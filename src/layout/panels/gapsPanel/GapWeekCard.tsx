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
    <div className="flex w-full flex-col bg-dark-secondary mt-1 max-h-1/3 rounded-lg">

      <header className="text-center text-sm font-bold p-1 text-dark-primary ">
        <button
          className="cursor-pointer p-1 px-3 bg-danger rounded-2xl"
          onClick={() =>
            changeSelectedWeek(parse(week, "yyyy-MM-dd", new Date()))
          }
        >
          {week}
        </button>
      </header>

      <main className="grid grid-rows-2 auto-cols-[31%] grid-flow-col max-h-full gap-2 p-2 overflow-x-auto">

        {entries.map((e) => (
          <GapEntryCard key={e} entryId={e} week={week} />
        ))}
      </main>
    </div>
  );
}

export default GapWeekCard;
