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
} from "./features/courses/sessions/sessionTemplatesSlice";
import {
  sessionInstancesReducer,
  addSessionInstance,
  addManySessionInstances,
  updateSessionInstance,
  deleteSessionInstance,
  updateManySessionInstances,
} from "./features/courses/sessions/sessionInstancesSlice";
import {
  scheduleOptionsReducer,
  addScheduleOption,
  addManyScheduleOptions,
  updateScheduleOption,
  deleteScheduleOption,
} from "./features/courses/sessions/scheduleOptionSlice";
import {
  scheduleEntriesReducer,
  addScheduleEntry,
  addManyScheduleEntries,
  updateScheduleEntry,
  deleteScheduleEntry,
} from "./features/courses/sessions/scheduleEntrySlice";
import { cascadeDeleteMiddleware } from "./middleware/cascadeDeleteMiddleware";

import { CRUDIdbMiddleware } from "./middleware/idbMiddleware";

export const store = configureStore({
  reducer: {
    courses: courseReducer,
    sessionTemplates: sessionTemplatesReducer,
    sessionInstances: sessionInstancesReducer,
    scheduleOptions: scheduleOptionsReducer,
    scheduleEntries: scheduleEntriesReducer,
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
      )
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
