# loan-v2

新時代諮詢表單網站，使用 Next.js App Router 建置。表單先送至同源的 `/api/lead`，再由伺服器端轉送至 Google Apps Script Web App，瀏覽器不會取得 Webhook URL。

## 本機開發

```bash
npm install
```

在專案根目錄建立 `.env.local`，至少設定：

```bash
GOOGLE_SHEETS_WEBHOOK_URL=your_google_apps_script_web_app_url
```

啟動專案：

```bash
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000)。請勿將 `.env.local`或實際 Webhook URL、Token 等敏感值提交到 Git。

## 環境變數

| 名稱 | 必要性 | 用途 |
| --- | --- | --- |
| `GOOGLE_SHEETS_WEBHOOK_URL` | 必要 | 伺服器端呼叫的 Google Apps Script Web App URL，不可加上 `NEXT_PUBLIC_` |
| `NEXT_PUBLIC_META_PIXEL_ID` | 選用 | Meta Pixel ID，用於 PageView 與 Lead 事件 |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | 選用 | GA4 Measurement ID，用於 `generate_lead` 事件 |
| `NEXT_PUBLIC_GA4_ID` | 選用 | GA4 Measurement ID 的相容備用名稱 |

## Google Sheets Webhook

`/api/lead` 會先執行伺服器端驗證，通過後才將 JSON POST 至 `GOOGLE_SHEETS_WEBHOOK_URL`。原有 11 個表單欄位順序維持不變：

```text
name
phone
residence
occupation
income
amount
hasLoan
monthlyPayment
loanStatus
purpose
consent
```

第 11 欄之後依序追加以下來源追蹤欄位：

```text
utm_source
utm_medium
utm_campaign
utm_content
utm_term
fbclid
gclid
landing_page
referrer
```

## 廣告來源追蹤

首頁會讀取網址上的 UTM 參數、`fbclid` 與 `gclid`，並在當前分頁 session 中保留首次有效值。後續網址沒有追蹤參數時，不會覆蓋已儲存的來源。

`landing_page` 只保留頁面網址與允許的追蹤參數；`referrer` 會移除 query string 與 hash。專案不會蒐集 Cookie、Authorization header、密碼或其他瀏覽器儲存內容。提交時間應繼續由 Google Apps Script 在寫入時產生，不接受使用者輸入時間。

Webhook 回傳非 2xx、網路失敗或逾時時，API 會回傳失敗，前端不會顯示成功或觸發 Lead 轉換事件。

## 檢查與建置

```bash
npx eslint .
```

```bash
npm run build
```
