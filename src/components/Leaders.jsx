import { leaders } from '../data/team'
import { asset } from '../lib/assets'
import { useReveal } from '../lib/useReveal'
import SectionHead from './SectionHead'

export default function Leaders() {
  const grid = useReveal(0.05)
  const manifesto = useReveal(0.2)

  return (
    <section className="leaders" id="leaders">
      <SectionHead
        num="02"
        tag="Leading from the front"
        title="Two leaders."
        accent="One vision."
        sub="The two players who set the tone — on the field and off it."
      />

      <div className="leader-grid stagger" ref={grid}>
        {leaders.map((l, i) => (
          <article key={l.name} className="leader" style={{ '--i': i }}>
            <div className={`leader-photo ${i === 0 ? 'crop-left' : 'crop-right'}`}>
              <img
                src={asset(l.photo)}
                alt={`${l.name}, ${l.role} of APS JPJ`}
                width="892"
                height="844"
                loading="lazy"
              />
              <span className="leader-num">{l.number}</span>
            </div>

            <div className="leader-body">
              <span className={`leader-role ${l.role === 'Captain' ? 'is-cap' : 'is-vc'}`}>
                {l.role}
              </span>
              <h3>{l.name}</h3>
              <p className="leader-discipline">{l.discipline}</p>
              <p className="leader-style">{l.style}</p>
              <blockquote className="leader-quote">“{l.quote}”</blockquote>
            </div>
          </article>
        ))}
      </div>

      <figure className="manifesto reveal" ref={manifesto}>
        <blockquote>
          A badge is not worn for yourself. It is worn for <em>everyone</em> who
          put you on the field.
        </blockquote>
      </figure>
    </section>
  )
}
