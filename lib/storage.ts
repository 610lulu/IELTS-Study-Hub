import type {
  SpeakingPractice,
  StudyPlan,
  StudyTask,
  VocabularyWord,
  WritingEssay,
} from "@/types";

export const STORAGE_KEYS = {
  words: "bandup.words",
  essays: "bandup.essays",
  speaking: "bandup.speaking",
  plan: "bandup.plan",
  tasks: "bandup.tasks",
} as const;

export const defaultPlan: StudyPlan = {
  currentBand: "5.5",
  targetBand: "6.5",
  examDate: "",
  dailyMinutes: 90,
  weeklyGoal: "完成 2 篇写作、5 次口语、70 个单词复习",
};

export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function readFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeToStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getDefaultTasks(date = todayKey()): StudyTask[] {
  return [
    {
      id: `task-${date}-vocabulary`,
      title: "复习 10 个高频单词",
      area: "Vocabulary",
      done: false,
      date,
    },
    {
      id: `task-${date}-writing`,
      title: "完成 1 个 Task 2 段落",
      area: "Writing",
      done: false,
      date,
    },
    {
      id: `task-${date}-speaking`,
      title: "完成 1 组 Part 2 口语练习",
      area: "Speaking",
      done: false,
      date,
    },
    {
      id: `task-${date}-reading`,
      title: "阅读定位关键词 20 分钟",
      area: "Reading",
      done: false,
      date,
    },
  ];
}

export function loadWords() {
  return readFromStorage<VocabularyWord[]>(STORAGE_KEYS.words, []);
}

export function loadEssays() {
  return readFromStorage<WritingEssay[]>(STORAGE_KEYS.essays, []);
}

export function loadSpeaking() {
  return readFromStorage<SpeakingPractice[]>(STORAGE_KEYS.speaking, []);
}

export function loadPlan() {
  return readFromStorage<StudyPlan>(STORAGE_KEYS.plan, defaultPlan);
}

export function loadTasks() {
  const date = todayKey();
  const allTasks = readFromStorage<StudyTask[]>(STORAGE_KEYS.tasks, []);
  const todayTasks = allTasks.filter((task) => task.date === date);
  return todayTasks.length > 0 ? todayTasks : getDefaultTasks(date);
}

export function loadAllTasks() {
  return readFromStorage<StudyTask[]>(STORAGE_KEYS.tasks, []);
}

export function upsertTasksForToday(todayTasks: StudyTask[]) {
  const date = todayKey();
  const allTasks = readFromStorage<StudyTask[]>(STORAGE_KEYS.tasks, []);
  const otherDays = allTasks.filter((task) => task.date !== date);
  writeToStorage(STORAGE_KEYS.tasks, [...otherDays, ...todayTasks]);
}

export function countTodayCompleted(tasks: StudyTask[]) {
  const today = todayKey();
  const todayTasks = tasks.filter((task) => task.date === today);
  return todayTasks.filter((task) => task.done).length;
}

export function calculateStreak(tasks: StudyTask[]) {
  const completedDates = new Set(
    tasks.filter((task) => task.done).map((task) => task.date),
  );

  let streak = 0;
  const cursor = new Date();

  while (completedDates.has(todayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}
