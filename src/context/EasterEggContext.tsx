import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

const KONAMI_SEQUENCE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowRight', 'ArrowLeft',
]

// Session flag — prevents direct URL access without triggering the easter egg
const EASTER_EGG_SESSION_KEY = 'materia_secret_unlocked'

export function markEasterEggUnlocked() {
  sessionStorage.setItem(EASTER_EGG_SESSION_KEY, '1')
}

export function isEasterEggUnlocked() {
  return sessionStorage.getItem(EASTER_EGG_SESSION_KEY) === '1'
}

interface EasterEggState {
  footerClickCount: number
  registerFooterClick: () => void
  logoLongPressHandlers: {
    onTouchStart: (e: React.TouchEvent) => void
    onTouchEnd: () => void
    onTouchMove: () => void
    onContextMenu: (e: React.MouseEvent) => void
  }
}

const EasterEggContext = createContext<EasterEggState>({
  footerClickCount: 0,
  registerFooterClick: () => {},
  logoLongPressHandlers: {
    onTouchStart: () => {},
    onTouchEnd: () => {},
    onTouchMove: () => {},
    onContextMenu: () => {},
  },
})

const LONG_PRESS_DURATION = 3000 // 3 seconds

export function EasterEggProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const keySequence = useRef<string[]>([])
  const [footerClickCount, setFooterClickCount] = useState(0)
  const footerTimer = useRef<ReturnType<typeof setTimeout>>()
  const longPressTimer = useRef<ReturnType<typeof setTimeout>>()

  // Keyboard sequence listener (desktop)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key
      if (!KONAMI_SEQUENCE.includes(key)) {
        keySequence.current = []
        return
      }
      keySequence.current = [...keySequence.current, key].slice(-KONAMI_SEQUENCE.length)
      if (JSON.stringify(keySequence.current) === JSON.stringify(KONAMI_SEQUENCE)) {
        keySequence.current = []
        markEasterEggUnlocked()
        navigate('/secret')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  // Footer 5-click trigger
  const registerFooterClick = () => {
    setFooterClickCount(prev => {
      const next = prev + 1
      clearTimeout(footerTimer.current)
      if (next >= 5) {
        markEasterEggUnlocked()
        navigate('/secret')
        return 0
      }
      footerTimer.current = setTimeout(() => setFooterClickCount(0), 3000)
      return next
    })
  }

  // Logo long-press handlers (mobile, 3 seconds)
  const logoLongPressHandlers = {
    onTouchStart: (e: React.TouchEvent) => {
      // Only single-finger touch to avoid conflict with scrolling
      if (e.touches.length !== 1) return
      longPressTimer.current = setTimeout(() => {
        markEasterEggUnlocked()
        navigate('/secret')
      }, LONG_PRESS_DURATION)
    },
    onTouchEnd: () => {
      clearTimeout(longPressTimer.current)
    },
    onTouchMove: () => {
      // Cancel if finger moves (e.g. user is scrolling)
      clearTimeout(longPressTimer.current)
    },
    onContextMenu: (e: React.MouseEvent) => {
      // Suppress the native long-press context menu on mobile browsers
      e.preventDefault()
    },
  }

  return (
    <EasterEggContext.Provider value={{ footerClickCount, registerFooterClick, logoLongPressHandlers }}>
      {children}
    </EasterEggContext.Provider>
  )
}

export const useEasterEgg = () => useContext(EasterEggContext)
