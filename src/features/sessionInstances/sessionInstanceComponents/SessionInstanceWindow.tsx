// Types
import type {
  IdType,
  Resource,
  AiSummary,
  AiQuiz,
  AiQuizQuestion,
} from "../../types/generalTypes";
import type { WeeklyContent } from "../../types/modelTypes";
import type { RootState } from "../../../store";

// React
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

// Utils
import { format, startOfWeek } from "date-fns";

// Selectors
import { sessionTemplatesSelectors } from "../../sessionTemplates/sessionTemplatesSlice";
import { courseSelectors } from "../../courses/coursesSlice";
import { getWeeklyContentForTemplateByWeek } from "../../selectors";

import { deletePDFResource } from "../../../firebase/storage";
import { generateSummary, generateQuiz } from "../../../firebase";

// Components
import AiContentContainer from "./AiContentContainer";
import ReasourceList from "../../../layout/ReasourceList";
import { PlusIcon } from "@heroicons/react/24/solid";
import { ensureSignedIn } from "../../../firebase/auth";
import AddResourceForm from "../../../layout/AddResourceForm";
import { updateWeeklyContent } from "../../weeklyContent/weeklyContentSlice";

function SessionInstanceWindow({
  onClose,
  templateId,
  week,
}: {
  onClose: () => void;
  templateId: IdType;
  week: Date;
}) {
  const weekISO = startOfWeek(week).toISOString();
  // Data
  const template = useSelector((state: RootState) =>
    sessionTemplatesSelectors.selectById(state, templateId)
  );
  const weeklyContent: WeeklyContent | undefined = useSelector(
    (state: RootState) =>
      getWeeklyContentForTemplateByWeek(state, weekISO, templateId)
  );
  const course = useSelector((state: RootState) =>
    courseSelectors.selectById(state, template.courseId)
  );

  // States
  const [isAddResourceFormOpen, setisAddResourceFormOpen] = useState(false);
  const [focusedContent, setFocusedContent] = useState<
    "summary" | "quizes" | null
  >(null);

  const dispatch = useDispatch();
  if (!weeklyContent) return;
  // Handlers
  const handleDeleteResource = async (resource: Resource) => {
    deletePDFResource(resource);

    dispatch(
      updateWeeklyContent({
        id: weeklyContent.id,
        changes: {
          resources: weeklyContent.resources.filter(
            (r) => r.title != resource.title
          ),
        },
      })
    );
  };

  const handleAddResource = (resource: Resource) => {
    dispatch(
      updateWeeklyContent({
        id: weeklyContent.id,
        changes: { resources: [...weeklyContent.resources, resource] },
      })
    );
  };

  // Summary Handlers
  const handleGenerateSummary = async (): Promise<AiSummary> => {
    const fileNames = weeklyContent.resources.map((resource) => resource.title);

    await ensureSignedIn();
    if (fileNames.length === 0) {
      throw new Error("אין מה לסכם");
    }

    try {
      const res = await generateSummary({
        fileNames,
        additionalInfo: { courseName: course.name, language: "Hebrew" },
      });
      const tokensUsed = res.data.tokensLeft;
      console.log(tokensUsed);
      const generatedSummary = res.data.generatedSummary;
      return {
        type: "summary",
        text: generatedSummary,
      };
    } catch (error) {
      alert(`Error generating summary: ${(error as Error).message}`);
      throw error;
    }
  };

  const handleDiscardSummary = () => {};

  const handleApproveSummary = (content: AiSummary) => {
    dispatch(
      updateWeeklyContent({
        id: weeklyContent.id,
        changes: { summary: content },
      })
    );
  };

  // Quiz Handlers
  const handleGenerateQuiz = async () => {
    const fileNames = weeklyContent.resources
      .filter((res) => res.type === "file")
      .map((res) => res.title);

    await ensureSignedIn();
    if (fileNames.length === 0) {
      throw new Error("אין על מה לשאול");
    }

    try {
      const res = await generateQuiz({
        fileNames,
        additionalInfo: { courseName: course.name, language: "Hebrew" },
      });

      const raw = res.data.generatedQuiz;
      const jsonCleaned = raw.replace(/```json\s*|\s*```/g, "");

      const quizes = [...weeklyContent.aiQuizes];

      try {
        let generatedQuestions: AiQuizQuestion[] = JSON.parse(jsonCleaned);
        const generatedQuiz: AiQuiz = {
          type: "quiz",
          questions: generatedQuestions,
        };
        quizes.push(generatedQuiz);
      } catch (error) {
        throw `Failed to parse quiz JSON: ${(error as Error).message}`;
      }

      return quizes;
    } catch (error) {
      alert(`Error generating quiz: ${(error as Error).message}`);
      throw error;
    }
  };

  const handleDiscardQuiz = () => {};

  const handleApproveQuiz = (content: AiQuiz[]) => {
    dispatch(
      updateWeeklyContent({
        id: weeklyContent.id,
        changes: { aiQuizes: content },
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
        className="flex flex-col bg-dark-primary max-h-3/4 max-w-4/5 rounded-lg p-2 "
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* Header */}
        <header
          className={`text-center text-dark-primary font-primary font-bold rounded-lg py-2 px-1`}
          style={{ backgroundColor: `${course.color}` }}
        >
          {template.type +
            " - " +
            course.name +
            " : " +
            format(week, "dd.MM.yyyy")}
        </header>

        {!weeklyContent && (
          <div>
            {`Error: content for week ${week} of template ${templateId} not found`}
          </div>
        )}

        {weeklyContent && (
          <div className="flex flex-col flex-1 min-h-0">
            {/* Resources */}
            <div className="flex flex-row relative items-center justify-center">
              <ReasourceList
                handleDeleteResource={handleDeleteResource}
                resources={weeklyContent.resources}
              />
              {/* Add Resource*/}
              <div className="">
                <button
                  className="h-5 w-5 bg-dark-secondary m-3 rounded-full cursor-pointer p-1"
                  onClick={() =>
                    setisAddResourceFormOpen(!isAddResourceFormOpen)
                  }
                >
                  <PlusIcon className="text-dark-primary" />
                </button>
                {isAddResourceFormOpen && (
                  <AddResourceForm
                    onSubmit={handleAddResource}
                    className="absolute -left-1/2 z-20"
                  />
                )}
              </div>
            </div>

            {/* Ai Section */}
            <div className="relative flex custom-scrollbar min-h-0 rounded-lg">
              {/* Focus content buttons */}
              {
                <div className="absolute flex flex-col gap-2 -left-9 bg-dark-primary rounded p-2">
                  <button
                    className="bg-red-500 h-5 w-5 rounded-full hover:brightness-85 cursor-pointer"
                    onClick={() =>
                      setFocusedContent(
                        focusedContent === "summary" ? null : "summary"
                      )
                    }
                  ></button>
                  <button
                    className="bg-green-500 h-5 w-5 rounded-full hover:brightness-95 cursor-pointer"
                    onClick={() =>
                      setFocusedContent(
                        focusedContent === "quizes" ? null : "quizes"
                      )
                    }
                  ></button>
                </div>
              }

              {/* Ai content panels */}
              <div className={`flex flex-row w-full gap-2`}>
                {/* Ai Summary */}
                {(focusedContent === null || focusedContent === "summary") && (
                  <div className="flex-1 overflow-y-scroll overflow-x-hidden border border-transparent bg-red-500 rounded-lg ">
                    <AiContentContainer<AiSummary>
                      className={`min-h-full bg-dark-secondary ${
                        focusedContent === null
                          ? ""
                          : focusedContent === "summary"
                          ? "w-full"
                          : "w-0"
                      }`}
                      contentType="summary"
                      content={weeklyContent.summary}
                      onGenerate={handleGenerateSummary}
                      onApprove={handleApproveSummary}
                      onDiscard={handleDiscardSummary}
                    />
                  </div>
                )}

                {/* Ai Quiz */}
                {(focusedContent === null || focusedContent === "quizes") && (
                  <div className="flex-1 overflow-y-scroll border border-transparent bg-green-500 rounded-lg">
                    <AiContentContainer<AiQuiz[]>
                      className={`min-h-full bg-dark-secondary ${
                        focusedContent === null
                          ? ""
                          : focusedContent === "quizes"
                          ? "w-full"
                          : "w-0"
                      }`}
                      contentType="quizes"
                      content={
                        weeklyContent.aiQuizes.length === 0
                          ? null
                          : weeklyContent.aiQuizes
                      }
                      onGenerate={handleGenerateQuiz}
                      onApprove={handleApproveQuiz}
                      onDiscard={handleDiscardQuiz}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SessionInstanceWindow;
