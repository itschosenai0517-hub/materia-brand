// server.js — Production server for Railway
// Serves the Vite build (dist/) as static files and handles /api/* routes.
// Run with: node server.js

import express from 'express'
import { createHash, timingSafeEqual } from 'crypto'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

// ─── API Routes ───────────────────────────────────────────────────────────────

/**
 * POST /api/verify-capitol
 * Body: { token: string }
 * Returns: { granted: boolean, role: 'admin' | 'user' | null }
 *
 * Compares the submitted token to ADMIN_SECRET and USER_SECRET using a
 * timing-safe comparison to prevent timing attacks.
 */
app.post('/api/verify-capitol', (req, res) => {
  const { token } = req.body ?? {}

  if (typeof token !== 'string' || token.length === 0) {
    return res.status(400).json({ granted: false, role: null, error: 'Invalid request' })
  }

  const adminSecret = process.env.ADMIN_SECRET
  const userSecret = process.env.USER_SECRET

  if (!adminSecret || !userSecret) {
    console.error('[capitol] ADMIN_SECRET or USER_SECRET environment variable is not set')
    return res.status(500).json({ granted: false, role: null, error: 'Server misconfiguration' })
  }

  // Hash the token so timingSafeEqual always compares equal-length Buffers
  const hashToken = createHash('sha256').update(token).digest()
  const hashAdmin = createHash('sha256').update(adminSecret).digest()
  const hashUser  = createHash('sha256').update(userSecret).digest()

  let role: 'admin' | 'user' | null = null
  try {
    if (timingSafeEqual(hashToken, hashAdmin)) {
      role = 'admin'
    } else if (timingSafeEqual(hashToken, hashUser)) {
      role = 'user'
    }
  } catch {
    role = null
  }

  const granted = role !== null

  // Small artificial delay (50–150 ms) to further discourage brute-force attempts
  const jitter = 50 + Math.floor(Math.random() * 100)
  setTimeout(() => res.json({ granted, role }), jitter)
})

// ─── Static files (Vite build) ────────────────────────────────────────────────

const distPath = join(__dirname, 'dist')
app.use(express.static(distPath))

// SPA fallback — all non-API routes serve index.html
app.get(/^(?!\/api\/).*$/, (_req, res) => {
  res.sendFile(join(distPath, 'index.html'))
})

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`[materia] Server running on port ${PORT}`)
  console.log(`[materia] Serving static files from: ${distPath}`)
  console.log(`[materia] ADMIN_SECRET: ${process.env.ADMIN_SECRET ? '✓ set' : '✗ NOT SET'}`)
  console.log(`[materia] USER_SECRET: ${process.env.USER_SECRET ? '✓ set' : '✗ NOT SET'}`)
})
