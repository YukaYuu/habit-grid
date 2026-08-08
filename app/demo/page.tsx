"use client";

import Link from "next/link";
import HabitTracker from "@/app/components/HabitTracker";
import { demoAdapter } from "@/lib/demoStorage";

export default function DemoPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">habit-grid (デモ)</h1>
        <a
          href="https://github.com/YukaYuu/habit-grid"
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          GitHubで見る
        </a>
      </div>
      <p className="mb-8 rounded border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800">
        これはデモです。ログイン不要で、記録はこのブラウザにのみ保存されます(サーバーには
        送信されません)。サンプルの習慣が1件、直近の記録つきで入っています。
        <Link href="/login" className="ml-1 underline">
          実際に自分用に使う
        </Link>
      </p>
      <HabitTracker adapter={demoAdapter} />
    </div>
  );
}
