"use client";

import { CalendarCheck, Plus, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { TaskList } from "@/components/TaskList";
import {
  createId,
  defaultPlan,
  getDefaultTasks,
  loadAllTasks,
  loadPlan,
  loadTasks,
  STORAGE_KEYS,
  todayKey,
  upsertTasksForToday,
  writeToStorage,
} from "@/lib/storage";
import type { StudyPlan, StudyTask, TaskArea } from "@/types";

const taskAreas: TaskArea[] = ["Vocabulary", "Listening", "Reading", "Writing", "Speaking"];

function daysUntil(examDate: string) {
  if (!examDate) {
    return null;
  }

  const today = new Date(todayKey());
  const exam = new Date(examDate);
  const diff = exam.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function StudyPlanPage() {
  const [plan, setPlan] = useState<StudyPlan>(defaultPlan);
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newArea, setNewArea] = useState<TaskArea>("Vocabulary");

  useEffect(() => {
    setPlan(loadPlan());
    const todayTasks = loadTasks();
    setTasks(todayTasks);
    if (loadAllTasks().filter((task) => task.date === todayKey()).length === 0) {
      upsertTasksForToday(todayTasks);
    }
  }, []);

  const remainingDays = daysUntil(plan.examDate);
  const completed = tasks.filter((task) => task.done).length;
  const completionRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  const planStats = useMemo(
    () => [
      { label: "目标分数", value: plan.targetBand },
      { label: "每天学习", value: `${plan.dailyMinutes} min` },
      { label: "今日完成", value: `${completionRate}%` },
      { label: "倒计时", value: remainingDays === null ? "--" : `${remainingDays} days` },
    ],
    [completionRate, plan.dailyMinutes, plan.targetBand, remainingDays],
  );

  function savePlan(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    writeToStorage(STORAGE_KEYS.plan, plan);
  }

  function toggleTask(taskId: string) {
    const next = tasks.map((task) =>
      task.id === taskId ? { ...task, done: !task.done } : task,
    );
    setTasks(next);
    upsertTasksForToday(next);
  }

  function addTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newTask.trim()) {
      return;
    }

    const next = [
      ...tasks,
      {
        id: createId("task"),
        title: newTask.trim(),
        area: newArea,
        done: false,
        date: todayKey(),
      },
    ];
    setTasks(next);
    upsertTasksForToday(next);
    setNewTask("");
  }

  function resetTodayTasks() {
    const next = getDefaultTasks(todayKey());
    setTasks(next);
    upsertTasksForToday(next);
  }

  return (
    <main className="shell py-6 md:py-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase text-sky">Study Plan</p>
          <h1 className="mt-1 text-3xl font-black text-ink">学习计划</h1>
        </div>
        <span className="chip">{todayKey()}</span>
      </div>

      <section className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <form className="panel p-5" onSubmit={savePlan}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-bold text-ink">
                当前分数
                <input
                  className="input mt-2"
                  value={plan.currentBand}
                  onChange={(event) => setPlan({ ...plan, currentBand: event.target.value })}
                  placeholder="5.5"
                />
              </label>
              <label className="text-sm font-bold text-ink">
                目标分数
                <input
                  className="input mt-2"
                  value={plan.targetBand}
                  onChange={(event) => setPlan({ ...plan, targetBand: event.target.value })}
                  placeholder="6.5"
                />
              </label>
              <label className="text-sm font-bold text-ink">
                考试日期
                <input
                  className="input mt-2"
                  type="date"
                  value={plan.examDate}
                  onChange={(event) => setPlan({ ...plan, examDate: event.target.value })}
                />
              </label>
              <label className="text-sm font-bold text-ink">
                每天学习时长
                <input
                  className="input mt-2"
                  type="number"
                  min={15}
                  step={15}
                  value={plan.dailyMinutes}
                  onChange={(event) =>
                    setPlan({ ...plan, dailyMinutes: Number(event.target.value) })
                  }
                />
              </label>
            </div>
            <label className="mt-4 block text-sm font-bold text-ink">
              每周目标
              <textarea
                className="input mt-2 min-h-28 resize-y"
                value={plan.weeklyGoal}
                onChange={(event) => setPlan({ ...plan, weeklyGoal: event.target.value })}
              />
            </label>
            <div className="mt-4 flex justify-end">
              <button type="submit" className="btn btn-primary">
                <Save size={18} aria-hidden="true" />
                保存计划
              </button>
            </div>
          </form>

          <div className="grid gap-3 sm:grid-cols-2">
            {planStats.map((item) => (
              <article key={item.label} className="rounded-lg border border-line bg-white p-4 shadow-soft">
                <p className="text-sm font-bold text-muted">{item.label}</p>
                <p className="mt-2 text-2xl font-black text-ink">{item.value}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="panel p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black text-ink">今日任务</p>
              <p className="mt-1 text-sm font-semibold text-muted">{completed}/{tasks.length} completed</p>
            </div>
            <CalendarCheck className="text-aqua" size={24} aria-hidden="true" />
          </div>

          <form className="mt-5 grid gap-3 md:grid-cols-[1fr_150px_auto]" onSubmit={addTask}>
            <input
              className="input"
              value={newTask}
              onChange={(event) => setNewTask(event.target.value)}
              placeholder="Add today's task"
            />
            <select
              className="input"
              value={newArea}
              onChange={(event) => setNewArea(event.target.value as TaskArea)}
            >
              {taskAreas.map((area) => (
                <option key={area}>{area}</option>
              ))}
            </select>
            <button type="submit" className="btn btn-secondary">
              <Plus size={18} aria-hidden="true" />
              添加
            </button>
          </form>

          <div className="mt-5">
            <TaskList tasks={tasks} onToggle={toggleTask} />
          </div>

          <button
            type="button"
            className="mt-4 text-sm font-bold text-sky hover:text-ink"
            onClick={resetTodayTasks}
          >
            重新生成默认任务
          </button>
        </div>
      </section>
    </main>
  );
}
