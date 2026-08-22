import type { Metadata } from "next";
import FulfillmentOsPage from "./_components/FulfillmentOsPage";

export const metadata: Metadata = {
  title: "FulfillmentOS | Order Operations Platform",
  description:
    "A multi-role order and fulfillment operations platform demo for the portfolio.",
};

export default function FulfillmentOsRoute() {
  return <FulfillmentOsPage />;
}
