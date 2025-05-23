import { useState, useEffect, useRef } from "react";
import parseCourse from "../utils/parseTechnionCourse";
import RawCourses from "../../filtered_courses.json";

import type { RawTechnionCourse } from "../features/types/generalTypes";

function SearchBar({
  onItemSelect,
}: {
  onItemSelect: (item: ReturnType<typeof parseCourse>) => void;
}) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<typeof RawCourses>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDropdownDown, setIsDropdownDown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsDropdownDown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim() === "") {
      setFiltered([]);
      return;
    }
    const q = query.trim().toLowerCase();
    const results = RawCourses.filter((c) =>
      c.general["שם מקצוע"].toLowerCase().includes(q)
    ).slice(0, 10);
    setFiltered(results);
  }, [query]);

  const handleItemClicked = (item: Partial<RawTechnionCourse>) => {
    if (!item?.schedule || !item?.general) return;
    const parsedItem = parseCourse(item as RawTechnionCourse);
    onItemSelect(parsedItem);
  };

  return (
    <div ref={containerRef} className="relative w-full" dir="rtl">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        onFocus={() => setIsDropdownDown(true)}
        placeholder="חפש קורס"
        className="border border-gray-300 bg-white p-2 rounded w-full focus:outline-none focus:ring focus:ring-blue-300 text-black"
      />

      {filtered.length > 0 && isDropdownDown && (
        <ul className="absolute mt-2 z-50 w-full bg-gray-100 border border-gray-200 rounded shadow-md max-h-60 overflow-y-auto">
          {filtered.map((item, index) => (
            <li
              key={index}
              className="p-2 hover:bg-blue-100 cursor-pointer text-right"
              onClick={() => {
                handleItemClicked(item);
                setQuery("");
                setFiltered([]);
              }}
            >
              {item.general["שם מקצוע"] + " - " + item.general["מספר מקצוע"]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
