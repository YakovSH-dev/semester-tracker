import { v4 as uuidv4 } from "uuid";
import {
  Course,
  ScheduleEntry,
  ScheduleOption,
  SessionTemplate,
  SessionInstance,
} from "../src/features/types/modelTypes";
import { IdType } from "../src/features/types/generalTypes";
import rawCourses from "../filtered_courses.json";

type RawCourse = {
  general: Record<string, string>;
  schedule: Record<string, string>[];
};

function parseDayOfWeek(day: string): number {
  const map: Record<string, number> = {
    ראשון: 0,
    שני: 1,
    שלישי: 2,
    רביעי: 3,
    חמישי: 4,
    שישי: 5,
    שבת: 6,
  };
  return map[day.trim()] ?? -1;
}

function parseTimeRange(range: string): {
  startTime: string;
  endTime: string;
  duration: number;
} {
  const [start, end] = range.split("-").map((s) => s.trim());
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const duration = (eh * 60 + em - sh * 60 - sm) / 60;
  return {
    startTime: `${sh.toString().padStart(2, "0")}:${sm
      .toString()
      .padStart(2, "0")}`,
    endTime: `${eh.toString().padStart(2, "0")}:${em
      .toString()
      .padStart(2, "0")}`,
    duration,
  };
}

export function parseCourse(raw: RawCourse): {
  course: Course;
  sessionTemplates: SessionTemplate[];
  scheduleOptions: ScheduleOption[];
  scheduleEntries: ScheduleEntry[];
  sessionInstances: SessionInstance[]; // still empty
} {
  const courseId: IdType = raw.general.id || uuidv4();

  const templates = new Map<string, SessionTemplate>();
  const scheduleOptions: ScheduleOption[] = [];
  const scheduleEntries: ScheduleEntry[] = [];

  for (const sched of raw.schedule) {
    const type = sched["סוג"].trim().toUpperCase();
    const instructor = sched["מרצה/מתרגל"];
    const templateKey = type;

    let template = templates.get(templateKey);
    if (!template) {
      const templateId = uuidv4();
      template = {
        id: templateId,
        type,
        weeklyHoursNum: 0,
        selectedOptionId: null,
        courseId,
        scheduleOptionIds: [],
        sessionInstanceIds: [],
      };
      templates.set(templateKey, template);
    }

    const optionId = uuidv4();
    const { startTime, endTime, duration } = parseTimeRange(sched["שעה"]);
    const entryId = uuidv4();

    scheduleEntries.push({
      id: entryId,
      startTime,
      endTime,
      durationInHours: duration,
      dayOfWeek: parseDayOfWeek(sched["יום"]),
      scheduleOptionId: optionId,
    });

    scheduleOptions.push({
      id: optionId,
      instructor,
      isSelected: false,
      sessionTemplateId: template.id,
      scheduleEntryIds: [entryId],
    });

    template.scheduleOptionIds.push(optionId);
    template.weeklyHoursNum += duration;
  }

  const course: Course = {
    id: courseId,
    name: raw.general["שם מקצוע"],
    faculty: raw.general["פקולטה"],
    points: parseFloat(raw.general["נקודות"] ?? "0"),
    color: undefined,
    sessionTemplatedIds: Array.from(templates.values()).map((t) => t.id),
  };

  return {
    course,
    sessionTemplates: Array.from(templates.values()),
    scheduleOptions,
    scheduleEntries,
    sessionInstances: [],
  };
}

const parsed = parseCourse(rawCourses[0]);

console.log("Course:", parsed.course);
console.log("Templates:", parsed.sessionTemplates);
console.log("Options:", parsed.scheduleOptions);
console.log("Entries:", parsed.scheduleEntries);
