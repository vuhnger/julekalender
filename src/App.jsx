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

  const formattedToday = today.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const decemberBegins = getDoorDate(1)
  const helperCopy =
    today < decemberBegins
      ? 'Countdown is on—doors open daily in December 2025.'
      : 'Tap any unlocked door to reveal its surprise.'

  const getDoorContent = (dayNumber) => ({
    title: `Day ${dayNumber}`,
    body: 'Content for this day will go here ✨',
  })

  const openDoorContent = activeDoor ? getDoorContent(activeDoor) : null

  return (
    <div className="app-shell">
      <header className="hero">
        <p className="eyebrow">Julekalender 2025</p>
        <h1>24 cozy moments, one each December day</h1>
        <p className="lede">
          A warm little calendar just for us. Each door opens on its day in December
          2025.
        </p>
        <div className="status-row" aria-live="polite">
          <span className="date-chip">Today: {formattedToday}</span>
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
            aria-label={`Content for day ${activeDoor}`}
            onClick={(event) => event.stopPropagation()}
          >
            <p className="eyebrow">Day {activeDoor}</p>
            <h2>{openDoorContent.title}</h2>
            <p className="dialog-body">{openDoorContent.body}</p>
            <button type="button" className="close-button" onClick={closePanel}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
