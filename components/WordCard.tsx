"use client";

import { Check, HelpCircle, RotateCcw, Trash2 } from "lucide-react";
import type { MasteryStatus, VocabularyWord } from "@/types";

interface WordCardProps {
  word: VocabularyWord;
  onStatusChange: (id: string, status: MasteryStatus) => void;
  onDelete: (id: string) => void;
}

const statusLabels: Record<MasteryStatus, string> = {
  unlearned: "New",
  fuzzy: "Review",
  mastered: "Mastered",
};

const statusOptions: Array<{ value: MasteryStatus; icon: typeof RotateCcw }> = [
  { value: "unlearned", icon: RotateCcw },
  { value: "fuzzy", icon: HelpCircle },
  { value: "mastered", icon: Check },
];

export function WordCard({ word, onStatusChange, onDelete }: WordCardProps) {
  return (
    <article className="soft-row p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="break-words text-xl font-black text-ink">{word.word}</h3>
          <p className="mt-2 break-words text-sm font-semibold text-muted">{word.meaning}</p>
        </div>
        <span className="chip shrink-0">{word.topic}</span>
      </div>

      {word.example ? (
        <p className="mt-4 rounded-lg bg-wash p-3 text-sm font-semibold leading-6 text-muted">
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
          className="icon-button ml-auto"
          onClick={() => onDelete(word.id)}
          aria-label="Delete word"
          title="Delete word"
        >
          <Trash2 size={17} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
