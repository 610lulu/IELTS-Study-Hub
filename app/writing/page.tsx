"use client";

import { Bot, CalendarDays, FileText, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { WritingEditor } from "@/components/WritingEditor";
import { createId, loadEssays, STORAGE_KEYS, writeToStorage } from "@/lib/storage";
import type { WritingEssay } from "@/types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function WritingPage() {
  const [essays, setEssays] = useState<WritingEssay[]>([]);

  useEffect(() => {
    setEssays(loadEssays());
  }, []);

  function persist(next: WritingEssay[]) {
    setEssays(next);
    writeToStorage(STORAGE_KEYS.essays, next);
  }

  const totalWords = useMemo(() => {
    return essays.reduce((sum, essay) => {
      return sum + essay.content.trim().split(/\s+/).filter(Boolean).length;
    }, 0);
  }, [essays]);

  const avgWords = essays.length ? Math.round(totalWords / essays.length) : 0;

  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Writing</p>
          <h1 className="page-title">Writing studio</h1>
          <p className="page-subtitle">Save IELTS essays now and leave room for AI feedback later.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="chip">{essays.length} essays</span>
          <span className="chip">{totalWords} words</span>
        </div>
      </header>

      <section className="mb-4 grid gap-4 sm:grid-cols-3">
        <article className="metric">
          <p className="metric-label">Total drafts</p>
          <p className="metric-value">{essays.length}</p>
        </article>
        <article className="metric">
          <p className="metric-label">Words written</p>
          <p className="metric-value">{totalWords}</p>
        </article>
        <article className="metric">
          <p className="metric-label">Average length</p>
          <p className="metric-value">{avgWords}</p>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <WritingEditor
          onSave={(essay) => {
            persist([
              {
                ...essay,
                id: createId("essay"),
                createdAt: new Date().toISOString(),
              },
              ...essays,
            ]);
          }}
        />

        <div className="panel p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Archive</p>
              <h2 className="mt-1 text-xl font-black text-ink">Essay history</h2>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-coral/15 text-coral">
              <FileText size={20} aria-hidden="true" />
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {essays.length > 0 ? (
              essays.map((essay) => {
                const words = essay.content.trim().split(/\s+/).filter(Boolean).length;
                return (
                  <article key={essay.id} className="soft-row p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap gap-2">
                          <span className="chip">{essay.taskType}</span>
                          <span className="chip">{essay.questionType}</span>
                          <span className="chip">{words} words</span>
                        </div>
                        <h3 className="mt-3 break-words text-base font-black text-ink">
                          {essay.prompt || "Untitled essay"}
                        </h3>
                      </div>
                      <button
                        type="button"
                        className="icon-button"
                        title="Delete essay"
                        aria-label="Delete essay"
                        onClick={() => persist(essays.filter((item) => item.id !== essay.id))}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <p className="mt-3 line-clamp-4 whitespace-pre-line text-sm font-semibold leading-6 text-muted">
                      {essay.content}
                    </p>
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <span className="flex items-center gap-2 text-xs font-bold text-muted">
                        <CalendarDays size={15} aria-hidden="true" />
                        {formatDate(essay.createdAt)}
                      </span>
                      <button type="button" className="btn btn-secondary" disabled>
                        <Bot size={18} aria-hidden="true" />
                        AI feedback
                      </button>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="rounded-lg border border-dashed border-line bg-white p-8 text-center text-sm font-bold text-muted">
                No essays yet
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
