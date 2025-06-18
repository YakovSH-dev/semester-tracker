import type { IdType, Resource } from "../types/generalTypes";
import { deletePDFResource } from "../../firebase/storage";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { courseSelectors, updateCourse } from "./coursesSlice";
import type { RootState } from "../../store";
import { getRandomHexColor } from "../../utils/misc";

import AddResourceForm from "../../layout/AddResourceForm";

import ReasourceList from "../../layout/ReasourceList";

function CourseWindow({
  courseId,
  onClose,
  onDeleteCourse,
}: {
  courseId: IdType;
  onClose: () => void;
  onDeleteCourse: (courseId: IdType) => void;
}) {
  const [isAddResourceFormOpen, setisAddResourceFormOpen] = useState(false);
  const dispatch = useDispatch();
  const course = useSelector((state: RootState) =>
    courseSelectors.selectById(state, courseId)
  );

  const handleChangeColor = () => {
    const newColor = getRandomHexColor();
    dispatch(updateCourse({ id: courseId, changes: { color: newColor } }));
  };

  const handleAddResource = (resource: Resource) => {
    if (course.resources.find((r) => r.title === resource.title) != undefined)
      return;
    dispatch(
      updateCourse({
        id: courseId,
        changes: { resources: [...(course.resources || []), resource] },
      })
    );
  };

  const handleDeleteResource = (resource: Resource) => {
    if (resource.type == "file") {
      deletePDFResource(resource);
    }
    dispatch(
      updateCourse({
        id: courseId,
        changes: {
          resources: [...(course.resources || [])].filter(
            (r) => r.title != resource.title
          ),
        },
      })
    );
  };

  return (
    <div
      className="h-screen w-screen flex items-center justify-center"
      onClick={() => onClose()}
      dir="rtl"
    >
      <div
        className="min-h-1/2 min-w-1/2 bg-white rounded-lg grid grid-cols-2 p-2"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {" "}
        <div className="grid [grid-template-rows:auto_1fr_1fr_1fr]">
          <section className="h-fit w-full border-b border-l  border-gray-200 grid auto-cols-3 p-1">
            <header
              className="col-start-1 text-sm font-bold rounded-4xl text-center p-1"
              style={{ background: `${course.color}` }}
            >
              {course.name}
            </header>
            <div className="col-start-3 flex flex-row" dir="ltr">
              <button
                className="border border-red-400 h-6 w-6 rounded hover:bg-red-200 hover:opacity-70 mx-2"
                onClick={() => onDeleteCourse(courseId)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-600 justify-self-center"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a2 2 0 00-2-2H9a2 2 0 00-2 2m10 0H5"
                  />
                </svg>
              </button>
              <button
                className="border border-gray-400 h-6 w-6 rounded hover:bg-gray-200 hover:opacity-70"
                onClick={handleChangeColor}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11 5h2M4 21h16M16.121 3.879a3 3 0 014.242 4.242L7 21H3v-4L16.121 3.879z"
                  />
                </svg>
              </button>
            </div>
          </section>
          <section className="relative h-full w-full border-l border-gray-200">
            <div className="absolute bottom-0 w-11/12 border-b border-gray-200"></div>
          </section>

          <section className="relative h-full w-full border-l border-gray-200">
            <div className="absolute bottom-0 w-11/12 border-b border-gray-200"></div>
          </section>

          <section className="h-full w-full border-l border-gray-200"></section>
        </div>
        <div className="grid grid-rows-2 w-full items-center">
          <section className="h-full w-full border-b border-gray-200 p-1 ">
            <header className="text-sm font-light border-b border-gray-200  grid grid-cols-[1fr_1fr]">
              <header>קישורים</header>{" "}
              <div className="relative flex-row" dir="ltr">
                <button
                  className="rounded-full h-5 w-5 border cursor-pointer"
                  onClick={() =>
                    setisAddResourceFormOpen(!isAddResourceFormOpen)
                  }
                ></button>

                <div className="absolute  z-20  rounded-lg overflow-hidden  shadow">
                  {isAddResourceFormOpen && (
                    <AddResourceForm onSubmit={handleAddResource} />
                  )}
                </div>
              </div>
            </header>
            <main className="grid grid-cols-4 gap-1 mt-4">
              <ReasourceList
                resources={course.resources}
                handleDeleteResource={handleDeleteResource}
              />
            </main>
          </section>
          <section className="h-full w-full "></section>
        </div>
      </div>
    </div>
  );
}

export default CourseWindow;
