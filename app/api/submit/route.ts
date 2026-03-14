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
import { supabase } from "@/app/lib/supabase"; // 确保路径指向你的 supabase 配置文件

export async function POST(request: Request) {
  try {
    const { sessionId, part, data } = await request.json();

    // 1. 基础校验
    if (!sessionId || !part || !data) {
      return NextResponse.json(
        { error: "Missing required fields: sessionId, part, or data" },
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
    // 2. 映射前端传入的 part 到数据库字段名
    // 前端传入的是 'part1', 'part2', 'part3'
    const columnMap: Record<string, string> = {
      part1: "part1_data",
      part2: "part2_data",
      part3: "part3_data",
    };

    const columnName = columnMap[part];
    if (!columnName) {
      return NextResponse.json(
        { error: "Invalid part identifier" },
        { status: 400 }
      );
    }

    // 3. 执行数据库更新操作
    // 使用 .upsert 而不是 .update 的好处是：如果 session 记录不存在会自动创建（虽然通常应该在 session/start 创建）
    const { error } = await supabase
      .from("interview_sessions")
      .upsert(
        { 
          session_id: sessionId, 
          [columnName]: data, 
          updated_at: new Date().toISOString(),
          // 如果是最后一部分，可以顺便更新状态
          status: part === "part3" ? "completed" : "in_progress"
        },
        { onConflict: "session_id" } // 关键：基于 session_id 进行冲突检查并更新
      );

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Database update failed", details: error.message },
        { status: 500 }
      );
    }

    // 4. 返回成功状态
    return NextResponse.json({ 
      success: true, 
      message: `${part} data submitted successfully` 
    });

  } catch (error: any) {
    console.error("Submit API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error?.message },
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
}
