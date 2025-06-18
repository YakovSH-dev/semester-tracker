import {
  createEntityAdapter,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import type { ScheduleOption } from "../types/modelTypes";
import { createLoadThunkAndReducer } from "../createLoadThunkAndReducer";
import { STORE_KEYS } from "../../utils/idbSetup";

const scheduleOptionsAdapter = createEntityAdapter({
  selectId: (scheduleOption: ScheduleOption) => scheduleOption.id,
});

export const scheduleOptionsSelectors =
  scheduleOptionsAdapter.getSelectors<RootState>(
    (state) => state.scheduleOptions
  );

const {
  thunk: loadScheduleOptions,
  extraReducers: scheduleOptionsExtraReducers,
} = createLoadThunkAndReducer<"scheduleOption", ScheduleOption>(
  STORE_KEYS.SCHEDULE_OPTION,
  "scheduleOptions/load",
  scheduleOptionsAdapter
);

const scheduleOptionSlice = createSlice({
  name: "scheduleOptions",
  initialState: scheduleOptionsAdapter.getInitialState({
    loading: false,
    error: undefined as string | undefined,
  }),
  reducers: {
    addScheduleOption: scheduleOptionsAdapter.addOne,
    addManyScheduleOptions: scheduleOptionsAdapter.addMany,
    updateScheduleOption: scheduleOptionsAdapter.updateOne,
    deleteScheduleOption: scheduleOptionsAdapter.removeOne,
    setScheduleOptionsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setScheduleOptionsError(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload;
    },
  },
  extraReducers: scheduleOptionsExtraReducers,
});

export const {
  addScheduleOption,
  addManyScheduleOptions,
  updateScheduleOption,
  deleteScheduleOption,
  setScheduleOptionsLoading,
  setScheduleOptionsError,
} = scheduleOptionSlice.actions;

export const scheduleOptionsReducer = scheduleOptionSlice.reducer;
export { loadScheduleOptions };
