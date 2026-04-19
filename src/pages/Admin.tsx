import { useEffect, useRef, useState } from 'react'
import {
  getCSRInquiries,
  updateInquiryStatus,
  updateImpactMetrics,
  subscribeChatMessages,
  deleteChatMessage,
  sendChatMessage,
  getEasterEggSessions,
  type CSRInquiry,
  type ChatMessage,
  type EasterEggSession,
} from '@/firebase/firestore'
import { decryptMessage, encryptMessage } from '@/lib/crypto'
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

  // Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatLoading, setChatLoading] = useState(true)
  const [chatError, setChatError] = useState<string | null>(null)
  const [chatInput, setChatInput] = useState('')
  const [sending, setSending] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const chatBottomRef = useRef<HTMLDivElement>(null)

  // Easter Egg sessions
  const [sessions, setSessions] = useState<EasterEggSession[]>([])
  const [sessionsLoading, setSessionsLoading] = useState(true)

  useEffect(() => {
    setPageMeta('後台管理')

    getCSRInquiries().then(data => {
      setInquiries(data)
      setLoading(false)
    })

    getEasterEggSessions().then(data => {
      setSessions(data)
      setSessionsLoading(false)
    })
  }, [])

  useEffect(() => {
    const unsub = subscribeChatMessages(
      (msgs) => {
        setChatMessages(msgs)
        setChatLoading(false)
        setChatError(null)
      },
      (err) => {
        setChatError(err.message)
        setChatLoading(false)
      }
    )
    return unsub
  }, [])

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

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

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = chatInput.trim()
    if (!text || sending) return
    setSending(true)
    setChatInput('')
    try {
      const encrypted = encryptMessage(text)
      await sendChatMessage('admin', encrypted)
    } catch (err) {
      console.error('Failed to send message', err)
    }
    setSending(false)
  }

  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm('確定要刪除這則訊息？')) return
    setDeletingId(id)
    try {
      await deleteChatMessage(id)
    } catch (err) {
      console.error('Failed to delete message', err)
    }
    setDeletingId(null)
  }

  const formatTime = (ts: unknown) => {
    if (!ts) return '—'
    try {
      const d = (ts as { toDate: () => Date }).toDate()
      return d.toLocaleString('zh-TW', {
        month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit',
      })
    } catch {
      return '—'
    }
  }

  // Easter Egg stats
  const totalAttempts = sessions.length
  const successCount = sessions.filter(s => s.granted).length
  const failCount = sessions.filter(s => !s.granted).length

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

        {/* Easter Egg Sessions */}
        <section className="mb-16">
          <h2 className="font-display text-2xl text-brand-ivory mb-8">
            彩蛋頁訪問紀錄
            <span className="font-sans text-sm text-brand-silver/40 ml-3">({totalAttempts})</span>
          </h2>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-brand-carbon p-5">
              <p className="font-sans text-xs tracking-widest uppercase text-brand-silver/40 mb-2">總嘗試次數</p>
              <p className="font-display text-3xl text-brand-ivory">{totalAttempts}</p>
            </div>
            <div className="bg-brand-carbon p-5">
              <p className="font-sans text-xs tracking-widest uppercase text-brand-silver/40 mb-2">成功進入</p>
              <p className="font-display text-3xl text-green-400">{successCount}</p>
            </div>
            <div className="bg-brand-carbon p-5">
              <p className="font-sans text-xs tracking-widest uppercase text-brand-silver/40 mb-2">密碼錯誤</p>
              <p className="font-display text-3xl text-red-400">{failCount}</p>
            </div>
          </div>

          {/* Session list */}
          {sessionsLoading ? (
            <p className="font-sans text-sm text-brand-silver/40">載入中...</p>
          ) : sessions.length === 0 ? (
            <p className="font-sans text-sm text-brand-silver/40">目前尚無訪問紀錄</p>
          ) : (
            <div className="space-y-px max-h-72 overflow-y-auto">
              {sessions.map(s => (
                <div key={s.id} className="bg-brand-carbon px-6 py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className={`font-sans text-xs tracking-widest px-2 py-0.5 border shrink-0 ${
                      s.granted
                        ? 'text-green-400 border-green-900/40'
                        : 'text-red-400 border-red-900/40'
                    }`}>
                      {s.granted ? '成功' : '失敗'}
                    </span>
                    <p className="font-sans text-xs text-brand-silver/40 truncate max-w-xs" title={s.userAgent}>
                      {s.uid === 'anonymous' ? '未登入用戶' : `uid: ${s.uid.slice(0, 12)}...`}
                    </p>
                  </div>
                  <span className="font-sans text-xs text-brand-silver/30 shrink-0">
                    {formatTime(s.triggeredAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Capitol Chat */}
        <section className="mb-16">
          <h2 className="font-display text-2xl text-brand-ivory mb-8">
            彩蛋頻道訊息
            <span className="font-sans text-sm text-brand-silver/40 ml-3">({chatMessages.length})</span>
          </h2>

          {chatError && (
            <div className="bg-red-950/20 border border-red-900/30 px-4 py-3 mb-6">
              <p className="font-sans text-xs text-red-400">連線錯誤：{chatError}</p>
            </div>
          )}

          {/* Message list */}
          <div className="space-y-px max-h-80 overflow-y-auto mb-4">
            {chatLoading ? (
              <p className="font-sans text-sm text-brand-silver/40">載入中...</p>
            ) : chatMessages.length === 0 ? (
              <p className="font-sans text-sm text-brand-silver/40">目前尚無訊息紀錄</p>
            ) : (
              chatMessages.map(msg => {
                const decrypted = decryptMessage(msg.content)
                return (
                  <div
                    key={msg.id}
                    className="bg-brand-carbon px-6 py-4 flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <span className={`font-sans text-xs tracking-widest px-2 py-0.5 border shrink-0 ${
                        msg.role === 'admin'
                          ? 'text-yellow-400 border-yellow-900/40'
                          : 'text-brand-coral border-brand-coral/30'
                      }`}>
                        {msg.role === 'admin' ? 'ADMIN' : 'USER'}
                      </span>
                      <p className="font-sans text-sm text-brand-ivory truncate">
                        {decrypted || (
                          <span className="text-brand-silver/30 italic">（無法解密）</span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="font-sans text-xs text-brand-silver/30">
                        {formatTime(msg.createdAt)}
                      </span>
                      <button
                        onClick={() => msg.id && handleDeleteMessage(msg.id)}
                        disabled={deletingId === msg.id}
                        className="font-sans text-xs text-brand-silver/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                      >
                        {deletingId === msg.id ? '刪除中...' : '刪除'}
                      </button>
                    </div>
                  </div>
                )
              })
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Admin reply input */}
          <form onSubmit={handleSendReply} className="flex items-center gap-3 border-t border-brand-silver/10 pt-4">
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              disabled={sending}
              placeholder="以 Admin 身份回覆..."
              className="flex-1 bg-brand-carbon border-b border-brand-silver/20 py-2 px-3 font-sans text-sm text-brand-ivory placeholder:text-brand-silver/30 focus:outline-none focus:border-brand-coral disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={sending || !chatInput.trim()}
              className="btn-primary text-xs disabled:opacity-30"
            >
              {sending ? '送出中...' : '送出回覆'}
            </button>
          </form>
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
