"use client";

import { CalendarDays, Mic2, Save, Shuffle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Timer } from "@/components/Timer";
import { getRandomQuestion, speakingQuestions } from "@/lib/sampleQuestions";
import { createId, loadSpeaking, STORAGE_KEYS, writeToStorage } from "@/lib/storage";
import type { SpeakingPart, SpeakingPractice } from "@/types";

const parts: SpeakingPart[] = ["Part 1", "Part 2", "Part 3"];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function SpeakingPage() {
  const [part, setPart] = useState<SpeakingPart>("Part 2");
  const [question, setQuestion] = useState(speakingQuestions["Part 2"][0]);
  const [answer, setAnswer] = useState("");
  const [records, setRecords] = useState<SpeakingPractice[]>([]);

  useEffect(() => {
    setRecords(loadSpeaking());
  }, []);

  function persist(next: SpeakingPractice[]) {
    setRecords(next);
    writeToStorage(STORAGE_KEYS.speaking, next);
  }

  function changePart(nextPart: SpeakingPart) {
    setPart(nextPart);
    setQuestion(speakingQuestions[nextPart][0]);
    setAnswer("");
  }

  function saveAnswer() {
    if (!answer.trim()) {
      return;
    }

    persist([
      {
        id: createId("speaking"),
        part,
        question,
        answer: answer.trim(),
        createdAt: new Date().toISOString(),
      },
      ...records,
    ]);
    setAnswer("");
  }

  return (
    <main className="shell py-6 md:py-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase text-sky">Speaking</p>
          <h1 className="mt-1 text-3xl font-black text-ink">口语题库</h1>
        </div>
        <span className="chip">{records.length} practices</span>
      </div>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <div className="panel p-5">
          <div className="flex flex-wrap gap-2">
            {parts.map((item) => (
              <button
                key={item}
                type="button"
                className={`btn min-h-10 px-4 ${part === item ? "btn-primary" : "btn-secondary"}`}
                onClick={() => changePart(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-lg border border-line bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black text-sky">{part}</p>
                <h2 className="mt-3 text-2xl font-black leading-8 text-ink">{question}</h2>
              </div>
              <button
                type="button"
                className="icon-button shrink-0"
                aria-label="Random question"
                title="随机抽题"
                onClick={() => setQuestion(getRandomQuestion(part))}
              >
                <Shuffle size={18} />
              </button>
            </div>
          </div>

          {part === "Part 2" ? (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Timer label="准备" seconds={60} />
              <Timer label="回答" seconds={120} />
            </div>
          ) : null}

          <label className="mt-5 block text-sm font-bold text-ink">
            回答
            <textarea
              className="input mt-2 min-h-56 resize-y leading-7"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="Type your answer..."
            />
          </label>

          <div className="mt-4 flex justify-end">
            <button type="button" className="btn btn-primary" onClick={saveAnswer}>
              <Save size={18} aria-hidden="true" />
              保存回答
            </button>
          </div>
        </div>

        <div className="panel p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black text-ink">练习记录</p>
              <p className="mt-1 text-sm font-semibold text-muted">Part 1 / Part 2 / Part 3</p>
            </div>
            <Mic2 className="text-honey" size={24} aria-hidden="true" />
          </div>

          <div className="mt-5 space-y-4">
            {records.length > 0 ? (
              records.map((record) => (
                <article key={record.id} className="rounded-lg border border-line bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="chip">{record.part}</span>
                      <h3 className="mt-3 break-words text-base font-black text-ink">
                        {record.question}
                      </h3>
                    </div>
                    <button
                      type="button"
                      className="icon-button shrink-0"
                      title="删除"
                      aria-label="Delete speaking practice"
                      onClick={() => persist(records.filter((item) => item.id !== record.id))}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="mt-3 line-clamp-4 whitespace-pre-line text-sm leading-6 text-slate-700">
                    {record.answer}
                  </p>
                  <span className="mt-4 flex items-center gap-2 text-xs font-bold text-muted">
                    <CalendarDays size={15} aria-hidden="true" />
                    {formatDate(record.createdAt)}
                  </span>
                </article>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-line bg-white p-8 text-center text-sm font-bold text-muted">
                暂无记录
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
