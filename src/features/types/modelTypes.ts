import type { IdType, Link } from "./generalTypes";

type Model =
  | Course
  | SessionTemplate
  | SessionInstance
  | ScheduleOption
  | ScheduleEntry;

type Course = {
  id: IdType;
  name: string;
  faculty?: string;
  points?: number;
  color?: string;
  resources: Link[];
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
};

type SessionInstance = {
  id: IdType;
  hourIndex: number;
  weekStartDate: string; // yyyy-MM-dd
  isCompleted: boolean;
  resources: Link[];
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
  startTime: string; //HH:MM
  endTime: string; //HH:MM
  durationInHours: number;
  dayOfWeek: number; // 0 - 6 (0 - Sunday)

  scheduleOptionId: IdType;
  sessionTemplateId: IdType | null;
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
  Model,
  FullCourseData,
};
