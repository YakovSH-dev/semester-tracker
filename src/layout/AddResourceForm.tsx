import type { IdType, Link } from "../features/types/generalTypes";

function AddResourceForm({ onSubmit, id}: { onSubmit: (resource: Link, id?: IdType) => void, id?: IdType}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const url = formData.get("url") as string;
    if (title && url) onSubmit({ title: title, url: url }, id);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col h-fit w-fit gap-3 rounded-lg p-3 bg-blue-200"
        dir="rtl"
      >
        {" "}
        <div>
          <label
            htmlFor="title"
            className="block text-xs font-light text-gray-700"
          >
            כותרת
          </label>
          <input
            type="title"
            id="title"
            name="title"
            className="mt-1 block w-50 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="url"
            className="block text-xs font-light text-gray-700"
          >
            קישור
          </label>
          <input
            type="url"
            id="url"
            name="url"
            className="mt-1 block w-50 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-1 w-5 h-5 bg-gray-500 text-white text-xs text-center rounded hover:bg-blue-600 transition self-center"
        >
          +
        </button>
      </form>
    </div>
  );
}

export default AddResourceForm;
