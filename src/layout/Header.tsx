import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useState } from "react";

import type { RootState } from "../store";
import type { FullCourseData } from "../features/types/modelTypes";

import {
  addCourse,
  courseSelectors,
  deleteCourse,
} from "../features/courses/coursesSlice";
import { addManySessionTemplates } from "../features/courses/sessions/sessionTemplatesSlice";
import { addManySessionInstances } from "../features/courses/sessions/sessionInstancesSlice";
import { addManyScheduleOptions } from "../features/courses/sessions/scheduleOptionSlice";
import { addManyScheduleEntries } from "../features/courses/sessions/scheduleEntrySlice";

import SearchBar from "./SearchBar";
import HeaderCourseBtn from "../features/courses/courseComponents/HeaderCourseBtn";
import CourseWindow from "../features/courses/courseComponents/CourseWindow";
import type { IdType } from "../features/types/generalTypes";

function Header() {
  const dispatch = useDispatch();
  const courseIds = useSelector((state: RootState) =>
    courseSelectors.selectIds(state)
  );
  const [[isCourseWindowOpen, selectedCourseId], setIsCourseWindowOpen] =
    useState([false, ""]);

  const handleCourseClick = (courseId: (typeof courseIds)[number]) => {
    setIsCourseWindowOpen([true, courseId]);
  };
  const handleDeleteCourse = (courseId: IdType) => {
    setIsCourseWindowOpen([false, ""]);
    dispatch(deleteCourse(courseId));
  };
  const createFullCourse = (courseData: FullCourseData) => {
    if (courseIds.find((cid) => cid === courseData.course.id)) return;
    dispatch(addCourse(courseData.course));
    dispatch(addManySessionTemplates(courseData.sessionTemplates));
    dispatch(addManySessionInstances(courseData.sessionInstances));
    dispatch(addManyScheduleOptions(courseData.scheduleOptions));
    dispatch(addManyScheduleEntries(courseData.scheduleEntries));
  };

  return (
    <>
      <header
        className="h-full w-full bg-dark-primary grid grid-cols-[1fr_1fr_1fr] p-2 place-items-center"
        dir="rtl"
      >
        <div className="justify-self-center w-[80%] ">
          {<SearchBar onItemSelect={createFullCourse} />}
        </div>

        <div className="grid grid-flow-col gap-2 mt-2 mb-2 overflow-hidden max-h-full">
          {courseIds.map((cId) => (
            <div className="aspect-square overflow-hidden max-h-full " key={cId}>
              <HeaderCourseBtn onClick={handleCourseClick} courseId={cId} />
            </div>
          ))}
        </div>
      </header>
      {isCourseWindowOpen && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-50 z-20"
            onClick={() => setIsCourseWindowOpen([false, ""])}
          ></div>

          <div className="fixed inset-0 z-30 flex justify-center items-center">
            <CourseWindow
              courseId={selectedCourseId}
              onClose={() => setIsCourseWindowOpen([false, ""])}
              onDeleteCourse={handleDeleteCourse}
            />
          </div>
        </>
      )}
    </>
  );
}

export default Header;
