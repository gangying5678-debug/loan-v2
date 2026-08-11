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
| `NEXT_PUBLIC_LINE_URL` | 選用 | 表單成功後由 API 回傳的 LINE 連結，未設定時使用預設值 |

## Google Sheets Webhook

`/api/lead` 會先執行伺服器端驗證，通過後才將以下 11 個 JSON 欄位 POST 至 `GOOGLE_SHEETS_WEBHOOK_URL`：

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

Webhook 回傳非 2xx、網路失敗或逾時時，API 會回傳失敗，前端不會顯示成功或觸發 Lead 轉換事件。

## 檢查與建置

```bash
npx eslint .
```

```bash
npm run build
```
