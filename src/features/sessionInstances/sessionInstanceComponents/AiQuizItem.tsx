import { useState } from "react";
import type { AiQuizQuestion } from "../../types/generalTypes";

type AnswerOption = "a" | "b" | "c" | "d";

export default function AiQuizItem({
  quiz,
  isPreview = false,
}: {
  quiz: AiQuizQuestion;
  isPreview?: boolean;
}) {
  const [choice, setChoice] = useState<AnswerOption | undefined>();
  const handleSelectAnswer = (key: AnswerOption) => {
    setChoice(key);
  };
  return (
    <ol className="border bg-dark-tertiary font-primary text-dark-primary rounded-lg p-2">
      <div className="text-center font-primary font-bold text-md mb-2">
        {quiz.difficulty} <br />
        {quiz.question}
      </div>
      <li className="flex flex-col gap-2 text-sm">
        {Object.entries(quiz.possibleAnswers).map(([key, answer]) => {
          const isSelected = choice !== undefined;
          const isCorrect = key === quiz.correctAnswer;

          const bgColor =
            isSelected && isCorrect
              ? "bg-green-600"
              : isSelected
              ? "bg-red-600"
              : "";

          return (
            <button
              disabled={isPreview}
              key={key}
              className={`p-1 border rounded-lg brightness-100 hover:brightness-75 ${bgColor}`}
              onClick={() => {
                handleSelectAnswer(key as AnswerOption);
              }}
            >
              {answer}
              {choice && key === quiz.correctAnswer && (
                <div className="border mt-1 rounded-md p-1">
                  {"הסבר: " + quiz.explanation}
                </div>
              )}
            </button>
          );
        })}
      </li>
    </ol>
  );
}
