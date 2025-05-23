import {
  createEntityAdapter,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import type { Course } from "../types/modelTypes";
import { createLoadThunkAndReducer } from "../createLoadThunkAndReducer";
import { STORE_KEYS } from "../../utils/idbSetup";

const coursesAdapter = createEntityAdapter({
  selectId: (course: Course) => course.id,
});

export const courseSelectors = coursesAdapter.getSelectors<RootState>(
  (state) => state.courses
);

const { thunk: loadCourses, extraReducers: courseExtraReducers } =
  createLoadThunkAndReducer<"course", Course>(
    STORE_KEYS.COURSE,
    "courses/load",
    coursesAdapter
  );

const coursesSlice = createSlice({
  name: "courses",
  initialState: coursesAdapter.getInitialState({
    loading: false,
    error: undefined as string | undefined,
  }),
  reducers: {
    addCourse: coursesAdapter.addOne,
    addManyCourses: coursesAdapter.addMany,
    updateCourse: coursesAdapter.updateOne,
    deleteCourse: coursesAdapter.removeOne,
    setCoursesLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setCoursesError(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload;
    },
  },
  extraReducers: courseExtraReducers,
});

export const {
  addCourse,
  addManyCourses,
  updateCourse,
  deleteCourse,
  setCoursesLoading,
  setCoursesError,
} = coursesSlice.actions;
export const courseReducer = coursesSlice.reducer;
export { loadCourses };
