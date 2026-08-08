"use client";

import { useEffect, useState } from "react";
import ContributionCalendar from "@/app/components/ContributionCalendar";
import { todayLocalDateString } from "@/lib/date";

export type Habit = { id: string; name: string; color: string; dates: string[] };

export type HabitTrackerAdapter = {
  loadHabits: () => Promise<Habit[]>;
  addHabit: (name: string) => Promise<void>;
  toggleToday: (habit: Habit) => Promise<void>;
  removeHabit: (id: string) => Promise<void>;
};

/** Data-source-agnostic habit UI: the real app backs this with the API
 * (see app/page.tsx), the public demo backs it with localStorage (see
 * app/demo/page.tsx) -- same interaction logic either way. */
export default function HabitTracker({ adapter }: { adapter: HabitTrackerAdapter }) {
  const [habits, setHabits] = useState<Habit[] | null>(null);
  const [newName, setNewName] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function reload() {
    setHabits(await adapter.loadHabits());
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    setNewName("");
    await adapter.addHabit(name);
    reload();
  }

  async function handleToggle(habit: Habit) {
    setBusyId(habit.id);
    try {
      await adapter.toggleToday(habit);
      await reload();
    } finally {
      setBusyId(null);
    }
  }

  async function handleRemove(id: string) {
    if (!confirm("この習慣を削除しますか？記録もすべて削除されます。")) return;
    await adapter.removeHabit(id);
    reload();
  }

  return (
    <>
      <form onSubmit={handleAdd} className="mb-8 flex gap-2">
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
                    onClick={() => handleToggle(habit)}
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
                    onClick={() => handleRemove(habit.id)}
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
    </>
  );
}
