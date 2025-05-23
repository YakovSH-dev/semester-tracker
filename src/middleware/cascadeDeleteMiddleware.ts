import { type Middleware } from "@reduxjs/toolkit";
import { type RootState } from "../store";
import { deleteCourse } from "../features/courses/coursesSlice";
import { deleteSessionTemplate } from "../features/courses/sessions/sessionTemplatesSlice";
import { deleteSessionInstance } from "../features/courses/sessions/sessionInstancesSlice";
import { deleteScheduleOption } from "../features/courses/sessions/scheduleOptionSlice";
import { deleteScheduleEntry } from "../features/courses/sessions/scheduleEntrySlice";

export const cascadeDeleteMiddleware: Middleware =
  (storeAPI) => (next) => (action) => {
    const state: RootState = storeAPI.getState();

    if (deleteCourse.match(action)) {
      const courseId = action.payload;

      const relatedSessionTemplateIds =
        state.courses.entities[courseId].sessionTemplatedIds;

      for (const templateId of relatedSessionTemplateIds) {
        storeAPI.dispatch(deleteSessionTemplate(templateId));
      }
    } else if (deleteSessionTemplate.match(action)) {
      const sessionTemplateId = action.payload;

      const relatedScheduleOptionIds =
        state.sessionTemplates.entities[sessionTemplateId].scheduleOptionIds;

      const relatedSessionInstanceIds =
        state.sessionTemplates.entities[sessionTemplateId].sessionInstanceIds;

      for (const optionId of relatedScheduleOptionIds) {
        storeAPI.dispatch(deleteScheduleOption(optionId));
      }

      for (const instanceId of relatedSessionInstanceIds) {
        storeAPI.dispatch(deleteSessionInstance(instanceId));
      }
    } else if (deleteScheduleOption.match(action)) {
      const scheduleOptionId = action.payload;

      const relatedScheduleEntryIds =
        state.scheduleOptions.entities[scheduleOptionId].scheduleEntryIds;

      for (const entryId of relatedScheduleEntryIds) {
        storeAPI.dispatch(deleteScheduleEntry(entryId));
      }
    }

    return next(action);
  };
