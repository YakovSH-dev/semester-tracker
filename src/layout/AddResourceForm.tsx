// Firebase
import { ensureSignedIn } from "../firebase/auth";
import { uploadPDFResource } from "../firebase/storage";

// Types
import type { IdType, Resource } from "../features/types/generalTypes";

// React
import { useState } from "react";

// Components
import Spinner from "./Spinner";
import { CheckIcon } from "@heroicons/react/24/outline";

function AddResourceForm({
  onSubmit,
  id,
  className = "",
}: {
  onSubmit: (resource: Resource, id?: IdType) => void;
  id?: IdType;
  className?: string;
}) {
  const [[selectedFileName, selectedFile], setFile] = useState<
    [string, File | null]
  >(["", null]);
  const [Error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(null);
    setError(null);
    setFile(["", null]);

    const file = e.target.files?.[0];

    if (!file) return;
    if (file?.type != "application/pdf") {
      setError("יש לבחור קובץ PDF בלבד");
      return;
    } else if (file.size > 5 * 1024 * 1024) {
      setError("עד 5 MB");
      return;
    }
    setFile([file.name, file]);
  };
  const handleFileSubmit = async () => {
    if (!selectedFile) {
      alert("No file selected.");
      return;
    }

    setUploading(true);

    try {
      await ensureSignedIn();
      const uploadedUrl = await uploadPDFResource(
        selectedFile,
        selectedFile.name
      );
      setUrl(uploadedUrl);
      onSubmit({ type: "file", title: selectedFileName, url: uploadedUrl }, id);
    } catch (e) {
      setError("Error: " + (e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleLinkSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const url = formData.get("url") as string;
    if (title && url) onSubmit({ type: "link", title: title, url: url }, id);
  };

  return (
    <div
      className={`h-fit w-fit bg-dark-primary p-3 flex flex-row text-dark-primary rounded-lg border border-gray-400 ${className}`}
      dir="rtl"
    >
      <div className="p-3 border-l">
        <header className="text-center">קישור</header>
        <form
          onSubmit={handleLinkSubmit}
          className="flex flex-col h-fit w-fit gap-3  p-3 "
          dir="rtl"
        >
          {" "}
          <div>
            <label htmlFor="title" className="block text-xs font-light ">
              כותרת
            </label>
            <input
              type="title"
              id="title"
              name="title"
              className="mt-1 block w-50 bg-dark-input rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="url" className="text-xs font-light"></label>
            <input
              type="url"
              id="url"
              name="url"
              className="mt-1 block w-50 bg-dark-input rounded-md shadow-sm focus:border-0.5"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-1 w-5 h-5 bg-dark-secondary text-xs text-center rounded transition self-center cursor-pointer"
          >
            +
          </button>
        </form>
      </div>

      <div className="h-full w-full grid grid-rows-2 p-3">
        <header className="h-full text-center">קובץ</header>

        <label className="mx-10 mb-1 h-full w-full place-self-center text-center cursor-pointer bg-dark-secondary rounded-lg p-3">
          בחר קובץ{" "}
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            hidden
          />
        </label>

        <button
          className="cursor-pointer bg-green-900 rounded-lg my-3"
          onClick={handleFileSubmit}
          disabled={selectedFile == null}
        >
          {" "}
          העלה קובץ
        </button>

        {Error != null && (
          <p className="font-primary text-red-400 text-sm ">{Error}</p>
        )}
        {selectedFileName && (
          <p className="mt-2 text-sm text-gray-600 text-center">
            {url ? "הועלה: " : "בחירה:  "}
            {selectedFileName}
          </p>
        )}
        {uploading && <Spinner />}
        {url != null && !uploading && (
          <CheckIcon className="h-5 w-5 place-self-center" />
        )}
      </div>
    </div>
  );
}

export default AddResourceForm;
