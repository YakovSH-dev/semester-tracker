import type { SessionInstance } from "../../../types/modelTypes";
import type { Link } from "../../../types/generalTypes";
import ReasourceList from "../../../../layout/ReasourceList";

function SessionInstanceWindow({
  onClose,
  sessionInstances,
}: {
  onClose: () => void;
  sessionInstances: SessionInstance[];
}) {
  const handleDeleteResource = (resource: Link) => {};
  return (
    <div
      className="h-screen w-screen flex items-center justify-center"
      onClick={() => onClose()}
      dir="rtl"
    >
      <div
        className="min-h-1/2 min-w-1/2 bg-white rounded-lg grid grid-cols-2 p-2"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* Resource List */}
        <div className="">
          {sessionInstances.map((inst) => (
            <ReasourceList
              key={inst.id}
              resources={inst.resources}
              handleDeleteResource={handleDeleteResource}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SessionInstanceWindow;
