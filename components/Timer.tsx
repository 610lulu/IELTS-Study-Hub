"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface TimerProps {
  label: string;
  seconds: number;
}

function formatTime(value: number) {
  const minutes = Math.floor(value / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function Timer({ label, seconds }: TimerProps) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setRemaining(seconds);
    setRunning(false);
  }, [seconds]);

  useEffect(() => {
    if (!running || remaining <= 0) {
      return;
    }

    const id = window.setInterval(() => {
      setRemaining((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(id);
  }, [remaining, running]);

  useEffect(() => {
    if (remaining === 0) {
      setRunning(false);
    }
  }, [remaining]);

  const progress = useMemo(() => {
    return seconds === 0 ? 0 : ((seconds - remaining) / seconds) * 100;
  }, [remaining, seconds]);

  return (
    <div className="rounded-lg border border-line bg-white p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-black text-ink">{label}</p>
          <p className="mt-1 font-mono text-3xl font-black tabular-nums text-sky">
            {formatTime(remaining)}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="icon-button"
            onClick={() => setRunning((value) => !value)}
            aria-label={running ? "Pause timer" : "Start timer"}
            title={running ? "暂停" : "开始"}
          >
            {running ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={() => {
              setRemaining(seconds);
              setRunning(false);
            }}
            aria-label="Reset timer"
            title="重置"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>
      <div className="mt-4 h-2 rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-aqua" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
