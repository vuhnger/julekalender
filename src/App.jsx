import { useEffect, useMemo, useState } from 'react'
import Snowfall from 'react-snowfall'
import AdventCalendar from './components/AdventCalendar'
import ContentRenderer from './components/ContentRenderer'
import contentData from './content.json'
import './App.css'

const TARGET_YEAR = 2025
const TARGET_MONTH = 11 // December is month index 11
const STORAGE_KEY = 'julekalender_openedDoors'
const DATE_OVERRIDE_KEY = 'julekalender_date_override'
const ACCESS_KEY = 'julekalender_access'
const osloFormatter = new Intl.DateTimeFormat('nb-NO', {
  timeZone: 'Europe/Oslo',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
})

const parseNorwegianDate = (value) => {
  if (!value) return null
  const match = value.trim().match(/^(\d{1,2})[-.](\d{1,2})[-.](\d{4})$/)
  if (!match) return null
  const day = Number(match[1])
  const month = Number(match[2])
  const year = Number(match[3])
  if (month < 1 || month > 12 || day < 1 || day > 31) return null
  return { day, month, year }
}

const datePartsToKey = ({ day, month, year }) => year * 10000 + month * 100 + day

const getOsloTodayParts = () => {
  const parts = osloFormatter.formatToParts(new Date())
  const map = {}
  parts.forEach(({ type, value }) => {
    if (type === 'day' || type === 'month' || type === 'year') {
      map[type] = Number(value)
    }
  })
  return { day: map.day, month: map.month, year: map.year }
}

const getTodayParts = () => {
  const params = new URLSearchParams(window.location.search)
  const raw = params.get('date') || params.get('dato') || localStorage.getItem(DATE_OVERRIDE_KEY)
  const parsed = parseNorwegianDate(raw)
  if (parsed) {
    localStorage.setItem(DATE_OVERRIDE_KEY, raw)
    return parsed
  }
  return getOsloTodayParts()
}

function App() {
  const [authorized, setAuthorized] = useState(false)
  const [checkingAccess, setCheckingAccess] = useState(true)
  const [passInput, setPassInput] = useState('')
  const [passError, setPassError] = useState('')
  const [activeDoor, setActiveDoor] = useState(null)
  const [openedDoors, setOpenedDoors] = useState([])
  const [snowCount] = useState(() => Math.floor(Math.random() * (200 - 50 + 1)) + 50)
  const todayParts = useMemo(() => getTodayParts(), [])
  const todayKey = datePartsToKey(todayParts)
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

  const getDoorDate = (dayNumber) => new Date(TARGET_YEAR, TARGET_MONTH, dayNumber)

  const isDoorUnlocked = (dayNumber) =>
    datePartsToKey({ year: TARGET_YEAR, month: TARGET_MONTH + 1, day: dayNumber }) <= todayKey
  const isDoorOpened = (dayNumber) => openedDoors.includes(dayNumber)

  const handleDoorSelect = (dayNumber) => {
    if (!isDoorUnlocked(dayNumber)) return
    setOpenedDoors((prev) =>
      prev.includes(dayNumber) ? prev : [...prev, dayNumber].sort((a, b) => a - b),
    )
    setActiveDoor(dayNumber)
  }

  const closePanel = () => setActiveDoor(null)

  const getDoorContent = (dayNumber) => contentData[String(dayNumber)] || null

  const openDoorContent = activeDoor ? getDoorContent(activeDoor) : null

  const expectedHash = '529c3146271d02cb3aca154b07c979110f70117fa5c8eb6751033fd7b7220606'

  const hashString = async (value) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(value)
    const digest = await crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  }

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_KEY)
    if (token === expectedHash) {
      setAuthorized(true)
    }
    setCheckingAccess(false)
  }, [])

  const handleUnlock = async (event) => {
    event.preventDefault()
    setPassError('')
    const hash = await hashString(passInput.trim())
    if (hash === expectedHash) {
      localStorage.setItem(ACCESS_KEY, expectedHash)
      setAuthorized(true)
      setPassInput('')
    } else {
      setPassError('Feil passord')
    }
  }

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

  if (checkingAccess) {
    return (
      <div className="gate-shell">
        <p>Laster …</p>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="gate-shell">
        <Snowfall
          snowflakeCount={80}
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
        <div className="gate-card">
          <h1>Kodeluke</h1>
          <p>Skriv inn passordet for kalenderen.</p>
          <form onSubmit={handleUnlock} className="gate-form">
            <input
              type="password"
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
              placeholder="Passord"
              aria-label="Passord"
            />
            <button type="submit">Lås opp</button>
          </form>
          {passError && <p className="gate-error">{passError}</p>}
        </div>
      </div>
    )
  }

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
            <div className="dialog-body">
              <ContentRenderer entry={openDoorContent} dayNumber={activeDoor} onClose={closePanel} />
            </div>
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
