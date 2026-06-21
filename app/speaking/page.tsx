"use client";

import { CalendarDays, Mic2, Save, Shuffle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Timer } from "@/components/Timer";
import { getRandomQuestion, speakingQuestions } from "@/lib/sampleQuestions";
import { createId, loadSpeaking, STORAGE_KEYS, writeToStorage } from "@/lib/storage";
import type { SpeakingPart, SpeakingPractice } from "@/types";

const parts: SpeakingPart[] = ["Part 1", "Part 2", "Part 3"];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
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
    <main className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Speaking</p>
          <h1 className="page-title">Speaking lab</h1>
          <p className="page-subtitle">Pick a part, answer under time pressure, and save your practice notes.</p>
        </div>
        <span className="chip">{records.length} practices</span>
      </header>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.92fr]">
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

          <div className="mt-5 panel-dark p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black text-honey">{part}</p>
                <h2 className="mt-3 text-2xl font-black leading-8 text-white">{question}</h2>
              </div>
              <button
                type="button"
                className="icon-button border-white/15 bg-white/10 text-white hover:border-honey"
                aria-label="Random question"
                title="Random question"
                onClick={() => setQuestion(getRandomQuestion(part))}
              >
                <Shuffle size={18} />
              </button>
            </div>
          </div>

          {part === "Part 2" ? (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Timer label="Preparation" seconds={60} />
              <Timer label="Answer" seconds={120} />
            </div>
          ) : null}

          <label className="mt-5 block text-sm font-bold text-ink">
            Answer
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
              Save answer
            </button>
          </div>
        </div>

        <div className="panel p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Archive</p>
              <h2 className="mt-1 text-xl font-black text-ink">Practice records</h2>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-honey/30 text-ink">
              <Mic2 size={20} aria-hidden="true" />
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {records.length > 0 ? (
              records.map((record) => (
                <article key={record.id} className="soft-row p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="chip">{record.part}</span>
                      <h3 className="mt-3 break-words text-base font-black text-ink">
                        {record.question}
                      </h3>
                    </div>
                    <button
                      type="button"
                      className="icon-button"
                      title="Delete practice"
                      aria-label="Delete speaking practice"
                      onClick={() => persist(records.filter((item) => item.id !== record.id))}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="mt-3 line-clamp-4 whitespace-pre-line text-sm font-semibold leading-6 text-muted">
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
                No speaking records yet
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
