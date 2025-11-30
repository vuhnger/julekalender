import { useState } from 'react'

export default function GiftWrapContent({ entry, dayNumber }) {
  const title = entry?.title || `Dag ${dayNumber}`
  const options = Array.isArray(entry?.options) ? entry.options : ['Papir A', 'Papir B', 'Papir C']
  const correct = typeof entry?.correct === 'number' ? entry.correct : 0
  const [giftChoice, setGiftChoice] = useState(null)
  const [giftFeedback, setGiftFeedback] = useState('')

  const pick = (idx) => {
    setGiftChoice(idx)
    setGiftFeedback(idx === correct ? 'Riktig! 🎁' : 'Prøv igjen.')
  }

  return (
    <>
      <h2>{title}</h2>
      <p>{entry?.body || 'Velg riktig papir/bånd for gaven.'}</p>
      <div className="gift-options">
        {options.map((opt, idx) => (
          <button
            key={idx}
            type="button"
            className={`gift-option ${giftChoice === idx ? 'selected' : ''}`}
            onClick={() => pick(idx)}
          >
            {opt}
          </button>
        ))}
      </div>
      {giftFeedback && <p className="gift-feedback">{giftFeedback}</p>}
    </>
  )
}
