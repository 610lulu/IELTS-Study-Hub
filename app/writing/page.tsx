"use client";

import { Bot, CalendarDays, FileText, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { WritingEditor } from "@/components/WritingEditor";
import { createId, loadEssays, STORAGE_KEYS, writeToStorage } from "@/lib/storage";
import type { WritingEssay } from "@/types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
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

  return (
    <main className="shell py-6 md:py-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase text-sky">Writing</p>
          <h1 className="mt-1 text-3xl font-black text-ink">写作记录</h1>
        </div>
        <div className="flex gap-3">
          <span className="chip">{essays.length} essays</span>
          <span className="chip">{totalWords} words</span>
        </div>
      </div>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
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
              <p className="text-sm font-black text-ink">历史作文</p>
              <p className="mt-1 text-sm font-semibold text-muted">Task 1 / Task 2</p>
            </div>
            <FileText className="text-coral" size={24} aria-hidden="true" />
          </div>

          <div className="mt-5 space-y-4">
            {essays.length > 0 ? (
              essays.map((essay) => {
                const words = essay.content.trim().split(/\s+/).filter(Boolean).length;
                return (
                  <article key={essay.id} className="rounded-lg border border-line bg-white p-4">
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
                        className="icon-button shrink-0"
                        title="删除"
                        aria-label="Delete essay"
                        onClick={() => persist(essays.filter((item) => item.id !== essay.id))}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <p className="mt-3 line-clamp-4 whitespace-pre-line text-sm leading-6 text-slate-700">
                      {essay.content}
                    </p>
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <span className="flex items-center gap-2 text-xs font-bold text-muted">
                        <CalendarDays size={15} aria-hidden="true" />
                        {formatDate(essay.createdAt)}
                      </span>
                      <button type="button" className="btn btn-secondary" disabled>
                        <Bot size={18} aria-hidden="true" />
                        AI 批改
                      </button>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="rounded-lg border border-dashed border-line bg-white p-8 text-center text-sm font-bold text-muted">
                暂无作文
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
