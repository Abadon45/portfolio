import { NextResponse } from "next/server";
import {
  createTeacherSchedule,
  listTeacherSchedules,
} from "../../../../lib/teacherWorkspace";
import { schoolLevels, titleCaseSubject } from "../../../../lib/k12Subjects";

export const runtime = "nodejs";

function normalizeEntries(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => {
      const item = entry as Record<string, unknown>;
      return {
        teacherName:
          typeof item.teacherName === "string" ? item.teacherName.trim() : "",
        schoolLevel:
          typeof item.schoolLevel === "string"
            ? item.schoolLevel.trim()
            : "JHS",
        yearLevel:
          typeof item.yearLevel === "string"
            ? item.yearLevel.trim()
            : "All Year Levels",
        day: typeof item.day === "string" ? item.day.trim() : "",
        startTime:
          typeof item.startTime === "string" ? item.startTime.trim() : "",
        endTime: typeof item.endTime === "string" ? item.endTime.trim() : "",
        subject:
          typeof item.subject === "string"
            ? titleCaseSubject(item.subject)
            : "",
        section:
          typeof item.section === "string"
            ? item.section.trim() || "Unsectioned"
            : "Unsectioned",
        room: typeof item.room === "string" ? item.room.trim() || null : null,
        notes:
          typeof item.notes === "string" ? item.notes.trim() || null : null,
      };
    })
    .filter(
      (entry) =>
        entry.teacherName &&
        entry.day &&
        entry.startTime &&
        entry.endTime &&
        entry.subject &&
        entry.yearLevel &&
        entry.section &&
        schoolLevels.includes(entry.schoolLevel as (typeof schoolLevels)[number]),
    );
}

function hasScheduleConflict(
  entries: ReturnType<typeof normalizeEntries>,
) {
  const occupied = new Set<string>();
  for (const entry of entries) {
    const timeKey = `${entry.day.toLowerCase()}\u0000${entry.startTime}`;
    const keys = [
      `teacher\u0000${entry.teacherName.toLowerCase()}\u0000${timeKey}`,
      `year\u0000${entry.schoolLevel.toLowerCase()}\u0000${entry.yearLevel.toLowerCase()}\u0000${entry.section?.toLowerCase()}\u0000${timeKey}`,
      `subject\u0000${entry.subject.toLowerCase()}\u0000${timeKey}`,
    ];
    if (keys.some((key) => occupied.has(key))) return true;
    keys.forEach((key) => occupied.add(key));
  }
  return false;
}

export async function GET() {
  try {
    const schedules = await listTeacherSchedules();
    if (!schedules)
      return NextResponse.json(
        { message: "Teacher access is required." },
        { status: 403 },
      );
    return NextResponse.json({ schedules });
  } catch {
    return NextResponse.json(
      { message: "Unable to load your schedules." },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const academicPeriod =
    typeof body?.academicPeriod === "string"
      ? body.academicPeriod.trim() || null
      : null;
  const entries = normalizeEntries(body?.entries);
  if (!name || name.length > 100) {
    return NextResponse.json(
      { message: "Enter a schedule name." },
      { status: 400 },
    );
  }
  if (hasScheduleConflict(entries)) {
    return NextResponse.json(
      {
        message:
          "This schedule contains a teacher, year-level, or subject time conflict.",
      },
      { status: 409 },
    );
  }
  try {
    const schedule = await createTeacherSchedule({
      name,
      academicPeriod,
      entries,
    });
    if (!schedule)
      return NextResponse.json(
        { message: "Teacher access is required." },
        { status: 403 },
      );
    return NextResponse.json({ schedule }, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Unable to save your schedule." },
      { status: 503 },
    );
  }
}
