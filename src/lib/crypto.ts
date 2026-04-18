import CryptoJS from 'crypto-js'

// Encryption key for client-side data (non-sensitive, purely for obfuscation)
// NOTE: This is intentionally NOT the admin password — do not store secrets here.
const OBFUSCATION_KEY = 'materia-client-v1'

export function encryptMessage(message: string): string {
  return CryptoJS.AES.encrypt(message, OBFUSCATION_KEY).toString()
}

export function decryptMessage(ciphertext: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, OBFUSCATION_KEY)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch {
    return ''
  }
}

/**
 * Verify the Capitol Terminal password via the server.
 * Returns the role ('admin' | 'user') if valid, or null if denied.
 */
export async function verifyCapitolPassword(
  input: string
): Promise<'admin' | 'user' | null> {
  try {
    const res = await fetch('/api/verify-capitol', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: input }),
    })
    if (!res.ok) return null
    const data = await res.json()
    if (data.granted && (data.role === 'admin' || data.role === 'user')) {
      return data.role
    }
    return null
  } catch {
    return null
  }
}

export function encryptUserData(data: object): string {
  return CryptoJS.AES.encrypt(JSON.stringify(data), OBFUSCATION_KEY).toString()
}

export function decryptUserData<T>(ciphertext: string): T | null {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, OBFUSCATION_KEY)
    const str = bytes.toString(CryptoJS.enc.Utf8)
    return JSON.parse(str) as T
  } catch {
    return null
  }
}
