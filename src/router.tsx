import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import { useAuth } from '@/context/AuthContext'

// Lazy loaded pages
const Home = lazy(() => import('@/pages/Home'))
const CSR = lazy(() => import('@/pages/CSR'))
const Products = lazy(() => import('@/pages/Products'))
const ProductDetail = lazy(() => import('@/pages/ProductDetail'))
const About = lazy(() => import('@/pages/About'))
const Login = lazy(() => import('@/pages/Login'))
const Portal = lazy(() => import('@/pages/Portal'))
const Admin = lazy(() => import('@/pages/Admin'))
const Secret = lazy(() => import('@/pages/Secret'))
const NotFound = lazy(() => import('@/pages/NotFound'))

function ProtectedRoute({ children, adminOnly = false }: {
  children: React.ReactNode
  adminOnly?: boolean
}) {
  const { user, isAdmin, loading } = useAuth()
  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && !isAdmin) return <Navigate to="/portal" replace />
  return <>{children}</>
}

function PageLoader() {
  return (
    <div className="min-h-screen bg-brand-charcoal flex items-center justify-center">
      <div className="w-6 h-6 border border-brand-coral border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/csr" element={<CSR />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/portal" element={
            <ProtectedRoute><Portal /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute adminOnly><Admin /></ProtectedRoute>
          } />
        </Route>
        {/* Easter egg — no layout wrapper */}
        <Route path="/secret" element={<Secret />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
