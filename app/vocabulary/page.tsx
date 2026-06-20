"use client";

import { Plus, Search, Shuffle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { WordCard } from "@/components/WordCard";
import { createId, loadWords, STORAGE_KEYS, writeToStorage } from "@/lib/storage";
import type { MasteryStatus, VocabularyWord, WordTopic } from "@/types";

const topics: WordTopic[] = [
  "Education",
  "Technology",
  "Environment",
  "Cities",
  "Work",
  "Culture",
];

const statusLabels: Array<{ value: "all" | MasteryStatus; label: string }> = [
  { value: "all", label: "全部" },
  { value: "unlearned", label: "未掌握" },
  { value: "fuzzy", label: "模糊" },
  { value: "mastered", label: "已掌握" },
];

export default function VocabularyPage() {
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [example, setExample] = useState("");
  const [topic, setTopic] = useState<WordTopic>("Education");
  const [search, setSearch] = useState("");
  const [topicFilter, setTopicFilter] = useState<"all" | WordTopic>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | MasteryStatus>("all");
  const [reviewIds, setReviewIds] = useState<string[]>([]);

  useEffect(() => {
    setWords(loadWords());
  }, []);

  function persist(next: VocabularyWord[]) {
    setWords(next);
    writeToStorage(STORAGE_KEYS.words, next);
  }

  const filteredWords = useMemo(() => {
    const query = search.trim().toLowerCase();
    return words.filter((item) => {
      const matchesSearch =
        !query ||
        item.word.toLowerCase().includes(query) ||
        item.meaning.toLowerCase().includes(query);
      const matchesTopic = topicFilter === "all" || item.topic === topicFilter;
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const matchesReview = reviewIds.length === 0 || reviewIds.includes(item.id);
      return matchesSearch && matchesTopic && matchesStatus && matchesReview;
    });
  }, [reviewIds, search, statusFilter, topicFilter, words]);

  function addWord(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!word.trim() || !meaning.trim()) {
      return;
    }

    persist([
      {
        id: createId("word"),
        word: word.trim(),
        meaning: meaning.trim(),
        example: example.trim(),
        topic,
        status: "unlearned",
        createdAt: new Date().toISOString(),
      },
      ...words,
    ]);
    setWord("");
    setMeaning("");
    setExample("");
  }

  function updateStatus(id: string, status: MasteryStatus) {
    persist(words.map((item) => (item.id === id ? { ...item, status } : item)));
  }

  function deleteWord(id: string) {
    persist(words.filter((item) => item.id !== id));
  }

  function pickReviewWords() {
    const pool = [...words].sort(() => Math.random() - 0.5).slice(0, 10);
    setReviewIds(pool.map((item) => item.id));
  }

  return (
    <main className="shell py-6 md:py-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase text-sky">Vocabulary</p>
          <h1 className="mt-1 text-3xl font-black text-ink">主题词库</h1>
        </div>
        <button type="button" className="btn btn-secondary" onClick={pickReviewWords}>
          <Shuffle size={18} aria-hidden="true" />
          随机复习 10 个
        </button>
      </div>

      <section className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <form className="panel p-5" onSubmit={addWord}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold text-ink">
              单词
              <input
                className="input mt-2"
                value={word}
                onChange={(event) => setWord(event.target.value)}
                placeholder="evidence"
              />
            </label>
            <label className="text-sm font-bold text-ink">
              中文释义
              <input
                className="input mt-2"
                value={meaning}
                onChange={(event) => setMeaning(event.target.value)}
                placeholder="证据"
              />
            </label>
          </div>
          <label className="mt-4 block text-sm font-bold text-ink">
            例句
            <textarea
              className="input mt-2 min-h-28 resize-y"
              value={example}
              onChange={(event) => setExample(event.target.value)}
              placeholder="The evidence suggests that..."
            />
          </label>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex-1 text-sm font-bold text-ink">
              主题
              <select
                className="input mt-2"
                value={topic}
                onChange={(event) => setTopic(event.target.value as WordTopic)}
              >
                {topics.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <button type="submit" className="btn btn-primary">
              <Plus size={18} aria-hidden="true" />
              添加
            </button>
          </div>
        </form>

        <div className="panel p-5">
          <div className="grid gap-3 md:grid-cols-[1fr_160px_150px]">
            <label className="relative text-sm font-bold text-ink">
              搜索
              <Search className="pointer-events-none absolute bottom-3 left-3 text-muted" size={18} aria-hidden="true" />
              <input
                className="input mt-2 pl-10"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="word / meaning"
              />
            </label>
            <label className="text-sm font-bold text-ink">
              主题
              <select
                className="input mt-2"
                value={topicFilter}
                onChange={(event) => setTopicFilter(event.target.value as "all" | WordTopic)}
              >
                <option value="all">全部</option>
                {topics.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-bold text-ink">
              状态
              <select
                className="input mt-2"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as "all" | MasteryStatus)}
              >
                {statusLabels.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {reviewIds.length > 0 ? (
            <button
              type="button"
              className="mt-4 text-sm font-bold text-sky hover:text-ink"
              onClick={() => setReviewIds([])}
            >
              查看全部单词
            </button>
          ) : null}

          <div className="mt-5 grid gap-4">
            {filteredWords.length > 0 ? (
              filteredWords.map((item) => (
                <WordCard
                  key={item.id}
                  word={item}
                  onStatusChange={updateStatus}
                  onDelete={deleteWord}
                />
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-line bg-white p-8 text-center text-sm font-bold text-muted">
                暂无单词
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
