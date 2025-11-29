import { useMemo, useState } from 'react'
import AdventCalendar from './components/AdventCalendar'
import './App.css'

const TARGET_YEAR = 2025
const TARGET_MONTH = 11 // December is month index 11

function App() {
  const [activeDoor, setActiveDoor] = useState(null)

  // Normalize to local midnight to avoid off-by-one issues across timezones.
  const today = useMemo(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate())
  }, [])

  const getDoorDate = (dayNumber) => new Date(TARGET_YEAR, TARGET_MONTH, dayNumber)

  const isDoorUnlocked = (dayNumber) => getDoorDate(dayNumber) <= today

  const handleDoorSelect = (dayNumber) => {
    if (!isDoorUnlocked(dayNumber)) return
    setActiveDoor(dayNumber)
  }

  const closePanel = () => setActiveDoor(null)

  const formattedToday = today.toLocaleDateString('nb-NO', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const decemberBegins = getDoorDate(1)
  const helperCopy =
    today < decemberBegins
      ? 'Nedtellingen er i gang—lukene åpner daglig i desember 2025.'
      : 'Trykk på en ulåst luke for å se hva som venter.'

  const getDoorContent = (dayNumber) => ({
    title: `Dag ${dayNumber}`,
    body: 'Innhold for denne dagen kommer her ✨',
  })

  const openDoorContent = activeDoor ? getDoorContent(activeDoor) : null

  return (
    <div className="app-shell">
      <div className="snow snow--front" aria-hidden="true"></div>
      <div className="snow snow--back" aria-hidden="true"></div>

      <header className="hero">
        <p className="eyebrow">Julekalender 2025</p>
        <h1>24 koselige stunder, én for hver desemberdag</h1>
        <p className="lede">
          En varm liten kalender bare for oss. Hver luke åpnes på sin dag i desember
          2025.
        </p>
        <div className="status-row" aria-live="polite">
          <span className="date-chip">I dag: {formattedToday}</span>
          <span className="helper">{helperCopy}</span>
        </div>
      </header>

      <AdventCalendar
        isDoorUnlocked={isDoorUnlocked}
        onDoorSelect={handleDoorSelect}
        getDoorDate={getDoorDate}
      />

      {activeDoor && openDoorContent && (
        <div className="overlay" role="presentation" onClick={closePanel}>
          <div
            className="door-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={`Innhold for dag ${activeDoor}`}
            onClick={(event) => event.stopPropagation()}
          >
            <p className="eyebrow">Dag {activeDoor}</p>
            <h2>{openDoorContent.title}</h2>
            <p className="dialog-body">{openDoorContent.body}</p>
            <button type="button" className="close-button" onClick={closePanel}>
              Lukk
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
