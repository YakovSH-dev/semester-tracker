import {
  createAsyncThunk,
  type ActionReducerMapBuilder,
  type EntityAdapter,
} from "@reduxjs/toolkit";
import {
  getAllItems,
  type StoreName,
  type StoreTypeMap,
} from "../utils/idbSetup";
import type { ExtendedEntityState, IdType } from "./types/generalTypes";

export function createLoadThunkAndReducer<
  K extends StoreName,
  T extends StoreTypeMap[K]
>(storeName: K, path: string, adapter: EntityAdapter<T, IdType>) {
  const thunk = createAsyncThunk<T[]>(path, async () => {
    return (await getAllItems<K>(storeName)) as T[];
  });

  const extraReducers = (
    builder: ActionReducerMapBuilder<ExtendedEntityState<T>>
  ) => {
    builder
      .addCase(thunk.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(thunk.fulfilled, (state, action) => {
        state.loading = false;
        adapter.setAll(state, action.payload);
      })
      .addCase(thunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Load failed";
      });
  };

  return { thunk, extraReducers };
}
