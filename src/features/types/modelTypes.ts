import type { IdType, Resource, AiQuiz, AiSummary } from "./generalTypes";

type Model =
  | Course
  | SessionTemplate
  | SessionInstance
  | ScheduleOption
  | ScheduleEntry
  | WeeklyContent;

type Course = {
  id: IdType;
  name: string;
  faculty?: string;
  points?: number;
  color?: string;
  resources: Resource[];
  sessionTemplatedIds: string[];
};

type SessionTemplate = {
  id: IdType;
  type: string; // e.g LECTURE/TUTORIAL/WORKSHOP ...
  weeklyHoursNum: number;
  selectedOptionId: string | null;

  courseId: string;
  scheduleOptionIds: string[];
  sessionInstanceIds: string[];
  weeklyContentIds: string[];
};

type SessionInstance = {
  id: IdType;
  hourIndex: number;
  weekStartDate: string; // yyyy-MM-dd
  isCompleted: boolean;
  resources: Resource[];
  sessionTemplateId: string | null;
};

type ScheduleOption = {
  id: IdType;
  instructor: string;
  isSelected: boolean;

  sessionTemplateId: string;
  scheduleEntryIds: string[];
};

type ScheduleEntry = {
  id: string;
  week: string; //  ISO 8601 (Date.toISOstring())
  dayOfWeek: number; // 0 - 6 (0 - Sunday)
  startTime: string; //HH:MM
  endTime: string; //HH:MM

  durationInHours: number;

  scheduleOptionId: IdType;
  sessionTemplateId: IdType;
  sessionInstanceIds: IdType[];
};

type WeeklyContent = {
  id: string;
  sessionTemplateId: IdType;
  week: string; //  ISO 8601 (Date.toISOstring())
  resources: Resource[];
  aiQuizes: AiQuiz[];
  summary: AiSummary | null;
};

type FullCourseData = {
  course: Course;
  sessionTemplates: SessionTemplate[];
  sessionInstances: SessionInstance[];
  scheduleOptions: ScheduleOption[];
  scheduleEntries: ScheduleEntry[];
};

export type {
  Course,
  SessionTemplate,
  SessionInstance,
  ScheduleOption,
  ScheduleEntry,
  WeeklyContent,
  Model,
  FullCourseData,
};
