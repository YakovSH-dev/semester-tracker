import { useState } from "react";
import type { AiQuiz } from "../../types/generalTypes";
import AiQuizQuestionsContainer from "./AiQuizQuestionContainer";

export default function AiQuizesContainer({
  quizes,
  isPreview = false,
}: {
  quizes: AiQuiz[];
  isPreview?: boolean;
}) {
  const quizesAmount = quizes.length;
  const [selectedQuizIndex, setSelectedQuizIndex] = useState(quizesAmount - 1);

  return (
    <div>
      {/* Quiz navigation buttons*/}
      <div className="grid grid-cols-2 mb-2 ">
        <button
          disabled={selectedQuizIndex >= quizesAmount - 1}
          onClick={() => setSelectedQuizIndex(selectedQuizIndex + 1)}
          className="bg-red-500 place-self-start p-1 rounded-md"
        >
          next
        </button>
        <button
          disabled={selectedQuizIndex <= 0}
          onClick={() => setSelectedQuizIndex(selectedQuizIndex - 1)}
          className="bg-red-500 place-self-end p-1 rounded-md"
        >
          prev
        </button>
      </div>
      {/* Quizes */}
      <div>
        <AiQuizQuestionsContainer
          quiz={quizes[selectedQuizIndex]}
          isPreview={isPreview}
        />
      </div>
    </div>
  );
}
