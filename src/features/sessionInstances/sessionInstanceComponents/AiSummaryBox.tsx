import type { AiSummary } from "../../types/generalTypes";

import ReactMarkdown from "react-markdown";

export default function AiSummaryBox({
  className = "",
  summary,
}: {
  className?: string;
  summary: AiSummary;
}) {
  return (
    <div>
      <div dir="rtl" className={`text-right text-dark-primary ${className}`}>
        <ReactMarkdown>{summary.text}</ReactMarkdown>
      </div>
    </div>
  );
}
