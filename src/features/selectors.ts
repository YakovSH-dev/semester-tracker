import type { RootState } from "../store";
import { createSelector } from "@reduxjs/toolkit";

import { sessionInstancesSelectors } from "./courses/sessions/sessionInstancesSlice";
import { scheduleOptionsSelectors } from "./courses/sessions/scheduleOptionSlice";
import { entrySelectors } from "./courses/sessions/scheduleEntrySlice";

import type { IdType } from "./types/generalTypes";

const getInstancesForWeek = createSelector(
  [sessionInstancesSelectors.selectAll, (_: RootState, week: string) => week],
  (instances, week) => instances.filter((i) => i.weekStartDate === week)
);

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

const getWeeklyEntryInstanceMap = createSelector(
  [
    (state: RootState) => getSelectedEntries(state),
    (state: RootState, week: string) => getInstancesForWeek(state, week),
  ],
  (entries, instances) => {
    const map = new Map<IdType, IdType[]>();
    const entsByTemplate = Object.groupBy(
      entries,
      (ent) => ent.sessionTemplateId!
    );
    const instsByTemplate = Object.groupBy(
      instances,
      (inst) => inst.sessionTemplateId!
    );
    for (const tmpltId in entsByTemplate) {
      if (!entsByTemplate[tmpltId]) continue;
      entsByTemplate[tmpltId].sort((a, b) => a.dayOfWeek - b.dayOfWeek);
      for (const entry of entsByTemplate[tmpltId]) {
        if (!instsByTemplate[tmpltId]) continue;
        map.set(
          entry.id,
          instsByTemplate[tmpltId]
            .splice(0, entry.durationInHours)
            .map((i) => i.id)
        );
      }
    }
    return map;
  }
);

const getWeeklyInstancesForEntry = createSelector(
  [
    sessionInstancesSelectors.selectEntities,
    (state: RootState, week: string) => getWeeklyEntryInstanceMap(state, week),
    (_: RootState, _week: string, entryId: string) => entryId,
  ],
  (instances, map, entryId) => {
    return map.get(entryId)?.map((id) => instances[id]);
  }
);

const getEntriesToRender = createSelector(
  (state: RootState) => state.sessionTemplates.entities,
  (state: RootState) => state.scheduleOptions.entities,
  (state: RootState) => state.scheduleEntries.entities,
  (templates, options, entries) => {
    console.log("getEntriesToRender");
    return Object.values(templates)
      .flatMap((t) =>
        t.selectedOptionId
          ? [options[t.selectedOptionId]].filter(Boolean)
          : Object.values(options).filter((o) => o.sessionTemplateId === t.id)
      )
      .flatMap((o) =>
        o.scheduleEntryIds.map((eId) => entries[eId]).filter(Boolean)
      );
  }
);

const makeGetGapEntriesForWeek = () =>
  createSelector(
    (state: RootState) => getSelectedEntries(state),
    sessionInstancesSelectors.selectEntities,
    (_: RootState, week: string) => week,
    (state: RootState, week: string) => getWeeklyEntryInstanceMap(state, week),
    (selectedEntries, instances, _week, map) => {
      const gapEntries = selectedEntries.filter((e) =>
        map.get(e.id)?.some((i) => !instances[i].isCompleted)
      );
      return gapEntries.map((e) => e.id);
    }
  );

const getGapEntries = (state: RootState, weeks: string[]) => {
  const gapEntries = [];
  const getGapEntriesForWeek = makeGetGapEntriesForWeek();
  for (const week of weeks) {
    const gapEntriesForWeek = getGapEntriesForWeek(state, week);
    if (gapEntriesForWeek.length > 0)
      gapEntries.push({ week, gapEntries: gapEntriesForWeek });
  }
  return gapEntries;
};

export {
  getEntriesToRender,
  getInstancesForWeek,
  getSelectedEntries,
  getWeeklyEntryInstanceMap,
  getWeeklyInstancesForEntry,
  getGapEntries,
};
