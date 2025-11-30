export default function RedirectContent({ entry, dayNumber }) {
  const title = entry?.title || `Dag ${dayNumber}`
  return (
    <>
      <h2>{title}</h2>
      <p>{entry?.body || 'Åpner en lenke i ny fane.'}</p>
      {entry?.url ? (
        <button type="button" className="primary-button" onClick={() => window.open(entry.url, '_blank')}>
          Åpne lenke
        </button>
      ) : (
        <p>Ingen URL satt.</p>
      )}
    </>
  )
}
