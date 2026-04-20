import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Mail } from 'lucide-react'
import { getProduct, type Product } from '@/firebase/firestore'
import { formatCurrency, setPageMeta } from '@/lib/utils'

// Fallback mock data matching Products.tsx
const MOCK: Record<string, Product> = {
  p1: {
    id: 'p1', name: '冷製薰衣草手工皂', nameEn: 'Lavender Cold Process Soap',
    description: '以台灣有機薰衣草精油手工製作，附工匠簽名卡與材料溯源說明。每一塊皂都經過4~6週冷製熟成，皂體溫和不刺激，適合所有膚質。',
    price: 480, category: 'soap', images: [],
    materials: ['有機薰衣草精油', '橄欖油', '乳油木果脂', '椰子油', '棕櫚油（RSPO 認證）'],
    impactNote: '每售出一塊，捐贈新臺幣24元予合作庇護工場', inStock: true, featured: true, createdAt: null,
  },
  p2: {
    id: 'p2', name: '大豆蠟木芯蠟燭', nameEn: 'Soy Wax Wood Wick Candle',
    description: '非基改美國大豆蠟，搭配木質燃芯，燃燒時有輕微劈啪聲，如壁爐的療癒感。燃燒時長約40小時。',
    price: 680, category: 'candle', images: [],
    materials: ['非基改大豆蠟', '木質燭芯', '天然精油', '玻璃容器（可回收）'],
    impactNote: '每售出一件，種植一棵台灣原生樹種', inStock: true, featured: true, createdAt: null,
  },
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(false)
    getProduct(id)
      .then(p => {
        const result = p ?? MOCK[id] ?? null
        setProduct(result)
        if (result) {
          const ogImage = result.images[0] ?? 'https://materia.tw/og-image.jpg'
          setPageMeta(result.name, result.description, ogImage)
        }
      })
      .catch(() => {
        // Firestore 失敗時降級至 mock
        const fallback = MOCK[id] ?? null
        setProduct(fallback)
        if (fallback) {
          setPageMeta(fallback.name, fallback.description, 'https://materia.tw/og-image.jpg')
        }
        setError(true)
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen pt-32 px-6 lg:px-12 flex items-center justify-center">
        <div className="w-6 h-6 border border-brand-coral border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 px-6 lg:px-12 flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-3xl text-brand-ivory mb-4">商品不存在</p>
          <Link to="/products" className="btn-outline text-xs">返回選物</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Back */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-brand-silver/40 hover:text-brand-ivory transition-colors mb-12"
        >
          <ArrowLeft size={12} />
          返回選物
        </Link>

        {/* Error notice */}
        {error && (
          <p className="font-sans text-xs text-brand-silver/40 border border-brand-silver/10 px-4 py-2 mb-8">
            目前顯示示範資料，部分資訊可能尚未同步。
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image */}
          <div className="aspect-square bg-brand-carbon relative">
            {product.images[0] ? (
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-end p-10">
                <p className="font-display text-9xl font-light text-brand-silver/10 leading-none">
                  {product.nameEn.charAt(0)}
                </p>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <p className="font-sans text-xs tracking-widest uppercase text-brand-silver/40 mb-3">
              {product.nameEn}
            </p>
            <h1 className="font-display text-4xl lg:text-5xl text-brand-ivory font-light mb-4">
              {product.name}
            </h1>
            <p className="font-display text-3xl text-brand-ivory mb-8">
              {formatCurrency(product.price)}
            </p>
            <p className="font-sans text-sm text-brand-silver/60 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Materials */}
            <div className="mb-8 p-6 border border-brand-silver/10">
              <p className="font-sans text-xs tracking-widest uppercase text-brand-silver/40 mb-4">
                材料成分
              </p>
              <ul className="space-y-2">
                {product.materials.map(m => (
                  <li key={m} className="flex items-center gap-3">
                    <CheckCircle size={12} className="text-brand-coral flex-shrink-0" />
                    <span className="font-sans text-sm text-brand-silver/60">{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Impact note */}
            <div className="mb-8 px-6 py-4 border-l-2 border-brand-coral">
              <p className="font-sans text-xs tracking-widest uppercase text-brand-coral mb-1">
                影響力說明
              </p>
              <p className="font-sans text-sm text-brand-silver/60">{product.impactNote}</p>
            </div>

            {/* CTA group */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="btn-primary flex-1 text-xs">
                加入訂單
              </button>
              <a
                href={`mailto:hello@materia.tw?subject=詢價：${encodeURIComponent(product.name)}&body=${encodeURIComponent(`您好，我想詢問「${product.name}」的相關資訊與採購報價。\n\n公司 / 姓名：\n數量需求：\n備註：`)}`}
                className="btn-outline flex-1 text-xs flex items-center justify-center gap-2"
              >
                <Mail size={12} />
                企業詢價
              </a>
            </div>

            <p className="font-sans text-xs text-brand-silver/30 mt-4">
              企業客製或大量採購，歡迎
              <Link to="/csr" className="text-brand-coral hover:underline ml-1">
                CSR 合作頁面
              </Link>
              填寫需求表單，48小時內回覆報價。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
