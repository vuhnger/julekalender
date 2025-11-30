import { useMemo, useState } from 'react'

const MAX_GUESSES = 6

function MiniWordle({ solution }) {
  const target = useMemo(() => solution.trim().toUpperCase(), [solution])
  const [guess, setGuess] = useState('')
  const [guesses, setGuesses] = useState([])
  const [status, setStatus] = useState(null)
  const [error, setError] = useState('')

  const submitGuess = () => {
    const clean = guess.trim().toUpperCase()
    if (!clean) {
      setError('Skriv et ord.')
      return
    }
    if (clean.length !== target.length) {
      setError(`Ordet må ha ${target.length} bokstaver.`)
      return
    }
    setError('')
    const nextGuesses = [...guesses, clean]
    setGuesses(nextGuesses)
    setGuess('')
    if (clean === target) {
      setStatus('Riktig! 🎉')
      return
    }
    if (nextGuesses.length >= MAX_GUESSES) {
      setStatus(`Ferdig! Ordet var ${target}`)
    }
  }

  const renderRow = (g) => {
    const letters = g.padEnd(target.length, ' ').slice(0, target.length).split('')
    return (
      <div className="wordle-row" key={g + Math.random()}>
        {letters.map((ch, idx) => {
          const correct = ch === target[idx]
          const present = !correct && target.includes(ch)
          const state = ch.trim() === '' ? 'empty' : correct ? 'correct' : present ? 'present' : 'miss'
          return (
            <span className={`wordle-cell wordle-cell--${state}`} key={`${g}-${idx}`}>
              {ch}
            </span>
          )
        })}
      </div>
    )
  }

  return (
    <div className="wordle">
      <div className="wordle-board">
        {guesses.map(renderRow)}
        {status ? (
          <p className="wordle-status">{status}</p>
        ) : (
          guesses.length < MAX_GUESSES && (
            <div className="wordle-input-row">
              <input
                className="wordle-input"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                maxLength={target.length}
                placeholder={`Gjett et ord på ${target.length} bokstaver`}
              />
              <button type="button" className="primary-button" onClick={submitGuess}>
                Gjett
              </button>
            </div>
          )
        )}
        {error && <p className="wordle-error">{error}</p>}
      </div>
    </div>
  )
}

export default MiniWordle
