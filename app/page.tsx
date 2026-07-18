import Image from "next/image";
import LeadForm from "./components/LeadForm";

const LINE_URL = "https://lin.ee/xVg7pXJ";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <section className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 px-4 py-5 md:py-8">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="pt-2 text-white lg:sticky lg:top-6">
            <div className="mb-2 flex items-center">
              <Image
                src="/logo2.png"
                alt="新時代 Logo"
                width={420}
                height={132}
                priority
                className="h-auto w-80 md:w-[420px]"
              />
            </div>

            <h1 className="mt-3 text-5xl font-black leading-tight md:text-6xl">
              20 萬元內
              <br />
              快速初步評估
            </h1>

            <p className="mt-4 max-w-xl text-lg leading-8 text-blue-100">
              填寫約 1 分鐘，
              <br />
              專人一對一協助初步評估。
            </p>

            <div className="mt-5 grid gap-3 text-sm text-blue-50 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-xl border border-white/15 bg-white/10 p-3">
                ✓ 線上填寫約 1 分鐘
              </div>

              <div className="rounded-xl border border-white/15 bg-white/10 p-3">
                ✓ 專人協助說明流程
              </div>

              <div className="rounded-xl border border-white/15 bg-white/10 p-3">
                ✓ 台南・高雄・屏東
              </div>
            </div>
          </div>

          <div
            id="lead-form"
            className="rounded-3xl bg-white p-5 shadow-2xl md:p-8"
          >
            <h2 className="text-2xl font-black">線上初步評估</h2>

            <p className="mb-5 mt-1 text-sm text-slate-500">
              填寫約需 1 分鐘，標示 * 為必填欄位。
            </p>

            <LeadForm />
          </div>
        </div>

        <footer className="mx-auto mt-6 max-w-6xl border-t border-white/15 pt-5 text-xs leading-6 text-blue-100">
          <p>© {new Date().getFullYear()} 資金方案資訊服務</p>
          <p>
            實際額度、利率、費用、期數及結果，依個別條件與正式審核為準。
          </p>
        </footer>
      </section>

      <a
        href={LINE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="加入 LINE 免費諮詢"
        className="fixed bottom-5 right-4 z-50 flex items-center gap-2 rounded-full bg-[#06C755] px-5 py-3 font-bold text-white shadow-2xl transition hover:scale-105 hover:bg-[#05b84e] md:bottom-7 md:right-7"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-black text-[#06C755]">
          L
        </span>

        <span>LINE 免費諮詢</span>
      </a>
    </main>
  );
}