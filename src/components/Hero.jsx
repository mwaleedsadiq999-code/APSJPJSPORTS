import { club, leaders } from '../data/team'
import { asset } from '../lib/assets'

const [captain, vice] = leaders

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-grid-lines" aria-hidden="true" />

      <div className="hero-inner">
        <div className="hero-copy">
          <p className="hero-eyebrow">
            {club.name} · Season {club.season}
          </p>

          <h1 className="hero-title">
            Twelve players.
            <br />
            <em>One badge.</em>
          </h1>

          <p className="hero-lede">
            The home of the {club.campus} first XII — the full squad, the men who
            lead it, and everything still to play for this season.
          </p>

          <div className="hero-cta">
            <a href="#squad" className="btn-solid">
              Meet the Squad
            </a>
            <a href="#leaders" className="btn-line">
              The Leaders
            </a>
          </div>
        </div>

        <figure className="hero-figure">
          <img
            src={asset('/assets/captains.jpg')}
            alt={`${captain.name} and ${vice.name}, captain and vice captain of APS JPJ`}
            width="892"
            height="844"
          />
          <figcaption>
            <span className="cap-name">
              {captain.name} &amp; {vice.name}
            </span>
            <span className="cap-role">
              {captain.role} · {vice.role}
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
