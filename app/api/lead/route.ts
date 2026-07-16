import { NextResponse } from "next/server";

function clean(value: unknown) {
  return String(value ?? "").trim().slice(0, 200);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const requiredFields = [
      "name",
      "phone",
      "residence",
      "occupation",
      "income",
      "amount",
      "hasLoan",
      "purpose",
      "consent",
    ];

    for (const field of requiredFields) {
      if (!clean(body[field])) {
        return NextResponse.json(
          { error: `缺少必要欄位：${field}` },
          { status: 400 },
        );
      }
    }

    const phone = clean(body.phone);

    if (!/^09\d{8}$/.test(phone)) {
      return NextResponse.json(
        { error: "電話格式不正確，請輸入 09 開頭的 10 碼手機號碼" },
        { status: 400 },
      );
    }

    if (
      body.hasLoan === "有" &&
      (!clean(body.monthlyPayment) || !clean(body.paymentStatus))
    ) {
      return NextResponse.json(
        { error: "請完整填寫目前貸款繳款與遲繳狀況" },
        { status: 400 },
      );
    }

    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;
    const lineUrl =
      process.env.NEXT_PUBLIC_LINE_URL || "https://line.me";

    if (!telegramToken || !telegramChatId) {
      return NextResponse.json(
        { error: "Telegram 尚未完成設定" },
        { status: 500 },
      );
    }

    const message = [
      "📩 新的網站諮詢",
      "",
      `姓名：${clean(body.name)}`,
      `電話：${phone}`,
      `居住地：${clean(body.residence)}`,
      `職業：${clean(body.occupation)}`,
      `月收入：${clean(body.income)}`,
      `需求金額：${clean(body.amount)}`,
      `名下貸款：${clean(body.hasLoan)}`,
      body.hasLoan === "有"
        ? `每月繳款：${clean(body.monthlyPayment)}`
        : "",
      body.hasLoan === "有"
        ? `呆帳／遲繳：${clean(body.paymentStatus)}`
        : "",
      `資金用途：${clean(body.purpose)}`,
      "",
      `時間：${new Date().toLocaleString("zh-TW", {
        timeZone: "Asia/Taipei",
      })}`,
    ]
      .filter(Boolean)
      .join("\n");

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${telegramToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: message,
        }),
      },
    );

    if (!telegramResponse.ok) {
      return NextResponse.json(
        { error: "Telegram 通知失敗，請檢查 Bot Token 與 Chat ID" },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      lineUrl,
    });
  } catch {
    return NextResponse.json(
      { error: "伺服器處理失敗，請稍後再試" },
      { status: 500 },
    );
  }
}