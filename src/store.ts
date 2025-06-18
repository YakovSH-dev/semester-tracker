import { configureStore } from "@reduxjs/toolkit";

import {
  courseReducer,
  addCourse,
  addManyCourses,
  updateCourse,
  deleteCourse,
} from "./features/courses/coursesSlice";
import {
  sessionTemplatesReducer,
  addSessionTemplate,
  addManySessionTemplates,
  updateSessionTemplate,
  deleteSessionTemplate,
} from "./features/sessionTemplates/sessionTemplatesSlice";
import {
  sessionInstancesReducer,
  addSessionInstance,
  addManySessionInstances,
  updateSessionInstance,
  deleteSessionInstance,
  updateManySessionInstances,
} from "./features/sessionInstances/sessionInstancesSlice";
import {
  scheduleOptionsReducer,
  addScheduleOption,
  addManyScheduleOptions,
  updateScheduleOption,
  deleteScheduleOption,
} from "./features/scheduleOptions/scheduleOptionSlice";
import {
  scheduleEntriesReducer,
  addScheduleEntry,
  addManyScheduleEntries,
  updateScheduleEntry,
  deleteScheduleEntry,
} from "./features/scheduleEntries/scheduleEntrySlice";
import {
  weeklyContentReducer,
  addWeeklyContent,
  addManyWeeklyContents,
  updateWeeklyContent,
  deleteWeeklyContent,
} from "./features/weeklyContent/weeklyContentSlice";
import { cascadeDeleteMiddleware } from "./middleware/cascadeDeleteMiddleware";

import { CRUDIdbMiddleware } from "./middleware/idbMiddleware";

export const store = configureStore({
  reducer: {
    courses: courseReducer,
    sessionTemplates: sessionTemplatesReducer,
    sessionInstances: sessionInstancesReducer,
    scheduleOptions: scheduleOptionsReducer,
    scheduleEntries: scheduleEntriesReducer,
    weeklyContents: weeklyContentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      cascadeDeleteMiddleware,
      CRUDIdbMiddleware(
        "course",
        addCourse,
        addManyCourses,
        updateCourse,
        deleteCourse
      ),
      CRUDIdbMiddleware(
        "sessionTemplate",
        addSessionTemplate,
        addManySessionTemplates,
        updateSessionTemplate,
        deleteSessionTemplate
      ),
      CRUDIdbMiddleware(
        "sessionInstance",
        addSessionInstance,
        addManySessionInstances,
        updateSessionInstance,
        deleteSessionInstance,
        updateManySessionInstances
      ),
      CRUDIdbMiddleware(
        "scheduleOption",
        addScheduleOption,
        addManyScheduleOptions,
        updateScheduleOption,
        deleteScheduleOption
      ),
      CRUDIdbMiddleware(
        "scheduleEntry",
        addScheduleEntry,
        addManyScheduleEntries,
        updateScheduleEntry,
        deleteScheduleEntry
      ),
      CRUDIdbMiddleware(
        "weeklyContent",
        addWeeklyContent,
        addManyWeeklyContents,
        updateWeeklyContent,
        deleteWeeklyContent
      )
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
