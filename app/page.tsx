"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ContributionCalendar from "@/app/components/ContributionCalendar";
import { todayLocalDateString } from "@/lib/date";

type Habit = { id: string; name: string; color: string; dates: string[] };

export default function Home() {
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[] | null>(null);
  const [newName, setNewName] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function loadHabits() {
    const res = await fetch("/api/habits");
    if (res.ok) setHabits(await res.json());
  }

  useEffect(() => {
    loadHabits();
  }, []);

  async function addHabit(e: React.FormEvent) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    setNewName("");
    await fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    loadHabits();
  }

  async function toggleToday(habit: Habit) {
    setBusyId(habit.id);
    const today = todayLocalDateString();
    const doneToday = habit.dates.includes(today);
    try {
      await fetch(`/api/habits/${habit.id}/entries`, {
        method: doneToday ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: today }),
      });
      await loadHabits();
    } finally {
      setBusyId(null);
    }
  }

  async function removeHabit(id: string) {
    if (!confirm("この習慣を削除しますか？記録もすべて削除されます。")) return;
    await fetch(`/api/habits/${id}`, { method: "DELETE" });
    loadHabits();
  }

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-xl font-semibold">habit-grid</h1>
        <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-800">
          ログアウト
        </button>
      </div>

      <form onSubmit={addHabit} className="mb-8 flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="新しい習慣を追加 (例: 英語学習)"
          className="flex-1 rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          追加
        </button>
      </form>

      {habits === null && <p className="text-sm text-gray-500">読み込み中...</p>}
      {habits !== null && habits.length === 0 && (
        <p className="text-sm text-gray-500">
          まだ習慣がありません。上のフォームから追加してください。
        </p>
      )}

      <div className="space-y-8">
        {habits?.map((habit) => {
          const today = todayLocalDateString();
          const doneToday = habit.dates.includes(today);
          return (
            <div key={habit.id} className="rounded-lg border p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-medium">{habit.name}</h2>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">{habit.dates.length}日達成</span>
                  <button
                    onClick={() => toggleToday(habit)}
                    disabled={busyId === habit.id}
                    className={`rounded px-3 py-1.5 text-sm font-medium disabled:opacity-50 ${
                      doneToday
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {doneToday ? "今日: 達成済み ✓" : "今日を記録"}
                  </button>
                  <button
                    onClick={() => removeHabit(habit.id)}
                    className="text-xs text-gray-400 hover:text-red-600"
                  >
                    削除
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <ContributionCalendar dates={habit.dates} color={habit.color} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
