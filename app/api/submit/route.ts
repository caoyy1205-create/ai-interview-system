import { NextResponse } from "next/server";

type Submission = {
  sessionId: string;
  taskId: string;
  repoUrl: string;
  notes: string;
  submittedAt: number;
};

// MVP：仅内存存储（服务重启会丢失）。后续可替换为 Supabase。
const submissions = new Map<string, Submission>();

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<Submission>;

    if (!body.sessionId || !body.taskId) {
      return NextResponse.json(
        { error: "Missing sessionId or taskId" },
        { status: 400 }
      );
    }

    const repoUrl = String(body.repoUrl || "").trim();
    const notes = String(body.notes || "").trim();

    if (!repoUrl) {
      return NextResponse.json({ error: "repoUrl is required" }, { status: 400 });
    }

    const record: Submission = {
      sessionId: body.sessionId,
      taskId: body.taskId,
      repoUrl,
      notes,
      submittedAt: Date.now(),
    };

    submissions.set(record.sessionId, record);

    return NextResponse.json({ ok: true, submission: record });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Server internal error", details: e?.message },
      { status: 500 }
    );
  }
}

// 可选：报告页读取用
export async function GET(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("sessionId") || "";
  const record = submissions.get(sessionId);
  return NextResponse.json({ submission: record || null });
}
