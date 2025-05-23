import { startOfWeek, differenceInWeeks, addWeeks, format } from "date-fns";
import { SEMESTER_START_DATE } from "../../../tempGlobalData";
import GapWeekCard from "./GapWeekCard";
import { useRef, useState, useEffect } from "react";
import { getGapEntries } from "../../../features/selectors";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";

function GapsPanel({
  changeSelectedWeek,
}: {
  changeSelectedWeek: (week: Date) => void;
}) {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const mainSize = useRef<HTMLDivElement>(null);

  const currentWeek = startOfWeek(new Date());
  const prevWeeks = Array.from(
    { length: differenceInWeeks(currentWeek, SEMESTER_START_DATE) + 2 },
    (_, i) => format(addWeeks(SEMESTER_START_DATE, i), "yyyy-MM-dd")
  );

  const gapEntries = useSelector((state: RootState) =>
    getGapEntries(state, prevWeeks)
  );

  const amount = gapEntries.reduce(
    (acc, cur) => (acc += cur.gapEntries.length),
    0
  );

  useEffect(() => {
    const checkOverflow = () => {
      if (mainSize.current) {
        setIsOverflowing(
          mainSize.current.scrollHeight > mainSize.current.clientHeight
        );
      }
    };
    checkOverflow();
  }, [amount]);

  return (
    <div className="relative h-full w-full flex flex-col">
      <header className="bg-red-100 text-center font-bold text-red-500 underline p-1">
        {" "}
        פערים
      </header>
      <main
        ref={mainSize}
        className="flex-1 overflow-y-auto overflow-hidden hide-scrollbar bg-blue-100"
      >
        {gapEntries.map((g, i) => (
          <GapWeekCard
            key={i}
            week={g.week}
            entries={g.gapEntries}
            changeSelectedWeek={changeSelectedWeek}
          />
        ))}
      </main>
      {isOverflowing && (
        <div className="absolute bottom-0 left-0 w-full h-10 pointer-events-none bg-gradient-to-t from-white to-transparent flex items-end justify-center text-gray-600">
          ˅
        </div>
      )}
    </div>
  );
}

export default GapsPanel;
