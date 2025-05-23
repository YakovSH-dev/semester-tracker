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
  const color = useSelector(
    (state: RootState) => courseSelectors.selectById(state, courseId).color
  );
  return (
    <button
      className="h-full w-full cursor-pointer rounded-full hover:brightness-[0.9] hover:shadow hover:-translate-y-[2px] transition-all"
      onClick={() => onClick(courseId)}
      style={{
        backgroundImage: `radial-gradient(circle, ${color} 50%, ${`#93c5fd`} 90%)`,
      }}
    ></button>
  );
}

export default HeaderCourseBtn;
