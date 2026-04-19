import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { verifyCapitolPassword } from '@/lib/crypto'
import {
  logEasterEggAccess,
  sendChatMessage,
  subscribeChatMessages,
  deleteChatMessage,
  type ChatMessage,
} from '@/firebase/firestore'
import { signIn } from '@/firebase/auth'
import { useAuth } from '@/context/AuthContext'
import { encryptMessage, decryptMessage } from '@/lib/crypto'

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

type Phase = 'boot' | 'auth' | 'chat' | 'denied'
type Role = 'admin' | 'user'

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

function AuthPrompt({
  onSuccess,
  onFail,
}: {
  onSuccess: (role: Role) => void
  onFail: () => void
}) {
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
    const role = await verifyCapitolPassword(input)

    if (role) {
      if (email.trim()) {
        try {
          await signIn(email.trim(), input)
        } catch { /* ignore — password-only mode also allowed */ }
      }
      await logEasterEggAccess(user?.uid ?? 'anonymous', true)
      onSuccess(role)
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

function ChatRoom({ role }: { role: Role }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [connError, setConnError] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Subscribe to real-time messages
  useEffect(() => {
    setConnError(null)
    setConnected(false)
    const unsub = subscribeChatMessages(
      (msgs) => {
        setMessages(msgs)
        setConnected(true)
        setConnError(null)
      },
      (err) => {
        setConnError(err.message)
        setConnected(false)
      }
    )
    return unsub
  }, [])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || sending) return
    setSending(true)
    setInput('')
    try {
      const encrypted = encryptMessage(text)
      await sendChatMessage(role, encrypted)
    } catch (err) {
      console.error('Failed to send message', err)
    }
    setSending(false)
  }

  const handleDelete = async (id: string) => {
    if (role !== 'admin') return
    try {
      await deleteChatMessage(id)
    } catch (err) {
      console.error('Failed to delete message', err)
    }
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Role badge */}
      <div className="flex items-center gap-3">
        <TerminalLine text="ENCRYPTED CHANNEL — ACTIVE" delay={0} className="text-green-400 terminal-glow" />
        <span
          className={`font-terminal text-xs tracking-widest px-2 py-0.5 border ${
            role === 'admin'
              ? 'text-yellow-400 border-yellow-900/50'
              : 'text-red-400 border-red-900/50'
          }`}
        >
          [{role.toUpperCase()}]
        </span>
        {/* Connection status */}
        <span className={`font-terminal text-xs ${connected ? 'text-green-700/50' : 'text-red-900/50'}`}>
          {connected ? '● LIVE' : '○ 連線中...'}
        </span>
      </div>

      {/* Error display */}
      {connError && (
        <div className="border border-red-800/40 bg-red-950/20 px-3 py-2">
          <p className="font-terminal text-xs text-red-500">// 連線錯誤: {connError}</p>
          <p className="font-terminal text-xs text-red-900/50 mt-1">// 請截圖此錯誤訊息以便排查</p>
        </div>
      )}

      {/* Message list */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-72 scrollbar-thin scrollbar-thumb-red-900/40">
        {!connError && messages.length === 0 && (
          <p className="font-terminal text-xs text-red-900/40 italic">// 頻道靜默中 — 等待通訊</p>
        )}
        {messages.map(msg => {
          const decrypted = decryptMessage(msg.content)
          const isOwn = msg.role === role
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2 group ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              {!isOwn && (
                <span className={`font-terminal text-xs mt-0.5 ${
                  msg.role === 'admin' ? 'text-yellow-700/60' : 'text-red-700/60'
                }`}>
                  [{msg.role.toUpperCase()}]
                </span>
              )}
              <div
                className={`max-w-xs px-3 py-2 border text-sm font-terminal ${
                  isOwn
                    ? 'border-red-700/40 bg-red-950/30 text-red-200 text-right'
                    : 'border-red-900/30 text-red-400'
                }`}
              >
                {decrypted || <span className="opacity-30 italic">// 無法解密</span>}
              </div>
              {isOwn && (
                <span className="font-terminal text-xs mt-0.5 text-red-700/60">
                  [{role.toUpperCase()}]
                </span>
              )}
              {/* Admin delete button */}
              {role === 'admin' && msg.id && (
                <button
                  onClick={() => handleDelete(msg.id!)}
                  className="opacity-0 group-hover:opacity-100 font-terminal text-xs text-red-900/50 hover:text-red-600 transition-all mt-0.5"
                  title="刪除此訊息"
                >
                  [×]
                </button>
              )}
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-red-900/20 pt-3">
        <span className="font-terminal text-red-500">{'>'}</span>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={sending}
          className="flex-1 bg-transparent font-terminal text-sm text-red-300 focus:outline-none tracking-wider placeholder:text-red-900/40 caret-red-400"
          placeholder="輸入訊息..."
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="font-terminal text-xs text-red-400 hover:text-red-300 tracking-widest border border-red-900/30 px-3 py-1 hover:border-red-700/50 transition-colors disabled:opacity-30"
        >
          SEND_
        </button>
      </form>
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
  const [role, setRole] = useState<Role | null>(null)
  const navigate = useNavigate()

  const handleSuccess = useCallback((r: Role) => {
    setRole(r)
    setPhase('chat')
  }, [])

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
                onSuccess={handleSuccess}
                onFail={() => setPhase('denied')}
              />
            )}
            {phase === 'chat' && role && (
              <ChatRoom role={role} />
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
