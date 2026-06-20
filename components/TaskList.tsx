"use client";

import { CheckCircle2, Circle } from "lucide-react";
import type { StudyTask } from "@/types";

interface TaskListProps {
  tasks: StudyTask[];
  onToggle?: (taskId: string) => void;
}

const areaTone: Record<StudyTask["area"], string> = {
  Listening: "text-sky bg-blue-50 border-blue-100",
  Reading: "text-aqua bg-teal-50 border-teal-100",
  Writing: "text-coral bg-rose-50 border-rose-100",
  Speaking: "text-honey bg-amber-50 border-amber-100",
  Vocabulary: "text-slate-700 bg-slate-100 border-slate-200",
};

export function TaskList({ tasks, onToggle }: TaskListProps) {
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center justify-between gap-3 rounded-lg border border-line bg-white p-3"
        >
          <div className="min-w-0">
            <p className={`text-sm font-bold ${task.done ? "text-muted line-through" : "text-ink"}`}>
              {task.title}
            </p>
            <span className={`mt-2 inline-flex rounded-full border px-2 py-1 text-xs font-bold ${areaTone[task.area]}`}>
              {task.area}
            </span>
          </div>
          <button
            type="button"
            className="icon-button shrink-0"
            onClick={() => onToggle?.(task.id)}
            aria-label={task.done ? "Mark as unfinished" : "Mark as finished"}
            title={task.done ? "取消完成" : "完成"}
          >
            {task.done ? <CheckCircle2 size={20} /> : <Circle size={20} />}
          </button>
        </div>
      ))}
    </div>
  );
}
