import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { type AppDispatch } from "./store";

import { loadCourses } from "./features/courses/coursesSlice";
import { loadSessionTemplates } from "./features/courses/sessions/sessionTemplatesSlice";
import { loadSessionInstances } from "./features/courses/sessions/sessionInstancesSlice";
import { loadScheduleOptions } from "./features/courses/sessions/scheduleOptionSlice";
import { loadScheduleEntries } from "./features/courses/sessions/scheduleEntrySlice";

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
    <div className="grid [grid-template-rows:75px_auto] w-full h-screen">
      <Header />
      <Dashboard />
    </div>
  );
}

export default App;
