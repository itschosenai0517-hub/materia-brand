import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { getImpactMetrics, type ImpactMetric } from '@/firebase/firestore'
import { animateCounter, formatNumber, setPageMeta } from '@/lib/utils'

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 lg:px-12 pt-24 pb-16 overflow-hidden">
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
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-brand-coral mb-8 animate-fade-up">
          永續製造 · 社會影響力
        </p>

        {/* Headline */}
        <h1 className="font-display text-[clamp(3rem,8vw,7rem)] font-light text-brand-ivory leading-[1.0] mb-8 animate-fade-up animate-delay-100">
          質地即
          <br />
          <span className="italic text-gradient-coral">宣言</span>
        </h1>

        <p className="font-sans text-base text-brand-silver/60 max-w-md leading-relaxed mb-12 animate-fade-up animate-delay-200">
          MATERIA 是台灣首個以工藝溯源為核心的
          <br />
          CSR 永續代工品牌。每一件產品，
          <br />
          承載可度量的社會影響力。
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 animate-fade-up animate-delay-300">
          <Link to="/csr" className="btn-primary flex items-center gap-2">
            開始 CSR 計畫
            <ArrowRight size={14} />
          </Link>
          <Link to="/products" className="btn-outline">
            探索職人選物
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-brand-silver/30 animate-fade-in animate-delay-700">
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

function ImpactDashboard() {
  const [metrics, setMetrics] = useState<ImpactMetric | null>(null)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getImpactMetrics().then(setMetrics)
  }, [])

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const m = metrics ?? {
    artisanHours: 12480,
    donationAmount: 847200,
    carbonSaved: 3240,
    productsDelivered: 28600,
    partnersCount: 34,
  }

  return (
    <section ref={ref} className="py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-brand-coral mb-4">
            Impact Dashboard
          </p>
          <h2 className="font-display text-4xl lg:text-5xl font-light text-brand-ivory">
            數字不說謊
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-brand-silver/10">
          <div className="bg-brand-charcoal">
            <MetricCard
              value={m.artisanHours}
              suffix="h"
              label="工匠累計工時"
              description="與庇護工場夥伴共同創造"
              progress={m.artisanHours}
              target={20000}
              visible={visible}
              delay={0}
            />
          </div>
          <div className="bg-brand-charcoal">
            <MetricCard
              value={m.donationAmount}
              suffix=""
              label="公益捐款 NT$"
              description="每筆訂單直接挹注合作 NGO"
              progress={m.donationAmount}
              target={1500000}
              visible={visible}
              delay={150}
            />
          </div>
          <div className="bg-brand-charcoal">
            <MetricCard
              value={m.carbonSaved}
              suffix="kg"
              label="減碳量"
              description="使用永續原料與在地生產"
              progress={m.carbonSaved}
              target={10000}
              visible={visible}
              delay={300}
            />
          </div>
          <div className="bg-brand-charcoal">
            <MetricCard
              value={m.productsDelivered}
              suffix=""
              label="出貨件數"
              description="B2B + B2C 累計交付"
              progress={m.productsDelivered}
              target={50000}
              visible={visible}
              delay={450}
            />
          </div>
          <div className="bg-brand-charcoal sm:col-span-2 lg:col-span-2">
            <MetricCard
              value={m.partnersCount}
              suffix=""
              label="企業合作夥伴數"
              description="CSR 長期合作客戶"
              progress={m.partnersCount}
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

// ─── Services ─────────────────────────────────────────────────────────────────

function Services() {
  const items = [
    {
      label: '01',
      title: 'CSR 代工',
      subtitle: 'Enterprise',
      body: '為企業設計可溯源的 CSR 禮品與活動體驗，附 Impact Report。從材料選定到品牌故事，全程客製。',
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
      body: '與庇護工場合作，標明工匠姓名。聯合 NGO 發行聯名限定款，每筆捐贈比例公開透明。',
      cta: '了解理念',
      href: '/about',
    },
  ]

  return (
    <section className="py-24 px-6 lg:px-12 border-t border-brand-silver/10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
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
          {items.map(item => (
            <div
              key={item.label}
              className="bg-brand-charcoal p-10 group hover:bg-brand-carbon transition-colors duration-300"
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

// ─── Brand Story Teaser ───────────────────────────────────────────────────────

function StoryTeaser() {
  return (
    <section className="py-24 px-6 lg:px-12 border-t border-brand-silver/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image placeholder */}
          <div className="aspect-[4/3] bg-brand-carbon relative overflow-hidden">
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

          <div>
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
              每一筆收益都有去向。這就是 MATERIA 的承諾。
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
  return (
    <section className="py-32 px-6 lg:px-12 border-t border-brand-silver/10 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 100%, #C9785A 0%, transparent 60%)`,
        }}
      />
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <h2 className="font-display text-5xl lg:text-6xl font-light text-brand-ivory leading-tight mb-6">
          開始你的
          <br />
          <span className="italic text-gradient-coral">CSR 計畫</span>
        </h2>
        <p className="font-sans text-sm text-brand-silver/50 leading-relaxed mb-10 max-w-md mx-auto">
          填寫合作需求，我們將在 48 小時內提供
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
    setPageMeta('MATERIA', '台灣領先的永續代工品牌，提供 CSR 企業合作、手工職人商品與公益製造解決方案。')
  }, [])

  return (
    <>
      <Hero />
      <TrustBar />
      <Services />
      <ImpactDashboard />
      <StoryTeaser />
      <FinalCTA />
    </>
  )
}
