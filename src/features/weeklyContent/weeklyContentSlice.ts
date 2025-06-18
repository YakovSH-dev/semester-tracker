import {
  createEntityAdapter,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import type { WeeklyContent } from "../types/modelTypes";
import { createLoadThunkAndReducer } from "../createLoadThunkAndReducer";
import { STORE_KEYS } from "../../utils/idbSetup";

const weeklyContentAdapter = createEntityAdapter({
  selectId: (weeklyContent: WeeklyContent) => weeklyContent.id,
});

export const weeklyContentSelectors =
  weeklyContentAdapter.getSelectors<RootState>((state) => state.weeklyContents);

const { thunk: loadweeklyContents, extraReducers: weeklyContentExtraReducers } =
  createLoadThunkAndReducer<"weeklyContent", WeeklyContent>(
    STORE_KEYS.WEEKLY_CONTENT,
    "weeklyContents/load",
    weeklyContentAdapter
  );

const weeklyContentsSlice = createSlice({
  name: "weeklyContents",
  initialState: weeklyContentAdapter.getInitialState({
    loading: false,
    error: undefined as string | undefined,
  }),
  reducers: {
    addWeeklyContent: weeklyContentAdapter.addOne,
    addManyWeeklyContents: weeklyContentAdapter.addMany,
    updateWeeklyContent: weeklyContentAdapter.updateOne,
    deleteWeeklyContent: weeklyContentAdapter.removeOne,
    setWeeklyContentsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setWeeklyContentsError(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload;
    },
  },
  extraReducers: weeklyContentExtraReducers,
});

export const {
  addWeeklyContent,
  addManyWeeklyContents,
  updateWeeklyContent,
  deleteWeeklyContent,
  setWeeklyContentsLoading,
  setWeeklyContentsError,
} = weeklyContentsSlice.actions;
export const weeklyContentReducer = weeklyContentsSlice.reducer;
export { loadweeklyContents };
