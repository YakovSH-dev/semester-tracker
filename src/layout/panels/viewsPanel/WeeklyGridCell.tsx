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

function WeeklyGridCell({ entryId, week }: { entryId: IdType; week: Date }) {
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
  const handleClick = () => {
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

  let outerClasses = `filter`;
  if (option.isSelected) {
    const rawBrightness = 100 - (completionPercent ?? 0) * 100;
    const brightness = Math.max(75, Math.floor(rawBrightness));
    outerClasses += `brightness-[${brightness}%]`;
  } else {
    outerClasses += "opacity-50 ";
    outerClasses += "hover:opacity-100 ";
  }
  return (
    <div
      className={
        "max-h-full max-w-full min-w-full  rounded-md flex flex-col items-center group transform overflow-hidden shadow " +
        outerClasses
      }
      style={{
        background: `${course.color}`,
      }}
    >
      {option.isSelected && (
        <button
          className="h-0  group-hover:h-4 group-hover:visible bg-green-200 transition-all cursor-pointer z-1 w-[50%] rounded-b-md "
          onClick={handleClickComplete}
        ></button>
      )}
      <button
        className="flex-1 flex flex-col p-1 text-xs font-bold w-full min-h-0 "
        onClick={handleClick}
        style={{
          textDecoration: `${
            completionPercent && completionPercent === 1 ? "line-through" : ""
          } `,
        }}
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
        {completionPercent != undefined &&
          completionPercent > 0 &&
          completionPercent < 1 &&
          `ראית ${completionPercent * 100}% מהרצאה זו`}
      </button>
    </div>
  );
}

export default WeeklyGridCell;
