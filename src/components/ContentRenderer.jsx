/* eslint-disable react-hooks/static-components */
import { getContentComponent } from './content'

export default function ContentRenderer({ entry, dayNumber }) {
  const safeEntry =
    entry || {
      type: 'text',
      body: 'Ingen tekst er lagt inn ennå. God jul! 🎄',
    }
  const Comp = getContentComponent(safeEntry.type)
  return <Comp entry={safeEntry} dayNumber={dayNumber} />
}
