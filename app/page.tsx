import LeadForm from "./components/LeadForm";

const LINE_URL = "https://lin.ee/xVg7pXJ";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#071a3c] text-white">
      {/* 背景光影 */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-blue-500/20 blur-[120px]" />
        <div className="absolute -bottom-52 right-[-120px] h-[650px] w-[650px] rounded-full bg-blue-600/30 blur-[140px]" />
        <div className="absolute left-[38%] top-[20%] h-[360px] w-[360px] rounded-full bg-amber-400/10 blur-[100px]" />

        <div className="absolute right-[42%] top-[-80px] h-[760px] w-px rotate-[28deg] bg-gradient-to-b from-transparent via-amber-300/40 to-transparent" />
        <div className="absolute right-[35%] top-[-120px] h-[850px] w-px rotate-[28deg] bg-gradient-to-b from-transparent via-blue-300/20 to-transparent" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-5 py-8 sm:px-8 lg:px-12">
        <section className="grid flex-1 items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          {/* 左側 Hero */}
          <div className="mx-auto w-full max-w-xl py-4 lg:py-10">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-amber-300/40 bg-white/5 px-4 py-2 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="text-sm font-semibold tracking-[0.18em] text-amber-300">
                新時代 NEW ERA
              </span>
            </div>

            <p className="mb-4 text-base font-semibold tracking-[0.18em] text-amber-300 sm:text-lg">
              專人協助・快速評估・隱私保密
            </p>

            <h1 className="text-5xl font-black leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
              20 萬元內
              <span className="mt-2 block bg-gradient-to-r from-[#f8d47a] via-[#e9ad38] to-[#fff0b5] bg-clip-text text-transparent">
                快速初步評估
              </span>
            </h1>

            <p className="mt-7 max-w-lg text-lg leading-8 text-blue-100/85 sm:text-xl">
              填寫約 1 分鐘，由專人一對一協助進行初步了解與流程說明。
            </p>

            {/* 三個特色 */}
            <div className="mt-9 grid grid-cols-3 gap-3">
              <Feature
                icon="shield"
                title="安全保密"
                description="妥善保護資料"
              />
              <Feature
                icon="bolt"
                title="快速評估"
                description="快速了解需求"
              />
              <Feature
                icon="chat"
                title="專人服務"
                description="即時協助說明"
              />
            </div>

            {/* 服務資訊 */}
            <div className="mt-7 grid gap-3 rounded-2xl border border-white/15 bg-white/[0.06] p-4 backdrop-blur sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <LocationIcon />
                <div>
                  <p className="font-bold text-white">服務地區</p>
                  <p className="mt-1 text-sm text-blue-100/70">
                    台南・高雄・屏東
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:border-l sm:border-white/15 sm:pl-5">
                <CheckIcon />
                <div>
                  <p className="font-bold text-white">透明流程</p>
                  <p className="mt-1 text-sm text-blue-100/70">
                    實際結果依條件審核
                  </p>
                </div>
              </div>
            </div>

            <a
              href={LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[#06c755] px-6 py-4 text-lg font-black text-white shadow-[0_16px_40px_rgba(6,199,85,0.25)] transition hover:-translate-y-0.5 hover:bg-[#05b94f] sm:w-auto"
            >
              <LineIcon />
              LINE 免費諮詢
            </a>
          </div>

          {/* 右側表單 */}
          <div className="relative mx-auto w-full max-w-[680px]">
            <div className="absolute -inset-3 rounded-[34px] bg-gradient-to-br from-blue-400/20 via-transparent to-amber-300/20 blur-xl" />

            <div className="relative rounded-[30px] border border-white/30 bg-white p-5 text-slate-900 shadow-[0_30px_90px_rgba(0,0,0,0.30)] sm:p-8 lg:p-10">
              <LeadForm />
            </div>
          </div>
        </section>

        <footer className="relative mt-10 border-t border-white/15 py-6 text-sm text-blue-100/65">
          <p>© 2026 資金方案資訊服務</p>
          <p className="mt-2 leading-6">
            實際額度、費用、期數及結果，依個別條件與正式審核為準。
          </p>
        </footer>
      </div>

      {/* 手機版固定 LINE */}
      <a
        href={LINE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LINE 免費諮詢"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#06c755] px-5 py-3 font-bold text-white shadow-2xl transition hover:scale-105 lg:bottom-7 lg:right-7"
      >
        <LineIcon />
        <span>LINE 免費諮詢</span>
      </a>
    </main>
  );
}

type FeatureProps = {
  icon: "shield" | "bolt" | "chat";
  title: string;
  description: string;
};

function Feature({ icon, title, description }: FeatureProps) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/[0.06] px-3 py-5 text-center backdrop-blur">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-amber-300/30 bg-amber-300/10 text-amber-300">
        {icon === "shield" && <ShieldIcon />}
        {icon === "bolt" && <BoltIcon />}
        {icon === "chat" && <ChatIcon />}
      </div>

      <p className="mt-3 font-bold">{title}</p>
      <p className="mt-1 text-xs leading-5 text-blue-100/65">
        {description}
      </p>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
      <path
        d="M12 3 5 6v5c0 4.6 2.7 8 7 10 4.3-2 7-5.4 7-10V6l-7-3Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m9.5 12 1.7 1.7 3.5-3.7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
      <path d="M13.2 2 5.5 13h5.6L10.8 22l7.7-12.2h-5.4L13.2 2Z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
      <path
        d="M5 17.5 3.5 21l4.1-1.5A9 9 0 1 0 5 17.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8 12h.01M12 12h.01M16 12h.01"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="mt-0.5 h-6 w-6 shrink-0 text-amber-300"
      fill="none"
    >
      <path
        d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle
        cx="12"
        cy="10"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="mt-0.5 h-6 w-6 shrink-0 text-amber-300"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m8 12 2.5 2.5L16 9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LineIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
      <path d="M12 3C6.5 3 2 6.7 2 11.3c0 4.1 3.6 7.5 8.5 8.2.3.1.8.3.9.7.1.4.1 1 .1 1.4 0 .4.3.7.7.4 2.4-1.4 9.8-5.8 9.8-10.7C22 6.7 17.5 3 12 3Z" />
      <path
        d="M6.5 9v4.3h2.4M10 9v4.3M11.5 13.3V9l3 4.3V9M18 9h-2.4v4.3H18"
        stroke="white"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}