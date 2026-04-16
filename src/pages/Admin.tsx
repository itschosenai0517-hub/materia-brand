import { useEffect, useState } from 'react'
import { getCSRInquiries, updateInquiryStatus, updateImpactMetrics, type CSRInquiry } from '@/firebase/firestore'
import { setPageMeta } from '@/lib/utils'

const STATUS_LABELS: Record<CSRInquiry['status'], string> = {
  pending: '待處理',
  contacted: '已聯繫',
  quoted: '已報價',
  confirmed: '已確認',
  completed: '已完成',
}
const STATUS_COLORS: Record<CSRInquiry['status'], string> = {
  pending: 'text-yellow-400',
  contacted: 'text-blue-400',
  quoted: 'text-purple-400',
  confirmed: 'text-brand-coral',
  completed: 'text-green-400',
}

export default function Admin() {
  const [inquiries, setInquiries] = useState<CSRInquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [impactForm, setImpactForm] = useState({
    artisanHours: '', donationAmount: '', carbonSaved: '',
    productsDelivered: '', partnersCount: '',
  })
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')

  useEffect(() => {
    setPageMeta('後台管理')
    getCSRInquiries().then(data => {
      setInquiries(data)
      setLoading(false)
    })
  }, [])

  const handleStatusChange = async (id: string, status: CSRInquiry['status']) => {
    await updateInquiryStatus(id, status)
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i))
  }

  const handleSaveMetrics = async () => {
    setSaving(true)
    try {
      await updateImpactMetrics({
        artisanHours: Number(impactForm.artisanHours) || undefined,
        donationAmount: Number(impactForm.donationAmount) || undefined,
        carbonSaved: Number(impactForm.carbonSaved) || undefined,
        productsDelivered: Number(impactForm.productsDelivered) || undefined,
        partnersCount: Number(impactForm.partnersCount) || undefined,
      })
      setSavedMsg('已儲存')
      setTimeout(() => setSavedMsg(''), 3000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-24 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="pt-8 mb-16">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-brand-coral mb-3">後台管理</p>
          <h1 className="font-display text-4xl font-light text-brand-ivory">Admin Dashboard</h1>
        </div>

        {/* Impact metrics editor */}
        <section className="mb-16">
          <h2 className="font-display text-2xl text-brand-ivory mb-8">Impact 數字更新</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {[
              { key: 'artisanHours', label: '工匠工時' },
              { key: 'donationAmount', label: '捐款金額' },
              { key: 'carbonSaved', label: '減碳量 kg' },
              { key: 'productsDelivered', label: '出貨件數' },
              { key: 'partnersCount', label: '合作夥伴' },
            ].map(f => (
              <div key={f.key}>
                <label className="block font-sans text-xs tracking-widest uppercase text-brand-silver/40 mb-2">
                  {f.label}
                </label>
                <input
                  type="number"
                  value={impactForm[f.key as keyof typeof impactForm]}
                  onChange={e => setImpactForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  placeholder="數值"
                  className="w-full bg-brand-carbon border-b border-brand-silver/20 py-2 px-2 font-sans text-sm text-brand-ivory placeholder:text-brand-silver/30 focus:outline-none focus:border-brand-coral"
                />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleSaveMetrics} disabled={saving} className="btn-primary text-xs">
              {saving ? '儲存中...' : '更新數字'}
            </button>
            {savedMsg && <p className="font-sans text-xs text-green-400">{savedMsg}</p>}
          </div>
        </section>

        {/* CSR inquiries */}
        <section>
          <h2 className="font-display text-2xl text-brand-ivory mb-8">
            CSR 詢單 ({inquiries.length})
          </h2>
          {loading ? (
            <p className="font-sans text-sm text-brand-silver/40">載入中...</p>
          ) : inquiries.length === 0 ? (
            <p className="font-sans text-sm text-brand-silver/40">目前尚無詢單</p>
          ) : (
            <div className="space-y-px">
              {inquiries.map(inq => (
                <div key={inq.id} className="bg-brand-carbon p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div>
                    <p className="font-sans text-sm text-brand-ivory">{inq.company}</p>
                    <p className="font-sans text-xs text-brand-silver/40">{inq.contact} · {inq.email}</p>
                  </div>
                  <div>
                    <p className="font-sans text-xs text-brand-silver/40">數量</p>
                    <p className="font-sans text-sm text-brand-ivory">{inq.quantity} 件</p>
                  </div>
                  <div>
                    <p className="font-sans text-xs text-brand-silver/40">預算</p>
                    <p className="font-sans text-sm text-brand-ivory">{inq.budget || '未填'}</p>
                  </div>
                  <div>
                    <select
                      value={inq.status}
                      onChange={e => inq.id && handleStatusChange(inq.id, e.target.value as CSRInquiry['status'])}
                      className={`bg-transparent border border-brand-silver/20 px-3 py-1.5 font-sans text-xs focus:outline-none focus:border-brand-coral cursor-pointer ${STATUS_COLORS[inq.status]}`}
                    >
                      {Object.entries(STATUS_LABELS).map(([v, l]) => (
                        <option key={v} value={v} className="bg-brand-carbon text-brand-ivory">{l}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
