"use client";

import { Save } from "lucide-react";
import { useMemo, useState } from "react";
import type { QuestionType, WritingEssay, WritingTaskType } from "@/types";

interface WritingEditorProps {
  onSave: (essay: Omit<WritingEssay, "id" | "createdAt">) => void;
}

const questionTypes: QuestionType[] = [
  "Opinion",
  "Discussion",
  "Advantage",
  "Problem",
  "Report",
];

export function WritingEditor({ onSave }: WritingEditorProps) {
  const [taskType, setTaskType] = useState<WritingTaskType>("Task 2");
  const [questionType, setQuestionType] = useState<QuestionType>("Opinion");
  const [prompt, setPrompt] = useState("");
  const [content, setContent] = useState("");

  const wordCount = useMemo(() => {
    return content.trim().split(/\s+/).filter(Boolean).length;
  }, [content]);

  return (
    <form
      className="panel p-5"
      onSubmit={(event) => {
        event.preventDefault();
        if (!content.trim()) {
          return;
        }
        onSave({
          taskType,
          questionType,
          prompt: prompt.trim(),
          content: content.trim(),
        });
        setPrompt("");
        setContent("");
      }}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <label className="text-sm font-bold text-ink">
          Task
          <select
            className="input mt-2"
            value={taskType}
            onChange={(event) => setTaskType(event.target.value as WritingTaskType)}
          >
            <option>Task 1</option>
            <option>Task 2</option>
          </select>
        </label>
        <label className="text-sm font-bold text-ink md:col-span-2">
          题型
          <select
            className="input mt-2"
            value={questionType}
            onChange={(event) => setQuestionType(event.target.value as QuestionType)}
          >
            {questionTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-4 block text-sm font-bold text-ink">
        题目
        <input
          className="input mt-2"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Some people believe..."
        />
      </label>

      <label className="mt-4 block text-sm font-bold text-ink">
        作文
        <textarea
          className="input mt-2 min-h-72 resize-y leading-7"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write your essay here..."
        />
      </label>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm font-bold text-muted">{wordCount} words</span>
        <button type="submit" className="btn btn-primary">
          <Save size={18} aria-hidden="true" />
          保存作文
        </button>
      </div>
    </form>
  );
}
