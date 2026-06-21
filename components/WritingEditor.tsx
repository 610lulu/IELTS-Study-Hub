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
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Writing editor</p>
          <h2 className="mt-1 text-2xl font-black text-ink">Draft a response</h2>
        </div>
        <span className="chip">{wordCount} words</span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
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
          Question type
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
        Prompt
        <input
          className="input mt-2"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Some people believe..."
        />
      </label>

      <label className="mt-4 block text-sm font-bold text-ink">
        Essay
        <textarea
          className="input mt-2 min-h-72 resize-y leading-7"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write your essay here..."
        />
      </label>

      <div className="mt-4 flex justify-end">
        <button type="submit" className="btn btn-primary">
          <Save size={18} aria-hidden="true" />
          Save essay
        </button>
      </div>
    </form>
  );
}
