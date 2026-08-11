import { NextResponse } from "next/server";

const MAX_BODY_BYTES = 4_096;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const WEBHOOK_TIMEOUT_MS = 10_000;
const FORMULA_PREFIX = /^[=+\-@]/;
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/;

const allowedFields = new Set([
  "name",
  "phone",
  "residence",
  "occupation",
  "income",
  "amount",
  "hasLoan",
  "monthlyPayment",
  "paymentStatus",
  "purpose",
  "consent",
]);

const residences = new Set(["台南市", "高雄市", "屏東縣"]);
const occupations = new Set([
  "上班族",
  "軍公教",
  "自營商",
  "公司負責人",
  "服務業",
  "工廠作業員",
  "自由工作者",
  "其他",
]);
const incomes = new Set([
  "30,000 元以下",
  "30,001～50,000 元",
  "50,001～80,000 元",
  "80,001～120,000 元",
  "120,001 元以上",
]);
const amounts = new Set([
  "50,000 元內",
  "100,000 元內",
  "150,000 元內",
  "200,000 元內",
]);
const monthlyPayments = new Set([
  "5,000 元以下",
  "5,001～10,000 元",
  "10,001～20,000 元",
  "20,001～30,000 元",
  "30,001 元以上",
]);
const paymentStatuses = new Set([
  "沒有呆帳或遲繳",
  "有遲繳",
  "有呆帳",
  "不確定",
]);
const purposes = new Set([
  "生活支出",
  "家庭支出",
  "資金周轉",
  "創業或營運",
  "醫療支出",
  "其他",
]);

const requestHistory = new Map<string, number[]>();

type LeadPayload = {
  name: string;
  phone: string;
  residence: string;
  occupation: string;
  income: string;
  amount: string;
  hasLoan: "有" | "沒有";
  monthlyPayment: string;
  loanStatus: string;
  purpose: string;
  consent: "同意";
};

function errorResponse(error: string, status: number, headers?: HeadersInit) {
  return NextResponse.json({ error }, { status, headers });
}

function getClientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

function isRateLimited(request: Request) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const clientIp = getClientIp(request);
  const recentRequests = (requestHistory.get(clientIp) ?? []).filter(
    (timestamp) => timestamp > windowStart,
  );

  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestHistory.set(clientIp, recentRequests);
    return true;
  }

  recentRequests.push(now);
  requestHistory.set(clientIp, recentRequests);

  if (requestHistory.size > 1_000) {
    for (const [ip, timestamps] of requestHistory) {
      if (!timestamps.some((timestamp) => timestamp > windowStart)) {
        requestHistory.delete(ip);
      }
    }
  }

  return false;
}

function readString(
  body: Record<string, unknown>,
  field: string,
  label: string,
  maxLength: number,
) {
  const rawValue = body[field];

  if (typeof rawValue !== "string") {
    throw new Error(`${label}格式不正確`);
  }

  const value = rawValue.trim();

  if (!value) {
    throw new Error(`請填寫${label}`);
  }

  if (value.length > maxLength) {
    throw new Error(`${label}長度超過限制`);
  }

  if (CONTROL_CHARACTERS.test(value) || FORMULA_PREFIX.test(value)) {
    throw new Error(`${label}包含無效字元`);
  }

  return value;
}

function readOption(
  body: Record<string, unknown>,
  field: string,
  label: string,
  options: Set<string>,
) {
  const value = readString(body, field, label, 30);

  if (!options.has(value)) {
    throw new Error(`${label}選項不正確`);
  }

  return value;
}

function validatePayload(body: unknown): LeadPayload {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new Error("請求資料格式不正確");
  }

  const data = body as Record<string, unknown>;

  if (Object.keys(data).some((field) => !allowedFields.has(field))) {
    throw new Error("請求包含未支援的欄位");
  }

  const name = readString(data, "name", "姓名", 30);

  if (!/^[\p{L}\p{M} .'·•・’-]+$/u.test(name)) {
    throw new Error("姓名格式不正確");
  }

  const phone = readString(data, "phone", "電話", 10);

  if (!/^09\d{8}$/.test(phone)) {
    throw new Error("電話格式不正確，請輸入 09 開頭的 10 碼手機號碼");
  }

  const residence = readOption(data, "residence", "居住地", residences);
  const occupation = readOption(data, "occupation", "職業", occupations);
  const income = readOption(data, "income", "月收入", incomes);
  const amount = readOption(data, "amount", "需求金額", amounts);
  const hasLoan = readOption(
    data,
    "hasLoan",
    "貸款狀態",
    new Set(["有", "沒有"]),
  ) as LeadPayload["hasLoan"];
  const purpose = readOption(data, "purpose", "資金用途", purposes);
  const consent = readString(data, "consent", "個資使用同意", 2);

  if (consent !== "同意") {
    throw new Error("請同意個人資料使用說明");
  }

  let monthlyPayment = "";
  let loanStatus = "";

  if (hasLoan === "有") {
    monthlyPayment = readOption(
      data,
      "monthlyPayment",
      "每月貸款繳款金額",
      monthlyPayments,
    );
    loanStatus = readOption(
      data,
      "paymentStatus",
      "呆帳或遲繳狀況",
      paymentStatuses,
    );
  } else if (
    (data.monthlyPayment !== undefined && data.monthlyPayment !== "") ||
    (data.paymentStatus !== undefined && data.paymentStatus !== "")
  ) {
    throw new Error("貸款資料與貸款狀態不一致");
  }

  return {
    name,
    phone,
    residence,
    occupation,
    income,
    amount,
    hasLoan,
    monthlyPayment,
    loanStatus,
    purpose,
    consent,
  };
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return errorResponse("只接受 JSON 格式資料", 415);
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);

  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return errorResponse("請求資料過大", 413);
  }

  if (isRateLimited(request)) {
    return errorResponse("送出次數過於頻繁，請稍後再試", 429, {
      "Retry-After": "60",
    });
  }

  let body: unknown;

  try {
    const rawBody = await request.text();

    if (new TextEncoder().encode(rawBody).length > MAX_BODY_BYTES) {
      return errorResponse("請求資料過大", 413);
    }

    body = JSON.parse(rawBody);
  } catch {
    return errorResponse("JSON 格式不正確", 400);
  }

  let payload: LeadPayload;

  try {
    payload = validatePayload(body);
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "表單資料不正確",
      400,
    );
  }

  const googleSheetsWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const lineUrl =
    process.env.NEXT_PUBLIC_LINE_URL ?? "https://lin.ee/xVg7pXJ";

  if (!googleSheetsWebhookUrl) {
    return errorResponse("伺服器尚未完成設定", 500);
  }

  try {
    const googleSheetsResponse = await fetch(googleSheetsWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
    });

    if (!googleSheetsResponse.ok) {
      return errorResponse("資料寫入失敗，請稍後再試", 502);
    }

    return NextResponse.json({
      ok: true,
      lineUrl,
    });
  } catch (error) {
    const status =
      error instanceof DOMException && error.name === "TimeoutError" ? 504 : 502;

    return errorResponse("資料寫入失敗，請稍後再試", status);
  }
}
