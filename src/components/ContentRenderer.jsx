import { useMemo, useRef, useState } from 'react'
import MiniWordle from './MiniWordle'
import MiniSudoku from './MiniSudoku'

function safeEval(code) {
  try {
    // Isolate from global scope as much as feasible in browser context.
    // We shadow common globals to reduce accidental access.
    // eslint-disable-next-line no-new-func
    const fn = new Function(
      '"use strict"; const window=undefined, document=undefined, localStorage=undefined, sessionStorage=undefined, location=undefined; ' +
        code,
    )
    const result = fn()
    return { ok: true, output: result === undefined ? '✅ Kjørte uten returverdi' : String(result) }
  } catch (error) {
    return { ok: false, output: error?.message || 'Kjøringsfeil' }
  }
}

const allowedEmbed = (url) => {
  if (!url) return false
  try {
    const { hostname } = new URL(url)
    // Just a light allowlist; adjust as needed.
    return /(youtube\.com|youtu\.be|vimeo\.com|player\.vimeo\.com)$/i.test(hostname)
  } catch {
    return false
  }
}

function ContentRenderer({ entry, dayNumber, onClose }) {
  const [code, setCode] = useState(entry.starter || "console.log('Hei!')")
  const [codeResult, setCodeResult] = useState(null)
  const [foundDiffs, setFoundDiffs] = useState(() =>
    Array.isArray(entry.differences) ? entry.differences.map(() => false) : [],
  )
  const [giftChoice, setGiftChoice] = useState(null)
  const [giftFeedback, setGiftFeedback] = useState('')
  const [rhymeInput, setRhymeInput] = useState('')
  const [rhymeOutput, setRhymeOutput] = useState('')
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizResult, setQuizResult] = useState(null)
  const iframeRef = useRef(null)

  const title = entry.title || `Dag ${dayNumber}`
  const ruleText = entry.rules || null

  const sudokuRuleText = () => {
    if (ruleText) return ruleText
    const cleaned = (entry.puzzle || '').replace(/[^0-9.]/g, '')
    const size = Math.max(3, Math.ceil(Math.sqrt(cleaned.length || 9)))
    const maxDigit = Math.min(9, size)
    return `Bruk tallene 1–${maxDigit}. Hver rad og kolonne skal ha hvert tall én gang. Forhåndsfylte ruter kan ikke endres.`
  }

  const videoAllowed = useMemo(() => allowedEmbed(entry.url), [entry.url])

  const handleRunCode = () => {
    const res = safeEval(code || '')
    setCodeResult(res)
  }

  if (!entry || !entry.type) {
    return (
      <>
        <h2>{title}</h2>
        <p>Ingen innholdstype definert for dag {dayNumber}.</p>
      </>
    )
  }

  switch (entry.type) {
    case 'text':
      return (
        <>
          <h2>{title}</h2>
          <p>{entry.body || 'Ingen tekst lagt inn.'}</p>
        </>
      )

    case 'video':
      return (
        <>
          <h2>{title}</h2>
          {videoAllowed ? (
            <div className="video-wrapper">
              <iframe
                ref={iframeRef}
                src={entry.url}
                title={title}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <p>Video-URLen kan ikke embeddes. Åpne direkte: <a href={entry.url}>{entry.url}</a></p>
          )}
        </>
      )

    case 'redirect':
      return (
        <>
          <h2>{title}</h2>
          <p>Åpner en lenke i ny fane.</p>
          <button type="button" className="primary-button" onClick={() => window.open(entry.url, '_blank')}>
            Åpne lenke
          </button>
        </>
      )

    case 'code':
      return (
        <>
          <h2>{title}</h2>
          <p>Skriv JavaScript og kjør.</p>
          <textarea
            className="code-input"
            value={code}
            onChange={() => {}}
            rows={6}
            readOnly
          />
          <div className="code-actions">
            <button type="button" className="primary-button" onClick={handleRunCode}>
              Kjør
            </button>
            <button type="button" className="secondary-button" disabled>
              Låst
            </button>
          </div>
          {codeResult && (
            <pre className={`code-output ${codeResult.ok ? 'ok' : 'error'}`}>{codeResult.output}</pre>
          )}
        </>
      )

    case 'wordle':
      return (
        <>
          <h2>{title}</h2>
          <MiniWordle solution={(entry.seed || 'NOEL').toUpperCase()} />
          <p className="rules-note">
            {ruleText ||
              'Regler: Gjett ordet med rett antall bokstaver. Grønn = rett bokstav rett plass, gul = rett bokstav feil plass, grå = ikke i ordet.'}
          </p>
        </>
      )

    case 'sudoku':
      return (
        <>
          <h2>{title}</h2>
          <MiniSudoku puzzle={entry.puzzle || ''} />
          <p className="rules-note">{sudokuRuleText()}</p>
        </>
      )

    default:
      return (
        <>
          <h2>{title}</h2>
          <p>Ukjent type: {entry.type}</p>
        </>
      )

    case 'recipe': {
      const ingredients = Array.isArray(entry.ingredients) ? entry.ingredients : []
      const steps = Array.isArray(entry.steps) ? entry.steps : []
      return (
        <>
          <h2>{title}</h2>
          {entry.body && <p>{entry.body}</p>}
          {ingredients.length > 0 && (
            <>
              <h3>Ingredienser</h3>
              <ul className="recipe-list">
                {ingredients.map((ing, idx) => (
                  <li key={idx}>{ing}</li>
                ))}
              </ul>
            </>
          )}
          {steps.length > 0 && (
            <>
              <h3>Slik gjør du</h3>
              <ol className="recipe-steps">
                {steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </>
          )}
        </>
      )
    }

    case 'spot-diff': {
      const diffs = Array.isArray(entry.differences) ? entry.differences : []
      const toggleDiff = (index) => {
        const next = [...foundDiffs]
        next[index] = !next[index]
        setFoundDiffs(next)
      }
      const allFound = diffs.length > 0 && foundDiffs.every(Boolean)
      return (
        <>
          <h2>{title}</h2>
          <p>{entry.rules || 'Finn alle forskjellene og marker dem.'}</p>
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

    case 'gift-wrap': {
      const options = Array.isArray(entry.options) ? entry.options : []
      const correct = typeof entry.correct === 'number' ? entry.correct : 0
      const pick = (idx) => {
        setGiftChoice(idx)
        setGiftFeedback(idx === correct ? 'Riktig! 🎁' : 'Prøv igjen.')
      }
      return (
        <>
          <h2>{title}</h2>
          <p>{entry.body || 'Velg riktig papir/bånd for gaven.'}</p>
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

    case 'rhyme': {
      const templates = [
        (w) => `${w} i kvelden, lysene tennes i fred.`,
        (w) => `${w} og pepperkake, julestemning på vei ned.`,
        (w) => `${w} og snø som daler, vi deler varme smil.`,
        (w) => `${w} i vinduet, julen banker på en mil.`,
      ]
      const generate = () => {
        const word = (rhymeInput || entry.word || 'jul').trim()
        const tpl = templates[Math.floor(Math.random() * templates.length)]
        setRhymeOutput(tpl(word))
      }
      return (
        <>
          <h2>{title}</h2>
          <p>{entry.body || 'Skriv inn et ord og få et lite julerim.'}</p>
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

    case 'quiz': {
      const questions = Array.isArray(entry.questions) ? entry.questions : []
      const submitQuiz = () => {
        let correct = 0
        questions.forEach((q, idx) => {
          if (quizAnswers[idx] === q.correct) correct += 1
        })
        setQuizResult({ correct, total: questions.length })
      }
      return (
        <>
          <h2>{title}</h2>
          <div className="quiz-list">
            {questions.map((q, idx) => (
              <div key={idx} className="quiz-question">
                <p>{q.question}</p>
                <div className="quiz-options">
                  {q.options.map((opt, optIdx) => (
                    <label key={optIdx} className="quiz-option">
                      <input
                        type="radio"
                        name={`quiz-${idx}`}
                        checked={quizAnswers[idx] === optIdx}
                        onChange={() => setQuizAnswers({ ...quizAnswers, [idx]: optIdx })}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            {questions.length > 0 && (
              <button type="button" className="primary-button" onClick={submitQuiz}>
                Sjekk svar
              </button>
            )}
            {quizResult && (
              <p className="quiz-result">
                Du fikk {quizResult.correct} av {quizResult.total} riktig.
              </p>
            )}
          </div>
        </>
      )
    }
  }
}

export default ContentRenderer
