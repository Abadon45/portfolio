import type {
  SchoolPeriod,
  TeachingLoad,
} from "../../lib/scheduleEngine";

export const jhs35TeacherDemo = {
  name: "JHS 35-teacher scheduling simulation",
  schoolLevel: "JHS" as const,
  schoolStartTime: "07:30",
  schoolEndTime: "16:30",
  referencePeriodMinutes: 60,
  days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  grades: ["Grade 7", "Grade 8", "Grade 9", "Grade 10"],
  sections: ["Rizal", "Bonifacio", "Mabini", "Luna"],
  teachers: Array.from(
    { length: 35 },
    (_, index) => `JHS Teacher ${String(index + 1).padStart(2, "0")}`,
  ),
  subjects: [
    { name: "English", durationMinutes: 50 },
    { name: "Filipino", durationMinutes: 45 },
    { name: "Mathematics", durationMinutes: 60 },
    { name: "Science", durationMinutes: 45 },
    { name: "Araling Panlipunan", durationMinutes: 50 },
    { name: "Edukasyon sa Pagpapakatao", durationMinutes: 45 },
    { name: "MAPEH", durationMinutes: 60 },
    {
      name: "Technology and Livelihood Education",
      durationMinutes: 60,
    },
  ],
  periodsPerSubject: 5,
  requestedDaysPerSubject: 5,
  expected: {
    teachers: 35,
    sections: 16,
    assignments: 128,
    requiredPeriods: 640,
    scheduledPeriods: 640,
    conflicts: 0,
    unscheduledLoads: 0,
    requiredCoverage: 100,
  },
};

export function createJhs35TeachingLoads(): TeachingLoad[] {
  const loads: TeachingLoad[] = [];
  let assignmentIndex = 0;

  for (const subject of jhs35TeacherDemo.subjects) {
    for (const grade of jhs35TeacherDemo.grades) {
      for (const section of jhs35TeacherDemo.sections) {
        loads.push({
          teacherName:
            jhs35TeacherDemo.teachers[
              assignmentIndex % jhs35TeacherDemo.teachers.length
            ],
          schoolLevel: jhs35TeacherDemo.schoolLevel,
          yearLevel: grade,
          section,
          subject: subject.name,
          periodsPerWeek: jhs35TeacherDemo.periodsPerSubject,
          periodDurationMinutes: subject.durationMinutes,
          daysPerWeek: jhs35TeacherDemo.requestedDaysPerSubject,
        });
        assignmentIndex += 1;
      }
    }
  }

  return loads;
}

export function createJhs35ReferencePeriods(): SchoolPeriod[] {
  const periods: SchoolPeriod[] = [];
  const startMinutes = toMinutes(jhs35TeacherDemo.schoolStartTime);
  const endMinutes = toMinutes(jhs35TeacherDemo.schoolEndTime);

  for (
    let current = startMinutes;
    current + jhs35TeacherDemo.referencePeriodMinutes <= endMinutes;
    current += jhs35TeacherDemo.referencePeriodMinutes
  ) {
    const index = periods.length + 1;
    periods.push({
      id: `period-${index}`,
      label: `Period ${index}`,
      startTime: fromMinutes(current),
      endTime: fromMinutes(
        current + jhs35TeacherDemo.referencePeriodMinutes,
      ),
    });
  }

  return periods;
}

function toMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function fromMinutes(value: number) {
  return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
}
