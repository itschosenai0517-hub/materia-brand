import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { signOut } from '@/firebase/auth'
import { setPageMeta } from '@/lib/utils'

const MEMBER_FEATURES = [
  { label: '訂閱管理', desc: '管理您的職人訂閱盒', href: '#subscription' },
  { label: '訂單記錄', desc: '查看所有歷史訂單', href: '#orders' },
  { label: 'Impact 報告', desc: '您的購買產生的影響力', href: '#impact' },
  { label: 'CSR 合作紀錄', desc: '企業合作進度追蹤', href: '#csr' },
]

export default function Portal() {
  const { profile, isAdmin } = useAuth()

  useEffect(() => {
    setPageMeta('會員中心')
  }, [])

  return (
    <div className="min-h-screen pt-24 pb-24 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-16 pt-8">
          <div>
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-brand-coral mb-3">
              會員中心
            </p>
            <h1 className="font-display text-4xl font-light text-brand-ivory">
              歡迎回來，{profile?.displayName ?? '會員'}
            </h1>
            <p className="font-sans text-xs text-brand-silver/40 mt-2 tracking-widest uppercase">
              {profile?.role === 'admin' ? 'Admin' : profile?.role === 'enterprise' ? 'Enterprise Member' : 'Member'}
            </p>
          </div>
          <button
            onClick={() => signOut()}
            className="btn-ghost text-xs tracking-widest uppercase"
          >
            登出
          </button>
        </div>

        {/* Admin shortcut */}
        {isAdmin && (
          <div className="mb-8 p-6 border border-brand-coral/30 bg-brand-coral/5">
            <p className="font-sans text-xs tracking-widest uppercase text-brand-coral mb-2">
              Admin Access
            </p>
            <p className="font-sans text-sm text-brand-silver/60 mb-4">
              您有管理員權限，可以進入後台管理介面。
            </p>
            <Link to="/admin" className="btn-primary text-xs">
              進入後台
            </Link>
          </div>
        )}

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-brand-silver/10 mb-12">
          {MEMBER_FEATURES.map(f => (
            <div
              key={f.label}
              className="bg-brand-charcoal p-8 hover:bg-brand-carbon transition-colors duration-300 cursor-pointer"
            >
              <h3 className="font-display text-2xl text-brand-ivory mb-2">{f.label}</h3>
              <p className="font-sans text-sm text-brand-silver/50">{f.desc}</p>
              <p className="font-sans text-xs text-brand-silver/20 mt-4 tracking-widest uppercase">
                即將推出
              </p>
            </div>
          ))}
        </div>

        {/* Personal impact */}
        <div className="border border-brand-silver/10 p-8">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-brand-coral mb-6">
            您的影響力
          </p>
          <div className="grid grid-cols-3 gap-8">
            {[
              { value: '0', label: '累計購買件數' },
              { value: 'NT 0元', label: '累計公益捐贈' },
              { value: '0 kg', label: '減碳貢獻' },
            ].map(m => (
              <div key={m.label}>
                <p className="font-display text-3xl text-brand-coral mb-1">{m.value}</p>
                <p className="font-sans text-xs text-brand-silver/40">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
