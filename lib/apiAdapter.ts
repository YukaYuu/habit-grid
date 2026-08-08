import type { Habit, HabitTrackerAdapter } from "@/app/components/HabitTracker";
import { todayLocalDateString } from "@/lib/date";

export const apiAdapter: HabitTrackerAdapter = {
  async loadHabits() {
    const res = await fetch("/api/habits");
    if (!res.ok) return [];
    return res.json();
  },

  async addHabit(name: string) {
    await fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
  },

  async toggleToday(habit: Habit) {
    const today = todayLocalDateString();
    const doneToday = habit.dates.includes(today);
    await fetch(`/api/habits/${habit.id}/entries`, {
      method: doneToday ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: today }),
    });
  },

  async removeHabit(id: string) {
    await fetch(`/api/habits/${id}`, { method: "DELETE" });
  },
};
