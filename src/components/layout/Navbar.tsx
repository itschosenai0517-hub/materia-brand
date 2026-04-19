import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { signOut } from '@/firebase/auth'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/csr', label: 'CSR合作' },
  { href: '/products', label: '職人選物' },
  { href: '/about', label: '品牌故事' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { user, isAdmin } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close on route change
  useEffect(() => setOpen(false), [location])

  // ESC key to close mobile menu
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && open) setOpen(false)
  }, [open])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-brand-charcoal/95 backdrop-blur-sm border-b border-brand-silver/10'
            : 'bg-transparent'
        )}
      >
        <nav
          className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between"
          aria-label="主要導航"
        >
          {/* Logo */}
          <Link
            to="/"
            className="font-display text-xl font-light tracking-[0.15em] text-brand-ivory uppercase"
            aria-label="MATERIA 首頁"
          >
            Materia
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'font-sans text-xs tracking-widest uppercase transition-colors duration-200',
                  location.pathname === link.href
                    ? 'text-brand-coral'
                    : 'text-brand-silver/60 hover:text-brand-ivory'
                )}
                aria-current={location.pathname === link.href ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="btn-ghost text-xs tracking-widest uppercase">
                    管理
                  </Link>
                )}
                <Link to="/portal" className="btn-ghost text-xs tracking-widest uppercase">
                  會員中心
                </Link>
                <button
                  onClick={() => signOut()}
                  className="btn-ghost text-xs tracking-widest uppercase"
                >
                  登出
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-xs tracking-widest uppercase">
                  登入
                </Link>
                <Link to="/csr" className="btn-primary text-xs">
                  企業合作
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-brand-silver/60 hover:text-brand-ivory transition-colors p-1"
            onClick={() => setOpen(prev => !prev)}
            aria-label={open ? '關閉選單' : '開啟選單'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {/* Mobile menu panel — animated slide */}
        <div
          id="mobile-menu"
          className={cn(
            'md:hidden bg-brand-charcoal/98 border-t border-brand-silver/10 px-6 space-y-4',
            'transition-all duration-300 overflow-hidden',
            open ? 'max-h-screen opacity-100 py-6' : 'max-h-0 opacity-0 pointer-events-none py-0'
          )}
          aria-hidden={!open}
        >
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              to={link.href}
              className="block font-sans text-xs tracking-widest uppercase text-brand-silver/60 hover:text-brand-ivory py-2 transition-colors"
              aria-current={location.pathname === link.href ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-brand-silver/10 flex flex-col gap-3">
            {user ? (
              <>
                <Link to="/portal" className="btn-outline text-center text-xs">
                  會員中心
                </Link>
                <button onClick={() => signOut()} className="btn-ghost text-xs text-left">
                  登出
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-outline text-center text-xs">
                  登入
                </Link>
                <Link to="/csr" className="btn-primary text-center text-xs">
                  企業合作
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Backdrop overlay — tap outside to close */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
    </>
  )
}
