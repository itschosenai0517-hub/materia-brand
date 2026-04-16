import CryptoJS from 'crypto-js'

const SECRET_KEY = import.meta.env.VITE_ADMIN_PASSWORD || 'capitol-secret'

export function encryptMessage(message: string): string {
  return CryptoJS.AES.encrypt(message, SECRET_KEY).toString()
}

export function decryptMessage(ciphertext: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch {
    return ''
  }
}

export function verifyCapitolPassword(input: string): boolean {
  return input === SECRET_KEY
}

export function encryptUserData(data: object): string {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString()
}

export function decryptUserData<T>(ciphertext: string): T | null {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY)
    const str = bytes.toString(CryptoJS.enc.Utf8)
    return JSON.parse(str) as T
  } catch {
    return null
  }
}
