import type { RootState } from "../../../store";
import { courseSelectors } from "../coursesSlice";
import { useSelector } from "react-redux";
function HeaderCourseBtn({
  onClick,
  courseId,
}: {
  onClick: (courseId: string) => void;
  courseId: string;
}) {
  const course = useSelector(
    (state: RootState) => courseSelectors.selectById(state, courseId)
  );
  const color = course.color;
  const letters = course.name.split(" ").map((tok)=> tok[0]);
  return (
    <button
      className="h-full w-full cursor-pointer rounded-full hover:brightness-[0.9] hover:shadow-[0_10px_10px_0px_rgba(255,255,255,0.1)] p-1 hover:-translate-y-[2px] transition-all font-bold text-sm text-dark-primary overflow-hidden"
      onClick={() => onClick(courseId)}
      style={{
        backgroundColor: `${color}`
      }}
    >{letters.join(".")}</button>
  );
}

export default HeaderCourseBtn;
