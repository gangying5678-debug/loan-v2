import type { Metadata } from "next";
import Link from "next/link";
import { LINE_URL, SITE_NAME, SITE_URL } from "../lib/site";

const description =
  "了解新時代如何蒐集、使用與儲存網站諮詢表單中的個人資料。";

export const metadata: Metadata = {
  title: "隱私權政策",
  description,
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: `隱私權政策｜${SITE_NAME}`,
    description,
    url: `${SITE_URL}/privacy`,
    siteName: SITE_NAME,
    locale: "zh_TW",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `隱私權政策｜${SITE_NAME}`,
    description,
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-800 sm:px-8 sm:py-14">
      <article className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <Link
          href="/"
          className="inline-flex rounded-md font-semibold text-blue-700 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          ← 返回首頁
        </Link>

        <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          隱私權政策
        </h1>

        <p className="mt-4 leading-7 text-slate-600">
          {SITE_NAME}尊重您的個人資料。本頁說明您透過本網站諮詢表單提供資料時，我們如何蒐集、使用與儲存這些資料。
        </p>

        <div className="mt-10 space-y-9">
          <section aria-labelledby="collected-data">
            <h2 id="collected-data" className="text-xl font-black text-slate-950">
              一、蒐集的資料
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              當您送出表單時，本網站會蒐集您填寫的姓名、手機號碼、居住地、職業、月收入區間、需求金額、現有貸款狀況、每月繳款金額、呆帳或遲繳狀況、資金用途，以及您的個資使用同意。
            </p>
          </section>

          <section aria-labelledby="collection-purpose">
            <h2
              id="collection-purpose"
              className="text-xl font-black text-slate-950"
            >
              二、蒐集與使用目的
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              上述資料僅用於了解您的諮詢需求、進行初步評估、與您聯絡，以及說明後續諮詢流程。表單送出不代表任何核准、額度或服務承諾，實際結果仍依個別條件與正式審核為準。
            </p>
          </section>

          <section aria-labelledby="data-storage">
            <h2 id="data-storage" className="text-xl font-black text-slate-950">
              三、資料儲存
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              您送出的表單資料可能透過伺服器端傳送並儲存於 Google Sheets，作為諮詢聯絡與處理記錄。我們會依實際業務需要處理這些資料。
            </p>
          </section>

          <section aria-labelledby="user-rights">
            <h2 id="user-rights" className="text-xl font-black text-slate-950">
              四、資料查詢、更正或刪除
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              如您希望查詢、更正或刪除透過本網站提供的資料，請透過本網站的 LINE 諮詢管道聯絡。為確認資料與申請人一致，我們可能需要您提供足以辨識該筆表單的必要資訊。
            </p>
            <a
              href={LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex rounded-xl bg-[#06c755] px-5 py-3 font-bold text-white transition hover:bg-[#05b94f] focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2"
            >
              透過 LINE 聯絡
            </a>
          </section>

          <section aria-labelledby="policy-updates">
            <h2
              id="policy-updates"
              className="text-xl font-black text-slate-950"
            >
              五、政策更新
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              若本網站的資料蒐集或處理方式調整，本頁內容也會配合更新。
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}

