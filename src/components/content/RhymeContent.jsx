import { useState } from 'react'

export default function RhymeContent({ entry, dayNumber }) {
  const title = entry?.title || `Dag ${dayNumber}`
  const [rhymeInput, setRhymeInput] = useState('')
  const [rhymeOutput, setRhymeOutput] = useState('')
  const templates = [
    (w) => `${w} i kvelden, lysene tennes i fred.`,
    (w) => `${w} og pepperkake, julestemning på vei ned.`,
    (w) => `${w} og snø som daler, vi deler varme smil.`,
    (w) => `${w} i vinduet, julen banker på en mil.`,
  ]
  const generate = () => {
    const word = (rhymeInput || entry?.word || 'jul').trim()
    const tpl = templates[Math.floor(Math.random() * templates.length)]
    setRhymeOutput(tpl(word))
  }

  return (
    <>
      <h2>{title}</h2>
      <p>{entry?.body || 'Skriv inn et ord og få et lite julerim.'}</p>
      <div className="rhyme-row">
        <input
          type="text"
          value={rhymeInput}
          onChange={(e) => setRhymeInput(e.target.value)}
          placeholder="Et ord"
        />
        <button type="button" className="primary-button" onClick={generate}>
          Lag rim
        </button>
      </div>
      {rhymeOutput && <p className="rhyme-output">{rhymeOutput}</p>}
    </>
  )
}
