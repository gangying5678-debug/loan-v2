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

    const googleSheetsWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    const lineUrl =
      process.env.NEXT_PUBLIC_LINE_URL ?? "https://lin.ee/xVg7pXJ";

    if (!googleSheetsWebhookUrl) {
      return NextResponse.json(
        { error: "Google 試算表尚未完成設定" },
        { status: 500 },
      );
    }

    const googleSheetsResponse = await fetch(googleSheetsWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: clean(body.name),
        phone,
        residence: clean(body.residence),
        occupation: clean(body.occupation),
        income: clean(body.income),
        amount: clean(body.amount),
        hasLoan: clean(body.hasLoan),
        monthlyPayment:
          body.hasLoan === "有" ? clean(body.monthlyPayment) : "",
        loanStatus: body.hasLoan === "有" ? clean(body.paymentStatus) : "",
        purpose: clean(body.purpose),
        consent: clean(body.consent),
      }),
    });

    if (!googleSheetsResponse.ok) {
      return NextResponse.json(
        { error: "資料寫入失敗，請稍後再試" },
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
