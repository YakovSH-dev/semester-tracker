import WeeklyView from "./WeeklyView";
function ViewsPanel({
  selectedWeek,
  setSelectedWeek,
}: {
  selectedWeek: Date;
  setSelectedWeek: React.Dispatch<React.SetStateAction<Date>>;
}) {
  return (
    <div className="h-full overflow-hidden">
      <WeeklyView
        selectedWeek={selectedWeek}
        setSelectedWeek={setSelectedWeek}
      />
    </div>
  );
}

export default ViewsPanel;
