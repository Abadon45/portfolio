import { NextResponse } from "next/server";

export const runtime = "nodejs";

const xenditUrl = "https://api.xendit.co/v2/invoices";

function getApiKey() {
  const apiKey = process.env.XENDIT_API_KEY;

  if (!apiKey) {
    throw new Error("XENDIT_API_KEY is not configured.");
  }

  return apiKey;
}

async function parseXenditResponse(response: Response) {
  const data = (await response.json().catch(() => null)) as Record<string, unknown> | null;

  if (!response.ok) {
    throw new Error(typeof data?.message === "string" ? data.message : "Xendit request failed.");
  }

  return data;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const amount = typeof body?.amount === "number" ? Math.round(body.amount) : 0;
  const externalId = typeof body?.externalId === "string" ? body.externalId : "PAY-DEMO-2048";

  if (!Number.isFinite(amount) || amount < 50 || amount > 1_000_000) {
    return NextResponse.json(
      { message: "Amount must be between ₱50 and ₱1,000,000." },
      { status: 400 },
    );
  }

  try {
    const origin = new URL(request.url).origin;
    const response = await fetch(xenditUrl, {
      body: JSON.stringify({
        amount,
        customer: { given_names: "Payments Lab Customer" },
        description: "Commerce OS Pro",
        external_id: externalId,
        failure_redirect_url: `${origin}/payments?xendit_cancelled=true`,
        invoice_duration: 86400,
        items: [{ name: "Commerce OS Pro", price: amount, quantity: 1 }],
        success_redirect_url: `${origin}/payments?xendit_return=${encodeURIComponent(externalId)}`,
      }),
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${Buffer.from(`${getApiKey()}:`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    const data = await parseXenditResponse(response);

    if (typeof data?.invoice_url !== "string" || typeof data?.id !== "string") {
      return NextResponse.json(
        { message: "Xendit did not return a valid invoice." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      externalId: data.external_id,
      invoiceId: data.id,
      url: data.invoice_url,
    });
  } catch (error) {
    console.error("Xendit invoice creation failed", error);
    return NextResponse.json(
      { message: "Unable to create a Xendit invoice." },
      { status: 502 },
    );
  }
}

export async function GET(request: Request) {
  const invoiceId = new URL(request.url).searchParams.get("invoice_id");

  if (!invoiceId) {
    return NextResponse.json(
      { message: "A Xendit invoice ID is required." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(`${xenditUrl}/${encodeURIComponent(invoiceId)}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${Buffer.from(`${getApiKey()}:`).toString("base64")}`,
      },
      method: "GET",
    });
    const data = await parseXenditResponse(response);

    return NextResponse.json({
      externalId: data?.external_id ?? null,
      paid: data?.status === "PAID",
      status: data?.status ?? null,
    });
  } catch (error) {
    console.error("Xendit invoice retrieval failed", error);
    return NextResponse.json(
      { message: "Unable to verify the Xendit invoice." },
      { status: 502 },
    );
  }
}
