import type { Resource } from "../features/types/generalTypes";
import { XMarkIcon, LinkIcon, DocumentIcon } from "@heroicons/react/24/outline";

function ReasourceList({
  resources,
  id,
  handleDeleteResource,
}: {
  resources: Resource[];
  id?: string;
  handleDeleteResource: (link: Resource, id?: string) => void;
}) {
  const amount = resources.length;
  return (
    <div className="flex flex-row gap-2 m-2">
      {resources &&
        resources.map((resource, i) => (
          <div
            key={i}
            onClick={() =>
              window.open(resource.url, "_blank", "noopener,noreferrer")
            }
            className={`gap-2 shadow flex items-center justify-center group hover:bg-dark-primary h-10 w-fit overflow-hidden cursor-pointer 
              
            `}
          >
            <div className="relative rounded-md flex flex-col text-center text-dark-primary items-center justify-center text-[10px] px-1 truncate hover:bg-gray-700">
              {/* Icon */}
              {resource.type === "link" ? (
                <LinkIcon className="h-5 w-5" />
              ) : (
                <DocumentIcon className="h-5 w-5" />
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteResource(resource, id);
                }}
                className="invisible rounded-full hover:bg-gray-600 group-hover:visible text-red-500 absolute font-bold text-xs top-0.5 left-0.5 cursor-pointer"
              >
                <XMarkIcon className="h-3 w-3 " />
              </button>
              {resource.title}
            </div>
            {amount != i + 1 && (
              <div className="h-4/5 border-l text-dark-primary"></div>
            )}
          </div>
        ))}
    </div>
  );
}

export default ReasourceList;
