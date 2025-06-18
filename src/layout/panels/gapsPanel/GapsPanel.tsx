import { startOfWeek } from "date-fns";
import GapWeekCard from "./GapWeekCard";
import { useRef, useState, useEffect } from "react";
import { getGapEntries } from "../../../features/selectors";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";

function GapsPanel({
  changeSelectedWeek,
  className = "",
}: {
  changeSelectedWeek: (week: Date) => void;
  className?: string;
}) {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const mainSize = useRef<HTMLDivElement>(null);

  const currentWeek = startOfWeek(new Date()).toISOString();

  const gapEntries = useSelector((state: RootState) =>
    getGapEntries(state, currentWeek)
  );

  const amount = gapEntries.length;

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
    <>
      {gapEntries.length != 0 && (
        <div
          className={`relative h-full w-full px-1 overflow-y-hidden ${className}`}
          dir="rtl"
        >
          <header className="text-center font-black font-primary bg-dark-primary danger-shadow text-dark-primary p-1 rounded mb-2">
            {" "}
            פערים
          </header>
          <main
            ref={mainSize}
            className="flex-1 w-full h-full overflow-y-auto hide-scrollbar"
          >
            {<div></div>}
            {Object.entries(
              Object.groupBy(gapEntries, (entry) => entry.week)
            ).map(([week, entries]) => (
              <GapWeekCard
                key={week}
                week={week}
                entries={entries?.map((e) => e.id) ?? [""]}
                changeSelectedWeek={changeSelectedWeek}
              />
            ))}
          </main>
          {isOverflowing && (
            <div className="absolute bottom-0 left-0 w-full h-10 pointer-events-none bg-gradient-to-t from-black to-transparent flex items-end justify-center"></div>
          )}
        </div>
      )}
    </>
  );
}

export default GapsPanel;
