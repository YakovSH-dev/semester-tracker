
import type { IdType, Link } from "../../../types/generalTypes";
import ReasourceList from "../../../../layout/ReasourceList";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../store";
import { entrySelectors } from "../scheduleEntrySlice";
import { getWeeklyInstancesForEntry } from "../../../selectors";
import { updateSessionInstance } from "../sessionInstancesSlice";
import { useState } from "react";
import AddResourceForm from "../../../../layout/AddResourceForm";
import {format} from "date-fns"
import { sessionTemplatesSelectors } from "../sessionTemplatesSlice";
import { courseSelectors } from "../../coursesSlice";

function SessionInstanceWindow({
  onClose,
  entryId,
  week,
}: {
  onClose: () => void;
  entryId: IdType;
  week: Date;
}) {
  const entry = useSelector((state: RootState) => entrySelectors.selectById(state, entryId));
  const template = useSelector((state: RootState) => sessionTemplatesSelectors.selectById(state, entry.sessionTemplateId!))
  const course = useSelector((state: RootState) => courseSelectors.selectById(state, template.courseId))
  const instances = useSelector((state:RootState) => getWeeklyInstancesForEntry(state, format(week, "yyyy-MM-dd"), entryId))

  const [[isAddResourceFormOpen, id], setisAddResourceFormOpen] = useState<[boolean, IdType]>([false, ""]);

  const dispatch = useDispatch();

  const handleDeleteResource = (resource: Link, id?: IdType) => {
      const instance = instances.find((inst)=>inst.id == id);
      if(!instance) {
        console.error("error deleting instance resource, instance no found");
        return;
      }
      dispatch(
        updateSessionInstance({
          id: id!,
          changes: {
            resources: [...(instance.resources || [])].filter(
              (r) => r.url != resource.url
            ),
          },
        }))
  };
  const handleAddResource = (resource: Link, id?:IdType) => {
    const instance = instances.find((inst)=>inst.id === id);
    if(!instance) {
        console.error("error deleting instance resource, instance no found");
        return;
    }
    if (instance.resources.filter((r) => r.url === resource.url).length) return;
    dispatch(
      updateSessionInstance({
        id: id!,
        changes: { resources: [...(instance.resources || []), resource] },
      })
    );
  };
  
  return (
    <div
      className="h-screen w-screen flex items-center justify-center"
      onClick={() => onClose()}
      dir="rtl"
    >
      <div
        className="min-h-1/2 min-w-1/2 bg-dark-primary rounded-lg p-2"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* Header */}
        <header className="text-center border-b border-gray-300 text-dark-primary font-primary font-bold">
          {template.type + " - " + course.name + " : " + format(week, "dd.MM.yyyy")}
        </header>

        {/*Instance columns*/}
        <div className="h-fit flex flex-row p-2 gap-2 text-dark-primary font-primary">
          {instances.map((inst, index) => (
            <div className="w-full flex flex-col">
            <header className="text-center">שעה - {index}</header>
            <div className="flex-1  bg-dark-secondary p-2 flex flex-row gap-2 justify-center">
            {/* Resource List */}
            <ReasourceList
              key={inst.id}
              id={inst.id}
              resources={inst.resources}
              handleDeleteResource={handleDeleteResource}
            />
              <button className="h-8 w-8 rounded-full bg-blue-200 cursor-pointer hover:bg-blue-300" onClick={()=>setisAddResourceFormOpen([!isAddResourceFormOpen, inst.id])}>+</button>
              {isAddResourceFormOpen && inst.id === id && <AddResourceForm id={inst.id} onSubmit={handleAddResource}/>}
            </div>
            </div>
          ))}
        </div>

        

      </div>
    </div>
  );
}

export default SessionInstanceWindow;
