import "server-only";

import { randomUUID } from "node:crypto";
import { getNeonSql } from "./neon";
import { getTeacherPortfolioUser } from "./portfolioAuth";

export type ScheduleEntry = {
  id: string;
  teacherName: string;
  yearLevel: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  section: string | null;
  room: string | null;
  notes: string | null;
};

export type TeacherSchedule = {
  id: string;
  name: string;
  academicPeriod: string | null;
  createdAt: string;
  updatedAt: string;
  entries: ScheduleEntry[];
};

function entryFromRow(row: Record<string, unknown>): ScheduleEntry {
  return {
    id: String(row.id),
    teacherName: String(row.teacher_name ?? ""),
    yearLevel: String(row.year_level ?? "All Year Levels"),
    day: String(row.day),
    startTime: String(row.start_time),
    endTime: String(row.end_time),
    subject: String(row.subject),
    section: row.section ? String(row.section) : null,
    room: row.room ? String(row.room) : null,
    notes: row.notes ? String(row.notes) : null,
  };
}

function scheduleFromRow(
  row: Record<string, unknown>,
  entries: ScheduleEntry[],
): TeacherSchedule {
  return {
    id: String(row.id),
    name: String(row.name),
    academicPeriod: row.academic_period ? String(row.academic_period) : null,
    createdAt: new Date(String(row.created_at)).toISOString(),
    updatedAt: new Date(String(row.updated_at)).toISOString(),
    entries,
  };
}

export async function listTeacherSchedules() {
  const teacher = await getTeacherPortfolioUser();
  if (!teacher) return null;
  const sql = getNeonSql();
  const rows = await sql`
    select id, name, academic_period, created_at, updated_at
    from portfolio_auth.teacher_schedules
    where user_id = ${teacher.id}
    order by updated_at desc
  `;
  const entries = await sql`
    select e.*
    from portfolio_auth.teacher_schedule_entries e
    join portfolio_auth.teacher_schedules s on s.id = e.schedule_id
    where s.user_id = ${teacher.id}
    order by case e.day
      when 'Monday' then 1
      when 'Tuesday' then 2
      when 'Wednesday' then 3
      when 'Thursday' then 4
      when 'Friday' then 5
      else 6
    end, e.start_time, e.teacher_name
  `;
  const entriesBySchedule = new Map<string, ScheduleEntry[]>();
  for (const entry of entries) {
    const list = entriesBySchedule.get(String(entry.schedule_id)) ?? [];
    list.push(entryFromRow(entry));
    entriesBySchedule.set(String(entry.schedule_id), list);
  }
  return rows.map((row) =>
    scheduleFromRow(row, entriesBySchedule.get(String(row.id)) ?? []),
  );
}

export async function createTeacherSchedule(input: {
  name: string;
  academicPeriod: string | null;
  entries: Omit<ScheduleEntry, "id">[];
}) {
  const teacher = await getTeacherPortfolioUser();
  if (!teacher) return null;
  const sql = getNeonSql();
  const id = randomUUID();
  await sql.transaction([
    sql`
      insert into portfolio_auth.teacher_schedules (id, user_id, name, academic_period)
      values (${id}, ${teacher.id}, ${input.name}, ${input.academicPeriod})
    `,
    ...input.entries.map(
      (entry) => sql`
        insert into portfolio_auth.teacher_schedule_entries
          (id, schedule_id, teacher_name, year_level, day, start_time, end_time, subject, section, room, notes)
        values
          (${randomUUID()}, ${id}, ${entry.teacherName}, ${entry.yearLevel}, ${entry.day}, ${entry.startTime}, ${entry.endTime},
           ${entry.subject}, ${entry.section}, ${entry.room}, ${entry.notes})
      `,
    ),
  ]);
  const schedules = await listTeacherSchedules();
  return schedules?.find((schedule) => schedule.id === id) ?? null;
}

export async function deleteTeacherSchedule(id: string) {
  const teacher = await getTeacherPortfolioUser();
  if (!teacher) return null;
  const sql = getNeonSql();
  const rows = await sql`
    delete from portfolio_auth.teacher_schedules
    where id = ${id} and user_id = ${teacher.id}
    returning id
  `;
  return Boolean(rows[0]);
}

export async function updateTeacherSchedule(
  id: string,
  input: { name: string; academicPeriod: string | null },
) {
  const teacher = await getTeacherPortfolioUser();
  if (!teacher) return null;
  const sql = getNeonSql();
  const rows = await sql`
    update portfolio_auth.teacher_schedules
    set name = ${input.name}, academic_period = ${input.academicPeriod}, updated_at = now()
    where id = ${id} and user_id = ${teacher.id}
    returning id
  `;
  if (!rows[0]) return undefined;
  const schedules = await listTeacherSchedules();
  return schedules?.find((schedule) => schedule.id === id) ?? null;
}
