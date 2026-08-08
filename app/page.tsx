"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import HabitTracker from "@/app/components/HabitTracker";
import { apiAdapter } from "@/lib/apiAdapter";

export default function Home() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-xl font-semibold">habit-grid</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <Link href="/demo" className="hover:text-gray-800">
            デモを見る
          </Link>
          <button onClick={logout} className="hover:text-gray-800">
            ログアウト
          </button>
        </div>
      </div>
      <HabitTracker adapter={apiAdapter} />
    </div>
  );
}
