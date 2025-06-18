import { type Middleware } from "@reduxjs/toolkit";
import { type RootState } from "../store";
import { deleteCourse } from "../features/courses/coursesSlice";
import { deleteSessionTemplate } from "../features/sessionTemplates/sessionTemplatesSlice";
import { deleteSessionInstance } from "../features/sessionInstances/sessionInstancesSlice";
import { deleteScheduleOption } from "../features/scheduleOptions/scheduleOptionSlice";
import { deleteScheduleEntry } from "../features/scheduleEntries/scheduleEntrySlice";
import { deleteWeeklyContent } from "../features/weeklyContent/weeklyContentSlice";

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

      const relatedWeeklyContentIds =
        state.sessionTemplates.entities[sessionTemplateId].weeklyContentIds;
      for (const optionId of relatedScheduleOptionIds) {
        storeAPI.dispatch(deleteScheduleOption(optionId));
      }

      for (const instanceId of relatedSessionInstanceIds) {
        storeAPI.dispatch(deleteSessionInstance(instanceId));
      }

      for (const weeklyContentId of relatedWeeklyContentIds) {
        storeAPI.dispatch(deleteWeeklyContent(weeklyContentId));
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
