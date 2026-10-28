import { useEffect, useLayoutEffect, useRef } from 'react'

/**
 * Adds `is-visible` to the element the first time it scrolls into view.
 * Pair with a `.reveal` class in CSS.
 */
export function useReveal(threshold = 0.12) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // No IntersectionObserver (very old browser) — just show it.
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible')
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return ref
}

/**
 * Mobile-only entrance for the squad grid.
 *
 * A single cascade fired when the section appears is wasted on a phone — most
 * cards sit below the fold and would finish animating before you ever reach
 * them. So each card is watched on its own and slides in from alternating
 * sides as it reaches the viewport; cards that arrive together still cascade,
 * which keeps the "one after another" rhythm while you scroll.
 *
 * Adds `stagger--sides` to the container and `is-in` to each card.
 * `resetKey` re-arms the effect when a filter swaps the cards out.
 */
export function useSideStagger(ref, resetKey) {
  // Layout effect so the side offsets are in place before the first paint —
  // otherwise the cards animate from the desktop pose into the mobile one.
  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return

    const mq = window.matchMedia('(max-width: 720px)')
    let io = null

    const reset = () => {
      if (io) io.disconnect()
      io = null
      root.classList.remove('stagger--sides')
      root.querySelectorAll('.card').forEach((card) => {
        card.classList.remove('is-in')
        card.style.removeProperty('--d')
      })
    }

    const start = () => {
      if (io) {
        io.disconnect()
        io = null
      }

      if (!mq.matches) {
        reset()
        return
      }

      root.classList.add('stagger--sides')
      const cards = [...root.querySelectorAll('.card:not(.card-fill)')]

      if (!('IntersectionObserver' in window)) {
        cards.forEach((card) => card.classList.add('is-in'))
        return
      }

      // Keep a local handle: a callback that fired after a re-arm would
      // otherwise unobserve through the newer observer.
      const observer = new IntersectionObserver(
        (entries) => {
          entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
            .forEach((entry, i) => {
              // Only the entrance is delayed, so hover feedback stays instant.
              entry.target.style.setProperty('--d', `${i * 90}ms`)
              entry.target.classList.add('is-in')
              observer.unobserve(entry.target)
            })
        },
        { threshold: 0.2, rootMargin: '0px 0px -6% 0px' }
      )

      io = observer
      cards.forEach((card) => observer.observe(card))
    }

    start()
    // Older Safari only has addListener; without this the layout effect throws
    // and the whole app fails to mount.
    if (mq.addEventListener) mq.addEventListener('change', start)
    else if (mq.addListener) mq.addListener(start)

    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', start)
      else if (mq.removeListener) mq.removeListener(start)
      reset()
    }
  }, [ref, resetKey])
}
