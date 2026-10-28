import { useReveal } from '../lib/useReveal'

export default function Support() {
  const ref = useReveal(0.15)

  return (
    <section className="support" id="support">
      <div className="support-inner reveal" ref={ref}>
        <p className="support-eyebrow">Play · Learn · Lead</p>
        <h2 className="support-title">
          Stand with <em>the squad.</em>
        </h2>
        <p className="support-sub">
          Follow the season, back the players and share in every result — home
          or away.
        </p>
        <a href="#home" className="btn-support">
          Get in Touch
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            aria-hidden="true"
          >
            <path d="M7 17L17 7M17 7H8M17 7v9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  )
}
