import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
  type DocumentData,
} from 'firebase/firestore'
import { db } from './config'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Product {
  id?: string
  name: string
  nameEn: string
  description: string
  price: number
  category: 'soap' | 'candle' | 'gift-set' | 'subscription'
  images: string[]
  materials: string[]
  impactNote: string
  inStock: boolean
  featured: boolean
  createdAt: unknown
}

export interface CSRInquiry {
  id?: string
  company: string
  contact: string
  email: string
  phone: string
  quantity: number
  budget: string
  timeline: string
  notes: string
  status: 'pending' | 'contacted' | 'quoted' | 'confirmed' | 'completed'
  createdAt: unknown
}

export interface ImpactMetric {
  id?: string
  artisanHours: number
  donationAmount: number
  carbonSaved: number
  productsDelivered: number
  partnersCount: number
  updatedAt: unknown
}

export interface EasterEggSession {
  id?: string
  uid: string
  triggeredAt: unknown
  userAgent: string
  granted: boolean
}

// ─── Products ────────────────────────────────────────────────────────────────

export async function getProducts(category?: string) {
  const ref = collection(db, 'products')
  const q = category
    ? query(ref, where('category', '==', category), where('inStock', '==', true))
    : query(ref, where('inStock', '==', true), orderBy('featured', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product))
}

export async function getFeaturedProducts(count = 6) {
  const ref = collection(db, 'products')
  const q = query(ref, where('featured', '==', true), limit(count))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product))
}

export async function getProduct(id: string) {
  const snap = await getDoc(doc(db, 'products', id))
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Product) : null
}

// ─── CSR Inquiries ────────────────────────────────────────────────────────────

export async function submitCSRInquiry(data: Omit<CSRInquiry, 'id' | 'status' | 'createdAt'>) {
  return addDoc(collection(db, 'csr_inquiries'), {
    ...data,
    status: 'pending',
    createdAt: serverTimestamp(),
  })
}

// ─── Impact Metrics ──────────────────────────────────────────────────────────

export async function getImpactMetrics(): Promise<ImpactMetric> {
  const snap = await getDoc(doc(db, 'config', 'impact'))
  if (snap.exists()) return snap.data() as ImpactMetric
  // Default values if not set
  return {
    artisanHours: 12480,
    donationAmount: 847200,
    carbonSaved: 3240,
    productsDelivered: 28600,
    partnersCount: 34,
    updatedAt: null,
  }
}

export function subscribeImpactMetrics(callback: (data: ImpactMetric) => void) {
  return onSnapshot(doc(db, 'config', 'impact'), snap => {
    if (snap.exists()) callback(snap.data() as ImpactMetric)
  })
}

// ─── Easter Egg ──────────────────────────────────────────────────────────────

export async function logEasterEggAccess(uid: string, granted: boolean) {
  return addDoc(collection(db, 'easter_egg_sessions'), {
    uid,
    triggeredAt: serverTimestamp(),
    userAgent: navigator.userAgent,
    granted,
  })
}

// ─── Admin ───────────────────────────────────────────────────────────────────

export async function updateImpactMetrics(data: Partial<ImpactMetric>) {
  return updateDoc(doc(db, 'config', 'impact'), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function getCSRInquiries() {
  const snap = await getDocs(
    query(collection(db, 'csr_inquiries'), orderBy('createdAt', 'desc'))
  )
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as CSRInquiry))
}

export async function updateInquiryStatus(id: string, status: CSRInquiry['status']) {
  return updateDoc(doc(db, 'csr_inquiries', id), { status })
}
