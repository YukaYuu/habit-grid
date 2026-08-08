import type { Habit, HabitTrackerAdapter } from "@/app/components/HabitTracker";
import { todayLocalDateString } from "@/lib/date";

const STORAGE_KEY = "habit-grid-demo-v1";

function toDateString(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function seedHabits(): Habit[] {
  const dates: string[] = [];
  for (let i = 1; i <= 45; i++) {
    if (Math.random() < 0.6) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(toDateString(d));
    }
  }
  return [{ id: "demo-seed", name: "英語学習 (サンプル)", color: "#39d353", dates }];
}

function readAll(): Habit[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seeded = seedHabits();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeAll(habits: Habit[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

/** Same interaction shape as apiAdapter, but persists to this browser's
 * localStorage only -- so /demo needs no login and never touches the
 * real database, and each visitor only ever sees their own sandbox. */
export const demoAdapter: HabitTrackerAdapter = {
  async loadHabits() {
    return readAll();
  },

  async addHabit(name: string) {
    const habits = readAll();
    habits.push({ id: `demo-${Date.now()}`, name, color: "#39d353", dates: [] });
    writeAll(habits);
  },

  async toggleToday(habit: Habit) {
    const habits = readAll();
    const target = habits.find((h) => h.id === habit.id);
    if (!target) return;
    const today = todayLocalDateString();
    const idx = target.dates.indexOf(today);
    if (idx >= 0) target.dates.splice(idx, 1);
    else target.dates.push(today);
    writeAll(habits);
  },

  async removeHabit(id: string) {
    writeAll(readAll().filter((h) => h.id !== id));
  },
};
