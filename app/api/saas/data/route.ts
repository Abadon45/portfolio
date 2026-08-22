import { NextResponse } from "next/server";
import { getSaaSData } from "../../../../lib/saasDemoRepository";

export const runtime = "nodejs";

export async function GET() {
  try {
    return NextResponse.json(await getSaaSData());
  } catch {
    return NextResponse.json(
      { message: "Unable to load SaaS demo data." },
      { status: 502 },
    );
  }
}
