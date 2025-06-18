import {
  createEntityAdapter,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { differenceInWeeks } from "date-fns";
import { type RootState } from "../../store";
import type { ScheduleEntry } from "../types/modelTypes";
import { createLoadThunkAndReducer } from "../createLoadThunkAndReducer";
import { STORE_KEYS } from "../../utils/idbSetup";

const scheduleEntriesAdapter = createEntityAdapter({
  selectId: (scheduleEntry: ScheduleEntry) => scheduleEntry.id,
  sortComparer: (a, b) => {
    const [aHours, aMinutes] = a.startTime.split(":").map(Number);
    const [bHours, bMinutes] = a.startTime.split(":").map(Number);

    return a.week === b.week
      ? differenceInWeeks(new Date(a.week), new Date(b.week))
      : a.dayOfWeek === b.dayOfWeek
      ? (aHours + aMinutes) / 60 - (bHours + bMinutes) / 60
      : a.dayOfWeek - b.dayOfWeek;
  },
});

export const entrySelectors = scheduleEntriesAdapter.getSelectors<RootState>(
  (state) => state.scheduleEntries
);

const {
  thunk: loadScheduleEntries,
  extraReducers: scheduleEntriesExtraReducers,
} = createLoadThunkAndReducer<"scheduleEntry", ScheduleEntry>(
  STORE_KEYS.SCHEDULE_ENTRY,
  "scheduleEntries/load",
  scheduleEntriesAdapter
);

const scheduleEntrySlice = createSlice({
  name: "scheduleEntries",
  initialState: scheduleEntriesAdapter.getInitialState({
    loading: false,
    error: undefined as string | undefined,
  }),
  reducers: {
    addScheduleEntry: scheduleEntriesAdapter.addOne,
    addManyScheduleEntries: scheduleEntriesAdapter.addMany,
    updateScheduleEntry: scheduleEntriesAdapter.updateOne,
    deleteScheduleEntry: scheduleEntriesAdapter.removeOne,
    setScheduleEntriesLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setScheduleEntriesError(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload;
    },
  },
  extraReducers: scheduleEntriesExtraReducers,
});

export const {
  addScheduleEntry,
  addManyScheduleEntries,
  updateScheduleEntry,
  deleteScheduleEntry,
  setScheduleEntriesLoading,
  setScheduleEntriesError,
} = scheduleEntrySlice.actions;

export const scheduleEntriesReducer = scheduleEntrySlice.reducer;
export { loadScheduleEntries };
