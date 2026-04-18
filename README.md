# MATERIA — 質地．永續製造 CSR 品牌

台灣首個以工藝溯源為核心的 CSR 永續代工品牌官方網站。

**Tech Stack:** React 18 · TypeScript · Vite · Tailwind CSS · Firebase · Framer Motion  
**Deployment:** Railway (`railway.toml` 已設定)

---

## 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 設定環境變數

複製 `.env.example` 為 `.env.local` 並填入 Firebase 設定：

```bash
cp .env.example .env.local
```

| 變數 | 說明 |
|------|------|
| `VITE_FIREBASE_API_KEY` | Firebase 專案 API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase 專案 ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase App ID |
| `VITE_APP_URL` | 網站根 URL（e.g. `https://materia.tw`） |
| `VITE_APP_ENV` | `development` 或 `production` |

> **注意：** `VITE_ADMIN_PASSWORD` 已移除。Capitol Terminal 密碼現在透過後端 API `/api/verify-capitol` 驗證，請在伺服器環境變數中設定，不要放進 `.env` 檔案。

### 3. 設定 Firebase

```bash
# 安裝 Firebase CLI
npm install -g firebase-tools

# 登入並選擇專案
firebase login
firebase use --add

# 部署 Firestore Security Rules
firebase deploy --only firestore:rules
```

### 4. 啟動開發伺服器

```bash
npm run dev
```

---

## 專案結構

```
src/
├── components/layout/   Navbar、Footer、Layout
├── context/             AuthContext、EasterEggContext
├── firebase/            config、auth、firestore
├── lib/                 utils、crypto
└── pages/               Home、CSR、Products、ProductDetail、About
                         Login、Portal、Admin、Secret、NotFound
public/
├── favicon.svg
├── og-image.jpg         社群分享預覽圖 (1200×630)
├── icon-192.png         PWA 圖示
├── icon-512.png         PWA 圖示
├── manifest.json        PWA 設定
├── robots.txt           搜尋引擎爬蟲設定
└── sitemap.xml          網站地圖
```

---

## 部署到 Railway

1. 將 repository push 到 GitHub
2. 在 Railway 新增專案，選擇 GitHub repo
3. 在 Railway 環境變數中設定所有 `VITE_*` 變數
4. Railway 會自動執行 `railway.toml` 中的 build/start 指令

---

## Easter Egg

Capitol Terminal 透過兩種方式觸發：
- Konami Code（↑↑↓↓←→→←）
- Footer 快速點擊 5 次

密碼驗證已改為後端 API，請確保 `/api/verify-capitol` 端點在部署環境中可用。

---

## License

Copyright © MATERIA. All rights reserved.
