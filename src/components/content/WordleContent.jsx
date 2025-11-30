import MiniWordle from '../MiniWordle'

export default function WordleContent({ entry, dayNumber }) {
  const title = entry?.title || `Dag ${dayNumber}`
  const seed = (entry?.seed || 'NOEL').toUpperCase()
  const rules =
    'Regler: Gjett ordet med rett antall bokstaver. Grønn = rett bokstav rett plass, gul = rett bokstav feil plass, grå = ikke i ordet.'

  return (
    <>
      <h2>{title}</h2>
      <MiniWordle solution={seed} />
      <p className="rules-note">{rules}</p>
    </>
  )
}
