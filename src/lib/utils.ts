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

// SEO helper — updates title, description, and optional og:image / og:title
export function setPageMeta(title: string, description?: string, ogImage?: string) {
  const fullTitle = `${title} — MATERIA`
  document.title = fullTitle

  const setMeta = (selector: string, attr: string, value: string) => {
    let el = document.querySelector(selector)
    if (!el) {
      el = document.createElement('meta')
      // Determine if it's a property (og) or name meta
      if (selector.includes('property=')) {
        ;(el as HTMLMetaElement).setAttribute('property', selector.match(/property="([^"]+)"/)?.[1] ?? '')
      } else {
        ;(el as HTMLMetaElement).setAttribute('name', selector.match(/name="([^"]+)"/)?.[1] ?? '')
      }
      document.head.appendChild(el)
    }
    el.setAttribute(attr, value)
  }

  if (description) {
    setMeta('meta[name="description"]', 'content', description)
    setMeta('meta[property="og:description"]', 'content', description)
  }

  setMeta('meta[property="og:title"]', 'content', fullTitle)

  if (ogImage) {
    setMeta('meta[property="og:image"]', 'content', ogImage)
  }
}
