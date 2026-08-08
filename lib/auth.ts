import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "habit_grid_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

/** Single-shared-password auth: this app has exactly one user, so a signed,
 * stateless session cookie (no session table) is enough -- no need for a
 * full auth system here. */
export function createSessionCookieValue(): string {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + SESSION_TTL_MS })).toString(
    "base64url"
  );
  return `${payload}.${sign(payload)}`;
}

export function isValidSessionCookieValue(value: string | undefined): boolean {
  if (!value) return false;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return false;

  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

export function checkPassword(candidate: string): boolean {
  const actual = process.env.APP_PASSWORD;
  if (!actual) throw new Error("APP_PASSWORD is not set");
  const a = Buffer.from(candidate);
  const b = Buffer.from(actual);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
export const SESSION_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;
