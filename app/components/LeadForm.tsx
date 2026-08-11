"use client";

import { FormEvent, useState } from "react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

const DEFAULT_LINE_URL = "https://lin.ee/xVg7pXJ";

export default function LeadForm() {
  const [hasLoan, setHasLoan] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [lineUrl, setLineUrl] = useState(DEFAULT_LINE_URL);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "資料送出失敗");
      }

      window.fbq?.("track", "Lead");
      window.gtag?.("event", "generate_lead", {
        residence: data.residence,
        amount: data.amount,
      });

      window.dataLayer?.push({
        event: "generate_lead",
        residence: data.residence,
        amount: data.amount,
      });

      if (typeof result.lineUrl === "string" && result.lineUrl) {
        setLineUrl(result.lineUrl);
      }

      setSuccess(true);
      form.reset();
      setHasLoan("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "送出失敗，請稍後再試",
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center md:p-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-3xl font-black text-white">
          ✓
        </div>

        <h3 className="mt-5 text-2xl font-black text-slate-900">
          資料已成功送出
        </h3>

        <p className="mt-3 leading-7 text-slate-600">
          感謝您的填寫，服務人員將於營業時間內盡快與您聯繫。
        </p>

        <a
          href={lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#06C755] px-5 py-4 text-lg font-black text-white transition hover:bg-[#05b84e]"
        >
          加入 LINE 繼續諮詢
        </a>

        <button
          type="button"
          onClick={() => {
            setSuccess(false);
            setErrorMessage("");
          }}
          className="mt-4 text-sm font-semibold text-slate-500 underline hover:text-slate-800"
        >
          重新填寫資料
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
      <div>
        <label className="mb-1 block font-bold">姓名 *</label>
        <input
          type="text"
          name="name"
          required
          maxLength={30}
          placeholder="請輸入姓名"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
        />
      </div>

      <div>
        <label className="mb-1 block font-bold">電話 *</label>
        <input
          type="tel"
          name="phone"
          required
          inputMode="tel"
          pattern="09[0-9]{8}"
          placeholder="例如 0912345678"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
        />
      </div>

      <div>
        <label className="mb-1 block font-bold">居住地 *</label>
        <select
          name="residence"
          required
          defaultValue=""
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
        >
          <option value="" disabled>
            請選擇
          </option>
          <option value="台南市">台南市</option>
          <option value="高雄市">高雄市</option>
          <option value="屏東縣">屏東縣</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block font-bold">職業 *</label>
        <select
          name="occupation"
          required
          defaultValue=""
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
        >
          <option value="" disabled>
            請選擇
          </option>
          <option>上班族</option>
          <option>軍公教</option>
          <option>自營商</option>
          <option>公司負責人</option>
          <option>服務業</option>
          <option>工廠作業員</option>
          <option>自由工作者</option>
          <option>其他</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block font-bold">月收入 *</label>
        <select
          name="income"
          required
          defaultValue=""
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
        >
          <option value="" disabled>
            請選擇
          </option>
          <option>30,000 元以下</option>
          <option>30,001～50,000 元</option>
          <option>50,001～80,000 元</option>
          <option>80,001～120,000 元</option>
          <option>120,001 元以上</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block font-bold">需求金額 *</label>
        <select
          name="amount"
          required
          defaultValue=""
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
        >
          <option value="" disabled>
            請選擇
          </option>
          <option>50,000 元內</option>
          <option>100,000 元內</option>
          <option>150,000 元內</option>
          <option>200,000 元內</option>
        </select>
      </div>

      <div className="md:col-span-2">
        <label className="mb-2 block font-bold">名下是否已有貸款 *</label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 p-3">
            <input
              type="radio"
              name="hasLoan"
              value="沒有"
              required
              onChange={() => setHasLoan("沒有")}
            />
            沒有
          </label>

          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 p-3">
            <input
              type="radio"
              name="hasLoan"
              value="有"
              required
              onChange={() => setHasLoan("有")}
            />
            有
          </label>
        </div>
      </div>

      {hasLoan === "有" && (
        <div className="grid gap-4 rounded-2xl border border-blue-200 bg-blue-50 p-4 md:col-span-2 md:grid-cols-2">
          <div>
            <label className="mb-1 block font-bold">
              目前每月貸款繳款金額 *
            </label>

            <select
              name="monthlyPayment"
              required
              defaultValue=""
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
            >
              <option value="" disabled>
                請選擇
              </option>
              <option>5,000 元以下</option>
              <option>5,001～10,000 元</option>
              <option>10,001～20,000 元</option>
              <option>20,001～30,000 元</option>
              <option>30,001 元以上</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block font-bold">
              目前是否有呆帳或遲繳 *
            </label>

            <select
              name="paymentStatus"
              required
              defaultValue=""
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
            >
              <option value="" disabled>
                請選擇
              </option>
              <option>沒有呆帳或遲繳</option>
              <option>有遲繳</option>
              <option>有呆帳</option>
              <option>不確定</option>
            </select>
          </div>
        </div>
      )}

      <div className="md:col-span-2">
        <label className="mb-1 block font-bold">資金用途 *</label>

        <select
          name="purpose"
          required
          defaultValue=""
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
        >
          <option value="" disabled>
            請選擇
          </option>
          <option>生活支出</option>
          <option>家庭支出</option>
          <option>資金周轉</option>
          <option>創業或營運</option>
          <option>醫療支出</option>
          <option>其他</option>
        </select>
      </div>

      <label className="flex items-start gap-2 text-sm text-slate-600 md:col-span-2">
        <input
          type="checkbox"
          name="consent"
          value="同意"
          required
          className="mt-1"
        />

        <span>
          我已閱讀服務說明及隱私權政策，並同意為回覆本次諮詢而使用我提供的資料。
        </span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-blue-600 px-5 py-4 text-lg font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2"
      >
        {loading ? "資料送出中…" : "立即送出"}
      </button>

      {errorMessage && (
        <p className="text-center text-sm font-medium text-red-600 md:col-span-2">
          {errorMessage}
        </p>
      )}

      <p className="text-center text-xs text-slate-500 md:col-span-2">
        請勿填寫銀行密碼、信用卡完整卡號或完整身分證資料。
      </p>
    </form>
  );
}