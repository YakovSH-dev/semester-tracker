import type { Link } from "../features/types/generalTypes";

function ReasourceList({
  resources,
  handleDeleteResource,
}: {
  resources: Link[];
  handleDeleteResource: (link: Link) => void;
}) {
  return (
    <>
      {resources &&
        resources.map((resource, i) => (
          <div
            key={i}
            onClick={() =>
              window.open(resource.url, "_blank", "noopener,noreferrer")
            }
            className="relative shadow flex items-center justify-center group hover:bg-gray-300 bg-gray-100 h-10 w-10 rounded overflow-hidden cursor-pointer"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteResource(resource);
              }}
              className="invisible group-hover:visible hover:text-red-500 absolute font-bold top-0 text-xs left-1 cursor-pointer"
            >
              x
            </button>
            <p className="text-center text-[10px] px-1 truncate">
              {resource.title}
            </p>
          </div>
        ))}
    </>
  );
}

export default ReasourceList;
