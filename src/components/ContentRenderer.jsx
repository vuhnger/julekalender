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
  }
}

export default ContentRenderer
