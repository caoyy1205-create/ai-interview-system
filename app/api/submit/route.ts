import { NextResponse } from "next/server";
import { rateLimiter } from "../../lib/rate-limit";

type Submission = {
  sessionId: string;
  taskId: string;
  repoUrl: string;
  notes: string;
  submittedAt: number;
  candidateName?: string;
  candidateEmail?: string;
};

// In-memory store — replace with Supabase in production
const submissions = new Map<string, Submission>();
// Track submitted sessions to prevent re-submission
const submittedSessions = new Set<string>();

export async function POST(req: Request) {
  try {
    // Rate limiting: max 10 submits per IP per hour
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const limited = rateLimiter.check(`submit:${ip}`, 10, 60 * 60 * 1000);
    if (limited) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = (await req.json()) as Partial<Submission>;

    if (!body.sessionId || !body.taskId) {
      return NextResponse.json(
        { error: "Missing sessionId or taskId" },
        { status: 400 }
      );
    }

    // Prevent re-submission
    if (submittedSessions.has(body.sessionId)) {
      return NextResponse.json(
        { error: "This session has already been submitted. Re-submission is not allowed." },
        { status: 409 }
      );
    }

    const repoUrl = String(body.repoUrl || "").trim();
    const notes = String(body.notes || "").trim();

    if (!repoUrl) {
      return NextResponse.json({ error: "repoUrl is required" }, { status: 400 });
    }

    // Basic URL validation
    try {
      new URL(repoUrl);
    } catch {
      return NextResponse.json(
        { error: "repoUrl must be a valid URL (e.g. https://github.com/...)" },
        { status: 400 }
      );
    }

    const record: Submission = {
      sessionId: body.sessionId,
      taskId: body.taskId,
      repoUrl,
      notes,
      submittedAt: Date.now(),
      candidateName: body.candidateName,
      candidateEmail: body.candidateEmail,
    };

    submissions.set(record.sessionId, record);
    submittedSessions.add(record.sessionId); // Lock session from re-submission

    return NextResponse.json({ ok: true, submission: record });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Server internal error", details: e?.message },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("sessionId") || "";
  const record = submissions.get(sessionId);
  return NextResponse.json({ submission: record || null });
}

// Admin: list all submissions (protected by token)
export async function PUT(req: Request) {
  const adminToken = req.headers.get("x-admin-token");
  const expectedToken = process.env.ADMIN_TOKEN;

  if (!expectedToken || adminToken !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const all = Array.from(submissions.values()).sort(
    (a, b) => b.submittedAt - a.submittedAt
  );
  return NextResponse.json({ submissions: all, total: all.length });
}
