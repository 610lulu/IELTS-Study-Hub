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
      { label: "Target band", value: plan.targetBand },
      { label: "Daily study", value: `${plan.dailyMinutes} min` },
      { label: "Today done", value: `${completionRate}%` },
      { label: "Days left", value: remainingDays === null ? "--" : `${remainingDays}` },
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
    <main className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Study plan</p>
          <h1 className="page-title">Plan board</h1>
          <p className="page-subtitle">Set the exam target and keep today focused.</p>
        </div>
        <span className="chip">{todayKey()}</span>
      </header>

      <section className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {planStats.map((item) => (
          <article key={item.label} className="metric">
            <p className="metric-label">{item.label}</p>
            <p className="metric-value">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.88fr_1.12fr]">
        <form className="panel p-5" onSubmit={savePlan}>
          <div>
            <p className="eyebrow">Settings</p>
            <h2 className="mt-1 text-xl font-black text-ink">Exam plan</h2>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold text-ink">
              Current band
              <input
                className="input mt-2"
                value={plan.currentBand}
                onChange={(event) => setPlan({ ...plan, currentBand: event.target.value })}
                placeholder="5.5"
              />
            </label>
            <label className="text-sm font-bold text-ink">
              Target band
              <input
                className="input mt-2"
                value={plan.targetBand}
                onChange={(event) => setPlan({ ...plan, targetBand: event.target.value })}
                placeholder="6.5"
              />
            </label>
            <label className="text-sm font-bold text-ink">
              Exam date
              <input
                className="input mt-2"
                type="date"
                value={plan.examDate}
                onChange={(event) => setPlan({ ...plan, examDate: event.target.value })}
              />
            </label>
            <label className="text-sm font-bold text-ink">
              Daily minutes
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
            Weekly goal
            <textarea
              className="input mt-2 min-h-28 resize-y"
              value={plan.weeklyGoal}
              onChange={(event) => setPlan({ ...plan, weeklyGoal: event.target.value })}
            />
          </label>
          <div className="mt-4 flex justify-end">
            <button type="submit" className="btn btn-primary">
              <Save size={18} aria-hidden="true" />
              Save plan
            </button>
          </div>
        </form>

        <div className="panel p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Today tasks</p>
              <h2 className="mt-1 text-xl font-black text-ink">{completed}/{tasks.length} completed</h2>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-aqua/15 text-aqua">
              <CalendarCheck size={22} aria-hidden="true" />
            </div>
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
            <button type="submit" className="btn btn-accent">
              <Plus size={18} aria-hidden="true" />
              Add
            </button>
          </form>

          <div className="mt-5">
            <TaskList tasks={tasks} onToggle={toggleTask} />
          </div>

          <button
            type="button"
            className="mt-4 text-sm font-black text-ink underline decoration-honey decoration-2 underline-offset-4"
            onClick={resetTodayTasks}
          >
            Reset default tasks
          </button>
        </div>
      </section>
    </main>
  );
}
