import { useState } from 'react'
import { squad, club } from '../data/team'
import { useReveal, useSideStagger } from '../lib/useReveal'
import SectionHead from './SectionHead'

const FILTERS = ['All', 'Batsman', 'Bowler', 'All-rounder', 'Wicketkeeper']

/** Two letters to sit as a watermark behind each card. */
function initials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function Squad() {
  const [active, setActive] = useState('All')
  const filters = useReveal()
  const grid = useReveal(0.05)
  // Phones get the alternating side entrance; larger screens keep the fade-up.
  useSideStagger(grid, active)

  const shown =
    active === 'All' ? squad : squad.filter((p) => p.discipline === active)

  return (
    <section className="squad" id="squad">
      <SectionHead
        num="01"
        tag={`The Roster · ${club.season}`}
        title="The"
        accent="Squad."
        sub={`${squad.length} players across batting, bowling and keeping — every one of them carrying the badge.`}
      />

      <div className="filters reveal" ref={filters} role="group" aria-label="Filter by discipline">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={active === f}
            className={`filter ${active === f ? 'is-active' : ''}`}
            onClick={() => setActive(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div
        className={`squad-grid stagger ${active === 'All' ? '' : 'is-filtered'}`}
        ref={grid}
      >
        {shown.map((p, i) => (
          <article
            key={p.number}
            className="card"
            style={{ '--i': i, '--from': i % 2 === 0 ? '-38px' : '38px' }}
          >
            <span className="card-ring" aria-hidden="true" />

            <div className="card-top">
              <span className="card-number">{p.number}</span>
              <span className="card-brand">
                <span className="card-badge">{club.shortName}</span>
              </span>
            </div>

            <span className="card-mark" aria-hidden="true">
              {initials(p.name)}
            </span>

            <div className="card-body">
              <span className="card-discipline">{p.discipline}</span>
              <h3 className="card-name">{p.name}</h3>
              <span className="card-style">
                {p.role !== 'Player' ? p.role : p.style}
              </span>
            </div>
          </article>
        ))}

        {/* Keep the panel a solid block: pad the last row so the grid's
            hairline background never shows through as an empty cell. */}
        {Array.from({ length: (6 - (shown.length % 6)) % 6 }).map((_, i) => (
          <div key={`fill-${i}`} className="card card-fill" aria-hidden="true" />
        ))}
      </div>

      {shown.length === 0 && (
        <p className="squad-empty">No players in this discipline yet.</p>
      )}
    </section>
  )
}
