import { useEffect, useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { submitCSRInquiry } from '@/firebase/firestore'
import { setPageMeta } from '@/lib/utils'

const PLANS = [
  {
    code: 'Basic',
    name: 'Impact Basic',
    price: 'NT$800 / 件起',
    min: '50 件起訂',
    features: [
      '客製包裝設計',
      '手工皂 / 蠟燭選品',
      '品牌 LOGO 印製',
      '基本材料說明卡',
    ],
  },
  {
    code: 'Pro',
    name: 'Impact Pro',
    price: 'NT$1,500 / 件起',
    min: '30 件起訂',
    features: [
      'Basic 全部內容',
      '品牌故事小冊',
      '工匠姓名卡',
      '季度 Impact Report',
      '公益捐贈比例標示',
    ],
    highlight: true,
  },
  {
    code: 'Enterprise',
    name: 'Impact Enterprise',
    price: '報價制',
    min: '年度合作',
    features: [
      'Pro 全部內容',
      '專屬工藝師指定',
      '年度品牌故事影片',
      '員工體驗工作坊',
      '季度合作報告會議',
      '優先產能保留',
    ],
  },
]

const MATERIALS = [
  { name: '冷製手工皂', origin: '台灣在地農場', cert: '無農藥認證' },
  { name: '大豆蠟', origin: '非基改美國大豆', cert: 'RSPO 認證' },
  { name: '精油原料', origin: '台灣薰衣草農場', cert: '有機認證' },
  { name: '包裝用紙', origin: '台灣回收再生', cert: 'FSC 認證' },
  { name: '棉芯燭芯', origin: '無漂白棉線', cert: '無鉛認證' },
]

function MaterialsSection() {
  return (
    <section className="py-20 px-6 lg:px-12 border-t border-brand-silver/10">
      <div className="max-w-7xl mx-auto">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-brand-coral mb-4">
          材料溯源
        </p>
        <h2 className="font-display text-4xl font-light text-brand-ivory mb-12">
          每一種原料都有故事
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-brand-silver/10">
          {MATERIALS.map(m => (
            <div key={m.name} className="bg-brand-charcoal p-8">
              <p className="font-display text-xl text-brand-ivory mb-2">{m.name}</p>
              <p className="font-sans text-xs text-brand-silver/50 mb-1">來源：{m.origin}</p>
              <p className="font-sans text-xs text-brand-coral/70">{m.cert}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PlansSection() {
  return (
    <section className="py-20 px-6 lg:px-12 border-t border-brand-silver/10">
      <div className="max-w-7xl mx-auto">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-brand-coral mb-4">
          方案選擇
        </p>
        <h2 className="font-display text-4xl font-light text-brand-ivory mb-12">
          三個層級，一個承諾
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-brand-silver/10">
          {PLANS.map(plan => (
            <div
              key={plan.code}
              className={`p-10 flex flex-col ${plan.highlight ? 'bg-brand-navy' : 'bg-brand-charcoal'}`}
            >
              {plan.highlight && (
                <p className="font-sans text-xs tracking-widest uppercase text-brand-coral mb-6">
                  推薦方案
                </p>
              )}
              <p className="font-display text-2xl text-brand-ivory mb-1">{plan.name}</p>
              <p className="font-sans text-xs text-brand-silver/40 mb-6">{plan.min}</p>
              <p className="font-display text-3xl text-brand-ivory mb-8">{plan.price}</p>
              <ul className="space-y-3 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-3">
                    <CheckCircle size={14} className="text-brand-coral mt-0.5 flex-shrink-0" />
                    <span className="font-sans text-sm text-brand-silver/60">{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => {
                  document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className={`mt-8 ${plan.highlight ? 'btn-primary' : 'btn-outline'} text-xs`}
              >
                選擇此方案
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function InquiryForm() {
  const [form, setForm] = useState({
    company: '', contact: '', email: '', phone: '',
    quantity: '', budget: '', timeline: '', notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await submitCSRInquiry({
        ...form,
        quantity: parseInt(form.quantity) || 0,
      })
      setSubmitted(true)
    } catch {
      setError('提交失敗，請稍後再試或直接寄信至 hello@materia.tw')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-20">
        <CheckCircle size={40} className="text-brand-coral mx-auto mb-6" />
        <h3 className="font-display text-3xl text-brand-ivory mb-4">已收到您的需求</h3>
        <p className="font-sans text-sm text-brand-silver/50">
          我們將在 48 小時內與您聯繫，提供客製化方案。
        </p>
      </div>
    )
  }

  const inputClass = "w-full bg-transparent border-b border-brand-silver/20 py-3 font-sans text-sm text-brand-ivory placeholder:text-brand-silver/30 focus:outline-none focus:border-brand-coral transition-colors duration-200"
  const labelClass = "block font-sans text-xs tracking-widest uppercase text-brand-silver/40 mb-2"

  return (
    <section id="inquiry-form" className="py-20 px-6 lg:px-12 border-t border-brand-silver/10">
      <div className="max-w-3xl mx-auto">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-brand-coral mb-4">
          提交需求
        </p>
        <h2 className="font-display text-4xl font-light text-brand-ivory mb-12">
          開始你的 CSR 計畫
        </h2>
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <label className={labelClass}>公司名稱 *</label>
              <input name="company" required value={form.company} onChange={handleChange} placeholder="ACME 股份有限公司" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>聯絡人姓名 *</label>
              <input name="contact" required value={form.contact} onChange={handleChange} placeholder="王小明" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>電子信箱 *</label>
              <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="contact@company.com" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>聯絡電話</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="02-XXXX-XXXX" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>預估數量 *</label>
              <input name="quantity" type="number" required min="1" value={form.quantity} onChange={handleChange} placeholder="例：200" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>預算範圍</label>
              <select name="budget" value={form.budget} onChange={handleChange} className={inputClass + ' cursor-pointer'}>
                <option value="" className="bg-brand-carbon">請選擇</option>
                <option value="under-50k" className="bg-brand-carbon">NT$50,000 以下</option>
                <option value="50k-150k" className="bg-brand-carbon">NT$50,000 – 150,000</option>
                <option value="150k-500k" className="bg-brand-carbon">NT$150,000 – 500,000</option>
                <option value="over-500k" className="bg-brand-carbon">NT$500,000 以上</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>期望交期</label>
            <input name="timeline" value={form.timeline} onChange={handleChange} placeholder="例：2025 年 3 月底" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>需求說明</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={4}
              placeholder="請描述活動主題、包裝風格需求、特殊要求等..."
              className={inputClass + ' resize-none'}
            />
          </div>
          {error && <p className="font-sans text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-primary w-full md:w-auto">
            {submitting ? '提交中...' : '送出需求'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default function CSR() {
  useEffect(() => {
    setPageMeta('CSR 企業合作', '與 MATERIA 合作，為企業設計可溯源的 CSR 禮品與活動體驗，附 Impact Report。')
  }, [])

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-brand-coral mb-6">
            企業 CSR 合作
          </p>
          <h1 className="font-display text-5xl lg:text-7xl font-light text-brand-ivory leading-tight mb-6">
            CSR 不是費用，
            <br />
            <span className="italic">是投資</span>
          </h1>
          <p className="font-sans text-base text-brand-silver/50 max-w-md leading-relaxed">
            每一次企業合作，我們都為您設計可量化、
            可溯源、可傳播的 CSR 影響力方案。
          </p>
        </div>
      </section>

      <MaterialsSection />
      <PlansSection />
      <InquiryForm />
    </>
  )
}
