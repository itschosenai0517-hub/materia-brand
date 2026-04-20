import { useEffect } from 'react'
import { setPageMeta } from '@/lib/utils'

const TIMELINE = [
  { year: '2014', title: '包裝工作室成立', body: '從一間小型包裝工作室開始，承接各式手工藝品的包裝設計與代工。' },
  { year: '2017', title: '公益合作起步', body: '與第一間庇護工場建立合作關係，開始以就業創造作為核心價值之一。' },
  { year: '2020', title: '手工皂與蠟燭線', body: '疫情期間轉型，推出自有手工皂與蠟燭產品線，著重永續原料溯源。' },
  { year: '2023', title: 'CSR品牌正式化', body: '整合B2B與B2C業務，以MATERIA為品牌名稱正式對外招商。' },
  { year: '2025', title: '數位化與訂閱制', body: '推出線上平台、Impact Dashboard與職人訂閱盒，邁向永續商業閉環。' },
]

const VALUES = [
  {
    title: '溯源透明',
    body: '每一種原料都有來源，每一位工匠都有名字。我們不用模糊的「友善環境」當行銷話術。',
  },
  {
    title: '影響力可量化',
    body: '捐贈金額、工匠工時、減碳量，全部公開顯示。CSR不是感覺，是數字。',
  },
  {
    title: '商業與公益不衝突',
    body: '我們相信，當商業模式設計得夠好，利潤與影響力可以互相強化，而非相互妥協。',
  },
]

export default function About() {
  useEffect(() => {
    setPageMeta('品牌故事', 'MATERIA從代工工作室到社會企業品牌的轉型故事與核心價值。')
  }, [])

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
          <div>
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-brand-coral mb-6">
              品牌故事
            </p>
            <h1 className="font-display text-5xl lg:text-7xl font-light text-brand-ivory leading-tight">
              製造業
              <br />
              可以是
              <br />
              <span className="italic text-gradient-coral">改變的起點</span>
            </h1>
          </div>
          <div>
            <p className="font-sans text-base text-brand-silver/50 leading-relaxed mb-6">
              MATERIA起源於一個簡單的信念：
              當我們決定如何製造一件東西，
              我們也在決定這個世界的樣貌。
            </p>
            <p className="font-sans text-base text-brand-silver/50 leading-relaxed">
              從一間小型包裝工作室出發，歷經十年，
              我們選擇把每一個製造決策，
              都變成一次對永續的投票。
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6 lg:px-12 border-t border-brand-silver/10">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-brand-silver/40 mb-16">
            發展歷程
          </p>
          <div className="space-y-0">
            {TIMELINE.map((item, i) => (
              <div
                key={item.year}
                className={`grid grid-cols-12 gap-8 py-8 ${i < TIMELINE.length - 1 ? 'border-b border-brand-silver/10' : ''}`}
              >
                <div className="col-span-2 lg:col-span-1">
                  <p className="font-mono text-xs text-brand-coral tracking-widest pt-1">
                    {item.year}
                  </p>
                </div>
                <div className="col-span-10 lg:col-span-4">
                  <h3 className="font-display text-2xl text-brand-ivory mb-2">{item.title}</h3>
                </div>
                <div className="col-span-12 lg:col-span-7 lg:col-start-6">
                  <p className="font-sans text-sm text-brand-silver/50 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 lg:px-12 border-t border-brand-silver/10">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-brand-coral mb-16">
            核心價值
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-brand-silver/10">
            {VALUES.map(v => (
              <div key={v.title} className="bg-brand-charcoal p-10">
                <h3 className="font-display text-2xl text-brand-ivory mb-4">{v.title}</h3>
                <p className="font-sans text-sm text-brand-silver/50 leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Canva visual direction note */}
      <section className="py-20 px-6 lg:px-12 border-t border-brand-silver/10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-brand-silver/30 mb-6">
            
          </p>
          <p className="font-sans text-sm text-brand-silver/40 leading-relaxed">
            
          </p>
        </div>
      </section>
    </>
  )
}
