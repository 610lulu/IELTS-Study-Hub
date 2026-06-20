export type SkillName = "Listening" | "Reading" | "Writing" | "Speaking";

export type MasteryStatus = "unlearned" | "fuzzy" | "mastered";

export type WordTopic =
  | "Education"
  | "Technology"
  | "Environment"
  | "Cities"
  | "Work"
  | "Culture";

export type WritingTaskType = "Task 1" | "Task 2";

export type QuestionType =
  | "Opinion"
  | "Discussion"
  | "Advantage"
  | "Problem"
  | "Report";

export type SpeakingPart = "Part 1" | "Part 2" | "Part 3";

export type TaskArea = "Listening" | "Reading" | "Writing" | "Speaking" | "Vocabulary";

export interface VocabularyWord {
  id: string;
  word: string;
  meaning: string;
  example: string;
  topic: WordTopic;
  status: MasteryStatus;
  createdAt: string;
}

export interface WritingEssay {
  id: string;
  taskType: WritingTaskType;
  questionType: QuestionType;
  prompt: string;
  content: string;
  createdAt: string;
}

export interface SpeakingPractice {
  id: string;
  part: SpeakingPart;
  question: string;
  answer: string;
  createdAt: string;
}

export interface StudyPlan {
  currentBand: string;
  targetBand: string;
  examDate: string;
  dailyMinutes: number;
  weeklyGoal: string;
}

export interface StudyTask {
  id: string;
  title: string;
  area: TaskArea;
  done: boolean;
  date: string;
}
