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
    <div className="border-b-1 border-slate-500 p-1 ">
      <header className="text-center text-sm font-bold p-1">
        <button
          className="cursor-pointer p-1 underline"
          onClick={() =>
            changeSelectedWeek(parse(week, "yyyy-MM-dd", new Date()))
          }
        >
          {week}
        </button>
      </header>
      <main className="flex flex-row gap-1 ">
        {entries.map((e) => (
          <GapEntryCard key={e} entryId={e} week={week} />
        ))}
      </main>
    </div>
  );
}

export default GapWeekCard;
