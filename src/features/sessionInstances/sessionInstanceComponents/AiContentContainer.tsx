import { useState } from "react";
import type { AiSummary, AiQuiz, AiContent } from "../../types/generalTypes";

import Spinner from "../../../layout/Spinner";
import AiSummaryBox from "./AiSummaryBox";
import AiQuizesContainer from "./AiQuizesContainer";

import {
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

type AiContentContainerProps<T extends AiContent> = {
  className?: string;
  contentType: "quizes" | "summary";
  content: T | null;
  onGenerate: () => Promise<T>;
  onApprove: (content: T) => void;
  onDiscard: () => void;
};

export default function AiContentContainer<T extends AiContent>({
  className = "",
  contentType,
  content,
  onGenerate,
  onApprove,
  onDiscard,
}: AiContentContainerProps<T>) {
  const [state, setState] = useState<
    "empty" | "default" | "generating" | "waitingForApproval"
  >(content ? "default" : "empty");
  const [error, setError] = useState<string | null>(null);
  const [currentContent, setCurrentContent] = useState<T | null>(content);

  const handleGenerate = async () => {
    setState("generating");
    setError(null);
    try {
      const newContent = await onGenerate();
      setCurrentContent(newContent);
      setState("waitingForApproval");
    } catch (error) {
      setError((error as Error).message);
      setState("empty");
    }
  };

  const handleApprove = () => {
    setError(null);
    if (currentContent != null) {
      onApprove(currentContent);
      setState("default");
    }
  };

  const handleDiscard = () => {
    setError(null);
    onDiscard();
    setCurrentContent(content);
    setState(content === null ? "empty" : "default");
  };

  const renderContent = () => {
    if (!currentContent) return;
    switch (contentType) {
      case "summary": {
        return (
          <AiSummaryBox
            className={"flex-1"}
            summary={currentContent as AiSummary}
          />
        );
      }
      case "quizes": {
        return (
          <AiQuizesContainer
            quizes={currentContent as AiQuiz[]}
            isPreview={state === "waitingForApproval"}
          />
        );
      }
      default: {
        return <></>;
      }
    }
  };

  return (
    <div className={`p-4 rounded-lg justify-start ${className}`}>
      {state === "default" && renderContent()}

      {state === "generating" && (
        <div className="">
          <Spinner />
        </div>
      )}
      {currentContent && state === "waitingForApproval" && (
        <div className="flex-1 place-content-center">
          {renderContent()}
          <div className="gap-2 flex justify-center mt-2">
            <button onClick={handleApprove} className="btn btn-approve">
              <CheckIcon className="h-5 w-5" />
            </button>
            <button onClick={handleDiscard} className="btn btn-discard">
              <XMarkIcon className="h-5 w-5" />
            </button>
            <button onClick={handleGenerate} className="btn btn-discard">
              <ArrowPathIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
      {(state === "empty" || state === "default") && (
        <button onClick={handleGenerate} className="btn btn-generate mt-2">
          {`${state === "empty" ? "צור " : "שנה "}${
            contentType === "summary" ? "סיכום" : "שאלון"
          }`}
        </button>
      )}
      {error && (
        <div className="flex-1 flex items-center mt-2">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
