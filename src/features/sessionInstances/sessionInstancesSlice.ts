import {
  createEntityAdapter,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { SessionInstance } from "../types/modelTypes";
import { createLoadThunkAndReducer } from "../createLoadThunkAndReducer";
import { STORE_KEYS } from "../../utils/idbSetup";
import type { IdType } from "../types/generalTypes";
import type { RootState } from "../../store";
import { isBefore } from "date-fns";

const sessionInstancesAdapter = createEntityAdapter({
  selectId: (sessionInstance: SessionInstance) => sessionInstance.id,
  sortComparer: (a, b) => {
    return a.weekStartDate === b.weekStartDate
      ? a.hourIndex - b.hourIndex
      : isBefore(new Date(b.weekStartDate), new Date(a.weekStartDate))
      ? -1
      : 1;
  },
});

export const sessionInstancesSelectors =
  sessionInstancesAdapter.getSelectors<RootState>(
    (state) => state.sessionInstances
  );

const {
  thunk: loadSessionInstances,
  extraReducers: sessionInstancesExtraReducers,
} = createLoadThunkAndReducer<"sessionInstance", SessionInstance>(
  STORE_KEYS.SESSION_INSTANCE,
  "sessionInstances/load",
  sessionInstancesAdapter
);

const sessionInstancesSlice = createSlice({
  name: "sessionInstances",
  initialState: sessionInstancesAdapter.getInitialState({
    loading: false,
    error: undefined as string | undefined,
  }),
  reducers: {
    addSessionInstance: sessionInstancesAdapter.addOne,
    addManySessionInstances: sessionInstancesAdapter.addMany,
    updateSessionInstance: sessionInstancesAdapter.updateOne,
    updateManySessionInstances: sessionInstancesAdapter.updateMany,
    deleteSessionInstance: sessionInstancesAdapter.removeOne,
    markComplete: (
      state,
      action: PayloadAction<{ instId: IdType; newStatus: boolean }>
    ) => {
      const instId = action.payload.instId;
      const newStatus = action.payload.newStatus;
      state.entities[instId].isCompleted = newStatus;
    },
    setSessionInstancesLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setSessionInstancesError(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload;
    },
  },
  extraReducers: sessionInstancesExtraReducers,
});

export const {
  addSessionInstance,
  addManySessionInstances,
  updateSessionInstance,
  updateManySessionInstances,
  deleteSessionInstance,
  markComplete,
  setSessionInstancesLoading,
  setSessionInstancesError,
} = sessionInstancesSlice.actions;

export const sessionInstancesReducer = sessionInstancesSlice.reducer;
export { loadSessionInstances };
