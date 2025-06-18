import type { Model } from "./modelTypes";
import type { EntityState } from "@reduxjs/toolkit";

type ExtendedEntityState<T> = EntityState<T, IdType> & {
  loading: boolean;
  error?: string;
};
type IdType = string;

type ItemsState<T extends Model> = {
  byId: Record<string, T>;
  byAllIds: string[];
  loading: boolean;
  error?: string;
};

type RawTechnionCourse = {
  general: {
    "מספר מקצוע": string;
    "שם מקצוע": string;
    סילבוס: string;
    פקולטה: string;
    "מסגרת לימודים": string;
    "מקצועות קדם": string;
    נקודות: string;
    אחראים: string;
    הערות: string;
    "מועד ב": string;
    "בוחן מועד א": string;
  };
  schedule:
    | {
        קבוצה: number;
        סוג: string;
        יום: string;
        שעה: string;
        בניין: string;
        חדר: number;
        "מרצה/מתרגל": string;
        "מס.": number;
      }[];
};

type Resource = {
  url: string;
  title: string;
  type: string;
};

type AiQuizQuestion = {
  question: string;
  difficulty: "EASY" | "MEDIUM" | "HARD" | "VERY_HARD";
  possibleAnswers: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  correctAnswer: "a" | "b" | "c" | "d";
  explanation: string;
  selection: "a" | "b" | "c" | "d" | undefined;
};

type AiQuiz = {
  type: "quiz";
  questions: AiQuizQuestion[];
};

type AiSummary = {
  type: "summary";
  text: string;
};

type AiContent = AiSummary | AiQuiz[];

export type {
  IdType,
  ItemsState,
  ExtendedEntityState,
  RawTechnionCourse,
  AiQuiz,
  AiQuizQuestion,
  AiSummary,
  AiContent,
  Resource,
};
