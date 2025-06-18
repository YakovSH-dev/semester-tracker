import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { type AppDispatch } from "./store";

import { loadCourses } from "./features/courses/coursesSlice";
import { loadSessionTemplates } from "./features/sessionTemplates/sessionTemplatesSlice";
import { loadSessionInstances } from "./features/sessionInstances/sessionInstancesSlice";
import { loadScheduleOptions } from "./features/scheduleOptions/scheduleOptionSlice";
import { loadScheduleEntries } from "./features/scheduleEntries/scheduleEntrySlice";
import { loadweeklyContents } from "./features/weeklyContent/weeklyContentSlice";

import Header from "./layout/Header";
import Dashboard from "./layout/Dashboard";
import "./app.css";

export async function loadAllStateFromIDB(dispatch: AppDispatch) {
  await Promise.all([
    dispatch(loadCourses()),
    dispatch(loadSessionTemplates()),
    dispatch(loadSessionInstances()),
    dispatch(loadScheduleOptions()),
    dispatch(loadScheduleEntries()),
    dispatch(loadweeklyContents()),
  ]);
}

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const loadData = async () => {
      await loadAllStateFromIDB(dispatch);
    };
    loadData();
  }, [dispatch]);

  return (
    <div className="flex flex-col w-full h-screen">
      <Header />
      <Dashboard className="flex-1" />
    </div>
  );
}

export default App;
