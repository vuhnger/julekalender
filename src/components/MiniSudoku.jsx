import { useMemo, useState } from 'react'

// Standard 9x9 demo-puzzle (0/. = tom)
const defaultPuzzle = '53..7....6..195....98....6.8...6...34..8.3..17...2...6....28....419..5....8..79'

const shuffleArray = (arr) => {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

const randomizeDigits = (puzzle) => {
  const digits = Array.from(new Set(puzzle.split('').filter((ch) => /[1-9]/.test(ch)))).sort()
  if (digits.length === 0) return puzzle
  const perm = shuffleArray(digits)
  const map = new Map()
  digits.forEach((d, idx) => map.set(d, perm[idx] || d))
  return puzzle
    .split('')
    .map((ch) => (map.has(ch) ? map.get(ch) : ch))
    .join('')
}

function parsePuzzle(puzzle) {
  const randomized = randomizeDigits((puzzle || defaultPuzzle).replace(/[^0-9.]/g, ''))
  const cleaned = randomized
  const size = Math.ceil(Math.sqrt(cleaned.length))
  const padded = cleaned.padEnd(size * size, '.')
  const cells = padded.split('')
  const fixed = cells.map((val, idx) => (val !== '.' ? idx : null)).filter((v) => v !== null)
  return { size, cells, fixed }
}

function MiniSudoku({ puzzle }) {
  const { size, cells, fixed } = useMemo(() => parsePuzzle(puzzle), [puzzle])
  const [values, setValues] = useState(cells)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('info')
  const blockSize = useMemo(() => {
    const root = Math.sqrt(size)
    return Number.isInteger(root) ? root : 3
  }, [size])

  const handleChange = (idx, val) => {
    if (fixed.includes(idx)) return
    const v = val.replace(/[^1-9]/g, '').slice(0, 1)
    const next = [...values]
    next[idx] = v || '.'
    setValues(next)
  }

  const check = () => {
    const maxDigit = Math.min(9, size)
    const required = Array.from({ length: maxDigit }, (_, i) => String(i + 1))
    // rows
    for (let r = 0; r < size; r++) {
      const row = values.slice(r * size, r * size + size)
      if (row.includes('.')) {
        setMessage('Fyll ut alle ruter.')
        setMessageType('warn')
        return
      }
      if (!isValidSet(row, required, size)) {
        setMessage(`Rad ${r + 1} har duplikater eller mangler.`)
        setMessageType('error')
        return
      }
    }
    // cols
    for (let c = 0; c < size; c++) {
      const col = []
      for (let r = 0; r < size; r++) col.push(values[r * size + c])
      if (!isValidSet(col, required, size)) {
        setMessage(`Kolonne ${c + 1} har duplikater eller mangler.`)
        setMessageType('error')
        return
      }
    }
    setMessage('Ser bra ut! ✔️')
    setMessageType('ok')
  }

  const isValidSet = (arr, required, size) => {
    const seen = new Set()
    for (const v of arr) {
      if (v === '.') return false
      if (!required.includes(v) || seen.has(v)) return false
      seen.add(v)
    }
    return seen.size === size
  }

  return (
    <div className="mini-sudoku">
      <div
        className="sudoku-grid"
        style={{
          gridTemplateColumns: `repeat(${size}, minmax(clamp(26px, 7vw, 40px), 1fr))`,
        }}
      >
        {values.map((val, idx) => {
          const row = Math.floor(idx / size)
          const col = idx % size
          const thickTop = row % blockSize === 0
          const thickLeft = col % blockSize === 0
          const thickBottom = row % blockSize === blockSize - 1
          const thickRight = col % blockSize === blockSize - 1

          const classes = [
            'sudoku-cell',
            fixed.includes(idx) ? 'fixed' : '',
            thickTop ? 'thick-top' : '',
            thickLeft ? 'thick-left' : '',
            thickBottom ? 'thick-bottom' : '',
            thickRight ? 'thick-right' : '',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <input
              key={idx}
              className={classes}
              value={val === '.' ? '' : val}
              onChange={(e) => handleChange(idx, e.target.value)}
              inputMode="numeric"
              maxLength={1}
              aria-label={`Rute ${idx + 1}`}
              disabled={fixed.includes(idx)}
            />
          )
        })}
      </div>
      <button type="button" className="primary-button" onClick={check}>
        Sjekk
      </button>
      {message && <p className={`sudoku-message ${messageType}`}>{message}</p>}
    </div>
  )
}

export default MiniSudoku
