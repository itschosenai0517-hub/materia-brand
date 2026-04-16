import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signIn, signUp } from '@/firebase/auth'
import { useAuth } from '@/context/AuthContext'
import { setPageMeta } from '@/lib/utils'

export default function Login() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    setPageMeta('登入')
    if (user) navigate('/portal', { replace: true })
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (mode === 'login') {
        await signIn(email, password)
      } else {
        if (!name.trim()) { setError('請輸入姓名'); return }
        await signUp(email, password, name)
      }
      navigate('/portal')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        setError('帳號或密碼不正確')
      } else if (msg.includes('email-already-in-use')) {
        setError('此信箱已被使用')
      } else if (msg.includes('weak-password')) {
        setError('密碼至少需要 6 個字元')
      } else {
        setError('登入失敗，請稍後再試')
      }
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-transparent border-b border-brand-silver/20 py-3 font-sans text-sm text-brand-ivory placeholder:text-brand-silver/30 focus:outline-none focus:border-brand-coral transition-colors duration-200"
  const labelClass = "block font-sans text-xs tracking-widest uppercase text-brand-silver/40 mb-2"

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-sm">
        <Link to="/" className="block mb-12">
          <p className="font-display text-2xl font-light tracking-[0.15em] text-brand-ivory uppercase">
            Materia
          </p>
        </Link>

        <div className="flex gap-6 mb-10 border-b border-brand-silver/10">
          {(['login', 'register'] as const).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError('') }}
              className={`pb-3 -mb-px font-sans text-xs tracking-widest uppercase border-b transition-colors duration-200 ${
                mode === m
                  ? 'text-brand-coral border-brand-coral'
                  : 'text-brand-silver/40 border-transparent hover:text-brand-ivory'
              }`}
            >
              {m === 'login' ? '登入' : '註冊'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {mode === 'register' && (
            <div>
              <label className={labelClass}>姓名</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="王小明"
                className={inputClass}
                required
              />
            </div>
          )}
          <div>
            <label className={labelClass}>電子信箱</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>密碼</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
              required
              minLength={6}
            />
          </div>

          {error && (
            <p className="font-sans text-xs text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-xs"
          >
            {loading ? '處理中...' : mode === 'login' ? '登入' : '建立帳號'}
          </button>
        </form>
      </div>
    </div>
  )
}
