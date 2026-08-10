import type { Metadata } from "next";
import AwsOperationsPage from "../components/aws/AwsOperationsPage";

export const metadata: Metadata = {
  title: "Cloudline | AWS Operations Hub",
  description: "An AWS-focused product template for monitoring serverless infrastructure.",
};

export default function AwsRoute() {
  return <AwsOperationsPage />;
}
