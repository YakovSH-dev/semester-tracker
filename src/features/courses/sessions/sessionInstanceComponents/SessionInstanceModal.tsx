import type { SessionInstance } from "../../../types/modelTypes";
import SessionInstanceWindow from "./SessionInstanceWindow";
import ReactDOM from "react-dom";

type Props = {
  sessionInstances: SessionInstance[];
  onClose: () => void;
};

export default function SessionInstanceModal({
  sessionInstances,
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
          sessionInstances={sessionInstances}
          onClose={onClose}
        />
      </div>
    </>,
    document.getElementById("modal-root")!
  );
}
