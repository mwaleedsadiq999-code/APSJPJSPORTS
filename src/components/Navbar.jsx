import { useEffect, useRef, useState } from 'react'
import { club } from '../data/team'
import { asset } from '../lib/assets'

const links = [
  { href: '#home', label: 'Home' },
  { href: '#squad', label: 'Squad' },
  { href: '#leaders', label: 'Leaders' },
  { href: '#stats', label: 'Stats' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('#home')
  const headerRef = useRef(null)

  useEffect(() => {
    const sections = links.map((l) => document.querySelector(l.href)).filter(Boolean)
    if (!sections.length) return

    let raf = 0

    const update = () => {
      raf = 0

      const docTop = (el) => el.getBoundingClientRect().top + window.scrollY
      const line = window.scrollY + 130 // just under the sticky bar
      let current = sections[0]

      for (const s of sections) {
        if (docTop(s) <= line) current = s
      }

      // At the very bottom, light up the last section.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4
      if (atBottom) current = sections[sections.length - 1]

      setActive('#' + current.id)

      // Reading progress — written straight to the DOM, no re-render.
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const pct = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0
      if (headerRef.current) {
        headerRef.current.style.setProperty('--p', (pct * 100).toFixed(2) + '%')
      }
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  // Escape closes the mobile menu.
  useEffect(() => {
    if (!open) return

    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="nav" ref={headerRef}>
      <div className="nav-inner">
        <a href="#home" className="nav-brand">
          <span className="nav-logo">
            <img src={asset('/assets/aps-logo.jpg')} alt="" width="42" height="42" />
          </span>
          <span className="nav-wordmark">
            <strong>{club.shortName}</strong>
            <small>{club.name.replace('APS JPJ ', '')}</small>
          </span>
        </a>

        <nav id="primary-nav" className={`nav-links ${open ? 'open' : ''}`} aria-label="Primary">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={active === l.href ? 'is-active' : ''}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="nav-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
          aria-expanded={open}
          aria-controls="primary-nav"
        >
          <span></span>
          <span></span>
        </button>
      </div>

      <span className="nav-progress" aria-hidden="true" />
    </header>
  )
}
