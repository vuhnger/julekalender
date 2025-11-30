import { useState } from 'react'

export default function SpotDiffContent({ entry, dayNumber }) {
  const title = entry?.title || `Dag ${dayNumber}`
  const diffs = Array.isArray(entry?.differences)
    ? entry.differences
    : ['Detalj 1', 'Detalj 2', 'Detalj 3']
  const [foundDiffs, setFoundDiffs] = useState(diffs.map(() => false))
  const allFound = diffs.length > 0 && foundDiffs.every(Boolean)

  const toggleDiff = (index) => {
    const next = [...foundDiffs]
    next[index] = !next[index]
    setFoundDiffs(next)
  }

  return (
    <>
      <h2>{title}</h2>
      <p>{entry?.rules || 'Finn alle forskjellene og marker dem.'}</p>
      <ul className="diff-list">
        {diffs.map((item, idx) => (
          <li key={idx}>
            <label className="diff-item">
              <input
                type="checkbox"
                checked={foundDiffs[idx] || false}
                onChange={() => toggleDiff(idx)}
              />
              <span>{item}</span>
            </label>
          </li>
        ))}
      </ul>
      {allFound && <p className="status-good">Alle forskjeller funnet! 🎉</p>}
    </>
  )
}
