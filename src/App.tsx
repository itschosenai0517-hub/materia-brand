import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { EasterEggProvider } from '@/context/EasterEggContext'
import AppRoutes from '@/router'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <EasterEggProvider>
          <AppRoutes />
        </EasterEggProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
