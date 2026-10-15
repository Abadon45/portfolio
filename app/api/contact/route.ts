import { NextResponse } from "next/server";

type ContactRequest = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  propertyType?: unknown;
  bill?: unknown;
  message?: unknown;
};

function readText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ContactRequest | null;
  const name = readText(body?.name, 120);
  const email = readText(body?.email, 254);
  const phone = readText(body?.phone, 40);
  const propertyType = readText(body?.propertyType, 40);
  const bill = readText(body?.bill, 80);
  const message = readText(body?.message, 4000);

  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { message: "Enter your name and a valid email address." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.AUTH_FROM_EMAIL;

  if (!apiKey || !from) {
    return NextResponse.json(
      { message: "The contact service is not configured yet. Please email hello@cotabatosolar.ph." },
      { status: 503 },
    );
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: ["hello@cotabatosolar.ph"],
      reply_to: email,
      subject: `Solar assessment request from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || "Not provided"}`,
        `Property type: ${propertyType || "Not provided"}`,
        `Average monthly bill: ${bill || "Not provided"}`,
        "",
        "Message:",
        message || "Not provided",
      ].join("\n"),
    }),
  }).catch(() => null);

  if (!response?.ok) {
    return NextResponse.json(
      { message: "We couldn’t send your request. Please email hello@cotabatosolar.ph." },
      { status: 502 },
    );
  }

  return NextResponse.json({ message: "Your assessment request was sent." });
}
