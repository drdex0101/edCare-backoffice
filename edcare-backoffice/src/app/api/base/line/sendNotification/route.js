// src/app/api/line/sendNotification/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, message } = body;

    const accessToken = process.env.NEXT_PUBLIC_CHANNEL_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json({ error: "CHANNEL_ACCESS_TOKEN 未設定" }, { status: 500 });
    }

    const lineMessage = typeof message === "string"
      ? [{ type: "text", text: message }]
      : [message];

    const payload = {
      to: userId,
      messages: lineMessage,
    };

    console.log(payload);

    const response = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("LINE API 發送失敗:", errorText);
      return NextResponse.json({ error: errorText }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("發送通知失敗:", error.message);
    return NextResponse.json({ error: "伺服器發送通知時出錯" }, { status: 500 });
  }
}
