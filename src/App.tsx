import { Component, type ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { EasterEggProvider } from '@/context/EasterEggContext'
import AppRoutes from '@/router'

// ─── Error Boundary ───────────────────────────────────────────────────────────

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('[MATERIA] Uncaught error:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-brand-charcoal flex flex-col items-center justify-center px-6 text-center">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-brand-coral mb-4">
            系統錯誤
          </p>
          <h1 className="font-display text-4xl text-brand-ivory font-light mb-4">
            Something went wrong
          </h1>
          <p className="font-sans text-sm text-brand-silver/50 mb-8 max-w-sm">
            頁面載入時發生錯誤，請嘗試重新整理。
          </p>
          <button
            onClick={() => window.location.reload()}
            className="font-sans text-xs tracking-widest uppercase text-brand-coral border border-brand-coral/30 px-6 py-3 hover:border-brand-coral/70 transition-colors"
          >
            重新整理
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <EasterEggProvider>
            <AppRoutes />
          </EasterEggProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
