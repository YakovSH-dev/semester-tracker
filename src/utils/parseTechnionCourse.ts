import { v4 as uuidv4 } from "uuid";
import type {
  Course,
  ScheduleEntry,
  ScheduleOption,
  SessionTemplate,
  SessionInstance,
} from "../features/types/modelTypes";
import type { IdType, RawTechnionCourse } from "../features/types/generalTypes";
import { getRandomHexColor } from "./misc";

import { SEMESTER_START_DATE, SEMESTER_END_DATE } from "../tempGlobalData";
import { addWeeks, isBefore, startOfWeek, format } from "date-fns";

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

function generateInstances(
  templateId: IdType,
  weeklyHoursNum: number,
  startDateStr: string,
  endDateStr: string
): SessionInstance[] {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  let curDate = startOfWeek(startDate);
  const instances: SessionInstance[] = [];
  while (isBefore(curDate, endDate)) {
    for (let i = 0; i < weeklyHoursNum; i++) {
      const id = uuidv4();
      instances.push({
        id: id,
        hourIndex: i,
        weekStartDate: format(curDate, "yyyy-MM-dd"),
        isCompleted: false,
        resources: [],
        sessionTemplateId: templateId,
      });
    }
    curDate = addWeeks(curDate, 1);
  }
  return instances;
}

export default function parseCourse(raw: RawTechnionCourse): {
  course: Course;
  sessionTemplates: SessionTemplate[];
  scheduleOptions: ScheduleOption[];
  scheduleEntries: ScheduleEntry[];
  sessionInstances: SessionInstance[];
} {
  const courseId: IdType = raw.general?.["מספר מקצוע"] || uuidv4();

  const templates = new Map<string, SessionTemplate>();
  const optionsWithDur = new Map<
    string,
    ScheduleOption & { weeklyDuration: number }
  >();
  const scheduleEntries: ScheduleEntry[] = [];

  if (raw.schedule)
    for (const sched of raw.schedule) {
      const type = sched["סוג"]?.trim().toUpperCase() ?? "סוג";
      const instructor = sched["מרצה/מתרגל"] ?? "מרצה/מתרגל";
      const group = sched["קבוצה"] ?? -1;
      const timeRange = sched["שעה"] ?? "08:00-09:00";
      const dayOfWeek = sched["יום"] ?? "שבת";
      const templateKey = type;
      const optionKey = `${group}-${templateKey}`;

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

      let option = optionsWithDur.get(optionKey);
      if (!option) {
        const optionId = uuidv4();
        const templateId = templates.get(type)?.id;
        option = {
          id: optionId,
          instructor,
          isSelected: false,
          sessionTemplateId: templateId || "",
          scheduleEntryIds: [],
          weeklyDuration: 0,
        };
        optionsWithDur.set(optionKey, option);
        template.scheduleOptionIds.push(option.id);
      }

      const { startTime, endTime, duration } = parseTimeRange(timeRange);
      const entryId = uuidv4();
      const templateId = templates.get(type)?.id;
      scheduleEntries.push({
        id: entryId,
        startTime,
        endTime,
        durationInHours: duration,
        dayOfWeek: parseDayOfWeek(dayOfWeek),
        scheduleOptionId: option.id,
        sessionTemplateId: templateId || null,
      });

      option.scheduleEntryIds.push(entryId);
      option.weeklyDuration += duration;

      template.weeklyHoursNum = option.weeklyDuration;
    }

  const course: Course = {
    id: courseId,
    name: raw.general?.["שם מקצוע"] ?? "קורס",
    faculty: raw.general?.["פקולטה"] ?? "נחשבת",
    points: parseFloat(raw.general?.["נקודות"] ?? "0"),
    color: getRandomHexColor(),
    resources: [],
    sessionTemplatedIds: Array.from(templates.values()).map((t) => t.id),
  };
  const sessionInstances: SessionInstance[] = [];
  const sessionTemplates = Array.from(templates.values());
  if (templates) {
    for (const template of sessionTemplates) {
      if (!template) continue;
      sessionInstances.push(
        ...generateInstances(
          template.id,
          template.weeklyHoursNum,
          SEMESTER_START_DATE,
          SEMESTER_END_DATE
        )
      );
      template.sessionInstanceIds = sessionInstances.map((i) => i.id);
    }
  }

  return {
    course,
    sessionTemplates: sessionTemplates,
    scheduleOptions: Array.from(optionsWithDur.values()).map(
      ({ weeklyDuration: _, ...option }) => option
    ),
    scheduleEntries,
    sessionInstances,
  };
}
