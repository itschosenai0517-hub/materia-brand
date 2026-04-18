import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { verifyCapitolPassword } from '@/lib/crypto'
import { logEasterEggAccess } from '@/firebase/firestore'
import { signIn } from '@/firebase/auth'
import { useAuth } from '@/context/AuthContext'

// ─── Typewriter hook ──────────────────────────────────────────────────────────

function useTypewriter(text: string, speed = 40, delay = 0) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) {
          clearInterval(interval)
          setDone(true)
        }
      }, speed)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timeout)
  }, [text, speed, delay])

  return { displayed, done }
}

// ─── Terminal line component ──────────────────────────────────────────────────

function TerminalLine({ text, speed = 35, delay = 0, className = '' }: {
  text: string
  speed?: number
  delay?: number
  className?: string
}) {
  const { displayed, done } = useTypewriter(text, speed, delay)
  return (
    <p className={`font-terminal text-sm leading-relaxed ${className}`}>
      {displayed}
      {!done && <span className="animate-type-cursor">_</span>}
    </p>
  )
}

// ─── Phases ───────────────────────────────────────────────────────────────────

type Phase = 'boot' | 'auth' | 'access' | 'denied' | 'portal'

interface PortalItem {
  key: string
  label: string
  description: string
  href?: string
}

const PORTAL_ITEMS: PortalItem[] = [
  { key: '1', label: 'MEMBER ARCHIVE', description: '高端會員專屬區域，查看您的影響力記錄', href: '/portal' },
  { key: '2', label: 'ENTERPRISE CHANNEL', description: '企業客戶機密合作通道', href: '/csr' },
  { key: '3', label: 'ARTISAN NETWORK', description: '職人工作室與材料溯源資料庫', href: '/products' },
  { key: '4', label: 'MISSION CONTROL', description: '管理員後台（需 Admin 角色）', href: '/admin' },
]

// ─── Sections ─────────────────────────────────────────────────────────────────

function BootSequence({ onComplete }: { onComplete: () => void }) {
  const lines = [
    { text: 'CAPITOL SECURE NETWORK — NODE 0x4D415445 —', delay: 0 },
    { text: 'Initializing encrypted channel...', delay: 600 },
    { text: 'Verifying district clearance...', delay: 1400 },
    { text: 'Establishing secure tunnel...', delay: 2200 },
    { text: '>>> CONNECTION ESTABLISHED <<<', delay: 3000 },
    { text: 'Welcome to THE CAPITOL TERMINAL.', delay: 3800 },
  ]
  const lastDone = useTypewriter(lines[lines.length - 1].text, 35, lines[lines.length - 1].delay)

  useEffect(() => {
    if (lastDone.done) {
      const t = setTimeout(onComplete, 800)
      return () => clearTimeout(t)
    }
  }, [lastDone.done, onComplete])

  return (
    <div className="space-y-2">
      {lines.map((l, i) => (
        <TerminalLine
          key={i}
          text={l.text}
          delay={l.delay}
          className={i === lines.length - 1 ? 'text-red-300 terminal-glow' : 'text-red-700/70'}
        />
      ))}
    </div>
  )
}

function AuthPrompt({ onSuccess, onFail }: { onSuccess: () => void; onFail: () => void }) {
  const [input, setInput] = useState('')
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<'email' | 'password'>('email')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 200)
  }, [step])

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) setStep('password')
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const isValid = await verifyCapitolPassword(input)

    if (isValid) {
      // Also try Firebase auth for actual role verification
      if (email.trim()) {
        try {
          await signIn(email.trim(), input)
        } catch { /* ignore — password-only mode also allowed */ }
      }
      await logEasterEggAccess(user?.uid ?? 'anonymous', true)
      onSuccess()
    } else {
      await logEasterEggAccess(user?.uid ?? 'anonymous', false)
      onFail()
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <TerminalLine text="IDENTIFICATION REQUIRED." delay={0} className="text-red-400" />
      <TerminalLine text="This terminal is monitored by the Capitol." delay={400} className="text-red-700/60" />

      {step === 'email' ? (
        <form onSubmit={handleEmailSubmit} className="space-y-3 pt-4">
          <p className="font-terminal text-xs text-red-700/50 tracking-widest uppercase">District ID (Email)</p>
          <div className="flex items-center gap-2">
            <span className="font-terminal text-red-500">{'>'}</span>
            <input
              ref={inputRef}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 bg-transparent font-terminal text-sm text-red-300 focus:outline-none border-b border-red-900/40 pb-1 tracking-wider placeholder:text-red-900/40 caret-red-400"
              placeholder="tribute@district.xx"
              autoComplete="off"
            />
          </div>
          <button type="submit" className="mt-4 font-terminal text-xs text-red-400 hover:text-red-300 tracking-widest uppercase border border-red-900/30 px-4 py-2 hover:border-red-700/50 transition-colors">
            PROCEED_
          </button>
        </form>
      ) : (
        <form onSubmit={handlePasswordSubmit} className="space-y-3 pt-4">
          <p className="font-terminal text-xs text-red-700/50 tracking-widest uppercase">Access Code</p>
          <div className="flex items-center gap-2">
            <span className="font-terminal text-red-500">{'>'}</span>
            <input
              ref={inputRef}
              type="password"
              value={input}
              onChange={e => setInput(e.target.value)}
              className="flex-1 bg-transparent font-terminal text-sm text-red-300 focus:outline-none border-b border-red-900/40 pb-1 tracking-widest placeholder:text-red-900/40 caret-red-400"
              placeholder="••••••••••••"
              autoComplete="off"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 font-terminal text-xs text-red-400 hover:text-red-300 tracking-widest uppercase border border-red-900/30 px-4 py-2 hover:border-red-700/50 transition-colors disabled:opacity-50"
          >
            {loading ? 'VERIFYING_' : 'VOLUNTEER AS TRIBUTE_'}
          </button>
        </form>
      )}
    </div>
  )
}

function AccessGranted({ onNavigate }: { onNavigate: (href: string) => void }) {
  const { displayed: line1, done: done1 } = useTypewriter('ACCESS GRANTED.', 40, 0)
  const { displayed: line2 } = useTypewriter('Welcome, Tribute. Choose your destination.', 35, 600)

  return (
    <div className="space-y-6">
      <p className="font-terminal text-lg text-green-400" style={{ textShadow: '0 0 12px rgba(74,222,128,0.6)' }}>
        {line1}{!done1 && <span className="animate-type-cursor">_</span>}
      </p>
      <p className="font-terminal text-sm text-red-700/70">{line2}</p>

      <div className="pt-4 space-y-2">
        {PORTAL_ITEMS.map((item, i) => (
          <button
            key={item.key}
            onClick={() => item.href && onNavigate(item.href)}
            className="w-full text-left p-4 border border-red-900/30 hover:border-red-700/60 hover:bg-red-950/30 transition-all duration-200 group"
            style={{ animationDelay: `${i * 100 + 800}ms` }}
          >
            <div className="flex items-start gap-4">
              <span className="font-terminal text-xs text-red-800/60 mt-0.5">[{item.key}]</span>
              <div>
                <p className="font-terminal text-sm text-red-300 group-hover:text-red-200 tracking-widest">
                  {item.label}
                </p>
                <p className="font-terminal text-xs text-red-800/50 mt-1">{item.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function AccessDenied() {
  return (
    <div className="space-y-4">
      <p
        className="font-terminal text-xl tracking-widest"
        style={{ color: '#8B0000', textShadow: '0 0 16px rgba(139,0,0,0.8)' }}
      >
        ACCESS DENIED.
      </p>
      <p className="font-terminal text-sm text-red-900/60 italic">
        May the odds be ever in your favor.
      </p>
      <p className="font-terminal text-xs text-red-950/50 mt-8">
        This incident has been logged. District peacekeepers have been notified.
      </p>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Secret() {
  const [phase, setPhase] = useState<Phase>('boot')
  const navigate = useNavigate()

  const handleNavigate = useCallback((href: string) => {
    navigate(href)
  }, [navigate])

  const handleExit = () => navigate('/')

  return (
    <div
      className={`min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-6 py-16 crt-screen
        ${phase === 'denied' ? 'bg-[#0A0000]' : 'bg-[#080808]'}`}
    >
      {/* Scanline effect */}
      <div className="scanline" />

      {/* CRT vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.7) 100%)',
        }}
      />

      {/* Horizontal scanlines texture */}
      <div
        className="fixed inset-0 pointer-events-none z-10 opacity-30"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
        }}
      />

      {/* Terminal container */}
      <div className="relative z-20 w-full max-w-2xl">
        {/* Header */}
        <div className="border border-red-900/30 bg-red-950/10 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-red-900/20">
            <div className="w-2 h-2 rounded-full bg-red-900/60" />
            <div className="w-2 h-2 rounded-full bg-red-900/40" />
            <div className="w-2 h-2 rounded-full bg-red-900/20" />
            <span className="font-terminal text-xs text-red-900/50 ml-2 tracking-widest">
              CAPITOL_SECURE_TERMINAL_v4.7.3
            </span>
          </div>

          <div className="p-6 min-h-[400px]">
            {phase === 'boot' && (
              <BootSequence onComplete={() => setPhase('auth')} />
            )}
            {phase === 'auth' && (
              <AuthPrompt
                onSuccess={() => setPhase('access')}
                onFail={() => setPhase('denied')}
              />
            )}
            {phase === 'access' && (
              <AccessGranted onNavigate={handleNavigate} />
            )}
            {phase === 'denied' && (
              <AccessDenied />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <p className="font-terminal text-xs text-red-950/40 tracking-widest">
            PANEM ET CIRCENSES
          </p>
          <button
            onClick={handleExit}
            className="font-terminal text-xs text-red-950/30 hover:text-red-900/50 tracking-widest transition-colors"
          >
            [ESC] EXIT_
          </button>
        </div>
      </div>
    </div>
  )
}
