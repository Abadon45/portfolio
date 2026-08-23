import { resolvePeriodDuration } from "./schedulingPolicy";

export type TeachingLoad = {
  teacherName: string;
  schoolLevel: "Kinder" | "Elementary" | "JHS" | "SHS";
  yearLevel: string;
  section: string;
  subject: string;
  periodsPerWeek: number;
  periodDurationMinutes?: number;
  daysPerWeek: number;
};

export type SchoolPeriod = {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
};

export type ScheduleSlot = {
  teacherName: string;
  schoolLevel: TeachingLoad["schoolLevel"];
  yearLevel: string;
  section: string;
  subject: string;
  day: string;
  startTime: string;
  endTime: string;
};

export type ScheduleGeneration = {
  entries: ScheduleSlot[];
  requiredPeriods: number;
  scheduledPeriods: number;
  unscheduledLoads: Array<TeachingLoad & { scheduledPeriods: number }>;
  conflicts: number;
  quality: number;
  analysis: ScheduleAnalysis;
  qualityMetrics: ScheduleQualityMetrics;
  teacherSummaries: TeacherScheduleSummary[];
};

export type ScheduleAnalysis = {
  teachers: number;
  sections: number;
  subjects: number;
  assignments: number;
  availablePeriods: number;
  requiredPeriods: number;
  capacityMargin: number;
};

export type ScheduleQualityMetrics = {
  requiredPeriods: number;
  scheduledPeriods: number;
  requiredCoverage: number;
  teacherConflicts: number;
  sectionConflicts: number;
  requestedDays: number;
  teacherWorkload: number;
  subjectDistribution: number;
  overall: number;
};

export type TeacherScheduleSummary = {
  teacherName: string;
  requiredPeriods: number;
  scheduledPeriods: number;
  subjects: Array<{ subject: string; requiredPeriods: number }>;
};

type Slot = {
  day: string;
  startTime: string;
  endTime: string;
  index: number;
};

export function generateTeacherSchedule({
  loads,
  days,
  periods,
}: {
  loads: TeachingLoad[];
  days: string[];
  periods: SchoolPeriod[];
}): ScheduleGeneration {
  const orderedDays = [...days].sort(compareDays);
  const referenceMinutes = periods[0]
    ? timeToMinutes(periods[0].endTime) - timeToMinutes(periods[0].startTime)
    : 60;
  const scheduledLoads = loads.map((load) => ({
    ...load,
    periodDurationMinutes: resolvePeriodDuration(
      load.schoolLevel,
      load.periodDurationMinutes,
      referenceMinutes,
    ),
  }));
  const availablePeriods = orderedDays.length * periods.length;
  const usedByTeacher = new Map<string, Set<string>>();
  const dailyTeachingMinutes = new Map<string, number>();
  const lastSubjectSlot = new Map<string, string>();
  const entries: ScheduleSlot[] = [];
  const scheduledByLoad = new Map<string, number>();
  const teacherNames = new Map<string, string>();
  const requiredByTeacher = new Map<string, number>();
  const subjectsByTeacher = new Map<
    string,
    Array<{ subject: string; requiredPeriods: number }>
  >();
  const usedDaysByLoad = new Map<string, Set<string>>();

  for (const load of scheduledLoads) {
    const teacherKey = normalizeTeacher(load.teacherName);
    teacherNames.set(teacherKey, teacherNames.get(teacherKey) ?? load.teacherName.trim());
    requiredByTeacher.set(
      teacherKey,
      (requiredByTeacher.get(teacherKey) ?? 0) + load.periodsPerWeek,
    );
    const subjects = subjectsByTeacher.get(teacherKey) ?? [];
    subjects.push({ subject: load.subject, requiredPeriods: load.periodsPerWeek });
    subjectsByTeacher.set(teacherKey, subjects);
  }

  const sortedLoads = [...scheduledLoads].sort(
    (a, b) => b.periodsPerWeek - a.periodsPerWeek,
  );
  for (const load of sortedLoads) {
    const teacherKey = normalizeTeacher(load.teacherName);
    const classKey = classIdentity(load);
    const teacherSlots =
      usedByTeacher.get(teacherKey) ?? new Set<string>();
    usedByTeacher.set(teacherKey, teacherSlots);
    const loadKey = `${teacherKey}\u0000${classKey}\u0000${normalizeValue(load.subject)}`;
    const usedDays = usedDaysByLoad.get(loadKey) ?? new Set<string>();
    const targetDays = Math.min(Math.max(1, load.daysPerWeek), orderedDays.length);
    usedDaysByLoad.set(loadKey, usedDays);
    const slots = buildFlexibleSlots(
      orderedDays,
      periods,
      load.periodDurationMinutes,
    );
    let scheduled = 0;
    for (let period = 0; period < load.periodsPerWeek; period += 1) {
      const candidates = slots.filter(
        (slot) => {
          const slotKey = `${slot.day}:${slot.startTime}`;
          return (
            !teacherSlots.has(slotKey) &&
            !entries.some((entry) =>
              intervalsOverlap(entry, slot) &&
              (normalizeTeacher(entry.teacherName) === teacherKey ||
                scheduleClassIdentity(entry) === classKey),
            )
          );
        },
      );
      if (!candidates.length) break;
      candidates.sort((a, b) => {
        const needsNewDay = usedDays.size < targetDays;
        if (needsNewDay) {
          const aNewDay = usedDays.has(a.day) ? 1 : 0;
          const bNewDay = usedDays.has(b.day) ? 1 : 0;
          if (aNewDay !== bNewDay) return aNewDay - bNewDay;
        }
        return scoreSlot(
          a,
          b,
          load,
          teacherSlots,
          dailyTeachingMinutes,
          lastSubjectSlot,
        );
      });
      const selected = candidates[0];
      const slotKey = `${selected.day}:${selected.startTime}`;
      teacherSlots.add(slotKey);
      usedDays.add(selected.day);
      dailyTeachingMinutes.set(
        `${teacherKey}:${selected.day}`,
        (dailyTeachingMinutes.get(`${teacherKey}:${selected.day}`) ?? 0) +
          load.periodDurationMinutes,
      );
      lastSubjectSlot.set(
        `${teacherKey}:${selected.day}`,
        `${selected.index}`,
      );
      entries.push({
        teacherName: load.teacherName,
        schoolLevel: load.schoolLevel,
        yearLevel: load.yearLevel,
        section: load.section,
        subject: load.subject,
        day: selected.day,
        startTime: selected.startTime,
        endTime: selected.endTime,
      });
      scheduled += 1;
    }
      scheduledByLoad.set(loadKey, scheduled);
  }

  const requiredPeriods = scheduledLoads.reduce(
    (sum, load) => sum + load.periodsPerWeek,
    0,
  );
  const scheduledPeriods = entries.length;
  const unscheduledLoads = scheduledLoads
    .map((load) => ({
      ...load,
      scheduledPeriods:
        scheduledByLoad.get(
          `${normalizeTeacher(load.teacherName)}\u0000${normalizeValue(load.schoolLevel)}\u0000${normalizeValue(load.yearLevel)}\u0000${normalizeValue(load.section)}\u0000${normalizeValue(load.subject)}`,
        ) ?? 0,
    }))
    .filter((load) => load.scheduledPeriods < load.periodsPerWeek);
  const conflictMetrics = countScheduleConflicts(entries);
  const teacherSummaries = [...teacherNames.entries()].map(
    ([teacherKey, teacherName]) => ({
      teacherName,
      requiredPeriods: requiredByTeacher.get(teacherKey) ?? 0,
      scheduledPeriods: entries.filter(
        (entry) => normalizeTeacher(entry.teacherName) === teacherKey,
      ).length,
      subjects: subjectsByTeacher.get(teacherKey) ?? [],
    }),
  );
  const requestedDays = calculateRequestedDays(scheduledLoads, usedDaysByLoad);
  const teacherWorkload = calculateTeacherWorkload(
    teacherKeyList(scheduledLoads),
    dailyTeachingMinutes,
  );
  const subjectDistribution = calculateSubjectDistribution(entries);
  const requiredCoverage = requiredPeriods === 0
    ? 0
    : Math.round((scheduledPeriods / requiredPeriods) * 100);
  const qualityMetrics: ScheduleQualityMetrics = {
    requiredPeriods,
    scheduledPeriods,
    requiredCoverage,
    teacherConflicts: conflictMetrics.teacher,
    sectionConflicts: conflictMetrics.section,
    requestedDays,
    teacherWorkload,
    subjectDistribution,
    overall: Math.round(
      requiredCoverage * 0.45 +
        requestedDays * 0.2 +
        teacherWorkload * 0.2 +
        subjectDistribution * 0.15,
    ),
  };
  const analysis: ScheduleAnalysis = {
    teachers: new Set(scheduledLoads.map((load) => normalizeTeacher(load.teacherName))).size,
    sections: new Set(scheduledLoads.map((load) => classIdentity(load))).size,
    subjects: new Set(scheduledLoads.map((load) => normalizeValue(load.subject))).size,
    assignments: scheduledLoads.length,
    availablePeriods,
    requiredPeriods,
    capacityMargin: availablePeriods - requiredPeriods,
  };
  return {
    entries,
    requiredPeriods,
    scheduledPeriods,
    unscheduledLoads,
    conflicts:
      conflictMetrics.teacher + conflictMetrics.section,
    quality: qualityMetrics.overall,
    analysis,
    qualityMetrics,
    teacherSummaries,
  };
}

function normalizeTeacher(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function compareDays(a: string, b: string) {
  const order = new Map([
    ["Monday", 0],
    ["Tuesday", 1],
    ["Wednesday", 2],
    ["Thursday", 3],
    ["Friday", 4],
  ]);
  return (order.get(a) ?? 99) - (order.get(b) ?? 99);
}

function normalizeValue(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function countScheduleConflicts(entries: ScheduleSlot[]) {
  const occupied = {
    teacher: [] as ScheduleSlot[],
    yearLevel: [] as ScheduleSlot[],
  };
  const conflicts = { teacher: 0, section: 0 };
  for (const entry of entries) {
    if (occupied.teacher.some((other) =>
      normalizeTeacher(other.teacherName) === normalizeTeacher(entry.teacherName) &&
      intervalsOverlap(other, entry)
    )) conflicts.teacher += 1;
    if (occupied.yearLevel.some((other) =>
      scheduleClassIdentity(other) === scheduleClassIdentity(entry) && intervalsOverlap(other, entry)
    )) conflicts.section += 1;
    occupied.teacher.push(entry);
    occupied.yearLevel.push(entry);
  }
  return conflicts;
}

function scheduleClassIdentity(value: Pick<ScheduleSlot, "schoolLevel" | "yearLevel" | "section">) {
  return [
    normalizeValue(value.schoolLevel),
    normalizeValue(value.yearLevel),
    normalizeValue(value.section),
  ].join("\u0000");
}

function timeToMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function intervalsOverlap(a: Pick<ScheduleSlot, "day" | "startTime" | "endTime">, b: Pick<ScheduleSlot, "day" | "startTime" | "endTime">) {
  return a.day === b.day && timeToMinutes(a.startTime) < timeToMinutes(b.endTime) && timeToMinutes(a.endTime) > timeToMinutes(b.startTime);
}

function buildFlexibleSlots(
  days: string[],
  periods: SchoolPeriod[],
  durationMinutes: number,
): Slot[] {
  const firstPeriod = periods[0];
  const lastPeriod = periods.at(-1);
  if (!firstPeriod || !lastPeriod) return [];
  const schoolStart = timeToMinutes(firstPeriod.startTime);
  const schoolEnd = timeToMinutes(lastPeriod.endTime);
  const slots: Slot[] = [];
  for (const day of days) {
    let index = 0;
    for (
      let start = schoolStart;
      start + durationMinutes <= schoolEnd;
      start += 5
    ) {
      slots.push({
        day,
        startTime: minutesToTime(start),
        endTime: minutesToTime(start + durationMinutes),
        index,
      });
      index += 1;
    }
  }
  return slots;
}

function minutesToTime(value: number) {
  const hours = Math.floor(value / 60).toString().padStart(2, "0");
  const minutes = (value % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

function classIdentity(load: TeachingLoad) {
  return [
    normalizeValue(load.schoolLevel),
    normalizeValue(load.yearLevel),
    normalizeValue(load.section),
  ].join("\u0000");
}

function teacherKeyList(loads: TeachingLoad[]) {
  return [...new Set(loads.map((load) => normalizeTeacher(load.teacherName)))];
}

function calculateRequestedDays(
  loads: TeachingLoad[],
  usedDaysByLoad: Map<string, Set<string>>,
) {
  if (!loads.length) return 0;
  const scores = loads.map((load) => {
    const key = `${normalizeTeacher(load.teacherName)}\u0000${classIdentity(load)}\u0000${normalizeValue(load.subject)}`;
    const requested = Math.max(1, load.daysPerWeek);
    return Math.min((usedDaysByLoad.get(key)?.size ?? 0) / requested, 1);
  });
  return Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 100);
}

function calculateTeacherWorkload(
  teachers: string[],
  dailyTeachingMinutes: Map<string, number>,
) {
  if (!teachers.length) return 0;
  const spreads = teachers.map((teacher) => {
    const values = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
      (day) => dailyTeachingMinutes.get(`${teacher}:${day}`) ?? 0,
    );
    return Math.max(...values) - Math.min(...values);
  });
  const averageSpread = spreads.reduce((sum, spread) => sum + spread, 0) / spreads.length;
  return Math.max(0, Math.round(100 - (averageSpread / 30) * 12));
}

function calculateSubjectDistribution(entries: ScheduleSlot[]) {
  if (!entries.length) return 0;
  const bySubject = new Map<string, { count: number; days: Set<string> }>();
  for (const entry of entries) {
    const key = normalizeValue(entry.subject);
    const record = bySubject.get(key) ?? { count: 0, days: new Set<string>() };
    record.count += 1;
    record.days.add(entry.day);
    bySubject.set(key, record);
  }
  const scores = [...bySubject.values()].map((record) =>
    Math.min(record.days.size / Math.min(record.count, 5), 1),
  );
  return Math.round(
    (scores.reduce((sum, score) => sum + score, 0) / scores.length) * 100,
  );
}

function scoreSlot(
  a: Slot,
  b: Slot,
  load: TeachingLoad,
  teacherSlots: Set<string>,
  dailyTeachingMinutes: Map<string, number>,
  lastSubjectSlot: Map<string, string>,
) {
  return (
    slotScore(a, load, teacherSlots, dailyTeachingMinutes, lastSubjectSlot) -
    slotScore(b, load, teacherSlots, dailyTeachingMinutes, lastSubjectSlot)
  );
}

function slotScore(
  slot: Slot,
  load: TeachingLoad,
  teacherSlots: Set<string>,
  dailyTeachingMinutes: Map<string, number>,
  lastSubjectSlot: Map<string, string>,
) {
  const dayKey = `${normalizeTeacher(load.teacherName)}:${slot.day}`;
  const adjacentPenalty =
    lastSubjectSlot.get(dayKey) === String(slot.index - 1) ? 6 : 0;
  const dayLoad = (dailyTeachingMinutes.get(dayKey) ?? 0) / 45;
  const slotLoad = teacherSlots.has(`${slot.day}:${slot.startTime}`) ? 1000 : 0;
  return dayLoad * 10 + adjacentPenalty + slotLoad;
}
