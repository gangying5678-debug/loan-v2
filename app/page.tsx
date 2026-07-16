import LeadForm from "./components/LeadForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <section className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 px-4 py-6 md:py-10">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="pt-2 text-white lg:sticky lg:top-6">
            <span className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-semibold">
              台南・高雄・屏東
            </span>

            <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
              20萬元內
              <br />
              資金方案資訊
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-blue-100 md:text-lg">
              填寫基本資料，由專人協助說明可能方案、申請流程與注意事項。
            </p>

            <div className="mt-5 rounded-2xl border border-white/20 bg-white/10 p-4 text-sm leading-6 text-blue-100">
              <p>20萬元為方案範圍上限，不代表每位申請人皆可取得。</p>
              <p className="mt-2">
                實際額度、利率、費用及結果，依個別條件與承作機構審核為準。
              </p>
            </div>

            <div className="mt-6 grid gap-3 text-sm text-blue-50 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-xl border border-white/15 bg-white/10 p-3">
                線上填寫基本資料
              </div>
              <div className="rounded-xl border border-white/15 bg-white/10 p-3">
                專人協助說明流程
              </div>
              <div className="rounded-xl border border-white/15 bg-white/10 p-3">
                服務地區以南部為主
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-2xl md:p-8">
            <h2 className="text-2xl font-black">線上初步評估</h2>
            <p className="mb-5 mt-1 text-sm text-slate-500">
              填寫約需 1 分鐘，標示 * 為必填欄位。
            </p>

            <LeadForm />
          </div>
        </div>
      </section>

      <section className="px-4 py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-black">服務流程</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm font-bold text-blue-600">步驟 1</p>
              <h3 className="mt-2 text-xl font-black">填寫資料</h3>
              <p className="mt-2 text-slate-600">
                提供基本聯絡方式與需求資訊。
              </p>
            </article>

            <article className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm font-bold text-blue-600">步驟 2</p>
              <h3 className="mt-2 text-xl font-black">專人確認</h3>
              <p className="mt-2 text-slate-600">
                服務人員確認資料並說明可能流程。
              </p>
            </article>

            <article className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm font-bold text-blue-600">步驟 3</p>
              <h3 className="mt-2 text-xl font-black">LINE 聯繫</h3>
              <p className="mt-2 text-slate-600">
                送出後前往官方 LINE 繼續諮詢。
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white px-4 py-14">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-black">常見問題</h2>

          <div className="mt-6 space-y-3">
            <details className="rounded-2xl border border-slate-200 p-5">
              <summary className="cursor-pointer font-bold">
                送出表單就代表一定可以申請嗎？
              </summary>
              <p className="mt-3 text-slate-600">
                不是。表單僅供初步了解，實際條件與結果仍依個別資料及承作機構審核。
              </p>
            </details>

            <details className="rounded-2xl border border-slate-200 p-5">
              <summary className="cursor-pointer font-bold">
                目前服務哪些地區？
              </summary>
              <p className="mt-3 text-slate-600">
                目前以台南、高雄及屏東地區為主。
              </p>
            </details>

            <details className="rounded-2xl border border-slate-200 p-5">
              <summary className="cursor-pointer font-bold">
                表單送出後會發生什麼？
              </summary>
              <p className="mt-3 text-slate-600">
                系統會通知服務人員，並帶你前往官方 LINE 繼續聯繫。
              </p>
            </details>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-50 px-4 py-8 text-sm text-slate-500">
        <div className="mx-auto max-w-6xl">
          <p>© {new Date().getFullYear()} 資金方案資訊服務</p>
          <p className="mt-2">
            實際額度、利率、費用、期數及結果，依個別條件與正式審核為準。
          </p>
        </div>
      </footer>
    </main>
  );
}