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

const dotClasses = {
  sky: "bg-sky/15 text-sky",
  aqua: "bg-aqua/15 text-aqua",
  coral: "bg-coral/15 text-coral",
  honey: "bg-honey/25 text-ink",
};

export function ProgressCard({ skill, value, target, accent }: ProgressCardProps) {
  const safeValue = Math.max(4, Math.min(value, 100));

  return (
    <article className="panel-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span
            className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black ${dotClasses[accent]}`}
          >
            {skill.slice(0, 1)}
          </span>
          <h3 className="mt-3 text-base font-black text-ink">{skill}</h3>
          <p className="mt-1 text-sm font-semibold text-muted">{target}</p>
        </div>
        <span className="text-2xl font-black text-ink">{value}%</span>
      </div>
      <div className="mt-5 h-2 rounded-full bg-wash">
        <div
          className={`h-2 rounded-full ${accentClasses[accent]}`}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </article>
  );
}
