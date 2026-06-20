"use client";

import { BookOpenText, CalendarDays, CheckCircle2, Flame, Mic2, PenLine } from "lucide-react";
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
  upsertTasksForToday,
} from "@/lib/storage";
import type { SpeakingPractice, StudyPlan, StudyTask, VocabularyWord, WritingEssay } from "@/types";

const journey = [
  {
    band: "5.5",
    title: "当前阶段",
    items: ["语法错误较多", "写作结构不稳定", "口语表达容易停顿"],
  },
  {
    band: "6.0",
    title: "下一阶段",
    items: ["完整四段式作文", "口语回答扩展到 3-5 句", "阅读能定位关键词"],
  },
  {
    band: "6.5",
    title: "目标阶段",
    items: ["写作逻辑清楚", "词汇替换自然", "口语有例子和细节"],
  },
];

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
    setTasks(todayTasks);
    setAllTasks(loadAllTasks().length ? loadAllTasks() : todayTasks);
  }, []);

  const completedTasks = tasks.filter((task) => task.done).length;
  const completionRate = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const streak = calculateStreak(allTasks);

  const stats = [
    {
      label: "已背单词",
      value: words.filter((word) => word.status === "mastered").length,
      icon: BookOpenText,
      tone: "text-sky bg-blue-50",
    },
    {
      label: "作文记录",
      value: essays.length,
      icon: PenLine,
      tone: "text-coral bg-rose-50",
    },
    {
      label: "口语练习",
      value: speaking.length,
      icon: Mic2,
      tone: "text-honey bg-amber-50",
    },
    {
      label: "今日完成",
      value: `${completionRate}%`,
      icon: CheckCircle2,
      tone: "text-aqua bg-teal-50",
    },
  ];

  const skillProgress = useMemo(() => {
    const mastered = words.filter((word) => word.status === "mastered").length;
    return [
      { skill: "Listening" as const, value: Math.min(100, 28 + speaking.length * 5), target: "精听与跟读", accent: "sky" as const },
      { skill: "Reading" as const, value: Math.min(100, 24 + mastered * 2), target: "定位与同义替换", accent: "aqua" as const },
      { skill: "Writing" as const, value: Math.min(100, 30 + essays.length * 8), target: "结构与论证", accent: "coral" as const },
      { skill: "Speaking" as const, value: Math.min(100, 34 + speaking.length * 7), target: "扩展与流利度", accent: "honey" as const },
    ];
  }, [essays.length, speaking.length, words]);

  function toggleTask(taskId: string) {
    const next = tasks.map((task) =>
      task.id === taskId ? { ...task, done: !task.done } : task,
    );
    setTasks(next);
    upsertTasksForToday(next);
    setAllTasks(loadAllTasks());
  }

  return (
    <main className="shell py-6 md:py-8">
      <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="panel p-5 md:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase text-sky">IELTS Study Hub</p>
              <h1 className="mt-2 text-3xl font-black text-ink md:text-4xl">BandUp 提分工作台</h1>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-line bg-white p-3">
                <p className="text-xs font-bold text-muted">当前</p>
                <p className="mt-1 text-2xl font-black text-ink">{plan.currentBand}</p>
              </div>
              <div className="rounded-lg border border-line bg-white p-3">
                <p className="text-xs font-bold text-muted">目标</p>
                <p className="mt-1 text-2xl font-black text-sky">{plan.targetBand}</p>
              </div>
              <div className="rounded-lg border border-line bg-white p-3">
                <p className="text-xs font-bold text-muted">连续</p>
                <p className="mt-1 flex items-center gap-1 text-2xl font-black text-honey">
                  <Flame size={20} aria-hidden="true" />
                  {streak}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(({ label, value, icon: Icon, tone }) => (
              <article key={label} className="rounded-lg border border-line bg-white p-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tone}`}>
                  <Icon size={19} aria-hidden="true" />
                </div>
                <p className="mt-4 text-sm font-bold text-muted">{label}</p>
                <p className="mt-1 text-3xl font-black text-ink">{value}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="panel p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black text-ink">今日任务</p>
              <p className="mt-1 text-sm font-semibold text-muted">{completedTasks}/{tasks.length} completed</p>
            </div>
            <CalendarDays className="text-sky" size={24} aria-hidden="true" />
          </div>
          <div className="mt-4">
            <TaskList tasks={tasks} onToggle={toggleTask} />
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {skillProgress.map((item) => (
          <ProgressCard key={item.skill} {...item} />
        ))}
      </section>

      <section className="mt-6 panel p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black text-sky">Band Score Journey</p>
            <h2 className="mt-1 text-2xl font-black text-ink">5.5 到 6.5 的路径</h2>
          </div>
          <p className="text-sm font-bold text-muted">{plan.weeklyGoal}</p>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {journey.map((stage) => (
            <article key={stage.band} className="rounded-lg border border-line bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-3xl font-black text-ink">{stage.band}</span>
                <span className="chip">{stage.title}</span>
              </div>
              <ul className="mt-4 space-y-2">
                {stage.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-aqua" size={16} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
