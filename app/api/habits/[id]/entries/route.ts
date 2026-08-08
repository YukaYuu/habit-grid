import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isValidDateString } from "@/lib/date";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const date = body?.date;
  if (!isValidDateString(date)) {
    return NextResponse.json({ error: "無効な日付です" }, { status: 400 });
  }

  await prisma.entry.upsert({
    where: { habitId_date: { habitId: id, date } },
    create: { habitId: id, date },
    update: {},
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const date = body?.date;
  if (!isValidDateString(date)) {
    return NextResponse.json({ error: "無効な日付です" }, { status: 400 });
  }

  await prisma.entry.deleteMany({ where: { habitId: id, date } });
  return NextResponse.json({ ok: true });
}
