import WeeklyView from "./WeeklyView";
function ViewsPanel({
  selectedWeek,
  setSelectedWeek,
  isGapsPanelOpen,
}: {
  selectedWeek: Date;
  setSelectedWeek: React.Dispatch<React.SetStateAction<Date>>;
  isGapsPanelOpen: Boolean;
}) {
  return (
    <div className="h-full overflow-hidden">
      <WeeklyView
        selectedWeek={selectedWeek}
        setSelectedWeek={setSelectedWeek}
        isGapsPanelOpen={isGapsPanelOpen}
      />
    </div>
  );
}

export default ViewsPanel;
