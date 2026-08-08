import { NextRequest, NextResponse } from "next/server";
import { isValidSessionCookieValue, SESSION_COOKIE_NAME } from "@/lib/auth";

// Runs on the Node.js runtime (not Edge) so lib/auth.ts can use Node's
// crypto module directly instead of the Web Crypto API.
export const config = {
  matcher: ["/((?!login|demo|api/login|_next/static|_next/image|favicon.ico).*)"],
};

export function proxy(request: NextRequest) {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (isValidSessionCookieValue(cookie)) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/login", request.url));
}
