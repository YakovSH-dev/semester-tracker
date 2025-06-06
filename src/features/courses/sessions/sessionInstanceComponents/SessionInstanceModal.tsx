import type { IdType } from "../../../types/generalTypes";
import SessionInstanceWindow from "./SessionInstanceWindow";
import ReactDOM from "react-dom";

type Props = {
  entryId: IdType
  week: Date
  onClose: () => void;
};

export default function SessionInstanceModal({
  entryId,
  week,
  onClose,
}: Props) {
  return ReactDOM.createPortal(
    <>
      <div
        className="fixed inset-0 bg-black opacity-50 z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex justify-center items-center">
        <SessionInstanceWindow
          entryId={entryId}
          week={week}
          onClose={onClose}
        />
      </div>
    </>,
    document.getElementById("modal-root")!
  );
}
