import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'TWD') {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat('zh-TW').format(n)
}

// Animate a number from 0 to target
export function animateCounter(
  target: number,
  duration: number,
  onUpdate: (value: number) => void,
  onComplete?: () => void
) {
  const start = performance.now()
  const update = (now: number) => {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3)
    onUpdate(Math.round(target * eased))
    if (progress < 1) {
      requestAnimationFrame(update)
    } else {
      onComplete?.()
    }
  }
  requestAnimationFrame(update)
}

export function useIntersectionObserver(
  callback: () => void,
  options?: IntersectionObserverInit
) {
  return (el: Element | null) => {
    if (!el) return
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback()
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.2, ...options })
    observer.observe(el)
  }
}

// SEO helper
export function setPageMeta(title: string, description?: string) {
  document.title = `${title} — MATERIA`
  const desc = document.querySelector('meta[name="description"]')
  if (desc && description) desc.setAttribute('content', description)
}
