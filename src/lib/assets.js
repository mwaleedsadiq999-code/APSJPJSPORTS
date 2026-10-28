/**
 * Resolve a file in /public against the configured Vite base.
 * Keeps component markup free of hard-coded roots.
 */
const base = import.meta.env.BASE_URL

export function asset(path) {
  return base + path.replace(/^\/+/, '')
}
