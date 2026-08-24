import Stripe from "stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");

  if (!secretKey || !webhookSecret || !signature) {
    return NextResponse.json(
      { message: "Stripe webhook configuration is incomplete." },
      { status: 400 },
    );
  }

  try {
    const stripe = new Stripe(secretKey);
    const event = stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      webhookSecret,
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      console.info("Stripe payment verified", {
        orderReference: session.metadata?.orderReference,
        sessionId: session.id,
      });
      // Fulfillment belongs here after idempotency checks in a real backend.
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook verification failed", error);
    return NextResponse.json(
      { message: "Invalid Stripe webhook signature." },
      { status: 400 },
    );
  }
}
