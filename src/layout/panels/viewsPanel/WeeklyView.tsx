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
    <div className="h-full flex flex-col bg-dark-tertiary p-1">
      <header className="grid grid-cols-[1fr_1fr_1fr] gap-2 place-items-end overflow-hidden max-h-15">
        <div
          onClick={() => handleCurrentWeekClick()}
          className="col-start-1 cursor-pointer h-full rounded-t-lg max-w-[70%] whitespace-nowrap mr-3 bg-dark-primary text-dark-primary font-primary text-ellipsis justify-self-center overflow-hidden hover:bg-gray-500"
        >
            <span
              className="text-md px-2 m-0.5 "
              style={{ fontSize: `clamp(15px, 1vw, 20px)` }}
            >
              שבוע נוכחי - {currentWeekNum}{" "}
            </span>
        </div>

        <div
          className="col-start-2 max-w-[100%] h-full flex items-center flex-row whitespace-nowrap text-dark-primary font-primary text-center justify-self-center bg-dark-primary gap-1 rounded-t-lg overflow-hidden"
          dir="rtl"
          style={{ fontSize: `clamp(15px, 1vw, 20px)` }}
        >

            <button
              disabled={selectedWeekNum == 1}
              className="p-1 m-0.5 cursor-pointer flex  text-md  text-ellipsis transition-all rounded-full hover:bg-gray-500"
              onClick={() => handlePreviousWeekClick()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            שבוע {selectedWeekNum} : {format(selectedWeek, "dd.MM.yyyy")}

            <button
            disabled={selectedWeekNum == 13 }
              className="p-1 m-0.5 rotate-180 cursor-pointer text-md transition-all rounded-full hover:bg-gray-500"
              onClick={() => handleNextWeekClick()}
            >
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        {<WeeklyGrid week={selectedWeek} />}
      </main>
    </div>
  );
}

export default WeeklyView;
