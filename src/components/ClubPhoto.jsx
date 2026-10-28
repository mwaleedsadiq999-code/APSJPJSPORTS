import { club } from '../data/team'
import { asset } from '../lib/assets'
import { useReveal } from '../lib/useReveal'

export default function ClubPhoto() {
  const ref = useReveal(0.1)

  return (
    <section className="club-photo">
      <div className="club-photo-inner">
        <figure className="club-frame reveal" ref={ref}>
          <img
            src={asset('/assets/team.png')}
            alt={`${club.name} — full squad, ${club.season}`}
            width="1125"
            height="633"
            loading="lazy"
          />
          <figcaption>{club.shortName} · {club.season} · The Full Squad</figcaption>
        </figure>
      </div>
    </section>
  )
}
