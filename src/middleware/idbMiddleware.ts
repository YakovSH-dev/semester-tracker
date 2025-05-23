import {
  addItem,
  updateItem,
  updateManyItems,
  deleteItem,
  addManyItems,
} from "../utils/idbSetup";
import type { StoreName } from "../utils/idbSetup";

// Types
import type { Middleware, ActionCreatorWithPayload } from "@reduxjs/toolkit";
import type { IdType } from "../features/types/generalTypes";
import type { Model } from "../features/types/modelTypes";
import type { Update } from "@reduxjs/toolkit";

export function CRUDIdbMiddleware<T extends Model>(
  storeName: StoreName,
  createAction: ActionCreatorWithPayload<T>,
  batchCreateAction: ActionCreatorWithPayload<Record<string, T> | readonly T[]>,
  updateAction: ActionCreatorWithPayload<Update<T, IdType>>,
  deleteAction: ActionCreatorWithPayload<IdType>,
  batchUpdateAction?: ActionCreatorWithPayload<readonly Update<T, string>[]>
): Middleware {
  return () => (next) => async (action) => {
    const result = next(action);
    try {
      if (createAction.match(action)) {
        await addItem(storeName, action.payload);
      } else if (batchCreateAction.match(action)) {
        await addManyItems(storeName, action.payload);
      } else if (updateAction.match(action)) {
        const { id, changes } = action.payload;
        await updateItem(storeName, id, changes);
      } else if (batchUpdateAction && batchUpdateAction.match(action)) {
        const updateData = action.payload.map((item) => {
          return { id: item.id, changes: item };
        });

        const asRecord = Object.fromEntries(
          updateData.map(({ id, changes }) => [id, ...[changes.changes]])
        );

        await updateManyItems(storeName, asRecord);
      } else if (deleteAction.match(action)) {
        const id = action.payload;
        await deleteItem(storeName, id);
      }
    } catch (err) {
      console.error(`IDB error in ${storeName}:`, err);
    }
    return result;
  };
}
