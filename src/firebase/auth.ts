import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './config'

export type UserRole = 'admin' | 'member' | 'enterprise' | 'user'

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  role: UserRole
  company?: string
  createdAt: unknown
  lastLogin: unknown
}

export async function signIn(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  // Update last login
  await setDoc(
    doc(db, 'users', credential.user.uid),
    { lastLogin: serverTimestamp() },
    { merge: true }
  )
  return credential
}

export async function signUp(
  email: string,
  password: string,
  displayName: string,
  role: UserRole = 'user'
) {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  const profile: UserProfile = {
    uid: credential.user.uid,
    email,
    displayName,
    role,
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp(),
  }
  await setDoc(doc(db, 'users', credential.user.uid), profile)
  return credential
}

export async function signOut() {
  await firebaseSignOut(auth)
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? (snap.data() as UserProfile) : null
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}

export async function isAdmin(uid: string): Promise<boolean> {
  const profile = await getUserProfile(uid)
  return profile?.role === 'admin'
}
