export type TeachingLoad = {
  teacherName: string;
  schoolLevel: "Kinder" | "Elementary" | "JHS" | "SHS";
  yearLevel: string;
  section: string;
  subject: string;
  hoursPerWeek: number;
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
  requiredHours: number;
  scheduledHours: number;
  unscheduledLoads: Array<TeachingLoad & { scheduledHours: number }>;
  conflicts: number;
  quality: number;
  teacherSummaries: TeacherScheduleSummary[];
};

export type TeacherScheduleSummary = {
  teacherName: string;
  requiredHours: number;
  scheduledHours: number;
  subjects: Array<{ subject: string; requiredHours: number }>;
};

type Slot = SchoolPeriod & { day: string; index: number };

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
  const slots: Slot[] = orderedDays.flatMap((day) =>
    periods.map((period, index) => ({ ...period, day, index })),
  );
  const usedByTeacher = new Map<string, Set<string>>();
  const usedByYearLevel = new Map<string, Set<string>>();
  const usedBySubject = new Map<string, Set<string>>();
  const dailyHours = new Map<string, number>();
  const lastSubjectSlot = new Map<string, string>();
  const entries: ScheduleSlot[] = [];
  const scheduledByLoad = new Map<string, number>();
  const teacherNames = new Map<string, string>();
  const requiredByTeacher = new Map<string, number>();
  const subjectsByTeacher = new Map<
    string,
    Array<{ subject: string; requiredHours: number }>
  >();
  const usedDaysByLoad = new Map<string, Set<string>>();

  for (const load of loads) {
    const teacherKey = normalizeTeacher(load.teacherName);
    const yearLevelKey = normalizeValue(load.yearLevel);
    const subjectKey = normalizeValue(load.subject);
    teacherNames.set(teacherKey, teacherNames.get(teacherKey) ?? load.teacherName.trim());
    requiredByTeacher.set(
      teacherKey,
      (requiredByTeacher.get(teacherKey) ?? 0) + load.hoursPerWeek,
    );
    const subjects = subjectsByTeacher.get(teacherKey) ?? [];
    subjects.push({ subject: load.subject, requiredHours: load.hoursPerWeek });
    subjectsByTeacher.set(teacherKey, subjects);
  }

  const sortedLoads = [...loads].sort(
    (a, b) => b.hoursPerWeek - a.hoursPerWeek,
  );
  for (const load of sortedLoads) {
    const teacherKey = normalizeTeacher(load.teacherName);
    const yearLevelKey = normalizeValue(load.yearLevel);
    const subjectKey = normalizeValue(load.subject);
    const classKey = `${normalizeValue(load.schoolLevel)}\u0000${yearLevelKey}\u0000${normalizeValue(load.section)}`;
    const teacherSlots =
      usedByTeacher.get(teacherKey) ?? new Set<string>();
    usedByTeacher.set(teacherKey, teacherSlots);
    const yearLevelSlots =
      usedByYearLevel.get(classKey) ?? new Set<string>();
    const subjectSlots = usedBySubject.get(subjectKey) ?? new Set<string>();
    usedByYearLevel.set(classKey, yearLevelSlots);
    usedBySubject.set(subjectKey, subjectSlots);
    const loadKey = `${teacherKey}\u0000${classKey}\u0000${subjectKey}`;
    const usedDays = usedDaysByLoad.get(loadKey) ?? new Set<string>();
    const targetDays = Math.min(Math.max(1, load.daysPerWeek), orderedDays.length);
    usedDaysByLoad.set(loadKey, usedDays);
    let scheduled = 0;
    for (let hour = 0; hour < load.hoursPerWeek; hour += 1) {
      const candidates = slots.filter(
        (slot) => {
          const slotKey = `${slot.day}:${slot.id}`;
          return (
            !teacherSlots.has(slotKey) &&
            !yearLevelSlots.has(slotKey) &&
            !subjectSlots.has(slotKey)
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
        return scoreSlot(a, b, load, teacherSlots, dailyHours, lastSubjectSlot);
      });
      const selected = candidates[0];
      const slotKey = `${selected.day}:${selected.id}`;
      teacherSlots.add(slotKey);
      yearLevelSlots.add(slotKey);
      subjectSlots.add(slotKey);
      usedDays.add(selected.day);
      dailyHours.set(
        `${teacherKey}:${selected.day}`,
        (dailyHours.get(`${teacherKey}:${selected.day}`) ?? 0) + 1,
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

  const requiredHours = loads.reduce((sum, load) => sum + load.hoursPerWeek, 0);
  const scheduledHours = entries.length;
  const unscheduledLoads = loads
    .map((load) => ({
      ...load,
      scheduledHours:
        scheduledByLoad.get(
          `${normalizeTeacher(load.teacherName)}\u0000${normalizeValue(load.schoolLevel)}\u0000${normalizeValue(load.yearLevel)}\u0000${normalizeValue(load.section)}\u0000${normalizeValue(load.subject)}`,
        ) ?? 0,
    }))
    .filter((load) => load.scheduledHours < load.hoursPerWeek);
  const conflicts = countScheduleConflicts(entries);
  const teacherSummaries = [...teacherNames.entries()].map(
    ([teacherKey, teacherName]) => ({
      teacherName,
      requiredHours: requiredByTeacher.get(teacherKey) ?? 0,
      scheduledHours: entries.filter(
        (entry) => normalizeTeacher(entry.teacherName) === teacherKey,
      ).length,
      subjects: subjectsByTeacher.get(teacherKey) ?? [],
    }),
  );
  const quality =
    requiredHours === 0
      ? 0
      : Math.round((scheduledHours / requiredHours) * 100);
  return {
    entries,
    requiredHours,
    scheduledHours,
    unscheduledLoads,
    conflicts,
    quality,
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
    teacher: new Set<string>(),
    yearLevel: new Set<string>(),
    subject: new Set<string>(),
  };
  let conflicts = 0;
  for (const entry of entries) {
    const timeKey = `${entry.day}\u0000${entry.startTime}`;
    const keys = [
      [occupied.teacher, `${normalizeTeacher(entry.teacherName)}\u0000${timeKey}`],
      [
        occupied.yearLevel,
        `${normalizeValue(entry.schoolLevel)}\u0000${normalizeValue(entry.yearLevel)}\u0000${normalizeValue(entry.section)}\u0000${timeKey}`,
      ],
      [occupied.subject, `${normalizeValue(entry.subject)}\u0000${timeKey}`],
    ] as const;
    for (const [set, key] of keys) {
      if (set.has(key)) conflicts += 1;
      set.add(key);
    }
  }
  return conflicts;
}

function scoreSlot(
  a: Slot,
  b: Slot,
  load: TeachingLoad,
  teacherSlots: Set<string>,
  dailyHours: Map<string, number>,
  lastSubjectSlot: Map<string, string>,
) {
  return (
    slotScore(a, load, teacherSlots, dailyHours, lastSubjectSlot) -
    slotScore(b, load, teacherSlots, dailyHours, lastSubjectSlot)
  );
}

function slotScore(
  slot: Slot,
  load: TeachingLoad,
  teacherSlots: Set<string>,
  dailyHours: Map<string, number>,
  lastSubjectSlot: Map<string, string>,
) {
  const dayKey = `${normalizeTeacher(load.teacherName)}:${slot.day}`;
  const adjacentPenalty =
    lastSubjectSlot.get(dayKey) === String(slot.index - 1) ? 6 : 0;
  const dayLoad = dailyHours.get(dayKey) ?? 0;
  const slotLoad = teacherSlots.has(`${slot.day}:${slot.id}`) ? 1000 : 0;
  return dayLoad * 10 + adjacentPenalty + slotLoad;
}
