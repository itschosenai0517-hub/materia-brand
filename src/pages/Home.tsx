import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown, CheckCircle2, Star, Newspaper } from 'lucide-react'
import { getImpactMetrics, type ImpactMetric } from '@/firebase/firestore'
import { animateCounter, formatNumber, setPageMeta } from '@/lib/utils'

// ─── useReveal hook — triggers animation only when element enters viewport ────

function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, visible }
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero() {
  const { ref, visible } = useReveal(0.05)

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center px-6 lg:px-12 pt-24 pb-16 overflow-hidden"
    >
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #C9785A 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, #0D2137 0%, transparent 50%)`,
        }}
      />
      {/* Thin vertical rule */}
      <div className="absolute left-6 lg:left-12 top-32 bottom-32 w-px bg-gradient-to-b from-transparent via-brand-silver/20 to-transparent hidden lg:block" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Overline */}
        <p className={`font-sans text-xs tracking-[0.3em] uppercase text-brand-coral mb-8 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{ transitionDelay: '0ms' }}>
          永續製造 · 社會影響力
        </p>

        {/* Headline */}
        <h1
          className={`font-display text-[clamp(3rem,8vw,7rem)] font-light text-brand-ivory leading-[1.0] mb-8 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{ transitionDelay: '100ms' }}
        >
          質地即
          <br />
          <span className="italic text-gradient-coral">宣言</span>
        </h1>

        <p
          className={`font-sans text-base text-brand-silver/60 max-w-md leading-relaxed mb-12 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{ transitionDelay: '200ms' }}
        >
          MATERIA是台灣首個以工藝溯源為核心的
          <br />
          CSR永續代工品牌。每一件產品，
          <br />
          承載可度量的社會影響力。
        </p>

        {/* CTAs */}
        <div
          className={`flex flex-wrap gap-4 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{ transitionDelay: '300ms' }}
        >
          <Link to="/csr" className="btn-primary flex items-center gap-2">
            開始CSR計畫
            <ArrowRight size={14} />
          </Link>
          <Link to="/products" className="btn-outline">
            探索職人選物
          </Link>
        </div>

        {/* Scroll indicator */}
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-brand-silver/30 transition-all duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: '700ms' }}
        >
          <span className="font-sans text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown size={14} className="animate-bounce" />
        </div>
      </div>
    </section>
  )
}

// ─── Trust bar ────────────────────────────────────────────────────────────────

function TrustBar() {
  const partners = [
    'ENTERPRISE A', 'FOUNDATION B', 'CORP C', 'GROUP D', 'VENTURES E', 'STUDIO F',
  ]
  return (
    <section className="border-y border-brand-silver/10 py-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-6">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-brand-silver/30 text-center">
          企業合作夥伴
        </p>
      </div>
      <div className="flex gap-16 overflow-x-auto pb-2 px-6 lg:px-12 scrollbar-none">
        {[...partners, ...partners].map((p, i) => (
          <span
            key={i}
            className="font-sans text-xs tracking-[0.2em] uppercase text-brand-silver/25 whitespace-nowrap flex-shrink-0"
          >
            {p}
          </span>
        ))}
      </div>
    </section>
  )
}

// ─── About Section ────────────────────────────────────────────────────────────

function AboutSection() {
  const { ref, visible } = useReveal(0.1)

  return (
    <section ref={ref} className="py-24 px-6 lg:px-12 border-t border-brand-silver/10 bg-brand-carbon/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: title */}
          <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-brand-coral mb-4">
              關於MATERIA
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-light text-brand-ivory leading-tight mb-6">
              不只是製造，
              <br />
              <span className="italic">是一種承諾</span>
            </h2>
            <p className="font-sans text-sm text-brand-silver/50 leading-relaxed mb-4">
              MATERIA成立於2014年，從台南一間手工包裝工作室出發，十年來深耕永續代工、公益製造與職人工藝。我們相信，企業禮品與選物可以是改變社會的媒介。
            </p>
            <p className="font-sans text-sm text-brand-silver/50 leading-relaxed mb-8">
              我們與超過30間庇護工場、NGO 及在地工藝師合作，每一件出廠的產品都有名字、有故事、有可追蹤的社會影響力數據。
            </p>
            <Link
              to="/about"
              className="font-sans text-xs tracking-widest uppercase text-brand-silver/40 hover:text-brand-coral transition-colors duration-200 flex items-center gap-2"
            >
              認識我們的故事
              <ArrowRight size={12} />
            </Link>
          </div>

          {/* Right: milestones */}
          <div className={`transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="space-y-0">
              {[
                { year: '2014', text: '創立於台南，從手工包裝工作室起步' },
                { year: '2017', text: '首度與庇護工場合作，推出公益代工模式' },
                { year: '2019', text: '轉型社會企業，建立 Impact Report 制度' },
                { year: '2022', text: 'B2B CSR 服務上線，首年突破百家企業客戶' },
                { year: '2024', text: '累計超過 28,000 件產品出廠，34 家長期合作夥伴' },
              ].map((item, i) => (
                <div
                  key={item.year}
                  className={`flex gap-6 py-6 border-b border-brand-silver/10 last:border-0 transition-all duration-500 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
                  style={{ transitionDelay: `${200 + i * 80}ms` }}
                >
                  <span className="font-sans text-xs tracking-widest text-brand-coral w-12 flex-shrink-0 pt-0.5">
                    {item.year}
                  </span>
                  <p className="font-sans text-sm text-brand-silver/50 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Stats Highlight ──────────────────────────────────────────────────────────

function StatsHighlight() {
  const { ref, visible } = useReveal(0.15)
  const [counts, setCounts] = useState([0, 0, 0, 0])

  const stats = [
    { value: 10, suffix: '+', label: '年深耕永續製造' },
    { value: 34, suffix: '', label: '企業長期合作夥伴' },
    { value: 98, suffix: '%', label: '客戶滿意度' },
    { value: 3, suffix: '萬+', label: '累計出貨件數' },
  ]

  useEffect(() => {
    if (!visible) return
    stats.forEach((stat, i) => {
      const timer = setTimeout(() => {
        animateCounter(stat.value, 1600, (v) => {
          setCounts(prev => {
            const next = [...prev]
            next[i] = v
            return next
          })
        })
      }, i * 120)
      return () => clearTimeout(timer)
    })
  }, [visible])

  return (
    <section ref={ref} className="py-20 px-6 lg:px-12 border-t border-brand-silver/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-brand-silver/10">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`bg-brand-charcoal p-10 text-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <p className="font-display text-5xl lg:text-6xl font-light text-brand-coral mb-3">
                {counts[i]}{stat.suffix}
              </p>
              <p className="font-sans text-xs tracking-widest uppercase text-brand-silver/40">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Services ─────────────────────────────────────────────────────────────────

function Services() {
  const { ref, visible } = useReveal(0.1)

  const items = [
    {
      label: '01',
      title: 'CSR 代工',
      subtitle: 'Enterprise',
      body: '為企業設計可溯源的CSR禮品與活動體驗，附Impact Report。從材料選定到品牌故事，全程客製。',
      cta: '了解方案',
      href: '/csr',
    },
    {
      label: '02',
      title: '職人選物',
      subtitle: 'Consumer',
      body: '每件手工皂與蠟燭都附材料溯源卡。訂閱制每季選物盒，附本季影響力數字。',
      cta: '探索商品',
      href: '/products',
    },
    {
      label: '03',
      title: '公益製造',
      subtitle: 'Social',
      body: '與庇護工場合作，標明工匠姓名。聯合NGO發行聯名限定款，每筆捐贈比例公開透明。',
      cta: '了解理念',
      href: '/about',
    },
  ]

  return (
    <section ref={ref} className="py-24 px-6 lg:px-12 border-t border-brand-silver/10">
      <div className="max-w-7xl mx-auto">
        <div
          className={`mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-brand-coral mb-4">
            服務模式
          </p>
          <h2 className="font-display text-4xl lg:text-5xl font-light text-brand-ivory">
            三種切入，
            <br />
            <span className="italic">一個核心</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-brand-silver/10">
          {items.map((item, i) => (
            <div
              key={item.label}
              className={`bg-brand-charcoal p-10 group hover:bg-brand-carbon transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <p className="font-sans text-xs text-brand-silver/30 tracking-widest mb-8">
                {item.label}
              </p>
              <p className="font-sans text-xs tracking-widest uppercase text-brand-coral mb-3">
                {item.subtitle}
              </p>
              <h3 className="font-display text-3xl font-light text-brand-ivory mb-4">
                {item.title}
              </h3>
              <p className="font-sans text-sm text-brand-silver/50 leading-relaxed mb-8">
                {item.body}
              </p>
              <Link
                to={item.href}
                className="font-sans text-xs tracking-widest uppercase text-brand-silver/40 hover:text-brand-coral transition-colors duration-200 flex items-center gap-2"
              >
                {item.cta}
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Why Us ───────────────────────────────────────────────────────────────────

function WhyUs() {
  const { ref, visible } = useReveal(0.1)

  const reasons = [
    {
      title: '完整溯源鏈',
      body: '從原料產地到成品交付，每個環節都有記錄。Impact Report隨貨附上，數字公開透明。',
    },
    {
      title: '職人工藝品質',
      body: '與有名字的工匠合作，不是工廠流水線。每批次都有品質驗核，確保一致水準。',
    },
    {
      title: '客製化彈性',
      body: '小量到大量皆可配合，從Logo印刷到全品項開發，彈性因應不同CSR預算與需求。',
    },
    {
      title: '48小時快速回應',
      body: '專屬顧問在48小時內提供方案初稿與報價，讓CSR計畫準時上線。',
    },
    {
      title: '社會效益保證',
      body: '合作即代表支持庇護工場就業與NGO公益，每筆訂單的捐贈比例事前約定、事後公開。',
    },
    {
      title: '品牌共創支援',
      body: '提供文案、視覺、故事包裝協助，讓你的CSR禮品不只是禮品，更是品牌的延伸。',
    },
  ]

  return (
    <section ref={ref} className="py-24 px-6 lg:px-12 border-t border-brand-silver/10 bg-brand-carbon/20">
      <div className="max-w-7xl mx-auto">
        <div
          className={`mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-brand-coral mb-4">
            為何選擇我們
          </p>
          <h2 className="font-display text-4xl lg:text-5xl font-light text-brand-ivory">
            六個理由，
            <br />
            <span className="italic">信任 MATERIA</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-brand-silver/10">
          {reasons.map((reason, i) => (
            <div
              key={reason.title}
              className={`bg-brand-charcoal p-8 group transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <CheckCircle2 size={16} className="text-brand-coral mb-5 opacity-60" />
              <h3 className="font-sans text-sm font-medium text-brand-ivory mb-3">
                {reason.title}
              </h3>
              <p className="font-sans text-xs text-brand-silver/40 leading-relaxed">
                {reason.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Impact Dashboard ─────────────────────────────────────────────────────────

interface MetricCardProps {
  value: number
  suffix: string
  label: string
  description: string
  progress: number
  target: number
  visible: boolean
  delay: number
}

function MetricCard({ value, suffix, label, description, progress, target, visible, delay }: MetricCardProps) {
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(() => {
      animateCounter(value, 1800, setDisplayed)
    }, delay)
    return () => clearTimeout(timer)
  }, [visible, value, delay])

  return (
    <div className="border border-brand-silver/10 p-8 hover:border-brand-silver/20 transition-colors duration-300">
      <p className="impact-number mb-2">
        {formatNumber(displayed)}{suffix}
      </p>
      <p className="font-sans text-sm text-brand-ivory/80 mb-1">{label}</p>
      <p className="font-sans text-xs text-brand-silver/40 mb-6">{description}</p>
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: visible ? `${(progress / target) * 100}%` : '0%' }}
        />
      </div>
      <p className="font-sans text-xs text-brand-silver/30 mt-2">
        目標 {formatNumber(target)}{suffix}
      </p>
    </div>
  )
}

const FALLBACK_METRICS: ImpactMetric = {
  artisanHours: 12480,
  donationAmount: 847200,
  carbonSaved: 3240,
  productsDelivered: 28600,
  partnersCount: 34,
  updatedAt: null,
}

function ImpactDashboard() {
  const [metrics, setMetrics] = useState<ImpactMetric>(FALLBACK_METRICS)
  const [metricsError, setMetricsError] = useState(false)
  const { ref, visible } = useReveal(0.2)

  useEffect(() => {
    getImpactMetrics()
      .then(setMetrics)
      .catch(() => {
        // Silently fall back to default values; log for debugging
        console.warn('[ImpactDashboard] Failed to fetch impact metrics, using fallback values.')
        setMetricsError(true)
      })
  }, [])

  return (
    <section ref={ref} className="py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-brand-coral mb-4">
            Impact Dashboard
          </p>
          <h2 className="font-display text-4xl lg:text-5xl font-light text-brand-ivory">
            數字會說話
          </h2>
          {metricsError && (
            <p className="font-sans text-xs text-brand-silver/30 mt-3">
              目前顯示參考數據，即時資料暫時無法載入。
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-brand-silver/10">
          <div className="bg-brand-charcoal">
            <MetricCard
              value={metrics.artisanHours}
              suffix="h"
              label="工匠累計工時"
              description="與庇護工場夥伴共同創造"
              progress={metrics.artisanHours}
              target={20000}
              visible={visible}
              delay={0}
            />
          </div>
          <div className="bg-brand-charcoal">
            <MetricCard
              value={metrics.donationAmount}
              suffix=""
              label="公益捐款"
              description="每筆訂單直接挹注合作NGO"
              progress={metrics.donationAmount}
              target={1500000}
              visible={visible}
              delay={150}
            />
          </div>
          <div className="bg-brand-charcoal">
            <MetricCard
              value={metrics.carbonSaved}
              suffix="kg"
              label="減碳量"
              description="使用永續原料與在地生產"
              progress={metrics.carbonSaved}
              target={10000}
              visible={visible}
              delay={300}
            />
          </div>
          <div className="bg-brand-charcoal">
            <MetricCard
              value={metrics.productsDelivered}
              suffix=""
              label="出貨件數"
              description="B2B + B2C累計交付"
              progress={metrics.productsDelivered}
              target={50000}
              visible={visible}
              delay={450}
            />
          </div>
          <div className="bg-brand-charcoal sm:col-span-2 lg:col-span-2">
            <MetricCard
              value={metrics.partnersCount}
              suffix=""
              label="企業合作夥伴數"
              description="CSR長期合作客戶"
              progress={metrics.partnersCount}
              target={100}
              visible={visible}
              delay={600}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function Testimonials() {
  const { ref, visible } = useReveal(0.1)

  const testimonials = [
    {
      quote: '第一次合作CSR代工就選MATERIA，從設計到出貨不到三週，附上的Impact Report讓我們在股東會上有了有力的說明材料。',
      name: '陳副總',
      role: '某科技集團CSR部門副總',
    },
    {
      quote: '訂了季度選物盒送給全體員工，每一件都附有溯源卡，同事反應比一般禮盒更有溫度。明年繼續。',
      name: 'Michelle L.',
      role: '新創公司HR Director',
    },
    {
      quote: 'MATERIA 是我合作過最有誠意的品牌，他們真的在意每一個環節，不是用永續當噱頭。',
      name: '林執行長',
      role: '社會企業創辦人',
    },
  ]

  return (
    <section ref={ref} className="py-24 px-6 lg:px-12 border-t border-brand-silver/10">
      <div className="max-w-7xl mx-auto">
        <div
          className={`mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-brand-coral mb-4">
            客戶見證
          </p>
          <h2 className="font-display text-4xl lg:text-5xl font-light text-brand-ivory">
            他們怎麼說
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-brand-silver/10">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`bg-brand-charcoal p-10 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={10} className="fill-brand-coral text-brand-coral" />
                ))}
              </div>
              <p className="font-sans text-sm text-brand-silver/60 leading-relaxed mb-8 italic">
                「{t.quote}」
              </p>
              <div className="border-t border-brand-silver/10 pt-6">
                <p className="font-sans text-xs text-brand-ivory">{t.name}</p>
                <p className="font-sans text-xs text-brand-silver/30 mt-1">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Latest News ──────────────────────────────────────────────────────────────

function LatestNews() {
  const { ref, visible } = useReveal(0.1)

  const news = [
    {
      date: '2025.04',
      tag: '媒體報導',
      title: 'MATERIA登上《天下雜誌》永續企業專題',
      excerpt: '報導聚焦MATERIA如何透過代工模式重新定義CSR，讓企業禮品成為社會影響力的載體。',
    },
    {
      date: '2025.03',
      tag: '新品上架',
      title: '2025春季限定「山林系」選物盒正式開放預購',
      excerpt: '本季與台東有機農場合作，推出天然蠟燭與手工皂組合，附完整的工匠故事溯源卡。',
    },
    {
      date: '2025.02',
      tag: '里程碑',
      title: '累計捐款突破新臺幣100萬，感謝每一位合作夥伴',
      excerpt: '隨著訂單持續成長，本月累計公益捐款金額正式突破百萬，資金全數流向合作NGO就業計畫。',
    },
  ]

  return (
    <section ref={ref} className="py-24 px-6 lg:px-12 border-t border-brand-silver/10 bg-brand-carbon/20">
      <div className="max-w-7xl mx-auto">
        <div
          className={`flex items-end justify-between mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <div>
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-brand-coral mb-4">
              最新消息
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-light text-brand-ivory">
              近期動態
            </h2>
          </div>
          <Link
            to="/about"
            className="hidden lg:flex font-sans text-xs tracking-widest uppercase text-brand-silver/40 hover:text-brand-coral transition-colors duration-200 items-center gap-2"
          >
            查看全部
            <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-brand-silver/10">
          {news.map((item, i) => (
            <div
              key={item.title}
              className={`bg-brand-charcoal p-8 group hover:bg-brand-carbon transition-all duration-500 cursor-pointer ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="font-sans text-xs text-brand-silver/30 tracking-widest">
                  {item.date}
                </span>
                <span className="font-sans text-xs tracking-widest uppercase text-brand-coral border border-brand-coral/30 px-2 py-0.5">
                  {item.tag}
                </span>
              </div>
              <Newspaper size={14} className="text-brand-silver/20 mb-4" />
              <h3 className="font-sans text-sm font-medium text-brand-ivory leading-relaxed mb-4 group-hover:text-brand-coral transition-colors duration-200">
                {item.title}
              </h3>
              <p className="font-sans text-xs text-brand-silver/40 leading-relaxed">
                {item.excerpt}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile: view all */}
        <div className={`mt-8 lg:hidden flex justify-center transition-all duration-700 delay-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          <Link
            to="/about"
            className="font-sans text-xs tracking-widest uppercase text-brand-silver/40 hover:text-brand-coral transition-colors duration-200 flex items-center gap-2"
          >
            查看全部動態
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── Brand Story Teaser ───────────────────────────────────────────────────────

function StoryTeaser() {
  const { ref, visible } = useReveal(0.15)

  return (
    <section ref={ref} className="py-24 px-6 lg:px-12 border-t border-brand-silver/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image placeholder */}
          <div
            className={`aspect-[4/3] bg-brand-carbon relative overflow-hidden transition-all duration-700 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
          >
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `radial-gradient(ellipse at 30% 60%, #C9785A 0%, transparent 60%)`,
              }}
            />
            <div className="absolute inset-0 flex items-end p-8">
              <p className="font-display text-6xl font-light text-brand-ivory/10">
                工坊
              </p>
            </div>
          </div>

          <div
            className={`transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
          >
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-brand-coral mb-6">
              品牌故事
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-light text-brand-ivory leading-tight mb-6">
              從代工工作室
              <br />
              到社會企業品牌
            </h2>
            <p className="font-sans text-sm text-brand-silver/50 leading-relaxed mb-4">
              MATERIA 起源於一間小型包裝工作室，與公益活動的十年積累。
              我們相信，製造業可以是改變的起點，而非終點。
            </p>
            <p className="font-sans text-sm text-brand-silver/50 leading-relaxed mb-10">
              每一批原料都有來源，每一位工匠都有名字，
              每一筆收益都有去向。這就是MATERIA的承諾。
            </p>
            <Link
              to="/about"
              className="font-sans text-xs tracking-widest uppercase text-brand-silver/40 hover:text-brand-coral transition-colors duration-200 flex items-center gap-2"
            >
              閱讀完整故事
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

function FinalCTA() {
  const { ref, visible } = useReveal(0.2)

  return (
    <section ref={ref} className="py-32 px-6 lg:px-12 border-t border-brand-silver/10 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 100%, #C9785A 0%, transparent 60%)`,
        }}
      />
      <div
        className={`max-w-3xl mx-auto text-center relative z-10 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <h2 className="font-display text-5xl lg:text-6xl font-light text-brand-ivory leading-tight mb-6">
          開始你的
          <br />
          <span className="italic text-gradient-coral">CSR 計畫</span>
        </h2>
        <p className="font-sans text-sm text-brand-silver/50 leading-relaxed mb-10 max-w-md mx-auto">
          填寫合作需求，我們將在48小時內提供
          客製化方案與報價。
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/csr" className="btn-primary flex items-center gap-2">
            提交合作需求
            <ArrowRight size={14} />
          </Link>
          <Link to="/products" className="btn-outline">
            先逛逛選物
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  useEffect(() => {
    setPageMeta('MATERIA', '台灣領先的永續代工品牌，提供CSR企業合作、手工職人商品與公益製造解決方案。')
  }, [])

  return (
    <>
      <Hero />
      <TrustBar />
      <AboutSection />
      <StatsHighlight />
      <Services />
      <WhyUs />
      <ImpactDashboard />
      <Testimonials />
      <LatestNews />
      <StoryTeaser />
      <FinalCTA />
    </>
  )
}
