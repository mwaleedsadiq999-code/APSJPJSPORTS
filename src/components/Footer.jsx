import { club } from '../data/team'
import { asset } from '../lib/assets'

// "Home" is deliberately absent — the Back to top control already does that job.
const links = [
  { href: '#squad', label: 'Squad' },
  { href: '#leaders', label: 'Leaders' },
  { href: '#stats', label: 'Stats' },
]

export default function Footer() {
  // "I Shall Rise and Shine" → a lead line and an italic accent line.
  const [lead, ...rest] = club.motto.split(/\s+and\s+/i)
  const tail = rest.join(' and ')

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-motto-block">
          <div className="footer-motto-copy">
            <p className="footer-kicker">Army Public Schools &amp; Colleges System</p>

            <h2 className="footer-motto">
              <span className="fm-line">{lead}</span>
              {tail && <span className="fm-line fm-accent">and {tail}.</span>}
            </h2>
          </div>

          <div className="footer-emblem">
            <span className="footer-seal">
              <img src={asset('/assets/aps-logo.jpg')} alt="" width="176" height="176" />
            </span>
          </div>
        </div>

        <div className="footer-main">
          <div className="footer-identity">
            <p className="footer-name">{club.name}</p>
            <p className="footer-campus">{club.campus}</p>
          </div>

          <nav className="footer-links" aria-label="Footer">
            {links.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p>
            © {club.season}
            <span className="footer-copy-name"> {club.name}</span>
          </p>
          <a href="#home" className="footer-top-btn">
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
