import { NextResponse } from "next/server";
import { pickTask } from "../../../lib/tasks";
import { rateLimiter } from "../../../lib/rate-limit";

// 导入新的题库模块（先临时写在同一文件，后续拆分）
import {   
  getRandomMultipleChoice,
  getRandomEssayQuestions,
  getRandomCollaborationTasks,
  getRandomProjectTask
} from "../../../lib/questionBank";

function randomId(prefix = "sess") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
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
  try {
    const body = await req.json().catch(() => ({}));
    
    // 1. 随机生成三部分题目
    const mcQuestions = getRandomMultipleChoice(8);      // 8 道选择题
    const essayQuestions = getRandomEssayQuestions(2);   // 2 道问答题
    const collaborationTasks = getRandomCollaborationTasks(2); // 2 道协作题
    const projectTask = getRandomProjectTask(1);         // 1 道项目题
    
    // 2. 组合成完整面试题
    const examSet = {
      part1: {
        type: "基础认知",
        allowAI: false,
        timeLimitMinutes: 30,
        questions: [
          ...mcQuestions.map((q, idx) => ({
            id: `mc_${idx}`,
            type: "multipleChoice",
            ...q
          })),
          ...essayQuestions.map((q, idx) => ({
            id: `essay_${idx}`,
            type: "essay",
            ...q
          }))
        ]
      },
      part2: {
        type: "AI协作能力",
        allowAI: true,
        timeLimitMinutes: 40,
        tasks: collaborationTasks.map((t, idx) => ({
          id: `collab_${idx}`,
          ...t
        }))
      },
      part3: {
        type: "项目实战",
        allowAI: true,
        timeLimitMinutes: 90,
        task: {
          id: `project_0`,
          ...projectTask
        }
      }
    };
    
    // 3. 生成 session
    const sessionId = randomId("session");
    const startedAt = Date.now();
    
    // MVP：session 先不落库，直接返回给前端存储
    return NextResponse.json({
      sessionId,
      startedAt,
      examSet,  // 改为返回完整三部分题目
      // 保持向后兼容（如果前端还用 task）
      task: projectTask // 第三部分项目题作为兼容字段
    });
    
  } catch (error) {
    console.error("Session start error:", error);
    return NextResponse.json(
      { error: "Failed to start session" },
      { status: 500 }
    );
  }
}
