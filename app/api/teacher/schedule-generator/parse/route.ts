import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { getTeacherPortfolioUser } from "../../../../../lib/portfolioAuth";
import {
  normalizeSchoolLevel,
  normalizeYearLevel,
  schoolLevelForYear,
  titleCaseSubject,
  type SchoolLevel,
} from "../../../../../lib/k12Subjects";
import type { TeachingLoad } from "../../../../../lib/scheduleEngine";
import {
  isValidPeriodDuration,
  periodDurationBounds,
} from "../../../../../lib/schedulingPolicy";

export const runtime = "nodejs";
const maxFileSize = 5 * 1024 * 1024;

type ImportIssue = {
  row: number;
  field: string;
  value: string;
  reason: string;
  suggestion: string;
};

export async function POST(request: Request) {
  const teacher = await getTeacherPortfolioUser();
  if (!teacher)
    return NextResponse.json(
      { message: "Teacher access is required." },
      { status: 403 },
    );
  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  if (!(file instanceof File))
    return NextResponse.json(
      { message: "Choose a CSV or Excel file." },
      { status: 400 },
    );
  if (file.size > maxFileSize)
    return NextResponse.json(
      { message: "Files must be 5 MB or smaller." },
      { status: 413 },
    );
  if (!/\.(csv|xlsx|xls)$/i.test(file.name))
    return NextResponse.json(
      {
        message: "This file format isn't supported. Use .csv, .xlsx, or .xls.",
      },
      { status: 415 },
    );

  try {
    const workbook = XLSX.read(Buffer.from(await file.arrayBuffer()), {
      type: "buffer",
    });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: "",
    });
    const headerMap = new Map(
      Object.keys(rows[0] ?? {}).map((key) => [
        key.toLowerCase().replace(/[^a-z0-9]/g, ""),
        key,
      ]),
    );
    const teacherKey = headerMap.get("teachername") ?? headerMap.get("teacher");
    const yearLevelKey =
      headerMap.get("yearlevel") ?? headerMap.get("gradelevel") ?? headerMap.get("grade");
    const schoolLevelKey = headerMap.get("schoollevel") ?? headerMap.get("level");
    const sectionKey = headerMap.get("section") ?? headerMap.get("classname");
    const subjectKey = headerMap.get("subject");
    const periodsKey = headerMap.get("periodsperweek") ?? headerMap.get("periods");
    const durationKey = headerMap.get("perioddurationminutes") ?? headerMap.get("durationminutes");
    const legacyHoursKey = headerMap.get("hoursperweek") ?? headerMap.get("hours");
    const daysKey = headerMap.get("daysperweek") ?? headerMap.get("days");
    if (legacyHoursKey && !periodsKey)
      return NextResponse.json(
        {
          message:
            "This file uses Hours Per Week. Rename that column to Periods Per Week so the scheduler does not confuse hours with timetable periods.",
        },
        { status: 400 },
      );
    if (!teacherKey || !schoolLevelKey || !yearLevelKey || !sectionKey || !subjectKey || !periodsKey || !daysKey)
      return NextResponse.json(
        {
          message:
            "Your file must include Teacher Name, School Level, Year Level, Section, Subject, Periods Per Week, and Days Per Week columns.",
        },
        { status: 400 },
      );
    const errors: ImportIssue[] = [];
    const loads: TeachingLoad[] = [];
    rows.forEach((row, index) => {
      const rowNumber = index + 2;
      const teacherName = String(row[teacherKey] ?? "").trim().replace(/\s+/g, " ");
      const rawSchoolLevel = String(row[schoolLevelKey] ?? "").trim();
      const schoolLevel = normalizeSchoolLevel(rawSchoolLevel);
      const rawYearLevel = String(row[yearLevelKey] ?? "").trim();
      const yearLevel = normalizeYearLevel(rawYearLevel);
      const section = String(row[sectionKey] ?? "").trim().replace(/\s+/g, " ");
      const subject = titleCaseSubject(String(row[subjectKey] ?? ""));
      const periodsPerWeek = Number(row[periodsKey]);
      const daysPerWeek = Number(row[daysKey]);
      const rawDuration = durationKey
        ? String(row[durationKey] ?? "").trim()
        : "";
      const periodDurationMinutes = rawDuration
        ? Number(rawDuration)
        : undefined;
      const rowIssues: ImportIssue[] = [];
      if (!teacherName) rowIssues.push({ row: rowNumber, field: "Teacher Name", value: "", reason: "Teacher name is required.", suggestion: "Enter the assigned teacher." });
      if (!schoolLevel) rowIssues.push({ row: rowNumber, field: "School Level", value: rawSchoolLevel, reason: "School level is not recognized.", suggestion: "Use Kinder, Elementary, JHS, or SHS." });
      if (!yearLevel || !/^Kindergarten$|^Grade (?:[1-9]|1[0-2])$/.test(yearLevel)) rowIssues.push({ row: rowNumber, field: "Year Level", value: rawYearLevel, reason: "Year level is not recognized.", suggestion: "Use Kindergarten or Grade 1 through Grade 12." });
      if (schoolLevel && yearLevel && schoolLevelForYear(yearLevel) !== schoolLevel) rowIssues.push({ row: rowNumber, field: "School Level", value: rawSchoolLevel, reason: "School level does not match the year level.", suggestion: `Use ${schoolLevelForYear(yearLevel)} for ${yearLevel}.` });
      if (!section) rowIssues.push({ row: rowNumber, field: "Section", value: "", reason: "Section is required.", suggestion: "Enter the school's section name." });
      if (!subject) rowIssues.push({ row: rowNumber, field: "Subject", value: "", reason: "Subject is required.", suggestion: "Enter a subject name." });
      if (!Number.isInteger(periodsPerWeek) || periodsPerWeek < 1 || periodsPerWeek > 60) rowIssues.push({ row: rowNumber, field: "Periods Per Week", value: String(row[periodsKey] ?? ""), reason: "Periods must be a whole number from 1 to 60.", suggestion: "Enter the number of timetable periods required each week." });
      if (!Number.isInteger(daysPerWeek) || daysPerWeek < 1 || daysPerWeek > 5) rowIssues.push({ row: rowNumber, field: "Days Per Week", value: String(row[daysKey] ?? ""), reason: "Days must be a whole number from 1 to 5.", suggestion: "Enter the requested number of school days." });
      if (
        schoolLevel &&
        periodDurationMinutes !== undefined &&
        (!Number.isInteger(periodDurationMinutes) ||
          !isValidPeriodDuration(schoolLevel, periodDurationMinutes))
      ) {
        const bounds = periodDurationBounds(schoolLevel);
        rowIssues.push({ row: rowNumber, field: "Period Duration Minutes", value: rawDuration, reason: `Duration must be in 5-minute increments from ${bounds.minimumMinutes} to ${bounds.maximumMinutes} minutes for ${schoolLevel}.`, suggestion: `Use a value between ${bounds.minimumMinutes} and ${bounds.maximumMinutes}, or leave it blank for automatic calculation.` });
      }
      errors.push(...rowIssues);
      if (!rowIssues.length) loads.push({ teacherName, schoolLevel: schoolLevel as SchoolLevel, yearLevel, section, subject, periodsPerWeek, periodDurationMinutes, daysPerWeek });
    });
    const combined = new Map<string, TeachingLoad>();
    for (const load of loads) {
      const key = `${load.teacherName.toLowerCase()}\u0000${load.schoolLevel.toLowerCase()}\u0000${load.yearLevel.toLowerCase()}\u0000${load.section.toLowerCase()}\u0000${load.subject.toLowerCase()}\u0000${load.periodDurationMinutes}`;
      const existing = combined.get(key);
      if (existing) {
        existing.periodsPerWeek += load.periodsPerWeek;
        existing.daysPerWeek = Math.max(existing.daysPerWeek, load.daysPerWeek);
      }
      else combined.set(key, { ...load });
    }
    return NextResponse.json({
      loads: [...combined.values()],
      errors,
      processed: rows.length,
      accepted: [...combined.values()].length,
      rejected: errors.length,
      totalPeriods: [...combined.values()].reduce(
        (sum, load) => sum + load.periodsPerWeek,
        0,
      ),
    });
  } catch {
    return NextResponse.json(
      { message: "We couldn't read that file." },
      { status: 400 },
    );
  }
}
