"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import {
  getSessionAttribution,
  type AttributionData,
} from "../lib/attribution";
import { LINE_URL } from "../lib/site";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

type FieldName =
  | "name"
  | "phone"
  | "residence"
  | "occupation"
  | "income"
  | "amount"
  | "hasLoan"
  | "monthlyPayment"
  | "loanStatus"
  | "purpose"
  | "consent";

type FieldErrors = Partial<Record<FieldName, string>>;

class SubmissionError extends Error {}

function getValue(formData: FormData, field: FieldName) {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
}

function validateForm(formData: FormData): FieldErrors {
  const errors: FieldErrors = {};
  const requiredFields: Array<[FieldName, string]> = [
    ["name", "請輸入姓名"],
    ["phone", "請輸入手機號碼"],
    ["residence", "請選擇居住地"],
    ["occupation", "請選擇職業"],
    ["income", "請選擇月收入"],
    ["amount", "請選擇需求金額"],
    ["hasLoan", "請選擇目前是否有貸款"],
    ["purpose", "請選擇資金用途"],
    ["consent", "請閱讀並同意個人資料使用說明"],
  ];

  for (const [field, message] of requiredFields) {
    if (!getValue(formData, field)) {
      errors[field] = message;
    }
  }

  const name = getValue(formData, "name");
  if (name && name.length > 30) {
    errors.name = "姓名不得超過 30 個字";
  }

  const phone = getValue(formData, "phone");
  if (phone && !/^09\d{8}$/.test(phone)) {
    errors.phone = "請輸入 09 開頭的 10 碼手機號碼";
  }

  if (getValue(formData, "hasLoan") === "有") {
    if (!getValue(formData, "monthlyPayment")) {
      errors.monthlyPayment = "請選擇每月貸款繳款金額";
    }
    if (!getValue(formData, "loanStatus")) {
      errors.loanStatus = "請選擇是否有遲繳或呆帳";
    }
  }

  return errors;
}

function getSubmissionError(status: number, serverMessage?: string) {
  if (status === 429) {
    return "送出次數過於頻繁，請稍後再試。";
  }

  if (status === 400 && serverMessage) {
    return serverMessage;
  }

  return "目前無法送出資料，請稍後再試。";
}

export default function LeadForm() {
  const [hasLoan, setHasLoan] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [success, setSuccess] = useState(false);
  const [lineUrl, setLineUrl] = useState(LINE_URL);
  const submittingRef = useRef(false);
  const conversionTrackedRef = useRef(false);
  const attributionRef = useRef<AttributionData | null>(null);

  useEffect(() => {
    attributionRef.current = getSessionAttribution();
  }, []);

  function clearFieldError(field: FieldName) {
    setErrorMessage("");
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function fieldAccessibility(field: FieldName) {
    return {
      "aria-invalid": fieldErrors[field] ? true : undefined,
      "aria-describedby": fieldErrors[field] ? `${field}-error` : undefined,
    };
  }

  function handleLoanChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.currentTarget.value;
    const form = event.currentTarget.form;

    setHasLoan(value);
    clearFieldError("hasLoan");

    if (value === "沒有") {
      const monthlyPayment = form?.elements.namedItem("monthlyPayment");
      const loanStatus = form?.elements.namedItem("loanStatus");

      if (monthlyPayment instanceof HTMLSelectElement) {
        monthlyPayment.value = "";
      }
      if (loanStatus instanceof HTMLSelectElement) {
        loanStatus.value = "";
      }

      clearFieldError("monthlyPayment");
      clearFieldError("loanStatus");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const data: Record<string, FormDataEntryValue | string> = {
      ...Object.fromEntries(formData.entries()),
      ...(attributionRef.current ?? getSessionAttribution()),
    };
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setErrorMessage("請檢查標示的必填欄位。");
      const firstInvalidField = Object.keys(validationErrors)[0];
      form
        .querySelector<HTMLElement>(`[name="${firstInvalidField}"]`)
        ?.focus();
      return;
    }

    if (submittingRef.current) {
      return;
    }

    submittingRef.current = true;

    setLoading(true);
    setErrorMessage("");
    setFieldErrors({});

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        lineUrl?: unknown;
      };

      if (!response.ok || result.ok !== true) {
        throw new SubmissionError(
          getSubmissionError(response.status, result.error),
        );
      }

      if (!conversionTrackedRef.current) {
        conversionTrackedRef.current = true;
        window.fbq?.("track", "Lead");
        window.gtag?.("event", "generate_lead", {
          residence: data.residence,
          amount: data.amount,
        });
      }

      if (typeof result.lineUrl === "string" && result.lineUrl) {
        setLineUrl(result.lineUrl);
      }

      setSuccess(true);
      form.reset();
      setHasLoan("");
      setFieldErrors({});
    } catch (error) {
      submittingRef.current = false;
      setErrorMessage(
        error instanceof SubmissionError
          ? error.message
          : "目前無法送出資料，請稍後再試。",
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center md:p-8"
      >
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
            setFieldErrors({});
            submittingRef.current = false;
            conversionTrackedRef.current = false;
          }}
          className="mt-4 text-sm font-semibold text-slate-500 underline hover:text-slate-800"
        >
          重新填寫資料
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-describedby={errorMessage ? "form-error" : undefined}
      className="grid gap-4 [&>*]:min-w-0 md:grid-cols-2"
    >
      <div
        aria-hidden="true"
        className="absolute left-[-10000px] h-px w-px overflow-hidden"
      >
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <p className="text-sm text-slate-500 md:col-span-2">
        <span className="font-bold text-red-600" aria-hidden="true">
          *
        </span>{" "}
        為必填欄位
      </p>

      <div>
        <label htmlFor="name" className="mb-1 block font-bold">
          姓名 *
        </label>
        <input
          id="name"
          type="text"
          name="name"
          required
          maxLength={30}
          placeholder="請輸入姓名"
          {...fieldAccessibility("name")}
          onChange={() => clearFieldError("name")}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
        />
        <FieldError field="name" message={fieldErrors.name} />
      </div>

      <div>
        <label htmlFor="phone" className="mb-1 block font-bold">
          電話 *
        </label>
        <input
          id="phone"
          type="tel"
          name="phone"
          required
          inputMode="tel"
          pattern="09[0-9]{8}"
          placeholder="例如 0912345678"
          autoComplete="tel"
          {...fieldAccessibility("phone")}
          onChange={() => clearFieldError("phone")}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
        />
        <FieldError field="phone" message={fieldErrors.phone} />
      </div>

      <div>
        <label htmlFor="residence" className="mb-1 block font-bold">
          居住地 *
        </label>
        <select
          id="residence"
          name="residence"
          required
          defaultValue=""
          {...fieldAccessibility("residence")}
          onChange={() => clearFieldError("residence")}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base"
        >
          <option value="" disabled>
            請選擇
          </option>
          <option value="台南市">台南市</option>
          <option value="高雄市">高雄市</option>
          <option value="屏東縣">屏東縣</option>
        </select>
        <FieldError field="residence" message={fieldErrors.residence} />
      </div>

      <div>
        <label htmlFor="occupation" className="mb-1 block font-bold">
          職業 *
        </label>
        <select
          id="occupation"
          name="occupation"
          required
          defaultValue=""
          {...fieldAccessibility("occupation")}
          onChange={() => clearFieldError("occupation")}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base"
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
        <FieldError field="occupation" message={fieldErrors.occupation} />
      </div>

      <div>
        <label htmlFor="income" className="mb-1 block font-bold">
          月收入 *
        </label>
        <select
          id="income"
          name="income"
          required
          defaultValue=""
          {...fieldAccessibility("income")}
          onChange={() => clearFieldError("income")}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base"
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
        <FieldError field="income" message={fieldErrors.income} />
      </div>

      <div>
        <label htmlFor="amount" className="mb-1 block font-bold">
          需求金額 *
        </label>
        <select
          id="amount"
          name="amount"
          required
          defaultValue=""
          {...fieldAccessibility("amount")}
          onChange={() => clearFieldError("amount")}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base"
        >
          <option value="" disabled>
            請選擇
          </option>
          <option>50,000 元內</option>
          <option>100,000 元內</option>
          <option>150,000 元內</option>
          <option>200,000 元內</option>
        </select>
        <FieldError field="amount" message={fieldErrors.amount} />
      </div>

      <fieldset className="md:col-span-2">
        <legend className="mb-2 block font-bold">
          名下是否已有貸款 *
        </legend>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 p-3">
            <input
              type="radio"
              name="hasLoan"
              value="沒有"
              required
              {...fieldAccessibility("hasLoan")}
              onChange={handleLoanChange}
            />
            沒有
          </label>

          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 p-3">
            <input
              type="radio"
              name="hasLoan"
              value="有"
              required
              {...fieldAccessibility("hasLoan")}
              onChange={handleLoanChange}
            />
            有
          </label>
        </div>
        <FieldError field="hasLoan" message={fieldErrors.hasLoan} />
      </fieldset>

      {hasLoan === "有" && (
        <div className="grid gap-4 rounded-2xl border border-blue-200 bg-blue-50 p-4 md:col-span-2 md:grid-cols-2">
          <div>
            <label htmlFor="monthlyPayment" className="mb-1 block font-bold">
              目前每月貸款繳款金額 *
            </label>

            <select
              id="monthlyPayment"
              name="monthlyPayment"
              required
              defaultValue=""
              {...fieldAccessibility("monthlyPayment")}
              onChange={() => clearFieldError("monthlyPayment")}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base"
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
            <FieldError
              field="monthlyPayment"
              message={fieldErrors.monthlyPayment}
            />
          </div>

          <div>
            <label htmlFor="loanStatus" className="mb-1 block font-bold">
              目前是否有呆帳或遲繳 *
            </label>

            <select
              id="loanStatus"
              name="loanStatus"
              required
              defaultValue=""
              {...fieldAccessibility("loanStatus")}
              onChange={() => clearFieldError("loanStatus")}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base"
            >
              <option value="" disabled>
                請選擇
              </option>
              <option>沒有呆帳或遲繳</option>
              <option>有遲繳</option>
              <option>有呆帳</option>
              <option>不確定</option>
            </select>
            <FieldError
              field="loanStatus"
              message={fieldErrors.loanStatus}
            />
          </div>
        </div>
      )}

      <div className="md:col-span-2">
        <label htmlFor="purpose" className="mb-1 block font-bold">
          資金用途 *
        </label>

        <select
          id="purpose"
          name="purpose"
          required
          defaultValue=""
          {...fieldAccessibility("purpose")}
          onChange={() => clearFieldError("purpose")}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base"
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
        <FieldError field="purpose" message={fieldErrors.purpose} />
      </div>

      <div className="md:col-span-2">
        <div className="flex items-start gap-2 text-sm text-slate-600">
          <input
            id="consent"
            type="checkbox"
            name="consent"
            value="同意"
            required
            {...fieldAccessibility("consent")}
            onChange={() => clearFieldError("consent")}
            className="mt-1"
          />

          <span>
            <label htmlFor="consent">我已閱讀服務說明及</label>
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-700 underline hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              隱私權政策
            </a>
            <label htmlFor="consent">
              ，並同意為回覆本次諮詢而使用我提供的資料。
            </label>
          </span>
        </div>
        <FieldError field="consent" message={fieldErrors.consent} />
      </div>

      <button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-4 text-lg font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2"
      >
        {loading ? (
          <>
            <span
              aria-hidden="true"
              className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
            />
            資料送出中…
          </>
        ) : (
          "立即送出"
        )}
      </button>

      {errorMessage && (
        <p
          id="form-error"
          role="alert"
          aria-live="assertive"
          className="text-center text-sm font-medium leading-6 text-red-600 md:col-span-2"
        >
          {errorMessage}
        </p>
      )}

      <p className="text-center text-xs text-slate-500 md:col-span-2">
        請勿填寫銀行密碼、信用卡完整卡號或完整身分證資料。
      </p>
    </form>
  );
}

function FieldError({
  field,
  message,
}: {
  field: FieldName;
  message?: string;
}) {
  if (!message) {
    return null;
  }

  return (
    <p
      id={`${field}-error`}
      className="mt-1.5 text-sm font-medium leading-5 text-red-600"
    >
      {message}
    </p>
  );
}
