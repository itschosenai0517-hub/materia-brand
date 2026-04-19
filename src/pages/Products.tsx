import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { getProducts, type Product } from '@/firebase/firestore'
import { formatCurrency, setPageMeta } from '@/lib/utils'

const CATEGORIES = [
  { key: '', label: '全部' },
  { key: 'soap', label: '手工皂' },
  { key: 'candle', label: '蠟燭' },
  { key: 'gift-set', label: '禮盒' },
  { key: 'subscription', label: '訂閱制' },
]

// Mock products shown while Firestore loads
const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1', name: '冷製薰衣草手工皂', nameEn: 'Lavender Cold Process Soap',
    description: '以台灣有機薰衣草精油手工製作，附工匠簽名卡與材料溯源說明。',
    price: 480, category: 'soap', images: [], materials: ['有機薰衣草精油', '橄欖油', '乳油木果脂'],
    impactNote: '每售出一塊，捐贈NT24元予合作庇護工場', inStock: true, featured: true, createdAt: null,
  },
  {
    id: 'p2', name: '大豆蠟木芯蠟燭', nameEn: 'Soy Wax Wood Wick Candle',
    description: '非基改美國大豆蠟，搭配木質燃芯，燃燒時有輕微劈啪聲。',
    price: 680, category: 'candle', images: [], materials: ['非基改大豆蠟', '木質燭芯', '天然精油'],
    impactNote: '每售出一件，種植一棵台灣原生樹種', inStock: true, featured: true, createdAt: null,
  },
  {
    id: 'p3', name: '職人春季禮盒', nameEn: 'Artisan Spring Gift Set',
    description: '手工皂2塊 + 蠟燭1入 + 品牌故事冊，適合節慶或員工禮品。',
    price: 1280, category: 'gift-set', images: [], materials: ['手工皂', '大豆蠟蠟燭', 'FSC 認證包裝'],
    impactNote: '每盒包含工匠手寫卡片，捐贈比例5%', inStock: true, featured: true, createdAt: null,
  },
  {
    id: 'p4', name: '季度職人訂閱盒', nameEn: 'Artisan Quarterly Subscription',
    description: '每季精選4–6件職人選物，附本季影響力數字報告。',
    price: 980, category: 'subscription', images: [], materials: ['季節限定選品'],
    impactNote: '訂閱戶享優先體驗新品，捐贈比例8%', inStock: true, featured: false, createdAt: null,
  },
  {
    id: 'p5', name: '炭黑排毒手工皂', nameEn: 'Activated Charcoal Detox Soap',
    description: '竹炭與茶樹精油配方，深層清潔。適合油性肌膚。',
    price: 520, category: 'soap', images: [], materials: ['竹炭粉', '茶樹精油', '蓖麻油'],
    impactNote: '每售出一塊，捐贈 NT$26 予合作庇護工場', inStock: true, featured: false, createdAt: null,
  },
  {
    id: 'p6', name: '麝香琥珀蠟燭', nameEn: 'Musk Amber Soy Candle',
    description: '溫暖的琥珀麝香調，燃燒時長約45小時。',
    price: 780, category: 'candle', images: [], materials: ['大豆蠟', '麝香精油', '琥珀原料'],
    impactNote: '每售出一件，種植一棵台灣原生樹種', inStock: true, featured: false, createdAt: null,
  },
]

function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/products/${product.id}`} className="group block">
      <div className="aspect-square bg-brand-carbon mb-4 overflow-hidden relative">
        {product.images[0] ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="absolute inset-0 flex items-end p-6">
            <p className="font-display text-5xl font-light text-brand-silver/10 leading-none">
              {product.nameEn.charAt(0)}
            </p>
          </div>
        )}
        {product.featured && (
          <div className="absolute top-4 left-4">
            <span className="font-sans text-xs tracking-widest uppercase text-brand-ivory bg-brand-coral px-2 py-1">
              精選
            </span>
          </div>
        )}
      </div>
      <div>
        <p className="font-sans text-xs tracking-widest uppercase text-brand-silver/40 mb-1">
          {product.nameEn}
        </p>
        <h3 className="font-display text-xl text-brand-ivory mb-2 group-hover:text-brand-coral transition-colors duration-200">
          {product.name}
        </h3>
        <p className="font-sans text-sm text-brand-silver/50 leading-relaxed mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <p className="font-sans text-sm text-brand-ivory">{formatCurrency(product.price)}</p>
          <ArrowRight size={14} className="text-brand-silver/30 group-hover:text-brand-coral group-hover:translate-x-1 transition-all duration-200" />
        </div>
      </div>
    </Link>
  )
}

export default function Products() {
  const [activeCategory, setActiveCategory] = useState('')
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setPageMeta('職人選物', '手工皂、蠟燭、限定禮盒與訂閱制選物盒，每件附材料溯源卡與影響力說明。')
    getProducts().then(data => {
      if (data.length > 0) setProducts(data)
    }).finally(() => setLoading(false))
  }, [])

  const filtered = activeCategory
    ? products.filter(p => p.category === activeCategory)
    : products

  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-brand-coral mb-6">
            職人選物
          </p>
          <h1 className="font-display text-5xl lg:text-7xl font-light text-brand-ivory leading-tight">
            每一件都有
            <br />
            <span className="italic">溯源故事</span>
          </h1>
        </div>
      </section>

      {/* Filters */}
      <section className="px-6 lg:px-12 mb-12">
        <div className="max-w-7xl mx-auto border-b border-brand-silver/10 pb-4 flex gap-8 overflow-x-auto scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`font-sans text-xs tracking-widest uppercase whitespace-nowrap pb-4 -mb-px border-b transition-colors duration-200 ${
                activeCategory === cat.key
                  ? 'text-brand-coral border-brand-coral'
                  : 'text-brand-silver/40 border-transparent hover:text-brand-ivory'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 lg:px-12 pb-24">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-brand-carbon mb-4" />
                  <div className="h-3 bg-brand-carbon w-1/3 mb-2" />
                  <div className="h-5 bg-brand-carbon w-2/3 mb-3" />
                  <div className="h-3 bg-brand-carbon w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
