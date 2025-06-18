import type { RootState } from "../../store";
import { getCourseCompletionData } from "../selectors";
import { courseSelectors } from "./coursesSlice";
import { useSelector } from "react-redux";
function HeaderCourseBtn({
  onClick,
  courseId,
}: {
  onClick: (courseId: string) => void;
  courseId: string;
}) {
  const course = useSelector((state: RootState) =>
    courseSelectors.selectById(state, courseId)
  );
  const completionData = useSelector((state: RootState) =>
    getCourseCompletionData(state, courseId)
  );
  const color = course.color;
  const letters = course.name.split(" ").map((tok) => tok[0]);

  return (
    <div className="relative  cursor-pointer rounded-full h-15 w-15 hover:brightness-[0.9] hover:shadow-[0_10px_10px_0px_rgba(255,255,255,0.1)] hover:-translate-y-[2px] transition-all">
      <div
        className="rounded-full absolute -inset-1.5"
        style={{
          background: `conic-gradient(green 0% ${
            completionData.onTrackPercent
          }%, red ${completionData.onTrackPercent}% ${
            completionData.onTrackPercent + completionData.behindPercent
          }%, blue ${
            completionData.onTrackPercent + completionData.behindPercent
          }% ${
            completionData.onTrackPercent +
            completionData.behindPercent +
            completionData.leadPercent
          }%, gray ${
            completionData.onTrackPercent +
            completionData.behindPercent +
            completionData.leadPercent
          }% 100%)`,
        }}
      ></div>

      <div className="rounded-full absolute -inset-0.5 bg-dark-primary"></div>

      <div
        className="absolute flex justify-center rounded-full inset-1"
        onClick={() => onClick(courseId)}
        style={{
          backgroundColor: `${color}`,
        }}
      >
        <span className="font-bold text-sm text-dark-primary text-center place-self-center truncate">
          {letters.join(".")}
        </span>
      </div>
    </div>
  );
}

export default HeaderCourseBtn;
