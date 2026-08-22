import { NextResponse } from "next/server";
import {
  getNeonDatabaseTime,
  isNeonConfigured,
  NeonConfigurationError,
} from "../../../../../lib/neon";

export const runtime = "nodejs";

export async function GET() {
  if (!isNeonConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        message: "DATABASE_URL is not configured.",
      },
      { status: 503 },
    );
  }

  try {
    const databaseTime = await getNeonDatabaseTime();

    return NextResponse.json({
      ok: true,
      configured: true,
      databaseTime,
    });
  } catch (error) {
    if (error instanceof NeonConfigurationError) {
      return NextResponse.json(
        { ok: false, configured: false, message: error.message },
        { status: 503 },
      );
    }

    return NextResponse.json(
      {
        ok: false,
        configured: true,
        message: "Neon is configured but the connection failed.",
      },
      { status: 502 },
    );
  }
}
