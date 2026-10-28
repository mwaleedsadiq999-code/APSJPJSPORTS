import { useEffect, useRef, useState } from 'react'
import { seasonStats, club } from '../data/team'

/** Counts a number up once, with an ease-out curve. */
function Stat({ target, label, active }) {
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!active) return

    let raf
    let start
    const duration = 1400

    const step = (t) => {
      if (start === undefined) start = t
      const p = Math.min((t - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [active, target])

  return (
    <div className="stat">
      <div className="stat-value">{String(n).padStart(2, '0')}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

export default function Stats() {
  const ref = useRef(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setActive(true)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
          io.disconnect()
        }
      },
      { threshold: 0.35 }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section className="stats" id="stats" ref={ref}>
      <div className="stats-inner">
        {seasonStats.map((s) => (
          <Stat key={s.label} target={s.value} label={s.label} active={active} />
        ))}

        <div className="stat stat-season">
          <div className="stat-label">Season</div>
          <div className="stat-value">{club.season}</div>
        </div>
      </div>
    </section>
  )
}
