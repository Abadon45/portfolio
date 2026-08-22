"use client";

import { useMemo, useRef, useState } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { useTwcAlert } from "../../../components/portfolio/TwcAlertSystem";
import {
  schoolLevelForYear,
  schoolLevels,
  firstYearLevelForSchoolLevel,
  subjectsForYearLevel,
  titleCaseSubject,
  yearLevels,
  type SchoolLevel,
} from "../../../../lib/k12Subjects";
import {
  generateTeacherSchedule,
  type ScheduleGeneration,
  type ScheduleSlot,
  type SchoolPeriod,
  type TeachingLoad,
} from "../../../../lib/scheduleEngine";

const defaultDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

type LoadDraft = TeachingLoad & { id: string };

export default function ScheduleGeneratorClient() {
  const { toastError, toastSuccess } = useTwcAlert();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loads, setLoads] = useState<LoadDraft[]>([]);
  const [teacherName, setTeacherName] = useState("");
  const [schoolLevel, setSchoolLevel] = useState<SchoolLevel>("JHS");
  const [yearLevel, setYearLevel] = useState("Grade 7");
  const [section, setSection] = useState("");
  const [subject, setSubject] = useState("");
  const [hours, setHours] = useState("1");
  const [daysPerWeek, setDaysPerWeek] = useState("5");
  const [days, setDays] = useState(defaultDays);
  const [periodMinutes, setPeriodMinutes] = useState("60");
  const [startTime, setStartTime] = useState("07:30");
  const [endTime, setEndTime] = useState("16:30");
  const [generation, setGeneration] = useState<ScheduleGeneration | null>(null);
  const [saving, setSaving] = useState(false);
  const [importErrors, setImportErrors] = useState<string[]>([]);

  const periods = useMemo(
    () => buildPeriods(startTime, endTime, Number(periodMinutes)),
    [endTime, periodMinutes, startTime],
  );
  const totalHours = loads.reduce((sum, load) => sum + load.hoursPerWeek, 0);

  function addLoad() {
    const parsedHours = Number(hours);
    const parsedDays = Number(daysPerWeek);
    if (
      !teacherName.trim() ||
      !schoolLevel ||
      !yearLevel.trim() ||
      !section.trim() ||
      !titleCaseSubject(subject) ||
      !Number.isInteger(parsedHours) ||
      parsedHours < 1 ||
      parsedHours > 60 ||
      !Number.isInteger(parsedDays) ||
      parsedDays < 1 ||
      parsedDays > days.length
    ) {
      toastError("Enter the teacher, school level, year level, section, subject, hours, and a valid number of days.");
      return;
    }
    const existing = loads.find(
      (load) =>
        load.teacherName.toLowerCase() === teacherName.trim().toLowerCase() &&
        load.schoolLevel.toLowerCase() === schoolLevel.toLowerCase() &&
        load.yearLevel.toLowerCase() === yearLevel.toLowerCase() &&
        load.section.toLowerCase() === section.trim().toLowerCase() &&
        load.subject.toLowerCase() === subject.trim().toLowerCase(),
    );
    if (existing) {
      setLoads((current) =>
        current.map((load) =>
          load.id === existing.id
            ? {
                ...load,
                hoursPerWeek: load.hoursPerWeek + parsedHours,
                daysPerWeek: Math.max(load.daysPerWeek, parsedDays),
              }
            : load,
        ),
      );
    } else {
      setLoads((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          teacherName: teacherName.trim(),
          schoolLevel,
          yearLevel,
          section: section.trim(),
          subject: titleCaseSubject(subject),
          hoursPerWeek: parsedHours,
          daysPerWeek: parsedDays,
        },
      ]);
    }
    setSubject("");
    setSection("");
    setHours("1");
  }

  function removeLoad(id: string) {
    setLoads((current) => current.filter((load) => load.id !== id));
    setGeneration(null);
  }

  async function importFile(file: File) {
    const formData = new FormData();
    formData.set("file", file);
    try {
      const response = await fetch("/api/teacher/schedule-generator/parse", {
        body: formData,
        method: "POST",
      });
      const data = (await response.json()) as {
        loads?: TeachingLoad[];
        errors?: string[];
        message?: string;
      };
      if (!response.ok)
        throw new Error(data.message ?? "Unable to import teaching loads.");
      setImportErrors(data.errors ?? []);
      setLoads(
        (data.loads ?? []).map((load) => ({
          ...load,
          id: crypto.randomUUID(),
        })),
      );
      setGeneration(null);
      toastSuccess(
        `${data.loads?.length ?? 0} teaching loads imported for review.`,
      );
    } catch (error) {
      toastError(
        error instanceof Error ? error.message : "Unable to import file.",
      );
    }
  }

  function generate() {
    if (!loads.length) {
      toastError("Add or import at least one teaching load first.");
      return;
    }
    if (!days.length || !periods.length) {
      toastError("Configure at least one school day and one valid period.");
      return;
    }
    setGeneration(generateTeacherSchedule({ days, loads, periods }));
  }

  async function saveSchedule() {
    if (!generation) return;
    setSaving(true);
    try {
      const response = await fetch("/api/teacher/schedules", {
        body: JSON.stringify({
          academicPeriod: "Generated draft",
          entries: generation.entries.map((entry) => ({
            ...entry,
            section: entry.section || null,
            room: null,
            notes: null,
          })),
          name: `Generated schedule · ${new Date().toLocaleDateString()}`,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const data = (await response.json()) as { message?: string };
      if (!response.ok)
        throw new Error(data.message ?? "Unable to save schedule.");
      toastSuccess("Generated schedule saved to your Teacher's Lounge.");
    } catch (error) {
      toastError(
        error instanceof Error ? error.message : "Unable to save schedule.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography
          color="primary.main"
          sx={{ fontWeight: 800, letterSpacing: "0.08em" }}
          variant="overline"
        >
          TEACHER&apos;S LOUNGE
        </Typography>
        <Typography component="h1" sx={{ fontWeight: 850 }} variant="h3">
          Schedule Creator
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 760 }}>
          Add every subject assigned to each teacher. The generator combines a
          teacher's subjects and reserves one period per teacher, so their
          assignments cannot overlap.
        </Typography>
      </Box>
      <Card variant="outlined">
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack spacing={2.5}>
            <Box>
              <Typography sx={{ fontWeight: 800 }} variant="h6">
                Build teaching loads
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Add one assignment for each teacher, section, subject, and weekly meeting pattern.
              </Typography>
            </Box>
            <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.65fr) minmax(280px, 0.85fr)" } }}>
              <Stack spacing={1.5}>
                <Typography color="primary.main" sx={{ fontWeight: 800, letterSpacing: "0.06em" }} variant="overline">MANUAL ENTRY</Typography>
                <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" } }}>
                  <TextField label="Teacher name" onChange={(event) => setTeacherName(event.target.value)} value={teacherName} />
                  <FormControl>
                    <InputLabel id="school-level-label">School level</InputLabel>
                    <Select label="School level" labelId="school-level-label" onChange={(event) => { const level = event.target.value as SchoolLevel; setSchoolLevel(level); setYearLevel(firstYearLevelForSchoolLevel(level)); setSubject(""); }} value={schoolLevel}>
                      {schoolLevels.map((level) => <MenuItem key={level} value={level}>{level}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <InputLabel id="year-level-label">Year level</InputLabel>
                    <Select label="Year level" labelId="year-level-label" onChange={(event) => { const level = event.target.value; setYearLevel(level); setSchoolLevel(schoolLevelForYear(level)); setSubject(""); }} value={yearLevel}>
                      {yearLevels.map((level) => <MenuItem key={level} value={level}>{level}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <TextField label="Section" onChange={(event) => setSection(event.target.value)} placeholder="e.g. Rizal" value={section} />
                  <Autocomplete freeSolo options={subjectsForYearLevel(yearLevel)} value={subject} onChange={(_, value) => setSubject(titleCaseSubject(value ?? ""))} onInputChange={(_, value) => setSubject(titleCaseSubject(value))} renderInput={(params) => <TextField {...params} label="Subject" placeholder="Choose or type a subject" />} />
                  <TextField label="Hours / week" onChange={(event) => setHours(event.target.value)} type="number" value={hours} />
                  <TextField helperText={`1–${days.length} selected school days`} label="Days / week" onChange={(event) => setDaysPerWeek(event.target.value)} type="number" value={daysPerWeek} />
                </Box>
                <Button onClick={addLoad} startIcon={<AddRoundedIcon />} sx={{ alignSelf: "flex-start" }} variant="outlined">Add teaching load</Button>
              </Stack>
              <Stack spacing={1.5} sx={{ bgcolor: "action.hover", border: 1, borderColor: "divider", borderRadius: 1.5, p: 2 }}>
                <Typography color="primary.main" sx={{ fontWeight: 800, letterSpacing: "0.06em" }} variant="overline">IMPORT</Typography>
                <Typography sx={{ fontWeight: 800 }} variant="subtitle1">Import a prepared load sheet</Typography>
                <Typography color="text.secondary" variant="body2">Columns: Teacher Name, School Level, Year Level, Section, Subject, Hours Per Week, Days Per Week.</Typography>
                <Button component="label" startIcon={<CloudUploadRoundedIcon />} variant="contained">Choose CSV / Excel<input accept=".csv,.xlsx,.xls" hidden onChange={(event) => { const file = event.target.files?.[0]; if (file) void importFile(file); event.target.value = ""; }} ref={fileRef} type="file" /></Button>
                <Button component="a" download="teaching-load-template.csv" href={`data:text/csv;charset=utf-8,Teacher%20Name%2CSchool%20Level%2CYear%20Level%2CSection%2CSubject%2CHours%20Per%20Week%2CDays%20Per%20Week%0AMaria%20Santos%2CJHS%2CGrade%207%2CRizal%2CMathematics%2C5%2C5%0AMaria%20Santos%2CJHS%2CGrade%207%2CRizal%2CEnglish%2C4%2C4`} startIcon={<DownloadRoundedIcon />} variant="text">Download template</Button>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
      {!!importErrors.length && (
        <Alert severity="warning">
          {importErrors.map((error) => (
            <div key={error}>{error}</div>
          ))}
        </Alert>
      )}
      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              sx={{ justifyContent: "space-between" }}
            >
              <Box>
                <Typography sx={{ fontWeight: 800 }} variant="h6">
                  Teaching loads
                </Typography>
                <Typography color="text.secondary" variant="body2">
                Review before generation · {totalHours} required hours across teachers
                </Typography>
              </Box>
              <Chip label={`${loads.length} assignments`} size="small" />
            </Stack>
            {!loads.length ? (
              <Typography color="text.secondary">
                No teaching loads yet. Add them manually or import a file.
              </Typography>
            ) : (
              <Stack divider={<Divider />}>
                {loads.map((load) => (
                  <Stack
                    key={load.id}
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    sx={{ alignItems: { sm: "center" }, py: 1.25 }}
                  >
                    <Typography sx={{ flex: 1, fontWeight: 700 }}>
                      {load.teacherName}
                    </Typography>
                    <Typography sx={{ flex: 1 }}>{load.schoolLevel}</Typography>
                    <Typography sx={{ flex: 1 }}>{load.yearLevel}</Typography>
                    <Typography sx={{ flex: 1 }}>{load.section}</Typography>
                    <Typography sx={{ flex: 1 }}>{load.subject}</Typography>
                    <Typography color="text.secondary">
                      {load.daysPerWeek} days · {load.hoursPerWeek} hrs
                    </Typography>
                    <Button
                      color="error"
                      onClick={() => removeLoad(load.id)}
                      size="small"
                    >
                      Remove
                    </Button>
                  </Stack>
                ))}
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>
      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2}>
            <Typography sx={{ fontWeight: 800 }} variant="h6">
              School schedule configuration
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              {defaultDays.map((day) => (
                <Button
                  key={day}
                  onClick={() =>
                    setDays((current) =>
                      current.includes(day)
                        ? current.filter((item) => item !== day)
                        : [...current, day],
                    )
                  }
                  size="small"
                  variant={days.includes(day) ? "contained" : "outlined"}
                >
                  {day}
                </Button>
              ))}
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="School start"
                onChange={(event) => setStartTime(event.target.value)}
                type="time"
                value={startTime}
              />
              <TextField
                fullWidth
                label="School end"
                onChange={(event) => setEndTime(event.target.value)}
                type="time"
                value={endTime}
              />
              <FormControl fullWidth>
                <InputLabel id="period-length-label">Period length</InputLabel>
                <Select
                  label="Period length"
                  labelId="period-length-label"
                  onChange={(event) => setPeriodMinutes(event.target.value)}
                  value={periodMinutes}
                >
                  <MenuItem value="45">45 minutes</MenuItem>
                  <MenuItem value="50">50 minutes</MenuItem>
                  <MenuItem value="60">60 minutes</MenuItem>
                  <MenuItem value="90">90 minutes</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <Typography color="text.secondary" variant="body2">
              {periods.length} teaching periods per selected day. Breaks and
              unavailable periods are planned for the next configuration
              iteration.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
      <Button
        disabled={!loads.length}
        onClick={generate}
        startIcon={<AutoAwesomeRoundedIcon />}
        sx={{ alignSelf: "flex-start" }}
        variant="contained"
      >
        Generate Schedule
      </Button>
      {generation && (
        <GeneratedResult
          generation={generation}
          onSave={saveSchedule}
          saving={saving}
        />
      )}
    </Stack>
  );
}

function GeneratedResult({
  generation,
  onSave,
  saving,
}: {
  generation: ScheduleGeneration;
  onSave: () => void;
  saving: boolean;
}) {
  const [teacherFilter, setTeacherFilter] = useState("all");
  const teachers = [
    ...new Set(generation.entries.map((entry) => entry.teacherName)),
  ];
  const visibleEntries = generation.entries
    .filter(
    (entry) => teacherFilter === "all" || entry.teacherName === teacherFilter,
    )
    .sort(compareScheduleSlots);
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            sx={{ justifyContent: "space-between" }}
          >
            <Box>
              <Typography sx={{ fontWeight: 800 }} variant="h6">
                Generated schedule
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Each teacher is scheduled as one combined workload across all of
                their subjects. A teacher can never occupy two subjects in the
                same period.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Chip
                color={
                  generation.unscheduledLoads.length ? "warning" : "success"
                }
                label={`${generation.scheduledHours}/${generation.requiredHours} hours`}
                size="small"
              />
              <Chip label={`${generation.quality}% capacity`} size="small" />
              <Chip
                color={generation.conflicts ? "error" : "success"}
                label={generation.conflicts + " teacher conflicts"}
                size="small"
              />
            </Stack>
          </Stack>
          <Box
            sx={{
              display: "grid",
              gap: 1,
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, minmax(0, 1fr))",
              },
            }}
          >
            {generation.teacherSummaries.map((teacher) => (
              <Card key={teacher.teacherName} variant="outlined">
                <CardContent sx={{ p: 1.75 }}>
                  <Typography sx={{ fontWeight: 800 }}>
                    {teacher.teacherName}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {teacher.scheduledHours}/{teacher.requiredHours} hours placed
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ mt: 0.75 }}
                    variant="caption"
                  >
                    {teacher.subjects
                      .map(
                        (subject) =>
                          subject.subject + " (" + subject.requiredHours + "h)",
                      )
                      .join(" · ")}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
          {generation.conflicts > 0 && (
            <Alert severity="error">
              The generated result contains teacher overlaps. Review the
              configuration before saving this schedule.
            </Alert>
          )}
          {generation.unscheduledLoads.length > 0 && (
            <Alert severity="warning">
              Some hours could not be placed. Review the workload and available
              periods, then generate again.
            </Alert>
          )}
          <FormControl fullWidth size="small">
            <InputLabel id="teacher-filter-label">Teacher</InputLabel>
            <Select
              label="Teacher"
              labelId="teacher-filter-label"
              onChange={(event) => setTeacherFilter(event.target.value)}
              value={teacherFilter}
            >
              <MenuItem value="all">All teachers</MenuItem>
              {teachers.map((teacher) => (
                <MenuItem key={teacher} value={teacher}>
                  {teacher}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box
            sx={{
              display: "grid",
              gap: 1,
              gridTemplateColumns: {
                xs: "1fr",
                sm: `repeat(${Math.min(5, Math.max(1, new Set(visibleEntries.map((entry) => entry.day)).size))}, minmax(0, 1fr))`,
              },
            }}
          >
            {visibleEntries.map((entry) => (
              <Card
                key={`${entry.teacherName}-${entry.day}-${entry.startTime}-${entry.subject}`}
                variant="outlined"
              >
                <CardContent sx={{ p: 1.5 }}>
                  <Typography color="primary.main" variant="caption">
                    {entry.day} · {entry.startTime}–{entry.endTime}
                  </Typography>
                  <Typography color="text.secondary" variant="caption">
                    {entry.schoolLevel} · {entry.yearLevel} · {entry.section}
                  </Typography>
                  <Typography sx={{ fontWeight: 800 }}>
                    {entry.subject}
                  </Typography>
                  <Typography color="text.secondary" variant="caption">
                    {entry.teacherName}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Button
              disabled={saving}
              onClick={onSave}
              startIcon={<SaveRoundedIcon />}
              variant="contained"
            >
              {saving ? "Saving…" : "Save schedule"}
            </Button>
            <Button
              onClick={() => downloadCsv(generation.entries)}
              startIcon={<DownloadRoundedIcon />}
              variant="outlined"
            >
              Export CSV
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function buildPeriods(
  start: string,
  end: string,
  duration: number,
): SchoolPeriod[] {
  const startMinutes = toMinutes(start);
  const endMinutes = toMinutes(end);
  if (
    !duration ||
    startMinutes === null ||
    endMinutes === null ||
    endMinutes <= startMinutes
  )
    return [];
  const periods: SchoolPeriod[] = [];
  for (
    let current = startMinutes, index = 1;
    current + duration <= endMinutes;
    current += duration, index += 1
  )
    periods.push({
      id: `period-${index}`,
      label: `Period ${index}`,
      startTime: fromMinutes(current),
      endTime: fromMinutes(current + duration),
    });
  return periods;
}

const dayOrder = new Map(
  ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
    (day, index) => [day, index],
  ),
);

function compareScheduleSlots(a: ScheduleSlot, b: ScheduleSlot) {
  const dayDifference =
    (dayOrder.get(a.day) ?? Number.MAX_SAFE_INTEGER) -
    (dayOrder.get(b.day) ?? Number.MAX_SAFE_INTEGER);
  if (dayDifference) return dayDifference;
  return a.startTime.localeCompare(b.startTime) || a.teacherName.localeCompare(b.teacherName);
}

function toMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return Number.isFinite(hours) && Number.isFinite(minutes)
    ? hours * 60 + minutes
    : null;
}
function fromMinutes(value: number) {
  return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
}
function downloadCsv(entries: ScheduleSlot[]) {
  const csv = [
    "Teacher,School Level,Year Level,Section,Day,Start,End,Subject",
    ...entries.map((entry) =>
      [
        entry.teacherName,
        entry.schoolLevel,
        entry.yearLevel,
        entry.section,
        entry.day,
        entry.startTime,
        entry.endTime,
        entry.subject,
      ]
        .map((value) => `"${value.replaceAll('"', '""')}"`)
        .join(","),
    ),
  ].join("\n");
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "teacher-schedule.csv";
  link.click();
  URL.revokeObjectURL(url);
}
