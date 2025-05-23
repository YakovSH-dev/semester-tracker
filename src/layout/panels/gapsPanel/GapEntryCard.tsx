import { scheduleOptionsSelectors } from "../../../features/courses/sessions/scheduleOptionSlice";
import { courseSelectors } from "../../../features/courses/coursesSlice";
import { sessionTemplatesSelectors } from "../../../features/courses/sessions/sessionTemplatesSlice";
import { getWeeklyInstancesForEntry } from "../../../features/selectors";
import { updateManySessionInstances } from "../../../features/courses/sessions/sessionInstancesSlice";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../store";
import type { IdType } from "../../../features/types/generalTypes";
import { entrySelectors } from "../../../features/courses/sessions/scheduleEntrySlice";

function GapEntryCard({ entryId, week }: { entryId: IdType; week: string }) {
  const dispatch = useDispatch();
  const entry = useSelector((state: RootState) =>
    entrySelectors.selectById(state, entryId)
  );
  const instances = useSelector((state: RootState) =>
    getWeeklyInstancesForEntry(state, week, entry.id)
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
  return (
    <button
      className="bg-red-300 rounded hover:brightness-95 cursor-pointer"
      onClick={handleClickComplete}
    >
      <h1 className="p-1 text-xs font-bold" dir="rtl">
        {template.type.concat(` (${entry.durationInHours} ש')`)} - {course.name}
      </h1>
    </button>
  );
}

export default GapEntryCard;
