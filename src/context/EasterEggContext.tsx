import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

const KONAMI_SEQUENCE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowRight', 'ArrowLeft',
]

interface EasterEggState {
  footerClickCount: number
  registerFooterClick: () => void
}

const EasterEggContext = createContext<EasterEggState>({
  footerClickCount: 0,
  registerFooterClick: () => {},
})

export function EasterEggProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const keySequence = useRef<string[]>([])
  const [footerClickCount, setFooterClickCount] = useState(0)
  const footerTimer = useRef<ReturnType<typeof setTimeout>>()

  // Keyboard sequence listener
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
        navigate('/secret')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  const registerFooterClick = () => {
    setFooterClickCount(prev => {
      const next = prev + 1
      clearTimeout(footerTimer.current)
      if (next >= 5) {
        navigate('/secret')
        return 0
      }
      // Reset after 3 seconds of inactivity
      footerTimer.current = setTimeout(() => setFooterClickCount(0), 3000)
      return next
    })
  }

  return (
    <EasterEggContext.Provider value={{ footerClickCount, registerFooterClick }}>
      {children}
    </EasterEggContext.Provider>
  )
}

export const useEasterEgg = () => useContext(EasterEggContext)
