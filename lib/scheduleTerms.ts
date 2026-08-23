export const scheduleTerms = [
  "Full School Year",
  "Term 1",
  "Term 2",
  "Term 3",
] as const;

export type ScheduleTerm = (typeof scheduleTerms)[number];

export function isScheduleTerm(value: string): value is ScheduleTerm {
  return scheduleTerms.includes(value as ScheduleTerm);
}
