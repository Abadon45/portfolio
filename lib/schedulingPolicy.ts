import type { TeachingLoad } from "./scheduleEngine";

export type PeriodDurationBounds = {
  minimumMinutes: number;
  maximumMinutes: number;
};

export function periodDurationBounds(
  schoolLevel: TeachingLoad["schoolLevel"],
): PeriodDurationBounds {
  return {
    minimumMinutes: 45,
    maximumMinutes: schoolLevel === "SHS" ? 150 : 60,
  };
}

export function isValidPeriodDuration(
  schoolLevel: TeachingLoad["schoolLevel"],
  durationMinutes: number,
) {
  const bounds = periodDurationBounds(schoolLevel);
  return (
    Number.isInteger(durationMinutes) &&
    durationMinutes >= bounds.minimumMinutes &&
    durationMinutes <= bounds.maximumMinutes &&
    durationMinutes % 5 === 0
  );
}

export function resolvePeriodDuration(
  schoolLevel: TeachingLoad["schoolLevel"],
  requestedMinutes: number | undefined,
  referenceMinutes = 60,
) {
  const bounds = periodDurationBounds(schoolLevel);
  const source = Number.isInteger(requestedMinutes)
    ? requestedMinutes!
    : referenceMinutes;
  const clamped = Math.min(
    bounds.maximumMinutes,
    Math.max(bounds.minimumMinutes, source),
  );
  return Math.round(clamped / 5) * 5;
}
