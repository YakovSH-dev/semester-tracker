import GapEntryCard from "./GapEntryCard";
import { format } from "date-fns";

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
    <div className="flex flex-col w-full bg-dark-secondary mb-2 border border-red-600 rounded-lg overflow-hidden">
      <header className="min-w-full text-center text-sm mb-2 bg-red-600 font-bold text-dark-primary">
        <button
          className="cursor-pointer p-1 text-sm px-3 rounded-2xl"
          onClick={() => changeSelectedWeek(new Date(week))}
        >
          {format(week, "dd/MM/yyyy")}
        </button>
      </header>

      <main className="grid gap-2 mb-2 mx-2">
        {entries.map((e) => (
          <GapEntryCard key={e} entryId={e} week={week} />
        ))}
      </main>
    </div>
  );
}

export default GapWeekCard;
