import { NextResponse } from "next/server";
import { pickTask } from "../../../lib/tasks";

function randomId(prefix = "sess") {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const taskId = body?.taskId as string | undefined;

  const task = pickTask(taskId);

  // MVP：session 先不落库，直接返回给前端存储
  const sessionId = randomId("session");
  const startedAt = Date.now();

  return NextResponse.json({
    sessionId,
    startedAt,
    task,
  });
}
