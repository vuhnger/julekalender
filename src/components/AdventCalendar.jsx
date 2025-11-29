import './AdventCalendar.css'

const doorNumbers = Array.from({ length: 24 }, (_, index) => index + 1)
const decorations = [
  '🦌',
  '🎅',
  '🌲',
  '🧝',
  '🦊',
  '🐻',
  '🐧',
  '🎄',
  '🕯️',
  '🎁',
  '🦉',
  '❄️',
]

function AdventCalendar({ isDoorUnlocked, onDoorSelect, getDoorDate }) {
  return (
    <section className="calendar" aria-label="Adventskalender for desember 2025">
      <div className="calendar-grid">
        {doorNumbers.map((day) => {
          const unlocked = isDoorUnlocked(day)
          const unlockDate = getDoorDate(day)
          const unlockLabel = unlockDate.toLocaleDateString('nb-NO', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })
          const icon = decorations[(day - 1) % decorations.length]

          return (
            <Door
              key={day}
              dayNumber={day}
              unlocked={unlocked}
              unlockLabel={unlockLabel}
              onOpen={onDoorSelect}
              icon={icon}
            />
          )
        })}
      </div>
    </section>
  )
}

function Door({ dayNumber, unlocked, onOpen, unlockLabel, icon }) {
  const label = unlocked
    ? `Åpne luke ${dayNumber}`
    : `Luke ${dayNumber} er låst til ${unlockLabel}`

  return (
    <button
      type="button"
      className={`door ${unlocked ? 'door--unlocked' : 'door--locked'}`}
      onClick={() => unlocked && onOpen(dayNumber)}
      disabled={!unlocked}
      aria-label={label}
    >
      <span className="door-icon" aria-hidden="true">
        {icon}
      </span>
      {!unlocked && (
        <span className="lock-icon" aria-hidden="true">
          🔒
        </span>
      )}
      <span className="door-number">{dayNumber}</span>
      <span className="door-status" aria-hidden="true">
        {unlocked ? 'Trykk for å åpne' : `Åpner ${unlockLabel}`}
      </span>
    </button>
  )
}

export default AdventCalendar
