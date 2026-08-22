import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { getTeacherPortfolioUser } from "../../../../../lib/portfolioAuth";
import { titleCaseSubject } from "../../../../../lib/k12Subjects";

export const runtime = "nodejs";
const maxFileSize = 5 * 1024 * 1024;

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
    const subjectKey = headerMap.get("subject");
    const hoursKey = headerMap.get("hoursperweek") ?? headerMap.get("hours");
    if (!teacherKey || !yearLevelKey || !subjectKey || !hoursKey)
      return NextResponse.json(
        {
          message:
            "Your file must include Teacher Name, Year Level, Subject, and Hours Per Week columns.",
        },
        { status: 400 },
      );
    const errors: string[] = [];
    const loads = rows
      .map((row, index) => {
        const teacherName = String(row[teacherKey] ?? "").trim();
        const yearLevel = String(row[yearLevelKey] ?? "").trim();
        const subject = titleCaseSubject(String(row[subjectKey] ?? ""));
        const hoursPerWeek = Number(row[hoursKey]);
        if (
          !teacherName ||
          !yearLevel ||
          !subject ||
          !Number.isInteger(hoursPerWeek) ||
          hoursPerWeek <= 0 ||
          hoursPerWeek > 60
        )
          errors.push(
            `Row ${index + 2}: teacher, year level, subject, and whole hours between 1 and 60 are required.`,
          );
        return { teacherName, yearLevel, subject, hoursPerWeek };
      })
      .filter(
        (load) =>
          load.teacherName &&
          load.yearLevel &&
          load.subject &&
          Number.isInteger(load.hoursPerWeek) &&
          load.hoursPerWeek > 0 &&
          load.hoursPerWeek <= 60,
      );
    const combined = new Map<string, (typeof loads)[number]>();
    for (const load of loads) {
      const key = `${load.teacherName.toLowerCase()}\u0000${load.yearLevel.toLowerCase()}\u0000${load.subject.toLowerCase()}`;
      const existing = combined.get(key);
      if (existing) existing.hoursPerWeek += load.hoursPerWeek;
      else combined.set(key, { ...load });
    }
    return NextResponse.json({
      loads: [...combined.values()],
      errors,
      totalHours: [...combined.values()].reduce(
        (sum, load) => sum + load.hoursPerWeek,
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
