import ViewsPanel from "./panels/viewsPanel/ViewsPanel";
import GapsPanel from "./panels/gapsPanel/GapsPanel";
import { useState } from "react";
import { startOfWeek } from "date-fns";

function Dashboard() {
  const currentWeek = startOfWeek(new Date());
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);

  const handleChangeSelectedWeek = (week: Date) => {
    setSelectedWeek(week);
  };
  return (
    <div
      className="h-full w-full grid [grid-template-rows:auto_auto] gap-2 p-2 bg-blue-100 overflow-hidden"
      dir="rtl"
    >
      {/* Top Row */}
      {/*<div className="h-full w-full grid [grid-template-columns:1fr_1fr] gap-2">
        <div className="bg-white rounded shadow ">Top Left</div>

        <div className="bg-white rounded shadow">Top Right</div>
      </div>*/}

      {/* Bottom Row */}
      <div className="min-h-full w-full grid [grid-template-columns:4fr_1fr] gap-2 overflow-hidden">
        <div className="h-full bg-white rounded shadow overflow-hidden">
          <ViewsPanel
            selectedWeek={selectedWeek}
            setSelectedWeek={setSelectedWeek}
          />
        </div>
        <div className="h-full w-full bg-white  rounded shadow overflow-hidden">
          <GapsPanel changeSelectedWeek={handleChangeSelectedWeek} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
