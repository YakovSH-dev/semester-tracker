import {
  createEntityAdapter,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import type { SessionTemplate } from "../types/modelTypes";
import { createLoadThunkAndReducer } from "../createLoadThunkAndReducer";
import { STORE_KEYS } from "../../utils/idbSetup";
import type { IdType } from "../types/generalTypes";

const sessionTemplatesAdapter = createEntityAdapter({
  selectId: (sessionTemplate: SessionTemplate) => sessionTemplate.id,
});

export const sessionTemplatesSelectors =
  sessionTemplatesAdapter.getSelectors<RootState>(
    (state) => state.sessionTemplates
  );

const {
  thunk: loadSessionTemplates,
  extraReducers: sessionTemplatesExtraReducers,
} = createLoadThunkAndReducer<"sessionTemplate", SessionTemplate>(
  STORE_KEYS.SESSION_TEMPLATE,
  "sessionTemplates/load",
  sessionTemplatesAdapter
);

const sessionTemplatesSlice = createSlice({
  name: "sessionTemplates",
  initialState: sessionTemplatesAdapter.getInitialState({
    loading: false,
    error: undefined as string | undefined,
  }),
  reducers: {
    addSessionTemplate: sessionTemplatesAdapter.addOne,
    addManySessionTemplates: sessionTemplatesAdapter.addMany,
    updateSessionTemplate: sessionTemplatesAdapter.updateOne,
    deleteSessionTemplate: sessionTemplatesAdapter.removeOne,
    setSelectedOption: (
      state,
      action: PayloadAction<{ tmpltId: IdType; selectedOptId: IdType | null }>
    ) => {
      const tmpltId = action.payload.tmpltId;
      const selectedOptId = action.payload.selectedOptId;
      state.entities[tmpltId].selectedOptionId = selectedOptId;
    },
    setSessionTemplatesLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setSessionTemplatesError(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload;
    },
  },
  extraReducers: sessionTemplatesExtraReducers,
});

export const {
  addSessionTemplate,
  addManySessionTemplates,
  updateSessionTemplate,
  deleteSessionTemplate,
  setSelectedOption,
  setSessionTemplatesLoading,
  setSessionTemplatesError,
} = sessionTemplatesSlice.actions;

export const sessionTemplatesReducer = sessionTemplatesSlice.reducer;
export { loadSessionTemplates };
