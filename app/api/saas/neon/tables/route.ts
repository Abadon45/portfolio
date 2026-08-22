import { NextResponse } from "next/server";
import {
  isNeonConfigured,
  listNeonTables,
  NeonConfigurationError,
} from "../../../../../lib/neon";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const inspectionSecret = process.env.NEON_INSPECT_SECRET;
  const suppliedSecret = request.headers.get("x-neon-inspect-secret");

  if (!inspectionSecret || suppliedSecret !== inspectionSecret) {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }

  if (!isNeonConfigured()) {
    return NextResponse.json(
      { configured: false, message: "DATABASE_URL is not configured." },
      { status: 503 },
    );
  }

  try {
    const tables = await listNeonTables();

    return NextResponse.json({ configured: true, tables });
  } catch (error) {
    if (error instanceof NeonConfigurationError) {
      return NextResponse.json(
        { configured: false, message: error.message },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { configured: true, message: "Unable to inspect the database schema." },
      { status: 502 },
    );
  }
}
