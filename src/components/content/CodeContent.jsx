import { useState } from 'react'
import { safeEval } from './utils'

export default function CodeContent({ entry, dayNumber }) {
  const title = entry?.title || `Dag ${dayNumber}`
  const starter = entry?.starter || "console.log('Hei!')"
  const [codeResult, setCodeResult] = useState(null)

  const handleRunCode = () => {
    const res = safeEval(starter || '')
    setCodeResult(res)
  }

  return (
    <>
      <h2>{title}</h2>
      <p>{entry?.body || 'Skriv JavaScript og kjør.'}</p>
      <textarea className="code-input" value={starter} rows={6} readOnly />
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
}
