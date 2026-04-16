import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <p className="font-display text-[8rem] font-light text-brand-silver/10 leading-none mb-6">
          404
        </p>
        <h1 className="font-display text-3xl text-brand-ivory mb-4">
          頁面不存在
        </h1>
        <p className="font-sans text-sm text-brand-silver/50 mb-10">
          您所尋找的頁面已移除或從未存在。
        </p>
        <Link to="/" className="btn-primary text-xs">
          返回首頁
        </Link>
      </div>
    </div>
  )
}
