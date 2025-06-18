import type { RootState } from "../store";
import { createSelector } from "@reduxjs/toolkit";

import { sessionInstancesSelectors } from "./sessionInstances/sessionInstancesSlice";
import { scheduleOptionsSelectors } from "./scheduleOptions/scheduleOptionSlice";
import { entrySelectors } from "./scheduleEntries/scheduleEntrySlice";

import type { ScheduleEntry } from "./types/modelTypes";
import { sessionTemplatesSelectors } from "./sessionTemplates/sessionTemplatesSlice";
import { differenceInWeeks, isBefore, startOfWeek } from "date-fns";
import { courseSelectors } from "./courses/coursesSlice";
import { weeklyContentSelectors } from "./weeklyContent/weeklyContentSlice";

const getSelectedEntries = createSelector(
  [scheduleOptionsSelectors.selectAll, entrySelectors.selectEntities],
  (options, entries) => {
    return options
      .filter((option) => option.isSelected)
      .filter(Boolean)
      .flatMap((opt) => opt.scheduleEntryIds)
      .filter(Boolean)
      .map((entryId) => entries[entryId])
      .filter(Boolean);
  }
);

const getWeeklyInstancesForEntry = createSelector(
  [
    sessionInstancesSelectors.selectEntities,
    (state: RootState, entryId: string) =>
      entrySelectors.selectById(state, entryId),
  ],

  (instances, entry) => {
    const instancesForEntry = entry.sessionInstanceIds.map(
      (instanceId) => instances[instanceId]
    );
    return instancesForEntry.filter(Boolean);
  }
);

const getEntriesForWeek = createSelector(
  [entrySelectors.selectAll, (_: RootState, week: string) => week],
  (entries, week) => {
    return entries.filter((entry) => entry.week === week);
  }
);

const getEntriesToRenderForWeek = createSelector(
  sessionTemplatesSelectors.selectAll,
  scheduleOptionsSelectors.selectEntities,

  (state: RootState, week: string) => getEntriesForWeek(state, week),

  (templates, options, entries): ScheduleEntry[] => {
    return (
      templates
        .filter(Boolean)
        .flatMap((template) =>
          template.selectedOptionId
            ? // If template has a selected option render its entries, if not render entries of all options
              [options[template.selectedOptionId]].filter(Boolean)
            : Object.values(options)
                .filter((o) => o.sessionTemplateId === template.id)
                .filter(Boolean)
        )
        // Convert the ids to objects
        .flatMap(
          (option) =>
            option.scheduleEntryIds
              .map((entryId) => entries.find((entry) => entry.id === entryId))
              .filter(Boolean) as ScheduleEntry[]
        )
    );
  }
);

const getGapEntries = createSelector(
  [
    (state: RootState) => getSelectedEntries(state),
    sessionInstancesSelectors.selectEntities,
    (_: RootState, currentWeek: string) => currentWeek,
  ],
  (entries, instances, currentWeek) => {
    return (
      entries
        // Get entries from previous weeks
        .filter((entry) =>
          isBefore(new Date(entry.week), new Date(currentWeek))
        )
        // Filter the ones that have uncompleted instances
        .filter((entry) =>
          entry.sessionInstanceIds.some(
            (instanceId) => !instances[instanceId]?.isCompleted
          )
        )
        .sort((a, b) => differenceInWeeks(new Date(a.week), new Date(b.week)))
    );
  }
);

const getInstancesByIdForCourse = createSelector(
  [
    (state: RootState, courseId: string) =>
      courseSelectors.selectById(state, courseId),
    sessionTemplatesSelectors.selectEntities,
  ],
  (course, allTemplates) => {
    return course.sessionTemplatedIds
      .map((templateId) => allTemplates[templateId])
      .filter(Boolean)
      .flatMap((template) => template.sessionInstanceIds)
      .filter(Boolean);
  }
);

const selectInstanceEntitiesByIds = createSelector(
  [
    sessionInstancesSelectors.selectEntities,
    (_: RootState, instanceIds: string[]) => instanceIds,
  ],
  (allInstanceEntities, instanceIdsToSelect) => {
    return instanceIdsToSelect
      .map((instanceId) => allInstanceEntities[instanceId])
      .filter(Boolean);
  }
);

const getCourseCompletionData = createSelector(
  [
    (state: RootState, courseId: string) =>
      selectInstanceEntitiesByIds(
        state,
        getInstancesByIdForCourse(state, courseId)
      ),
  ],
  (courseInstances) => {
    const instancesAmount = courseInstances.length;
    if (instancesAmount === 0)
      return {
        onTrackPercent: 0,
        behindPercent: 0,
        leadPercent: 0,
      };
    const currentWeek = startOfWeek(new Date());

    const cdata = courseInstances.reduce(
      (data, cur) => {
        const curDate = startOfWeek(new Date(cur.weekStartDate));
        const curIsCompleted = cur.isCompleted;
        if (isBefore(curDate, currentWeek)) {
          curIsCompleted ? data.onTrackPercent++ : data.behindPercent++;
          return data;
        } else {
          curIsCompleted && data.leadPercent++;
          return data;
        }
      },
      { onTrackPercent: 0, behindPercent: 0, leadPercent: 0 }
    );

    cdata.behindPercent *= 100 / instancesAmount;
    cdata.onTrackPercent *= 100 / instancesAmount;
    cdata.leadPercent *= 100 / instancesAmount;

    return cdata;
  }
);

const getGeneralDataForEntry = createSelector(
  [
    (state: RootState, entryId: string) =>
      entrySelectors.selectById(state, entryId),
    scheduleOptionsSelectors.selectEntities,
    sessionTemplatesSelectors.selectEntities,
    courseSelectors.selectEntities,
  ],
  (entry, options, templates, courses) => {
    const option = options[entry.scheduleOptionId];
    const template = templates[option.sessionTemplateId];
    const course = courses[template.courseId];
    const data = {
      startTime: entry.startTime,
      endTime: entry.endTime,
      duration: entry.durationInHours,
      dayOfWeek: entry.dayOfWeek,
      instructor: option.instructor,
      isSelected: option.isSelected,
      type: template.type,
      courseName: course.name,
      color: course.color,
    };
    return data;
  }
);

const getWeeklyContentForWeek = createSelector(
  [weeklyContentSelectors.selectAll, (_: RootState, week: string) => week],
  (weeklyContents, week) => {
    return weeklyContents.filter(
      (weeklyContent) => weeklyContent.week === week
    );
  }
);

const getWeeklyContentForTemplateByWeek = createSelector(
  [
    (state: RootState, week: string) => getWeeklyContentForWeek(state, week),
    (_: RootState, _week: string, templateId: string) => templateId,
  ],
  (weeklyContents, templateId) => {
    const weeklyContent = weeklyContents.find(
      (weeklyContent) => weeklyContent.sessionTemplateId === templateId
    );
    return weeklyContent;
  }
);

export {
  getEntriesToRenderForWeek,
  getSelectedEntries,
  getWeeklyInstancesForEntry,
  getGapEntries,
  getCourseCompletionData,
  getGeneralDataForEntry,
  getWeeklyContentForTemplateByWeek,
};
