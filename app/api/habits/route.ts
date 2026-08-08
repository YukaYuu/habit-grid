import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const habits = await prisma.habit.findMany({
    orderBy: { createdAt: "asc" },
    include: { entries: { select: { date: true } } },
  });
  return NextResponse.json(
    habits.map((h) => ({
      id: h.id,
      name: h.name,
      color: h.color,
      dates: h.entries.map((e) => e.date),
    }))
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "名前を入力してください" }, { status: 400 });
  }
  const color = typeof body?.color === "string" ? body.color : undefined;

  const habit = await prisma.habit.create({ data: { name, ...(color && { color }) } });
  return NextResponse.json({ id: habit.id, name: habit.name, color: habit.color, dates: [] });
}
