import type { Metadata } from "next";
import PaymentsLabPage from "./_components/PaymentsLabPage";

export const metadata: Metadata = {
  title: "Payments Lab | Xendit + Stripe",
  description:
    "An interactive payment integration study comparing Xendit invoices and Stripe Checkout.",
};

export default function PaymentsRoute() {
  return <PaymentsLabPage />;
}
