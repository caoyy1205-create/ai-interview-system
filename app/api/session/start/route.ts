import { NextResponse } from "next/server";
import { pickTask } from "../../../lib/tasks";
import { rateLimiter } from "../../../lib/rate-limit";

function randomId(prefix = "sess") {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export async function POST(req: Request) {
  // Rate limiting: max 5 sessions per IP per hour
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const limited = rateLimiter.check(ip, 5, 60 * 60 * 1000);
  if (limited) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const taskId = body?.taskId as string | undefined;

  // Candidate identity binding
  const candidateName = String(body?.candidateName || "").trim();
  const candidateEmail = String(body?.candidateEmail || "").trim();

  if (!candidateName || !candidateEmail) {
    return NextResponse.json(
      { error: "candidateName and candidateEmail are required" },
      { status: 400 }
    );
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(candidateEmail)) {
    return NextResponse.json(
      { error: "Invalid email address" },
      { status: 400 }
    );
  }

  const task = pickTask(taskId);
  const sessionId = randomId("session");
  const startedAt = Date.now();

  return NextResponse.json({
    sessionId,
    startedAt,
    task,
    candidate: {
      name: candidateName,
      email: candidateEmail,
    },
  });
}
