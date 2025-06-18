import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useState } from "react";

import type { RootState } from "../store";
import type {
  FullCourseData,
  WeeklyContent,
} from "../features/types/modelTypes";

import {
  addCourse,
  courseSelectors,
  deleteCourse,
} from "../features/courses/coursesSlice";
import { addManySessionTemplates } from "../features/sessionTemplates/sessionTemplatesSlice";
import { addManySessionInstances } from "../features/sessionInstances/sessionInstancesSlice";
import { addManyScheduleOptions } from "../features/scheduleOptions/scheduleOptionSlice";
import { addManyScheduleEntries } from "../features/scheduleEntries/scheduleEntrySlice";
import { addManyWeeklyContents } from "../features/weeklyContent/weeklyContentSlice";

import SearchBar from "./SearchBar";
import HeaderCourseBtn from "../features/courses/HeaderCourseBtn";
import CourseWindow from "../features/courses/CourseWindow";
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
  const createFullCourse = (
    courseData: FullCourseData & { weeklyContents: WeeklyContent[] }
  ) => {
    if (courseIds.find((cid) => cid === courseData.course.id)) return;
    dispatch(addCourse(courseData.course));
    dispatch(addManySessionTemplates(courseData.sessionTemplates));
    dispatch(addManySessionInstances(courseData.sessionInstances));
    dispatch(addManyScheduleOptions(courseData.scheduleOptions));
    dispatch(addManyScheduleEntries(courseData.scheduleEntries));
    dispatch(addManyWeeklyContents(courseData.weeklyContents));
  };

  return (
    <div className="flex">
      <header
        className="h-fit w-full bg-dark-primary flex flex-row p-2 gap-5 justify-center place-items-center"
        dir="rtl"
      >
        <div className="justify-self-center ">
          {<SearchBar onItemSelect={createFullCourse} />}
        </div>

        <div className="flex flex-row  mt-1 mb-1 ">
          {courseIds.map((cId) => (
            <div className="aspect-square mx-2" key={cId}>
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
    </div>
  );
}

export default Header;
