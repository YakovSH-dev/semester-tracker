import { useState } from "react";
import { startOfWeek } from "date-fns";

import ViewsPanel from "./panels/viewsPanel/ViewsPanel";
import GapsPanel from "./panels/gapsPanel/GapsPanel";
import { ChevronDoubleLeftIcon } from "@heroicons/react/24/outline";

function Dashboard({ className = "" }: { className?: string }) {
  const currentWeek = startOfWeek(new Date());
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);

  const [isGapsPanelOpen, setIsGapsPanelOpen] = useState(false);

  const handleChangeSelectedWeek = (week: Date) => {
    setSelectedWeek(week);
  };
  return (
    <div
      className={`grid [grid-template-rows:1fr] gap-2 p-2 bg-dark-secondary overflow-hidden ${className}`}
      dir="rtl"
    >
      {/* Top Row */}
      {/*<div className="h-full w-full grid [grid-template-columns:1fr_1fr] gap-2">
        <div className="bg-white rounded shadow ">Top Left</div>

        <div className="bg-white rounded shadow">Top Right</div>
      </div>*/}

      {/* Bottom Row */}
      <div className="relative h-full w-full md:flex md:flex-row gap-2 overflow-hidden">
        <div className="h-full min-w-3/4 w-full bg-dark-tertiary rounded shadow overflow-hidden">
          <ViewsPanel
            selectedWeek={selectedWeek}
            setSelectedWeek={setSelectedWeek}
            isGapsPanelOpen={isGapsPanelOpen}
          />
        </div>
        <div
          className={`absolute top-0 left-0 z-10 md:static h-full bg-dark-tertiary rounded shadow ${
            isGapsPanelOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform`}
        >
          <div
            className={` ${
              isGapsPanelOpen ? "md:w-full" : "md:w-0"
            } transition-transform`}
          >
            <GapsPanel
              className={""}
              changeSelectedWeek={handleChangeSelectedWeek}
            />
            <button
              className="absolute top-2 -right-5 w-10 h-5 rounded bg-dark-primary cursor-pointer flex"
              onClick={() => setIsGapsPanelOpen(!isGapsPanelOpen)}
            >
              <ChevronDoubleLeftIcon
                className={`text-dark-primary ${
                  !isGapsPanelOpen && "rotate-180 transition-transform"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
