import MiniSudoku from '../MiniSudoku'

export default function SudokuContent({ entry, dayNumber }) {
  const title = entry?.title || `Dag ${dayNumber}`
  const sudokuRuleText = () => {
    const cleaned = (entry?.puzzle || '').replace(/[^0-9.]/g, '')
    const size = Math.max(3, Math.ceil(Math.sqrt(cleaned.length || 9)))
    const maxDigit = Math.min(9, size)
    return `Bruk tallene 1–${maxDigit}. Hver rad og kolonne skal ha hvert tall én gang. Forhåndsfylte ruter kan ikke endres.`
  }

  return (
    <>
      <h2>{title}</h2>
      <MiniSudoku key={entry?.puzzle || 'default-sudoku'} puzzle={entry?.puzzle || ''} />
      <p className="rules-note">{sudokuRuleText()}</p>
    </>
  )
}
