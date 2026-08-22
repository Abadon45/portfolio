import { NextResponse } from "next/server";
import {
  deleteTeacherSchedule,
  updateTeacherSchedule,
} from "../../../../../lib/teacherWorkspace";

export const runtime = "nodejs";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const deleted = await deleteTeacherSchedule(id);
    if (deleted === null)
      return NextResponse.json(
        { message: "Teacher access is required." },
        { status: 403 },
      );
    if (!deleted)
      return NextResponse.json(
        { message: "Schedule not found." },
        { status: 404 },
      );
    return NextResponse.json({ deleted: true });
  } catch {
    return NextResponse.json(
      { message: "Unable to delete your schedule." },
      { status: 503 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const academicPeriod =
    typeof body?.academicPeriod === "string"
      ? body.academicPeriod.trim() || null
      : null;
  if (!name || name.length > 100) {
    return NextResponse.json(
      { message: "Enter a schedule name." },
      { status: 400 },
    );
  }
  try {
    const { id } = await params;
    const schedule = await updateTeacherSchedule(id, { name, academicPeriod });
    if (schedule === null)
      return NextResponse.json(
        { message: "Teacher access is required." },
        { status: 403 },
      );
    if (!schedule)
      return NextResponse.json(
        { message: "Schedule not found." },
        { status: 404 },
      );
    return NextResponse.json({ schedule });
  } catch {
    return NextResponse.json(
      { message: "Unable to update your schedule." },
      { status: 503 },
    );
  }
}
