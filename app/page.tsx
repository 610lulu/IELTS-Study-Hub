"use client";

import {
  BookOpenText,
  CalendarDays,
  CheckCircle2,
  Flame,
  Mic2,
  PenLine,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProgressCard } from "@/components/ProgressCard";
import { TaskList } from "@/components/TaskList";
import {
  calculateStreak,
  loadAllTasks,
  loadEssays,
  loadPlan,
  loadSpeaking,
  loadTasks,
  loadWords,
  todayKey,
  upsertTasksForToday,
} from "@/lib/storage";
import type { SpeakingPractice, StudyPlan, StudyTask, VocabularyWord, WritingEssay } from "@/types";

const journey = [
  {
    band: "5.5",
    title: "Current",
    items: ["Frequent grammar slips", "Essay structure needs control", "Speaking pauses are common"],
    progress: 38,
  },
  {
    band: "6.0",
    title: "Next stop",
    items: ["Clear four-part essays", "3 to 5 sentence speaking answers", "Faster keyword location"],
    progress: 62,
  },
  {
    band: "6.5",
    title: "Target",
    items: ["Stronger logic", "Natural paraphrasing", "Examples with detail"],
    progress: 84,
  },
];

function monthLabel() {
  return new Intl.DateTimeFormat("en-US", { month: "short" }).format(new Date());
}

export default function DashboardPage() {
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [essays, setEssays] = useState<WritingEssay[]>([]);
  const [speaking, setSpeaking] = useState<SpeakingPractice[]>([]);
  const [plan, setPlan] = useState<StudyPlan>(loadPlan());
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [allTasks, setAllTasks] = useState<StudyTask[]>([]);

  useEffect(() => {
    setWords(loadWords());
    setEssays(loadEssays());
    setSpeaking(loadSpeaking());
    setPlan(loadPlan());
    const todayTasks = loadTasks();
    const storedTasks = loadAllTasks();
    setTasks(todayTasks);
    setAllTasks(storedTasks.length ? storedTasks : todayTasks);
  }, []);

  const completedTasks = tasks.filter((task) => task.done).length;
  const completionRate = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const streak = calculateStreak(allTasks);
  const masteredWords = words.filter((word) => word.status === "mastered").length;
  const today = new Date().getDate();

  const stats = [
    {
      label: "Words mastered",
      value: masteredWords,
      icon: BookOpenText,
      tone: "bg-sky/15 text-sky",
    },
    {
      label: "Essays saved",
      value: essays.length,
      icon: PenLine,
      tone: "bg-coral/15 text-coral",
    },
    {
      label: "Speaking rounds",
      value: speaking.length,
      icon: Mic2,
      tone: "bg-honey/30 text-ink",
    },
    {
      label: "Tasks done",
      value: `${completionRate}%`,
      icon: CheckCircle2,
      tone: "bg-aqua/15 text-aqua",
    },
  ];

  const skillProgress = useMemo(() => {
    return [
      {
        skill: "Listening" as const,
        value: Math.min(100, 30 + speaking.length * 4),
        target: "Shadowing and detail capture",
        accent: "sky" as const,
      },
      {
        skill: "Reading" as const,
        value: Math.min(100, 28 + masteredWords * 2),
        target: "Keyword location",
        accent: "aqua" as const,
      },
      {
        skill: "Writing" as const,
        value: Math.min(100, 32 + essays.length * 8),
        target: "Argument structure",
        accent: "coral" as const,
      },
      {
        skill: "Speaking" as const,
        value: Math.min(100, 34 + speaking.length * 7),
        target: "Fluency and examples",
        accent: "honey" as const,
      },
    ];
  }, [essays.length, masteredWords, speaking.length]);

  function toggleTask(taskId: string) {
    const next = tasks.map((task) =>
      task.id === taskId ? { ...task, done: !task.done } : task,
    );
    setTasks(next);
    upsertTasksForToday(next);
    setAllTasks(loadAllTasks());
  }

  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">IELTS Study Hub</p>
          <h1 className="page-title">Hi, Amanda!</h1>
          <p className="page-subtitle">Track the path from Band {plan.currentBand} to {plan.targetBand}.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden min-h-10 items-center gap-2 rounded-lg border border-line bg-white px-4 text-sm font-bold text-muted sm:flex">
            <Search size={16} aria-hidden="true" />
            Search study data
          </div>
          <span className="chip">{todayKey()}</span>
        </div>
      </header>

      <section className="grid gap-4 xl:grid-cols-[1.55fr_0.85fr]">
        <article className="panel p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="eyebrow">Band journey</p>
              <h2 className="mt-2 text-2xl font-black text-ink">Results for today</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="metric min-w-24">
                <p className="metric-label">Current</p>
                <p className="metric-value">{plan.currentBand}</p>
              </div>
              <div className="metric min-w-24">
                <p className="metric-label">Target</p>
                <p className="metric-value">{plan.targetBand}</p>
              </div>
              <div className="metric min-w-24">
                <p className="metric-label">Streak</p>
                <p className="mt-2 flex items-center gap-1 text-3xl font-black text-ink">
                  <Flame size={19} className="text-honey" aria-hidden="true" />
                  {streak}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {journey.map((stage) => (
              <div key={stage.band} className="rounded-lg bg-[#d8d0bf] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black text-muted">{stage.title}</p>
                    <p className="mt-2 text-4xl font-black text-ink">{stage.band}</p>
                  </div>
                  <span className="chip">{stage.progress}%</span>
                </div>
                <div className="mt-5 h-2 rounded-full bg-white/60">
                  <div
                    className="h-2 rounded-full bg-honey"
                    style={{ width: `${stage.progress}%` }}
                  />
                </div>
                <ul className="mt-4 space-y-2">
                  {stage.items.map((item) => (
                    <li key={item} className="flex gap-2 text-sm font-bold text-[#4f4a43]">
                      <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-ink" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </article>

        <article className="panel-dark p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black">Training days</p>
              <p className="mt-1 text-xs font-bold text-white/55">{monthLabel()}</p>
            </div>
            <CalendarDays size={22} className="text-honey" aria-hidden="true" />
          </div>
          <div className="mt-5 grid grid-cols-7 gap-2 text-center text-[11px] font-black text-white/55">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
              <span key={`${day}-${index}`}>{day}</span>
            ))}
            {Array.from({ length: 28 }, (_, index) => {
              const day = index + 1;
              const active = day === today;
              const done = active || day === 5 || day === 17 || day === 23;
              return (
                <span
                  key={day}
                  className={`flex aspect-square items-center justify-center rounded-full ${
                    active
                      ? "bg-honey text-ink"
                      : done
                        ? "bg-white/12 text-white"
                        : "text-white/45"
                  }`}
                >
                  {day}
                </span>
              );
            })}
          </div>
          <div className="mt-5 flex flex-wrap gap-3 text-[11px] font-bold text-white/65">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-honey" />
              Current day
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-white/35" />
              Practice logged
            </span>
          </div>
        </article>
      </section>

      <section className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <article key={label} className="metric">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${tone}`}>
              <Icon size={18} aria-hidden="true" />
            </div>
            <p className="mt-4 text-sm font-bold text-muted">{label}</p>
            <p className="mt-1 text-3xl font-black text-ink">{value}</p>
          </article>
        ))}
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[0.95fr_1.25fr]">
        <article className="panel p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Today focus</p>
              <h2 className="mt-1 text-xl font-black text-ink">{completedTasks}/{tasks.length} completed</h2>
            </div>
            <span className="chip">{completionRate}%</span>
          </div>
          <div className="mt-4">
            <TaskList tasks={tasks} onToggle={toggleTask} />
          </div>
        </article>

        <article className="panel p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Skill balance</p>
              <h2 className="mt-1 text-xl font-black text-ink">Four-module progress</h2>
            </div>
            <span className="chip">Goal {plan.targetBand}</span>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {skillProgress.map((item) => (
              <ProgressCard key={item.skill} {...item} />
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
