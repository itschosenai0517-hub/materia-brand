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

// ─── District Status Panel ─────────────────────────────────────────────────────

const DISTRICTS = [
  { id: 1,  name: 'LUXURY',      status: 'COMPLIANT',  color: 'text-yellow-500/80' },
  { id: 2,  name: 'MASONRY',     status: 'COMPLIANT',  color: 'text-yellow-500/80' },
  { id: 3,  name: 'TECHNOLOGY',  status: 'COMPLIANT',  color: 'text-yellow-500/80' },
  { id: 4,  name: 'FISHING',     status: 'COMPLIANT',  color: 'text-yellow-500/80' },
  { id: 5,  name: 'POWER',       status: 'MONITORING', color: 'text-amber-500' },
  { id: 6,  name: 'TRANSPORT',   status: 'COMPLIANT',  color: 'text-yellow-500/80' },
  { id: 7,  name: 'LUMBER',      status: 'MONITORING', color: 'text-amber-500' },
  { id: 8,  name: 'TEXTILES',    status: 'ALERT',      color: 'text-red-400' },
  { id: 9,  name: 'GRAIN',       status: 'COMPLIANT',  color: 'text-yellow-500/80' },
  { id: 10, name: 'LIVESTOCK',   status: 'COMPLIANT',  color: 'text-yellow-500/80' },
  { id: 11, name: 'AGRICULTURE', status: 'ALERT',      color: 'text-red-400' },
  { id: 12, name: 'MINING',      status: 'SUPPRESSED', color: 'text-red-600' },
  { id: 13, name: 'NUCLEAR',     status: 'DESTROYED',  color: 'text-gray-500/70', rebel: true },
] as const

function DistrictGrid() {
  return (
    <div className="mt-4 border border-red-900/20 p-3">
      <p className="font-terminal text-xs text-red-700/60 tracking-widest mb-2 uppercase">// DISTRICT STATUS GRID — YEAR 74</p>
      <div className="grid grid-cols-4 gap-1">
        {DISTRICTS.map(d => (
          <div
            key={d.id}
            className={`border px-2 py-1 transition-colors duration-300 ${'rebel' in d && d.rebel
              ? 'border-red-700/40 hover:border-red-500/60 group cursor-default'
              : 'border-red-950/30'
            }`}
          >
            <p className="font-terminal text-xs text-red-700/60">D{String(d.id).padStart(2, '0')}</p>
            {'rebel' in d && d.rebel ? (
              <>
                <p className="font-terminal text-xs truncate text-gray-500/70 group-hover:hidden">{d.status}</p>
                <p className="font-terminal text-xs text-red-400 hidden group-hover:block truncate">ALIVE — ACTIVE</p>
              </>
            ) : (
              <p className={`font-terminal text-xs truncate ${d.color}`}>{d.status}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Flame animation ──────────────────────────────────────────────────────────

function FlameIcon({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  const s = size === 'lg' ? 'text-2xl' : 'text-sm'
  return (
    <span
      className={`${s} inline-block`}
      style={{
        filter: 'drop-shadow(0 0 6px rgba(255,100,0,0.8)) drop-shadow(0 0 12px rgba(220,50,0,0.5))',
        animation: 'flicker 1.5s ease-in-out infinite alternate',
      }}
    >
      🔥
    </span>
  )
}

// ─── Capitol Seal ─────────────────────────────────────────────────────────────

function CapitolSeal() {
  return (
    <div className="flex justify-center mb-4">
      <div
        className="relative w-16 h-16 border border-red-900/40 rounded-full flex items-center justify-center"
        style={{ boxShadow: '0 0 20px rgba(139,0,0,0.3), inset 0 0 20px rgba(0,0,0,0.5)' }}
      >
        <div className="absolute inset-1 border border-red-900/20 rounded-full" />
        <svg viewBox="0 0 40 40" className="w-8 h-8 opacity-60">
          <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(139,0,0,0.5)" strokeWidth="0.5" />
          <path d="M20 4 L22 16 L34 12 L24 20 L32 30 L20 24 L8 30 L16 20 L6 12 L18 16 Z"
            fill="rgba(139,0,0,0.3)" stroke="rgba(180,0,0,0.6)" strokeWidth="0.5" />
          <circle cx="20" cy="20" r="3" fill="rgba(180,0,0,0.6)" />
        </svg>
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: 'radial-gradient(ellipse at 40% 30%, rgba(180,0,0,0.1), transparent 70%)' }}
        />
      </div>
    </div>
  )
}

// ─── Mockingjay SVG ───────────────────────────────────────────────────────────

function MockingjayIcon({ className = 'w-10 h-10', opacity = 'opacity-60' }: { className?: string; opacity?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      className={`${className} ${opacity}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Mockingjay symbol"
    >
      <circle cx="40" cy="40" r="38" stroke="rgba(220,50,50,0.7)" strokeWidth="1" />
      <circle cx="40" cy="40" r="33" stroke="rgba(180,0,0,0.4)" strokeWidth="0.5" />
      <line x1="40" y1="8" x2="40" y2="58" stroke="rgba(220,50,50,0.9)" strokeWidth="2" />
      <polyline points="34,20 40,8 46,20" stroke="rgba(220,50,50,0.9)" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <path
        d="M40 30 C32 26 22 30 20 38 C18 44 24 50 32 48 L40 58 L48 48 C56 50 62 44 60 38 C58 30 48 26 40 30Z"
        fill="rgba(180,0,0,0.5)"
        stroke="rgba(220,50,50,0.7)"
        strokeWidth="0.5"
      />
      <path d="M30 36 C22 32 12 36 10 42" stroke="rgba(220,50,50,0.6)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M50 36 C58 32 68 36 70 42" stroke="rgba(220,50,50,0.6)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M36 56 L34 68 M40 58 L40 70 M44 56 L46 68" stroke="rgba(180,0,0,0.5)" strokeWidth="1" strokeLinecap="round" />
      <circle cx="40" cy="34" r="1.5" fill="rgba(220,50,50,0.9)" />
    </svg>
  )
}

// ─── Tribute Quote ─────────────────────────────────────────────────────────────

const CAPITOL_QUOTES = [
  { en: '"may the odds be ever in your favor"', zh: '「願機率永遠對你有利」' },
  { en: '"hope is the only thing stronger than fear"', zh: '「希望是唯一比恐懼更強大的東西」' },
  { en: '"fire is catching"', zh: '「火焰會蔓延」' },
  { en: '"if we burn, you burn with us"', zh: '「如果我們燃燒，你也將與我們同燃」' },
  { en: '"snow falls. blood spills. the games begin."', zh: '「雪降臨，血流淌，競技場的遊戲開始了」' },
  { en: '"I am the Mockingjay."', zh: '「我就是學舌鳥」' },
  { en: '"It\'s the things we love most that destroy us."', zh: '「摧毀我們的，往往是我們最深愛的事物」' },
  { en: '"The bird, the pin, the song, the berries, the watch, the cracker, the dress that burst into flames."', zh: '「那隻鳥、那枚別針、那首歌、那些漿果、那只手錶、那塊餅乾、那件燃成火焰的裙子」' },
]

function RandomQuote() {
  const [q] = useState(() => CAPITOL_QUOTES[Math.floor(Math.random() * CAPITOL_QUOTES.length)])
  return (
    <div className="mt-2 px-4 text-center space-y-1">
      <p className="font-terminal text-xs text-red-600/70 italic leading-relaxed">{q.en}</p>
      <p className="font-terminal text-xs text-red-800/60 leading-relaxed">{q.zh}</p>
    </div>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function BootSequence({ onComplete }: { onComplete: () => void }) {
  const lines = [
    { text: 'CAPITOL SECURE NETWORK — NODE 0x4D415445 —', delay: 0 },
    { text: 'Scanning biometric signature...', delay: 500 },
    { text: 'District clearance: VERIFYING...', delay: 1100 },
    { text: 'Tessera count: SUPPRESSED', delay: 1700 },
    { text: 'Establishing encrypted tunnel to the Capitol...', delay: 2400 },
    { text: '>>> CONNECTION ESTABLISHED <<<', delay: 3200 },
    { text: 'Welcome to THE CAPITOL TERMINAL.', delay: 4000 },
    { text: '[REBEL NET] 攔截到加密訊號，來自第13區...', delay: 4900 },
    { text: '[REBEL NET] Encrypted uplink from District 13...', delay: 5600 },
    { text: '[REBEL NET] 學舌鳥尚存。凱妮絲·艾佛丁 — 狀態：活躍', delay: 6400 },
    { text: '[REBEL NET] The Mockingjay lives. Katniss Everdeen — STATUS: ACTIVE', delay: 7200 },
    { text: 'SIGNAL INTERCEPTED: ♩ ♪ ♩ ♪  — MOCKINGJAY FREQUENCY DETECTED', delay: 8000 },
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
      <CapitolSeal />
      {lines.map((l, i) => {
        const isRebelLine = l.text.startsWith('[REBEL NET]') || l.text.startsWith('SIGNAL')
        return (
          <TerminalLine
            key={i}
            text={l.text}
            delay={l.delay}
            className={
              i === 6
                ? 'text-red-300 terminal-glow'
                : isRebelLine
                ? 'text-amber-500/90'
                : 'text-red-500'
            }
          />
        )
      })}
      <DistrictGrid />
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
    <div className="space-y-4">
      {/* Reaping announcement header */}
      <div className="border border-red-900/30 bg-red-950/10 px-4 py-2 flex items-center gap-3 mb-2">
        <FlameIcon />
        <div>
          <p className="font-terminal text-xs text-red-500 tracking-widest uppercase">THE 74th HUNGER GAMES</p>
          <p className="font-terminal text-xs text-red-700/80">REAPING SEASON — AUTHENTICATION REQUIRED</p>
        </div>
        <FlameIcon />
      </div>

      <TerminalLine text="IDENTIFICATION REQUIRED." delay={0} className="text-red-400" />
      <TerminalLine text="This terminal is monitored by Capitol Peacekeepers." delay={400} className="text-red-500" />
      <TerminalLine text="Unauthorized access reported to President Snow." delay={900} className="text-red-700/80" />

      {/* District tags */}
      <div className="flex gap-2 flex-wrap mt-2">
        {['D01', 'D04', 'D07', 'D12'].map(d => (
          <span key={d} className="font-terminal text-xs text-red-700/60 border border-red-950/30 px-2 py-0.5">
            {d}
          </span>
        ))}
        <span className="font-terminal text-xs text-red-800/50 px-2 py-0.5 italic">+8 districts</span>
      </div>

      {step === 'email' ? (
        <form onSubmit={handleEmailSubmit} className="space-y-3 pt-4">
          <p className="font-terminal text-xs text-red-600/80 tracking-widest uppercase">Tribute District ID</p>
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
            PROCEED TO REAPING_
          </button>
        </form>
      ) : (
        <form onSubmit={handlePasswordSubmit} className="space-y-3 pt-4">
          <p className="font-terminal text-xs text-red-600/80 tracking-widest uppercase">Capitol Access Code</p>
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
            {loading ? 'VERIFYING CLEARANCE_' : 'I VOLUNTEER AS TRIBUTE_'}
          </button>
        </form>
      )}

      <RandomQuote />
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
      {/* Channel header with Mockingjay */}
      <div className="flex items-center gap-3 border-b border-red-900/20 pb-3">
        <MockingjayIcon className="w-7 h-7" opacity="opacity-70" />
        <div className="flex-1">
          <TerminalLine text="ENCRYPTED CHANNEL — ACTIVE" delay={0} className="text-green-400 terminal-glow" />
          <p className="font-terminal text-xs text-amber-600/70 tracking-widest mt-0.5">
            IF WE BURN, YOU BURN WITH US 
          </p>
        </div>
        <span
          className={`font-terminal text-xs tracking-widest px-2 py-0.5 border ${
            role === 'admin'
              ? 'text-yellow-400 border-yellow-900/50'
              : 'text-red-400 border-red-900/50'
          }`}
        >
          [{role.toUpperCase()}]
        </span>
        <span className={`font-terminal text-xs ${connected ? 'text-green-600/70' : 'text-red-700/60'}`}>
          {connected ? '● LIVE' : '○ 連線中...'}
        </span>
      </div>

      {/* Error display */}
      {connError && (
        <div className="border border-red-800/40 bg-red-950/20 px-3 py-2">
          <p className="font-terminal text-xs text-red-500">// 連線錯誤: {connError}</p>
          <p className="font-terminal text-xs text-red-700/60 mt-1">// 請截圖此錯誤訊息以便排查</p>
        </div>
      )}

      {/* Message list */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-72 scrollbar-thin scrollbar-thumb-red-900/40">
        {!connError && messages.length === 0 && (
          <p className="font-terminal text-xs text-red-700/50 italic">// 頻道靜默中 — 等待通訊</p>
        )}
        {messages.map(msg => {
          const decrypted = decryptMessage(msg.content)
          const isOwn = msg.role === role

          const ts = msg.createdAt as { toDate?: () => Date } | null
          const timeLabel = ts?.toDate
            ? ts.toDate().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false })
            : null

          return (
            <div
              key={msg.id}
              className={`flex flex-col gap-1 group ${isOwn ? 'items-end' : 'items-start'}`}
            >
              {/* Role label */}
              <span className={`font-terminal text-xs ${
                msg.role === 'admin' ? 'text-yellow-600/80' : 'text-red-600/80'
              }`}>
                [{msg.role.toUpperCase()}]
              </span>

              {/* Bubble + delete button row */}
              <div className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                <div
                  className={`max-w-xs px-3 py-2 border text-sm font-terminal ${
                    isOwn
                      ? 'border-red-700/40 bg-red-950/30 text-red-200 text-right'
                      : 'border-red-900/30 text-red-400'
                  }`}
                >
                  {decrypted || <span className="opacity-50 italic">// 無法解密</span>}
                </div>

                {/* Admin delete button — low opacity by default, full on group-hover */}
                {role === 'admin' && msg.id && (
                  <button
                    onClick={() => handleDelete(msg.id!)}
                    className="opacity-30 group-hover:opacity-100 font-terminal text-xs text-red-700 hover:text-red-400 transition-all mb-0.5 px-1 cursor-pointer"
                    title="刪除此訊息"
                  >
                    [×]
                  </button>
                )}
              </div>

              {/* Timestamp */}
              {timeLabel && (
                <p className="font-terminal text-xs text-red-800/60 tracking-widest px-1">
                  {timeLabel}
                </p>
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
      <CapitolSeal />
      <p
        className="font-terminal text-xl tracking-widest text-center"
        style={{ color: '#8B0000', textShadow: '0 0 16px rgba(139,0,0,0.8)' }}
      >
        ACCESS DENIED.
      </p>
      <div className="border border-red-950/40 bg-red-950/10 px-4 py-3 space-y-2">
        <p className="font-terminal text-xs text-red-600/80 tracking-widest uppercase">// CAPITOL SECURITY ALERT //</p>
        <p className="font-terminal text-sm text-red-700/70 italic">
          &quot;May the odds be ever in your favor.&quot;
        </p>
        <p className="font-terminal text-xs text-red-800/60">
          — Effie Trinket, District 12 Escort
        </p>
      </div>
      <div className="space-y-1 mt-4">
        <p className="font-terminal text-xs text-red-800/60">
          [!] Incident logged: {new Date().toISOString()}
        </p>
        <p className="font-terminal text-xs text-red-800/50">
          [!] Peacekeepers dispatched to your district.
        </p>
        <p className="font-terminal text-xs text-red-800/40">
          [!] Tesserae allocation under review.
        </p>
      </div>
      {/* Mockingjay — elevated opacity with flicker animation */}
      <div className="mt-6 flex flex-col items-center gap-3">
        <div style={{ animation: 'flicker 3s ease-in-out infinite alternate' }}>
          <MockingjayIcon className="w-20 h-20" opacity="opacity-60" />
        </div>
        <p className="font-terminal text-xs text-red-700/60 tracking-[0.3em] uppercase">Panem et Circenses</p>
        <p className="font-terminal text-xs text-red-800/50 tracking-widest italic">
          「如果我們燃燒，你也將與我們同燃」
        </p>
      </div>
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
            <span className="font-terminal text-xs text-red-700/60 ml-2 tracking-widest">
              CAPITOL_SECURE_TERMINAL_v4.7.3
            </span>
            <span className="ml-auto font-terminal text-xs text-red-800/50">
              PANEM · YEAR 74
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
          <div className="flex items-center gap-3">
            <p className="font-terminal text-xs text-red-800/50 tracking-widest">
              PANEM ET CIRCENSES
            </p>
            <span className="font-terminal text-xs text-red-900/30">|</span>
            <p className="font-terminal text-xs text-red-800/40 tracking-widest">
              {phase === 'chat' ? '🔒ENCRYPTED' : phase === 'denied' ? '⛔DENIED' : '○ STANDBY'}
            </p>
          </div>
          <button
            onClick={handleExit}
            className="font-terminal text-xs text-red-800/40 hover:text-red-600/70 tracking-widest transition-colors"
          >
            [ESC] EXIT_
          </button>
        </div>
      </div>
    </div>
  )
}
