import type { AiQuiz } from "../../types/generalTypes";
import AiQuizItem from "./AiQuizItem";

export default function AiQuizQuestionsContainer({
  quiz,
  isPreview,
}: {
  quiz: AiQuiz;
  isPreview?: boolean;
}) {
  return (
    <div className="">
      {quiz.questions.map((question, index) => (
        <div className="my-5">
          <AiQuizItem key={index} quiz={question} isPreview={isPreview} />
        </div>
      ))}
    </div>
  );
}
