import { v4 as uuidv4 } from "uuid";
import type {
  Course,
  ScheduleEntry,
  ScheduleOption,
  SessionTemplate,
  SessionInstance,
  WeeklyContent,
} from "../features/types/modelTypes";
import type { IdType, RawTechnionCourse } from "../features/types/generalTypes";
import { getRandomHexColor } from "./misc";

import {
  SEMESTER_END_DATE,
  SEMESTER_START_DATE,
  SEMESTER_WEEK_NUM,
} from "../tempGlobalData";
import { addWeeks, startOfWeek, isBefore } from "date-fns";

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
  startDateStr: string
): SessionInstance[] {
  const startDate = new Date(startDateStr);
  let curDate = startOfWeek(startDate);
  const instances: SessionInstance[] = [];
  for (let i = 0; i < SEMESTER_WEEK_NUM; i++) {
    for (let i = 0; i < weeklyHoursNum; i++) {
      const id = uuidv4();
      instances.push({
        id: id,
        hourIndex: i,
        weekStartDate: curDate.toISOString(),
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
  weeklyContents: WeeklyContent[];
} {
  const courseId: IdType = raw.general?.["מספר מקצוע"] || uuidv4();

  const templates = new Map<string, SessionTemplate>();
  const optionsWithDur = new Map<
    string,
    ScheduleOption & { weeklyDuration: number }
  >();
  const scheduleEntries: ScheduleEntry[] = [];
  const weeklyContents: WeeklyContent[] = [];

  if (!raw.schedule) {
    throw "No schedule data for this course";
  }
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
      for (let i = 0; i < SEMESTER_WEEK_NUM; i++) {
        template = {
          id: templateId,
          type,
          weeklyHoursNum: 0,
          selectedOptionId: null,
          courseId,
          scheduleOptionIds: [],
          sessionInstanceIds: [],
          weeklyContentIds: [],
        };
        templates.set(templateKey, template);
      }
    }

    let option = optionsWithDur.get(optionKey);

    if (!option) {
      const optionId = uuidv4();
      const templateId = templates.get(type)?.id;
      if (!templateId) {
        console.error("Error: templateId not found in map");
        throw new Error("ERROR");
      }
      option = {
        id: optionId,
        instructor,
        isSelected: false,
        sessionTemplateId: templateId || "",
        scheduleEntryIds: [],
        weeklyDuration: 0,
      };
      optionsWithDur.set(optionKey, option);
      template!.scheduleOptionIds.push(option.id);
    }

    const { startTime, endTime, duration } = parseTimeRange(timeRange);
    let startWeek = startOfWeek(new Date(SEMESTER_START_DATE));

    const entryIds = [];
    for (let i = 0; i < SEMESTER_WEEK_NUM; i++) {
      const entryId = uuidv4();
      const curWeek = addWeeks(startWeek, i);
      const templateId = templates.get(type)!.id;

      scheduleEntries.push({
        id: entryId,
        week: curWeek.toISOString(),
        startTime,
        endTime,
        durationInHours: duration,
        dayOfWeek: parseDayOfWeek(dayOfWeek),
        scheduleOptionId: option.id,
        sessionTemplateId: templateId,
        sessionInstanceIds: [],
      });

      entryIds.push(entryId);
    }

    option.scheduleEntryIds.push(...entryIds);
    option.weeklyDuration += duration;

    template!.weeklyHoursNum = option.weeklyDuration;
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
  const scheduleOptions = Array.from(optionsWithDur.values());

  if (templates) {
    for (const template of sessionTemplates) {
      if (!template) continue;
      // Make instances
      const instancesForTemplate = generateInstances(
        template.id,
        template.weeklyHoursNum,
        SEMESTER_START_DATE
      ).sort((a, b) => {
        return a.weekStartDate === b.weekStartDate
          ? a.hourIndex - b.hourIndex
          : isBefore(new Date(b.weekStartDate), new Date(a.weekStartDate))
          ? -1
          : 1;
      });

      sessionInstances.push(...instancesForTemplate);

      // Assign instances to entries
      const optionsForTemplate = scheduleOptions.filter(
        (o) => o.sessionTemplateId === template.id
      );

      for (const option of optionsForTemplate) {
        const entriesForOption = scheduleEntries.filter(
          (e) => e.scheduleOptionId === option.id
        );

        let instIds = sessionInstances.map((i) => i.id);

        for (const entry of entriesForOption) {
          for (let i = 0; i < entry.durationInHours; i++) {
            entry.sessionInstanceIds.push(instIds.pop() ?? " ");
          }
        }
      }

      // Assign instances to template
      template.sessionInstanceIds = sessionInstances.map((i) => i.id);

      // Initialize weekly content for template
      let curWeek = startOfWeek(new Date(SEMESTER_START_DATE));
      const endWeek = startOfWeek(new Date(SEMESTER_END_DATE));
      while (isBefore(curWeek, endWeek)) {
        const weeklyContentId = uuidv4();
        const weeklyContent: WeeklyContent = {
          id: weeklyContentId,
          sessionTemplateId: template.id,
          week: curWeek.toISOString(),
          resources: [],
          aiQuizes: [],
          summary: null,
        };
        weeklyContents.push(weeklyContent);

        // Assign weekly content to template
        template.weeklyContentIds.push(weeklyContentId);
        curWeek = addWeeks(curWeek, 1);
      }
    }
  }

  return {
    course,
    sessionTemplates: sessionTemplates,
    scheduleOptions: scheduleOptions,
    scheduleEntries,
    sessionInstances,
    weeklyContents: weeklyContents,
  };
}

/*
type courseInfo = {
  "מספר מקצוע": number;
  "שם מקצוע": string;
  נקודות: number;
};

type ScheduleItem = {
  קבוצה: number;
  סוג: string;
  יום: string;
  שעה: string; //"HH:MM - HH:MM"
  בניין: string;
  חדר: number;
  "מרצה/מתרגל": string;
  "מס.": number;
};

export default function parseCourse(raw: {
  general: courseInfo;
  schedule: ScheduleItem[];
}): {
  course: Course;
  sessionTemplates: SessionTemplate[];
  scheduleOptions: ScheduleOption[];
  scheduleEntries: ScheduleEntry[];
  sessionInstances: SessionInstance[];
} {
  const scheduleItems = raw.schedule;

  const sessionTemplates: SessionTemplate[] = Object.entries(
    Object.groupBy(scheduleItems, (item) => item["סוג"])
  ).map((raw_t) => {
    const weeklyHoursNum = Object.values(
      Object.groupBy(raw_t[1]!, (o) => o["קבוצה"])
    )[0]?.reduce((sum, cur) => {
      return sum + parseTimeRange(cur["שעה"]).duration;
    }, 0);

    return {
      id: uuidv4(),
      type: raw_t[0],
      weeklyHoursNum: weeklyHoursNum,
    };
  });

  return;
}
*/
