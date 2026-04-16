import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { type User } from 'firebase/auth'
import { onAuthChange, getUserProfile, type UserProfile, type UserRole } from '@/firebase/auth'

interface AuthState {
  user: User | null
  profile: UserProfile | null
  role: UserRole | null
  loading: boolean
  isAdmin: boolean
  isMember: boolean
}

const AuthContext = createContext<AuthState>({
  user: null,
  profile: null,
  role: null,
  loading: true,
  isAdmin: false,
  isMember: false,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      setUser(u)
      if (u) {
        const p = await getUserProfile(u.uid)
        setProfile(p)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const role = profile?.role ?? null

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        loading,
        isAdmin: role === 'admin',
        isMember: role === 'admin' || role === 'member' || role === 'enterprise',
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
