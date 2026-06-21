"use client";

import { CheckCircle2, Circle } from "lucide-react";
import type { StudyTask } from "@/types";

interface TaskListProps {
  tasks: StudyTask[];
  onToggle?: (taskId: string) => void;
}

const areaTone: Record<StudyTask["area"], string> = {
  Listening: "bg-sky/15 text-sky",
  Reading: "bg-aqua/15 text-aqua",
  Writing: "bg-coral/15 text-coral",
  Speaking: "bg-honey/30 text-ink",
  Vocabulary: "bg-wash text-muted",
};

export function TaskList({ tasks, onToggle }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-line bg-white p-6 text-center text-sm font-bold text-muted">
        No tasks yet
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div key={task.id} className="soft-row flex items-center justify-between gap-3 p-3">
          <div className="min-w-0">
            <p className={`text-sm font-extrabold ${task.done ? "text-muted line-through" : "text-ink"}`}>
              {task.title}
            </p>
            <span className={`mt-2 inline-flex rounded-full px-2 py-1 text-[11px] font-black ${areaTone[task.area]}`}>
              {task.area}
            </span>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={() => onToggle?.(task.id)}
            aria-label={task.done ? "Mark as unfinished" : "Mark as finished"}
            title={task.done ? "Mark as unfinished" : "Mark as finished"}
          >
            {task.done ? <CheckCircle2 size={20} /> : <Circle size={20} />}
          </button>
        </div>
      ))}
    </div>
  );
}
