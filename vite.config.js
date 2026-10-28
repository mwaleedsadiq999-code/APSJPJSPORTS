import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Relative base so the build works when served from a subpath or opened
  // straight from disk.
  base: './',
  build: {
    // Downlevel optional chaining, nullish coalescing and friends so older
    // iPads (Safari 11–13) can parse the bundle instead of showing a blank page.
    target: 'safari11',
  },
  server: {
    // Bind to every interface (IPv4 + IPv6), not just ::1. Without this Vite
    // listens on IPv6 loopback only, so anything that dials 127.0.0.1 —
    // tunnels, proxies, other tools — gets "connection refused".
    host: true,
    port: 5173,
    strictPort: true,
    // Tunnels forward requests with their own Host header. Without this Vite
    // answers 403 "Blocked request" (DNS-rebinding guard, on by default).
    allowedHosts: ['.lhr.life', '.loca.lt', '.trycloudflare.com', '.ngrok-free.app', '.pinggy.link'],
  },
  // `vite preview` serves dist/ — one JS file and one CSS file instead of
  // dozens of module requests, which is what an iPad on a phone link needs.
  preview: {
    host: true,
    port: 4173,
    strictPort: true,
    allowedHosts: ['.lhr.life', '.loca.lt', '.trycloudflare.com', '.ngrok-free.app', '.pinggy.link'],
  },
})
