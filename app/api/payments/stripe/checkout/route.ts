import Stripe from "stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }

  return new Stripe(secretKey);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const amount = typeof body?.amount === "number" ? Math.round(body.amount) : 0;
  const orderReference = typeof body?.orderReference === "string" ? body.orderReference : "PAY-DEMO-2048";

  if (!Number.isFinite(amount) || amount < 50 || amount > 1_000_000) {
    return NextResponse.json(
      { message: "Amount must be between ₱50 and ₱1,000,000." },
      { status: 400 },
    );
  }

  try {
    const origin = new URL(request.url).origin;
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "php",
            product_data: { name: "Commerce OS Pro" },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      metadata: { orderReference },
      success_url: `${origin}/payments?stripe_session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payments?stripe_cancelled=true`,
    });

    if (!session.url) {
      return NextResponse.json(
        { message: "Stripe did not return a Checkout URL." },
        { status: 502 },
      );
    }

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Session creation failed", error);
    return NextResponse.json(
      { message: "Unable to create a Stripe Checkout Session." },
      { status: 502 },
    );
  }
}

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json(
      { message: "A Stripe Checkout Session ID is required." },
      { status: 400 },
    );
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      amountTotal: session.amount_total,
      orderReference: session.metadata?.orderReference ?? null,
      paid: session.payment_status === "paid",
      paymentStatus: session.payment_status,
      sessionStatus: session.status,
    });
  } catch (error) {
    console.error("Stripe Checkout Session retrieval failed", error);
    return NextResponse.json(
      { message: "Unable to verify the Stripe Checkout Session." },
      { status: 502 },
    );
  }
}
