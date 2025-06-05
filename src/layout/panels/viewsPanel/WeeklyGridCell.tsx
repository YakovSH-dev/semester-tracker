import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { entrySelectors } from "../../../features/courses/sessions/scheduleEntrySlice";
import type { IdType } from "../../../features/types/generalTypes";
import type { RootState } from "../../../store";
import {
  scheduleOptionsSelectors,
  updateScheduleOption,
} from "../../../features/courses/sessions/scheduleOptionSlice";
import {
  sessionTemplatesSelectors,
  updateSessionTemplate,
} from "../../../features/courses/sessions/sessionTemplatesSlice";
import { courseSelectors } from "../../../features/courses/coursesSlice";
import { getWeeklyInstancesForEntry } from "../../../features/selectors";
import { updateManySessionInstances } from "../../../features/courses/sessions/sessionInstancesSlice";
import { format } from "date-fns";

import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import type { SessionInstance } from "../../../features/types/modelTypes";

import SessionInstanceModal from "../../../features/courses/sessions/sessionInstanceComponents/SessionInstanceModal";

function WeeklyGridCell({ entryId, week }: { entryId: IdType; week: Date }) {
  const [isSessionInstanceWindowOpen, setIsSessionInstanceWindowOpen] =
    useState<[boolean, SessionInstance[]]>([false, []]);
  const dispatch = useDispatch();

  // Data
  const entry = useSelector((state: RootState) =>
    entrySelectors.selectById(state, entryId)
  );

  const instances = useSelector((state: RootState) =>
    getWeeklyInstancesForEntry(state, format(week, "yyyy-MM-dd"), entryId)
  );

  const option = useSelector((state: RootState) =>
    scheduleOptionsSelectors.selectById(state, entry.scheduleOptionId)
  );

  const template = useSelector((state: RootState) =>
    sessionTemplatesSelectors.selectById(state, option.sessionTemplateId)
  );

  const course = useSelector((state: RootState) =>
    courseSelectors.selectById(state, template.courseId)
  );

  let completionPercent = null;
  if (instances != undefined && instances.length) {
    completionPercent =
      instances.filter((inst) => inst.isCompleted).length / instances.length;
  }

  // Handlers
  const handleSetSelected = () => {
    const newStatus = !option.isSelected;
    dispatch(
      updateScheduleOption({
        id: option.id,
        changes: { isSelected: !option.isSelected },
      })
    );
    dispatch(
      updateSessionTemplate({
        id: option.sessionTemplateId!,
        changes: { selectedOptionId: newStatus ? option.id : null },
      })
    );
  };
  const handleClickComplete = () => {
    const instancesToUpdate =
      completionPercent === 0 || completionPercent === 1
        ? instances
        : instances?.filter((inst) => !inst.isCompleted);

    const payload = instancesToUpdate?.map((inst) => {
      return { id: inst.id, changes: { isCompleted: !inst.isCompleted } };
    });
    if (!payload) {
      console.error(
        "Error getting instance data for completion,",
        instancesToUpdate,
        payload
      );
      return;
    }
    dispatch(updateManySessionInstances(payload));
  };
  const handleOpenSessionWindow = () => {
    instances && setIsSessionInstanceWindowOpen([true, instances]);
  };

  return (
    <div
      className={`relative overflow-hidden max-h-full max-w-full min-w-full rounded-md flex flex-col items-center group transform shadow transition-opacity duration-200 ${
        option.isSelected ? "opacity-100" : "opacity-50"
      } hover:opacity-100`}
    >
      <div
        className="absolute inset-0 rounded-md -z-10"
        style={{
          background: course.color,
          filter: `brightness(${
            completionPercent
              ? Math.max(100 - completionPercent * 100, 75)
              : 100
          }%)`,
        }}
      ></div>

      {completionPercent != null && completionPercent === 1 && (
        <div
          className="absolute h-7 w-7 rounded-full flex justify-center items-center text-white top-1/5 left-2 bg-green-400 shadow opacity-0 animate-[pop_200ms_ease-out_forwards] group-hover:opacity-50"
          style={{ filter: "none" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8.01 8.01a1 1 0 01-1.414 0l-4.01-4.01a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
      {option.isSelected && (
        <div className="flex flex-row w-full h-fit gap-1 overflow-hidden">
          <button
            className="h-0  group-hover:h-4 mx-2 group-hover:visible bg-green-400  transition-all cursor-pointer z-1 w-[50%] rounded-b-md "
            onClick={handleClickComplete}
          >
            {" "}
            <CheckIcon className="h-full w-full  text-gray-700" />
          </button>
          <button
            className="h-0  group-hover:h-4 mx-2 group-hover:visible bg-green-400  transition-all cursor-pointer z-1 w-[50%] rounded-b-md "
            onClick={handleSetSelected}
          >
            <ArrowPathIcon className="h-full w-full text-gray-700" />
          </button>
        </div>
      )}
      <div
        className={`flex-1 flex flex-col text-center p-1 cursor-pointer text-[0.6rem] font-bold w-full mt-3 min-h-0 overflow-hidden ${
          completionPercent && completionPercent === 1
            ? "line-through text-gray-300"
            : "text-white"
        }`}
        onClick={
          !option.isSelected ? handleSetSelected : handleOpenSessionWindow
        }
      >
        {course.name}
        <br />
        {template.type}
        <br />
        {option.instructor}
        <br />
        {entry.startTime + " - " + entry.endTime}
        <br />
        {instances?.map((inst) => inst.hourIndex)}
        <br />
        {completionPercent != undefined &&
          completionPercent > 0 &&
          completionPercent < 1 &&
          `ראית ${completionPercent * 100}% מהרצאה זו`}
      </div>
      {isSessionInstanceWindowOpen[0] && instances && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-50 z-50"
            onClick={() => setIsSessionInstanceWindowOpen([false, []])}
          ></div>

          <div className="fixed inset-0 z-50 flex justify-center items-center">
            <SessionInstanceModal
              sessionInstances={instances}
              onClose={() => setIsSessionInstanceWindowOpen([false, []])}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default WeeklyGridCell;
