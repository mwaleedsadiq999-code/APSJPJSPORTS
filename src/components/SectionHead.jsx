import { useReveal } from '../lib/useReveal'

/**
 * Section heading: a numbered rule, a large serif line, an optional standfirst.
 * `accent` renders in italic claret — the recurring editorial flourish.
 */
export default function SectionHead({ num, tag, title, accent, sub, threshold }) {
  const ref = useReveal(threshold)

  return (
    <div className="section-head reveal" ref={ref}>
      <div className="head-meta">
        <span className="head-num">{num}</span>
        <span className="head-rule" aria-hidden="true" />
        <span className="head-tag">{tag}</span>
      </div>

      <h2 className="head-title">
        {title} {accent && <em>{accent}</em>}
      </h2>

      {sub && <p className="section-sub">{sub}</p>}
    </div>
  )
}
