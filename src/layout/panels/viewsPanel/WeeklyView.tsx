import {
  startOfWeek,
  differenceInWeeks,
  addWeeks,
  subWeeks,
  format,
} from "date-fns";
import { SEMESTER_START_DATE } from "../../../tempGlobalData";
import WeeklyGrid from "./WeeklyGrid";

function WeeklyView({
  selectedWeek,
  setSelectedWeek,
}: {
  selectedWeek: Date;
  setSelectedWeek: React.Dispatch<React.SetStateAction<Date>>;
}) {
  const currentWeek = startOfWeek(new Date());
  const currentWeekNum =
    differenceInWeeks(currentWeek, startOfWeek(new Date(SEMESTER_START_DATE))) +
    1;
  const selectedWeekNum =
    differenceInWeeks(
      selectedWeek,
      startOfWeek(new Date(SEMESTER_START_DATE))
    ) + 1;

  const handleNextWeekClick = () => {
    if (!selectedWeek) return;
    setSelectedWeek(addWeeks(selectedWeek, 1));
  };

  const handlePreviousWeekClick = () => {
    if (!selectedWeek) return;
    setSelectedWeek(subWeeks(selectedWeek, 1));
  };

  const handleCurrentWeekClick = () => {
    setSelectedWeek(startOfWeek(new Date()));
  };

  return (
    <div className="h-full flex flex-col bg-white p-1">
      <header className="grid grid-cols-3 place-items-center">
        <h1
          onClick={() => handleCurrentWeekClick()}
          className="flex cursor-pointer transition-all gap-1 justify-between font-light hover:bg-blue-200  justify-content px-3 mt-4 bg-blue-300 rounded-t-lg"
        >
          <span className="font-bold">שבוע נוכחי - {currentWeekNum}: </span>
          {`(${format(currentWeek, "dd.MM.yyyy")})`}
        </h1>
        <div
          className="col-start-2 flex flex-row justify-center justify-content gap-1 mt-2"
          dir="rtl"
        >
          {selectedWeekNum > 1 && (
            <button
              className="p-1 flex rounded-t-lg text-md transition-all bg-blue-300 hover:bg-blue-200"
              onClick={() => handlePreviousWeekClick()}
            >
              שבוע קודם
            </button>
          )}
          <div className="p-1 font-bold">
            שבוע {selectedWeekNum} : {format(selectedWeek, "dd.MM.yyyy")}
          </div>
          {selectedWeekNum < 13 && (
            <button
              className="p-1 flex rounded-t-lg text-md transition-all bg-blue-300 hover:bg-blue-200"
              onClick={() => handleNextWeekClick()}
            >
              שבוע הבא
            </button>
          )}
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        {<WeeklyGrid week={selectedWeek} />}
      </main>
    </div>
  );
}

export default WeeklyView;
