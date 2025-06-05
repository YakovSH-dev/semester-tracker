import calculatePositionsForEntries from "../../../utils/calculatePositionsForEntries";
import { useSelector } from "react-redux";
import { getEntriesToRender } from "../../../features/selectors";
import { type RootState } from "../../../store";
import { useEffect, useRef, useState } from "react";

import WeeklyGridCell from "./WeeklyGridCell";

function WeeklyGrid({ week }: { week: Date }) {
  const entries = useSelector((state: RootState) => getEntriesToRender(state));
  const [gridDims, setGridDims] = useState({
    frRowHeight: 0,
    daysRowHeight: 0,
    timesColWidth: 0,
    frColWidth: 0,
    yOffset: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const cornerRef = useRef<HTMLDivElement>(null);

  const gridSize = containerRef.current?.scrollHeight;

  const startHour = 8;
  const endHour = 20;
  const rowsPerHour = 2;

  const numOfDays = 5;

  const numberOfFrColumns = numOfDays;
  const numberOfFrRows = (endHour - startHour) * rowsPerHour;

  const posEntries = calculatePositionsForEntries(entries, rowsPerHour);

  useEffect(() => {
    const calcGridDims = () => {
      if (containerRef.current != null && cornerRef.current != null) {
        const cornerRect = cornerRef.current.getBoundingClientRect();
        const gridRect = containerRef.current.getBoundingClientRect();

        const timesColWidth = cornerRect.width;
        const daysRowHeight = cornerRect.height;

        const gridHeight = containerRef.current.scrollHeight;
        const frRowHeight = (gridHeight - daysRowHeight) / numberOfFrRows;

        const gridWidth = gridRect.width;
        const frColWidth = (gridWidth - timesColWidth) / numberOfFrColumns;

        const yOffset = daysRowHeight;
        setGridDims({
          frRowHeight: frRowHeight,
          daysRowHeight: daysRowHeight,
          frColWidth: frColWidth,
          timesColWidth: timesColWidth,
          yOffset: yOffset,
        });
      }
    };

    window.addEventListener("resize", calcGridDims);
    calcGridDims();

    return () => {
      window.removeEventListener("resize", calcGridDims);
    };
  }, [gridSize]);

  const days = [
    "ראשון",
    "שני",
    "שלישי",
    "רביעי",
    "חמישי",
    "שישי",
    "שבת",
  ].splice(0, numOfDays);

  const times = [];

  for (let hour = startHour; hour < endHour; hour++) {
    const formattedHour = hour < 10 ? "0" + hour : hour.toString();

    times.push(`${formattedHour}:00`);

    times.push(`${formattedHour}:30`);
  }

  const lineColor = "#bfdbfe";
  const rowColorA = "#bfdbfe";
  const rowColorB = "white";
  const lineWidth = "1px";

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `auto repeat(${days.length}, minmax(auto, 1fr))`,
    gridTemplateRows: `auto repeat(${
      (endHour - startHour) * rowsPerHour
    }, minmax(auto, 1fr))`,
    backgroundColor: `white`,

    backgroundImage: `
    repeating-linear-gradient(
      to left,
      ${lineColor} 0px,
      ${lineColor} ${lineWidth},
      transparent ${lineWidth},
      transparent ${gridDims.frColWidth}px
    ),

    repeating-linear-gradient(
      to bottom,
      ${lineColor} 0px,
      ${lineColor} ${lineWidth},

      ${rowColorA} calc(${lineWidth} + ${lineWidth}),
      ${rowColorA} calc(${gridDims.frRowHeight}px - ${lineWidth}),

      ${lineColor} ${gridDims.frRowHeight}px,
      ${lineColor} calc(${gridDims.frRowHeight}px + ${lineWidth}),

      ${rowColorA} calc(${lineWidth} + ${gridDims.frRowHeight}px),
      ${rowColorA} ${gridDims.frRowHeight * 2}px,

      ${rowColorB} ${gridDims.frRowHeight * 2}px,
      ${rowColorB} ${gridDims.frRowHeight * 3}px,

      ${lineColor} ${gridDims.frRowHeight * 3}px,
      ${lineColor} calc(${lineWidth} + ${gridDims.frRowHeight * 3}px),

      ${rowColorB} calc(${lineWidth} + ${gridDims.frRowHeight * 3}px),
      ${rowColorB} ${gridDims.frRowHeight * 4}px
    ),

    repeating-linear-gradient(
      to bottom,
      ${lineColor} 0px,
      ${lineColor} ${lineWidth},
      transparent ${lineWidth},
      transparent ${gridDims.frRowHeight}px
    )
  `,

    backgroundPosition: `-${gridDims.timesColWidth}px ${gridDims.yOffset}px`,
    backgroundSize: `100% 100%`,
    backgroundRepeat: " no-repeat",
  };

  return (
    <div className="h-full w-full overflow-y-auto hide-scrollbar bg-blue-300 p-1 rounded-lg">
      <div
        className="h-full w-full  rounded-b-lg "
        style={gridStyle}
        dir="rtl"
        ref={containerRef}
      >
        {/* Corner Cell */}
        <div
          className="bg-blue-300"
          ref={cornerRef}
          style={{ gridRow: "1", gridColumn: "1" }}
        ></div>

        {days.map((day, index) => (
          <div
            className="text-md text-center bg-blue-300 font-bold text-white"
            key={day}
            style={{
              gridRow: "1",
              gridColumn: `${index + 2}`,
              width: "100%",
            }}
          >
            {day}
          </div>
        ))}

        {times.map((time, index) => (
          <div
            className="text-xs text-center bg-blue-300 box-border px-1 font-black text-amber-50"
            key={time}
            style={{
              gridColumn: "1",
              gridRow: `${index + 2}`,
            }}
          >
            {time}
          </div>
        ))}

        {posEntries.map((entry) => (
          <div
            key={entry.id}
            className="relative h-full"
            style={{
              gridColumn: `${entry.dayOfWeek + 2}`,
              gridRow: `${
                entry.startRow - startHour * rowsPerHour + 2
              } / span ${entry.rowSpan}`,
            }}
          >
            <div
              className="absolute max-h-full min-h-full z-1 flex rounded-lg p-0.5 justify-center transition-transform duration-500 hover:max-h-500 hover:w-100 hover:z-10 overflow-hidden"
              style={{
                left: `${
                  (entry.columnIndex ?? 0) * (100 / entry.totalColumns)
                }%`,
                width: `${100 / entry.totalColumns}%`,
              }}
            >
              {<WeeklyGridCell entryId={entry.id} week={week} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeeklyGrid;
