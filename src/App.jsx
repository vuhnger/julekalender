import { useEffect, useMemo, useState } from 'react'
import Snowfall from 'react-snowfall'
import AdventCalendar from './components/AdventCalendar'
import './App.css'

const TARGET_YEAR = 2025
const TARGET_MONTH = 11 // December is month index 11
const STORAGE_KEY = 'julekalender_openedDoors'

function App() {
  const [activeDoor, setActiveDoor] = useState(null)
  const [openedDoors, setOpenedDoors] = useState([])
  const [snowCount] = useState(() => Math.floor(Math.random() * (2000 - 200 + 1)) + 200)
  const targetChristmas = useMemo(() => new Date(TARGET_YEAR, TARGET_MONTH, 24, 0, 0, 0), [])
  const computeCountdown = (target) => {
    const now = Date.now()
    const diff = target.getTime() - now
    if (diff <= 0) {
      return { done: true, label: 'God jul!' }
    }
    const totalSeconds = Math.floor(diff / 1000)
    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return {
      done: false,
      label: `${days}d ${hours}t ${minutes}m ${seconds}s til julaften`,
    }
  }
  const [countdown, setCountdown] = useState(() => computeCountdown(targetChristmas))

  // Normalize to local midnight to avoid off-by-one issues across timezones.
  const today = useMemo(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate())
  }, [])

  const getDoorDate = (dayNumber) => new Date(TARGET_YEAR, TARGET_MONTH, dayNumber)

  const isDoorUnlocked = (dayNumber) => getDoorDate(dayNumber) <= today
  const isDoorOpened = (dayNumber) => openedDoors.includes(dayNumber)

  const handleDoorSelect = (dayNumber) => {
    if (!isDoorUnlocked(dayNumber)) return
    setOpenedDoors((prev) =>
      prev.includes(dayNumber) ? prev : [...prev, dayNumber].sort((a, b) => a - b),
    )
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

  // Legg inn valgfritt innhold pr. dag i dette kartet. Bruk ren tekst, lenker eller JSX.
  const doorContentMap = {
    // 1: {
    //   title: 'Første overraskelse',
    //   content: (
    //     <>
    //       <p>Her kan du legge tekst, bilder eller lenker.</p>
    //       <a href="https://example.com" target="_blank" rel="noreferrer">
    //         Eksempel-lenke
    //       </a>
    //     </>
    //   ),
    // },
  }

  const getDoorContent = (dayNumber) =>
    doorContentMap[dayNumber] || {
      title: `Dag ${dayNumber}`,
      content: <p>Her kan du legge inn tekst eller lenker for dag {dayNumber}.</p>,
    }

  const openDoorContent = activeDoor ? getDoorContent(activeDoor) : null

  useEffect(() => {
    const stored =
      typeof window !== 'undefined'
        ? JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        : []
    const unlockedByDate = Array.from({ length: 24 }, (_, idx) => idx + 1).filter((day) =>
      isDoorUnlocked(day),
    )
    const merged = Array.from(new Set([...(stored || []), ...unlockedByDate])).filter(
      (day) => typeof day === 'number' && day >= 1 && day <= 24,
    )
    setOpenedDoors(merged.sort((a, b) => a - b))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(openedDoors))
  }, [openedDoors])

  useEffect(() => {
    const tick = () => setCountdown(computeCountdown(targetChristmas))
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetChristmas])

  return (
    <div className="app-shell">
      <Snowfall
        snowflakeCount={snowCount}
        style={{
          position: 'fixed',
          width: '100vw',
          height: '100vh',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <christmas-lights class="lights-strip" aria-hidden="true"></christmas-lights>

      <header className="hero">
        <p className="eyebrow">Julekalender 2025</p>
        <h1>Ho, ho ho, velkommen til Digital Julekalender! ;)</h1>
        <p className="lede">
          Du kan åpne én luke hver dag.
        </p>
        <div className="status-row" aria-live="polite">
          <span className="date-chip">I dag: {formattedToday}</span>
          <span className="helper">{helperCopy}</span>
        </div>
        <div className="countdown-row" aria-live="polite">
          <span className="countdown-chip">{countdown.label}</span>
        </div>
      </header>

      <AdventCalendar
        isDoorUnlocked={isDoorUnlocked}
        onDoorSelect={handleDoorSelect}
        getDoorDate={getDoorDate}
        isDoorOpened={isDoorOpened}
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
            <p className="eyebrow">Dagens luke</p>
            <h2>{openDoorContent.title}</h2>
            <div className="dialog-body">{openDoorContent.content}</div>
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
