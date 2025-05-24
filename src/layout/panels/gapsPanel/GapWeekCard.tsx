import GapEntryCard from "./GapEntryCard";
import { parse } from "date-fns";

function GapWeekCard({
  week,
  entries,
  changeSelectedWeek,
}: {
  week: string;
  entries: string[];
  changeSelectedWeek: (week: Date) => void;
}) {
  return (
    <div className="bg-red-200 mt-1">
      <header className="text-center text-sm font-bold p-1 ">
        <button
          className="cursor-pointer p-1 underline"
          onClick={() =>
            changeSelectedWeek(parse(week, "yyyy-MM-dd", new Date()))
          }
        >
          {week}
        </button>
      </header>
      <main className="flex flex-row gap-1 overflow-x-auto p-2">
        {entries.map((e) => (
          <GapEntryCard key={e} entryId={e} week={week} />
        ))}
      </main>
      {/*<div className="bg-color-red w-[70%] border-1 border-red-900 justify-self-center mt-4"></div>*/}
    </div>
  );
}

export default GapWeekCard;
