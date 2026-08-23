import { NextResponse } from "next/server";
import {
  createTeacherSchedule,
  listTeacherSchedules,
} from "../../../../lib/teacherWorkspace";
import { schoolLevels, titleCaseSubject } from "../../../../lib/k12Subjects";
import { isScheduleTerm } from "../../../../lib/scheduleTerms";

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
        isValidTimeRange(entry.startTime, entry.endTime) &&
        entry.subject &&
        entry.yearLevel &&
        entry.section &&
        schoolLevels.includes(entry.schoolLevel as (typeof schoolLevels)[number]),
    );
}

function isValidTimeRange(startTime: string, endTime: string) {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  return Number.isFinite(start) && Number.isFinite(end) && start < end;
}

function hasScheduleConflict(
  entries: ReturnType<typeof normalizeEntries>,
) {
  return entries.some((entry, index) =>
    entries.slice(0, index).some((other) =>
      intervalsOverlap(entry, other) &&
      (sameTeacher(entry, other) || sameSection(entry, other)),
    ),
  );
}

function sameTeacher(
  left: ReturnType<typeof normalizeEntries>[number],
  right: ReturnType<typeof normalizeEntries>[number],
) {
  return left.teacherName.toLowerCase() === right.teacherName.toLowerCase();
}

function sameSection(
  left: ReturnType<typeof normalizeEntries>[number],
  right: ReturnType<typeof normalizeEntries>[number],
) {
  return (
    left.schoolLevel.toLowerCase() === right.schoolLevel.toLowerCase() &&
    left.yearLevel.toLowerCase() === right.yearLevel.toLowerCase() &&
    left.section.toLowerCase() === right.section.toLowerCase()
  );
}

function timeToMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function intervalsOverlap(
  left: ReturnType<typeof normalizeEntries>[number],
  right: ReturnType<typeof normalizeEntries>[number],
) {
  return (
    left.day.toLowerCase() === right.day.toLowerCase() &&
    timeToMinutes(left.startTime) < timeToMinutes(right.endTime) &&
    timeToMinutes(left.endTime) > timeToMinutes(right.startTime)
  );
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
  const schoolYear =
    typeof body?.schoolYear === "string" && body.schoolYear.trim()
      ? body.schoolYear.trim()
      : "Unspecified";
  const term =
    typeof body?.term === "string" && body.term.trim()
      ? body.term.trim()
      : "Full School Year";
  const academicPeriod =
    typeof body?.academicPeriod === "string"
      ? body.academicPeriod.trim() || null
      : null;
  const rawEntries = Array.isArray(body?.entries) ? body.entries : [];
  const entries = normalizeEntries(rawEntries);
  const sourceLoads = Array.isArray(body?.sourceLoads) ? body.sourceLoads : [];
  const qualityMetrics =
    body?.qualityMetrics && typeof body.qualityMetrics === "object"
      ? (body.qualityMetrics as Record<string, unknown>)
      : {};
  if (!name || name.length > 100 || !isScheduleTerm(term)) {
    return NextResponse.json(
      {
        message:
          "Enter a schedule name and choose Full School Year, Term 1, Term 2, or Term 3.",
      },
      { status: 400 },
    );
  }
  if (entries.length !== rawEntries.length) {
    return NextResponse.json(
      {
        message:
          "Every schedule entry must include a valid teacher, school level, year level, section, subject, day, and non-overlapping time interval.",
      },
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
      schoolYear,
      term,
      academicPeriod,
      sourceLoads,
      qualityMetrics,
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
