"use client";

import { Check, HelpCircle, RotateCcw } from "lucide-react";
import type { MasteryStatus, VocabularyWord } from "@/types";

interface WordCardProps {
  word: VocabularyWord;
  onStatusChange: (id: string, status: MasteryStatus) => void;
  onDelete: (id: string) => void;
}

const statusLabels: Record<MasteryStatus, string> = {
  unlearned: "未掌握",
  fuzzy: "模糊",
  mastered: "已掌握",
};

const statusOptions: Array<{ value: MasteryStatus; icon: typeof RotateCcw }> = [
  { value: "unlearned", icon: RotateCcw },
  { value: "fuzzy", icon: HelpCircle },
  { value: "mastered", icon: Check },
];

export function WordCard({ word, onStatusChange, onDelete }: WordCardProps) {
  return (
    <article className="panel p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="break-words text-xl font-black text-ink">{word.word}</h3>
          <p className="mt-2 break-words text-sm font-semibold text-muted">{word.meaning}</p>
        </div>
        <span className="chip shrink-0">{word.topic}</span>
      </div>

      {word.example ? (
        <p className="mt-4 rounded-lg border border-line bg-wash p-3 text-sm leading-6 text-slate-700">
          {word.example}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {statusOptions.map(({ value, icon: Icon }) => {
          const active = word.status === value;
          return (
            <button
              key={value}
              type="button"
              className={`btn min-h-9 px-3 text-sm ${
                active ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => onStatusChange(word.id, value)}
            >
              <Icon size={16} aria-hidden="true" />
              {statusLabels[value]}
            </button>
          );
        })}
        <button
          type="button"
          className="ml-auto text-sm font-bold text-muted hover:text-coral"
          onClick={() => onDelete(word.id)}
        >
          删除
        </button>
      </div>
    </article>
  );
}
