import { Link } from 'react-router-dom'
import { useEasterEgg } from '@/context/EasterEggContext'

export default function Footer() {
  const { registerFooterClick } = useEasterEgg()

  return (
    <footer className="bg-brand-carbon border-t border-brand-silver/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <p className="font-display text-2xl font-light tracking-[0.15em] text-brand-ivory uppercase mb-4">
              Materia
            </p>
            <p className="font-sans text-sm text-brand-silver/50 leading-relaxed max-w-xs">
              質地即宣言。每一件產品背後，
              是可溯源的工藝與可度量的社會影響力。
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="font-sans text-xs tracking-widest uppercase text-brand-silver/40 mb-4">
              服務
            </p>
            <ul className="space-y-3">
              {[
                { to: '/csr', label: 'CSR企業合作' },
                { to: '/products', label: '職人選物' },
                { to: '/about', label: '品牌故事' },
              ].map(l => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="font-sans text-sm text-brand-silver/50 hover:text-brand-ivory transition-colors duration-200"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-sans text-xs tracking-widest uppercase text-brand-silver/40 mb-4">
              聯絡
            </p>
            <ul className="space-y-3">
              <li className="font-sans text-sm text-brand-silver/50">
                materia2014@gmail.com
              </li>
              <li className="font-sans text-sm text-brand-silver/50">
                台灣 · 台北
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-brand-silver/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-brand-silver/30 tracking-widest">
            &copy; {new Date().getFullYear()} MATERIA. ALL RIGHTS RESERVED.
          </p>

          {/* Easter egg trigger — subtle, no indication */}
          <button
            onClick={registerFooterClick}
            className="font-sans text-xs text-brand-silver/20 hover:text-brand-silver/30 transition-colors duration-300 tracking-widest select-none"
            aria-hidden="true"
            tabIndex={-1}
          >
            MATERIA
          </button>

          <div className="flex items-center gap-6">
            <Link
              to="/login"
              className="font-sans text-xs text-brand-silver/30 hover:text-brand-silver/60 transition-colors tracking-widest uppercase"
            >
              會員
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
