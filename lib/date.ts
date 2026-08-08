const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isValidDateString(value: unknown): value is string {
  return typeof value === "string" && DATE_RE.test(value) && !Number.isNaN(Date.parse(value));
}

/** Today's date as YYYY-MM-DD in the *caller's* local timezone. Must be
 * called client-side -- computing "today" on the server would use the
 * server's timezone (UTC on most hosts), which silently shifts what
 * counts as "today" for anyone not in that timezone. */
export function todayLocalDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
