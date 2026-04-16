import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { signOut } from '@/firebase/auth'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/csr', label: 'CSR 合作' },
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

  useEffect(() => setOpen(false), [location])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-brand-charcoal/95 backdrop-blur-sm border-b border-brand-silver/10'
          : 'bg-transparent'
      )}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="font-display text-xl font-light tracking-[0.15em] text-brand-ivory uppercase"
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
          className="md:hidden text-brand-silver/60 hover:text-brand-ivory transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-brand-charcoal/98 border-t border-brand-silver/10 px-6 py-6 space-y-4">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              to={link.href}
              className="block font-sans text-xs tracking-widest uppercase text-brand-silver/60 hover:text-brand-ivory py-2 transition-colors"
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
      )}
    </header>
  )
}
