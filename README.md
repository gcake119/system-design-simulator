# SystemForge（繁體中文版）

開源的系統設計面試模擬器。你可以在畫布上建構真實架構、模擬正式環境等級的流量，並依照面試常見的五個面向取得評分。

> 本分支採用台灣常用的繁體中文用語；QPS、CDN、SQL、API、gRPC 等業界通用技術縮寫則保留原文。原始英文說明請參閱 [README.en.md](README.en.md)。

## 功能

- 35 種基礎設施元件，涵蓋網路、運算、儲存、訊息傳遞與平台基礎設施。
- 35 道系統設計題目，包含規模需求、限制條件、提示與參考架構。
- 可模擬每秒 1,000 至 500,000 次請求，顯示各節點的 QPS、使用率、延遲與健康狀態。
- 依可擴充性、可用性、延遲、成本效益與取捨五個面向評分。
- 提供 45 分鐘、六階段的模擬面試流程。
- 內建容量估算器、概念庫、取捨卡片與學習路徑。
- 所有資料都在瀏覽器端處理，無須帳號，也沒有後端服務。

## 快速開始

需求：Node.js 20 或更新版本，以及 npm。

```bash
npm install
npm run dev
```

接著開啟 <http://localhost:3000>。

正式環境建置：

```bash
npm run build
npm start
```

## 基本操作流程

```text
選擇題目 → 拖曳並連接元件 → 模擬流量 → 取得評分 → 反覆調整
```

1. 從頂端列選擇一道題目。
2. 從左側元件庫將元件拖到畫布上，或按 `⌘K`／`Ctrl+K` 開啟指令選單。
3. 拖曳元件的連接點以建立資料流向。
4. 設定每秒請求數，再執行流量模擬。
5. 執行評分，查看各面向的通過項目與改善建議。

## 鍵盤快速鍵

| 快速鍵 | 功能 |
|---|---|
| `⌘K`／`Ctrl+K` | 開啟指令選單 |
| `⌘Enter`／`Ctrl+Enter` | 執行模擬 |
| `⌘Shift+S`／`Ctrl+Shift+S` | 評分設計 |
| `⌘S`／`Ctrl+S` | 儲存設計 |
| `⌘O`／`Ctrl+O` | 載入設計 |
| `⌘Z`／`Ctrl+Z` | 復原 |
| `⌘Shift+Z`／`Ctrl+Shift+Z` | 重做 |
| `Delete`／`Backspace` | 刪除選取的元件或連線 |

## 技術架構

- Next.js 16（App Router）
- React 19 與 TypeScript
- React Flow 12
- Zustand 5（狀態儲存在 `localStorage`）
- Tailwind CSS 4

本應用程式完全在用戶端執行。模擬器使用 Kahn 拓撲排序演算法傳遞流量；評分只計算實際連接且可由入口節點到達的元件。

## 專案結構

```text
src/
├── app/          Next.js 進入點與全域樣式
├── components/   畫布、面板、側邊欄、對話框與面試流程
├── data/         元件、題目、概念、取捨卡片與學習路徑
├── engine/       流量模擬引擎
├── scoring/      五個評分面向與規則
├── store/        Zustand 狀態管理
├── lib/          匯出與參考架構工具
└── types/        共用 TypeScript 型別
```

## 驗證

專案目前沒有單元測試。提交變更前請至少執行：

```bash
npm run lint
npm run build
```

並在瀏覽器中實際操作選題、拖放、連線、模擬、評分、儲存與載入流程。

## 授權

本專案採用 [MIT License](LICENSE)。原作者為 Vijay Gupta（[@vijaygupta18](https://github.com/vijaygupta18)）。
