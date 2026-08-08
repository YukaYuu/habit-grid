"use client";

import { useMemo, useState } from "react";

type Props = {
  dates: string[]; // YYYY-MM-DD, "done" days
  color?: string;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEKS = 53;
const MONTH_LABELS = [
  "1月", "2月", "3月", "4月", "5月", "6月",
  "7月", "8月", "9月", "10月", "11月", "12月",
];
const CELL = 11;
const GAP = 3;
const COL_WIDTH = CELL + GAP;

function toDateString(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export default function ContributionCalendar({ dates, color = "#39d353" }: Props) {
  const doneSet = useMemo(() => new Set(dates), [dates]);
  const [hovered, setHovered] = useState<string | null>(null);

  const today = useMemo(() => startOfLocalDay(new Date()), []);

  const { weeks, monthLabels } = useMemo(() => {
    const daysBack = WEEKS * 7 - 1;
    const rawStart = new Date(today.getTime() - daysBack * DAY_MS);
    // Align the grid to the Sunday on or before rawStart, matching GitHub's layout.
    const start = new Date(rawStart.getTime() - rawStart.getDay() * DAY_MS);

    const weeks: Date[][] = [];
    for (let w = 0; w < WEEKS; w++) {
      const week: Date[] = [];
      for (let d = 0; d < 7; d++) {
        week.push(new Date(start.getTime() + (w * 7 + d) * DAY_MS));
      }
      weeks.push(week);
    }

    const labels: { weekIndex: number; label: string }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, i) => {
      const month = week[0].getMonth();
      if (month !== lastMonth) {
        labels.push({ weekIndex: i, label: MONTH_LABELS[month] });
        lastMonth = month;
      }
    });

    return { weeks, monthLabels: labels };
  }, [today]);

  return (
    <div className="inline-block">
      <div className="relative mb-1 h-4" style={{ marginLeft: 24 }}>
        {monthLabels.map(({ weekIndex, label }) => (
          <span
            key={weekIndex}
            className="absolute text-xs text-gray-500"
            style={{ left: weekIndex * COL_WIDTH }}
          >
            {label}
          </span>
        ))}
      </div>
      <div className="flex" style={{ gap: GAP }}>
        <div
          className="flex flex-col text-xs text-gray-500"
          style={{ gap: GAP, width: 20 }}
        >
          <div style={{ height: CELL }} />
          <div style={{ height: CELL, lineHeight: `${CELL}px` }}>月</div>
          <div style={{ height: CELL }} />
          <div style={{ height: CELL, lineHeight: `${CELL}px` }}>水</div>
          <div style={{ height: CELL }} />
          <div style={{ height: CELL, lineHeight: `${CELL}px` }}>金</div>
          <div style={{ height: CELL }} />
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col" style={{ gap: GAP }}>
            {week.map((day, di) => {
              const dateStr = toDateString(day);
              const isFuture = day.getTime() > today.getTime();
              const isDone = doneSet.has(dateStr);
              return (
                <div
                  key={di}
                  onMouseEnter={() => !isFuture && setHovered(dateStr)}
                  onMouseLeave={() => setHovered((h) => (h === dateStr ? null : h))}
                  className="rounded-sm"
                  style={{
                    height: CELL,
                    width: CELL,
                    background: isFuture ? "transparent" : isDone ? color : "#ebedf0",
                  }}
                  title={isFuture ? undefined : `${dateStr}${isDone ? " (達成)" : ""}`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-1 h-4 text-xs text-gray-500">
        {hovered ? `${hovered}${doneSet.has(hovered) ? " ✓" : ""}` : " "}
      </div>
    </div>
  );
}
