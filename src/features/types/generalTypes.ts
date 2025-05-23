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
  general?:
    | {
        "מספר מקצוע"?: string;
        "שם מקצוע"?: string;
        סילבוס?: string;
        פקולטה?: string;
        "מסגרת לימודים"?: string;
        "מקצועות קדם"?: string;
        נקודות?: string;
        אחראים?: string;
        הערות?: string;
        "מועד ב"?: string;
        "בוחן מועד א"?: string;
      }
    | undefined;
  schedule?:
    | {
        קבוצה?: number;
        סוג?: string;
        יום?: string;
        שעה?: string;
        בניין?: string;
        חדר?: number;
        "מרצה/מתרגל"?: string;
        "מס."?: number;
      }[]
    | undefined;
};

type Link = {
  title: string;
  url: string;
};

export type {
  IdType,
  ItemsState,
  ExtendedEntityState,
  RawTechnionCourse,
  Link,
};
