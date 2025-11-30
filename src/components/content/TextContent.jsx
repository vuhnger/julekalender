export default function TextContent({ entry, dayNumber }) {
  const title = entry?.title || `Dag ${dayNumber}`
  const body = entry?.body || 'Ingen tekst er lagt inn ennå. God jul! 🎄'
  return (
    <>
      <h2>{title}</h2>
      <p>{body}</p>
    </>
  )
}
