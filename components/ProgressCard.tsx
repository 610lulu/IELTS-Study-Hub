import type { SkillName } from "@/types";

interface ProgressCardProps {
  skill: SkillName;
  value: number;
  target: string;
  accent: "sky" | "aqua" | "coral" | "honey";
}

const accentClasses = {
  sky: "bg-sky",
  aqua: "bg-aqua",
  coral: "bg-coral",
  honey: "bg-honey",
};

export function ProgressCard({ skill, value, target, accent }: ProgressCardProps) {
  return (
    <article className="panel p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-black text-ink">{skill}</h3>
          <p className="mt-1 text-sm font-semibold text-muted">{target}</p>
        </div>
        <span className="text-2xl font-black text-ink">{value}%</span>
      </div>
      <div className="mt-5 h-2 rounded-full bg-slate-100">
        <div
          className={`h-2 rounded-full ${accentClasses[accent]}`}
          style={{ width: `${Math.max(4, Math.min(value, 100))}%` }}
        />
      </div>
    </article>
  );
}
