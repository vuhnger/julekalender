import { useMemo, useRef } from 'react'
import { allowedEmbed } from './utils'

export default function VideoContent({ entry, dayNumber }) {
  const title = entry?.title || `Dag ${dayNumber}`
  const iframeRef = useRef(null)
  const videoAllowed = useMemo(() => allowedEmbed(entry?.url), [entry?.url])

  return (
    <>
      <h2>{title}</h2>
      {videoAllowed && entry?.url ? (
        <div className="video-wrapper">
          <iframe
            ref={iframeRef}
            src={entry.url}
            title={title}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <p>
          Video-URLen kan ikke embeddes. Åpne direkte:{' '}
          {entry?.url ? <a href={entry.url}>{entry.url}</a> : 'Ingen URL satt.'}
        </p>
      )}
    </>
  )
}
