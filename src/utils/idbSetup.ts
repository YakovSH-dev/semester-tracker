import { openDB } from "idb";
import type {
  Course,
  SessionTemplate,
  SessionInstance,
  ScheduleOption,
  ScheduleEntry,
  WeeklyContent,
} from "../features/types/modelTypes";
import type { IdType } from "../features/types/generalTypes";

const DB_NAME = "myAppDatabase";
const DB_VERSION = 2;

export const STORE_KEYS = {
  COURSE: "course",
  SESSION_TEMPLATE: "sessionTemplate",
  SESSION_INSTANCE: "sessionInstance",
  SCHEDULE_OPTION: "scheduleOption",
  SCHEDULE_ENTRY: "scheduleEntry",
  WEEKLY_CONTENT: "weeklyContent",
} as const;

export type StoreName = (typeof STORE_KEYS)[keyof typeof STORE_KEYS];

async function initDB() {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion) {
      console.log(
        `Upgrading database from version ${oldVersion} to ${newVersion}...`
      );

      const storeNames: StoreName[] = Object.values(STORE_KEYS);

      storeNames.forEach((name) => {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name, { keyPath: "id" });
          console.log(`Object store "${name}" created.`);
        }
      });
    },
    blocked() {
      alert(
        "Database is blocked. Please close other tabs running this app and refresh."
      );
      console.error("Database opening blocked. Close other instances/tabs.");
    },
    blocking() {
      alert(
        "Database is outdated elsewhere. Please refresh other tabs or close them."
      );
      console.warn("This connection is blocking a newer version. Closing...");
      db.close();
    },
    terminated() {
      alert("Database connection was terminated unexpectedly. Please refresh.");
      console.error("Database connection terminated.");
    },
  });
  return db;
}

export type StoreTypeMap = {
  [STORE_KEYS.COURSE]: Course;
  [STORE_KEYS.SESSION_TEMPLATE]: SessionTemplate;
  [STORE_KEYS.SESSION_INSTANCE]: SessionInstance;
  [STORE_KEYS.SCHEDULE_OPTION]: ScheduleOption;
  [STORE_KEYS.SCHEDULE_ENTRY]: ScheduleEntry;
  [STORE_KEYS.WEEKLY_CONTENT]: WeeklyContent;
};

export async function addItem<K extends StoreName>(
  store: K,
  item: StoreTypeMap[K]
) {
  const db = await initDB();
  return db.put(store, item);
}

export async function addManyItems<K extends StoreName>(
  store: K,
  items: Record<string, StoreTypeMap[K]> | readonly StoreTypeMap[K][]
): Promise<void> {
  const db = await initDB();
  const tx = db.transaction(store, "readwrite");
  const storeObj = tx.objectStore(store);

  const valuesArray = Array.isArray(items) ? items : Object.values(items);

  for (const item of valuesArray) {
    storeObj.put(item);
  }

  await tx.done;
}

export async function getItem<K extends StoreName>(
  store: K,
  id: string
): Promise<StoreTypeMap[K] | undefined> {
  const db = await initDB();
  return db.get(store, id);
}

export async function getAllItems<K extends StoreName>(
  store: K
): Promise<StoreTypeMap[K][]> {
  const db = await initDB();
  return db.getAll(store);
}

export async function updateItem<K extends StoreName>(
  store: K,
  id: IdType,
  updateData: Partial<StoreTypeMap[K]>
) {
  const db = await initDB();
  const existing = await db.get(store, id);

  if (existing) {
    const updated = { ...existing, ...updateData };
    return db.put(store, updated);
  }
}

export async function updateManyItems<K extends StoreName>(
  store: K,
  updateData: Record<string, Partial<StoreTypeMap[K]>>
) {
  const db = await initDB();
  const tx = db.transaction(store, "readwrite");

  for (const id in updateData) {
    const ItemToUpdate = await getItem<K>(store, id);
    if (ItemToUpdate === undefined) {
      console.error("Could not find item for update in store", id, store);
      continue;
    } else
      for (const key in updateData[id]) {
        if (updateData[id][key] != undefined) {
          ItemToUpdate[key] = updateData[id][key];
        }
      }
    await addItem<K>(store, ItemToUpdate);
  }

  await tx.done;
}

export async function deleteItem<K extends StoreName>(store: K, id: string) {
  const db = await initDB();
  return db.delete(store, id);
}
