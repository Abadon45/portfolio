import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function matchesCallbackToken(received: string, expected: string) {
  const receivedBuffer = Buffer.from(received);
  const expectedBuffer = Buffer.from(expected);

  return receivedBuffer.length === expectedBuffer.length
    && timingSafeEqual(receivedBuffer, expectedBuffer);
}

export async function POST(request: Request) {
  const webhookToken = process.env.XENDIT_WEBHOOK_TOKEN ?? process.env.XENDIT_WEBHOOK_KEY;
  const callbackToken = request.headers.get("x-callback-token") ?? "";

  if (!webhookToken || !matchesCallbackToken(callbackToken, webhookToken)) {
    return NextResponse.json(
      { message: "Invalid Xendit callback token." },
      { status: 403 },
    );
  }

  const payload = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const status = payload?.status;
  const externalId = payload?.external_id;

  if (status === "PAID") {
    console.info("Xendit payment verified", {
      externalId,
      paymentId: payload?.id,
    });
    // Fulfillment belongs here after an idempotency check in a real backend.
  }

  return NextResponse.json({ received: true });
}
