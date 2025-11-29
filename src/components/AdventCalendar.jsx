import './AdventCalendar.css'

const doorNumbers = Array.from({ length: 24 }, (_, index) => index + 1)

function AdventCalendar({ isDoorUnlocked, onDoorSelect, getDoorDate }) {
  return (
    <section className="calendar" aria-label="Advent calendar for December 2025">
      <div className="calendar-grid">
        {doorNumbers.map((day) => {
          const unlocked = isDoorUnlocked(day)
          const unlockDate = getDoorDate(day)
          const unlockLabel = unlockDate.toLocaleDateString(undefined, {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })

          return (
            <Door
              key={day}
              dayNumber={day}
              unlocked={unlocked}
              unlockLabel={unlockLabel}
              onOpen={onDoorSelect}
            />
          )
        })}
      </div>
    </section>
  )
}

function Door({ dayNumber, unlocked, onOpen, unlockLabel }) {
  const label = unlocked
    ? `Open door ${dayNumber}`
    : `Door ${dayNumber} is locked until ${unlockLabel}`

  return (
    <button
      type="button"
      className={`door ${unlocked ? 'door--unlocked' : 'door--locked'}`}
      onClick={() => unlocked && onOpen(dayNumber)}
      disabled={!unlocked}
      aria-label={label}
    >
      {!unlocked && (
        <span className="lock-icon" aria-hidden="true">
          🔒
        </span>
      )}
      <span className="door-number">{dayNumber}</span>
      <span className="door-status" aria-hidden="true">
        {unlocked ? 'Tap to open' : `Opens ${unlockLabel}`}
      </span>
    </button>
  )
}

export default AdventCalendar
