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
 * Returns: { granted: boolean }
 *
 * Compares the submitted token to CAPITOL_SECRET using a timing-safe comparison
 * so an attacker can't measure response time to guess the password character by character.
 */
app.post('/api/verify-capitol', (req, res) => {
  const { token } = req.body ?? {}

  if (typeof token !== 'string' || token.length === 0) {
    return res.status(400).json({ granted: false, error: 'Invalid request' })
  }

  const secret = process.env.CAPITOL_SECRET
  if (!secret) {
    console.error('[capitol] CAPITOL_SECRET environment variable is not set')
    return res.status(500).json({ granted: false, error: 'Server misconfiguration' })
  }

  // Hash both sides so timingSafeEqual always compares equal-length Buffers
  const hashToken  = createHash('sha256').update(token).digest()
  const hashSecret = createHash('sha256').update(secret).digest()

  let granted = false
  try {
    granted = timingSafeEqual(hashToken, hashSecret)
  } catch {
    granted = false
  }

  // Small artificial delay (50–150 ms) to further discourage brute-force attempts
  const jitter = 50 + Math.floor(Math.random() * 100)
  setTimeout(() => res.json({ granted }), jitter)
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
  console.log(`[materia] CAPITOL_SECRET: ${process.env.CAPITOL_SECRET ? '✓ set' : '✗ NOT SET'}`)
})
