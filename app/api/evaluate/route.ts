import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { multipleChoicePool } from "@/app/lib/questionBank";

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId required" }, { status: 400 });
    }

    const { data: sessionData, error: dbError } = await supabase
      .from("interview_sessions")
      .select("*")
      .eq("session_id", sessionId)
      .single();

    if (dbError || !sessionData) {
      return NextResponse.json({ error: "面试记录未找到" }, { status: 404 });
    }

    const { part1_data, part2_data, part3_data, exam_set } = sessionData;

    const [p1Result, p2Result, p3Result] = await Promise.all([
      evaluatePart1(part1_data, exam_set),
      evaluatePart2(part2_data, exam_set),
      evaluatePart3(part3_data, exam_set),
    ]);

    const totalScore = Math.round(
      p1Result.score * 0.3 +
      p2Result.score * 0.3 +
      p3Result.score * 0.4
    );

    const finalReport = {
      totalScore,
      recommendation: getRecommendation(totalScore),
      breakdown: { part1: p1Result, part2: p2Result, part3: p3Result },
    };

    await supabase
      .from("interview_sessions")
      .update({ final_report: finalReport, status: "evaluated" })
      .eq("session_id", sessionId);

    return NextResponse.json(finalReport);
  } catch (error: any) {
    console.error("Evaluation Error:", error);
    return NextResponse.json({ error: "评估系统故障" }, { status: 500 });
  }
}

async function evaluatePart1(data: any, examSet: any) {
  if (!data || !data.answers) return { score: 0, feedback: "未提交", mcCorrect: 0, mcTotal: 0 };

  const questions = examSet?.part1?.questions || [];
  let mcCorrect = 0;
  let mcTotal = 0;
  const essayAnswers: string[] = [];

  questions.forEach((q: any) => {
    if (q.type === "multipleChoice") {
      mcTotal++;
      // 从题库找原题的正确答案
      const original = multipleChoicePool.find(
        (orig) => orig.question === q.question
      );
      const correctIdx = original?.correctAnswer ?? q.correctAnswer;
      if (data.answers[q.id] === correctIdx) mcCorrect++;
    } else if (q.type === "essay") {
      const ans = data.answers?.[q.id];
      if (ans) essayAnswers.push(ans);
    }
  });

  const mcScore = mcTotal > 0 ? Math.round((mcCorrect / mcTotal) * 40) : 0;

  // 问答题用 AI 评分（20分）
  let essayScore = 0;
  if (essayAnswers.length > 0) {
    const essayQuestions = questions.filter((q: any) => q.type === "essay");
    const prompt = `你是资深 AI 产品专家，请评估以下问答题的回答质量。
题目和回答：
${essayQuestions.map((q: any, i: number) => `题目${i + 1}：${q.question}\n回答：${essayAnswers[i] || "未作答"}`).join("\n\n")}

评分标准：理解深度(40%)、实践经验(30%)、表达清晰(30%)。
总共 20 分，请返回 JSON：{"score": 数字, "feedback": "评语"}`;
    const result = await callDeepSeek(prompt);
    essayScore = Math.min(20, result.score || 0);
  }

  const totalScore = mcScore + essayScore;
  return {
    score: Math.min(100, Math.round(totalScore / 0.6)),
    mcCorrect,
    mcTotal,
    mcScore,
    essayScore,
    feedback: `选择题 ${mcCorrect}/${mcTotal} 正确`,
  };
}

async function evaluatePart2(data: any, examSet: any) {
  if (!data || !data.messages || data.messages.length === 0) {
    return { score: 0, feedback: "未提交或无对话记录" };
  }

  const task = examSet?.part2?.tasks?.[0];
  const rubric = task?.evaluationFocus || [];
  const conversation = data.messages
    .map((m: any) => `${m.role === "user" ? "候选人" : "AI"}: ${m.content}`)
    .join("\n")
    .slice(0, 5000);

  const prompt = `你是资深 AI 产品专家，请评估候选人在以下协作任务中的表现。

任务：${task?.title || "AI协作任务"}
任务描述：${task?.description || ""}
评估要点：${JSON.stringify(rubric)}

候选人与AI的对话记录：
${conversation}

AI使用次数：${data.aiCount || 0}

请从以下维度评分（各维度满分100，最终加权为总分100）：
1. 需求理解与问题拆解能力
2. Prompt 设计质量与迭代深度  
3. 批判性思维（是否对AI输出进行筛选和改进）
4. 最终方案质量

请返回 JSON：{"score": 总分0-100, "feedback": "评语", "dimensions": [{"name": "维度名", "score": 分数, "comment": "评语"}]}`;

  return await callDeepSeek(prompt);
}

async function evaluatePart3(data: any, examSet: any) {
  if (!data || !data.repoUrl) return { score: 0, feedback: "项目未提交" };

  const task = examSet?.part3?.task;
  const rubric = task?.rubric || [];

  const prompt = `你是资深技术面试官，请评估候选人的项目实战提交。

项目题目：${task?.title || "项目实战"}
项目要求：${JSON.stringify(task?.requirements || [])}
交付物要求：${JSON.stringify(task?.deliverables || [])}

候选人提交：
- GitHub仓库：${data.repoUrl}
- 提交说明：${data.notes || "（无说明）"}

评分标准（各维度满分100）：
${rubric.map((r: any) => `- ${r.dimension}（权重${r.weight}%）：${r.whatGoodLooksLike}`).join("\n")}

注意：无法直接访问仓库，请基于提交说明和项目设计思路进行评估。
如果提交说明充分体现了思路，可给出合理分数；如果说明过于简单，适当扣分。

请返回 JSON：{"score": 总分0-100, "feedback": "评语", "dimensions": [{"name": "维度名", "score": 分数, "comment": "评语"}]}`;

  return await callDeepSeek(prompt);
}

async function callDeepSeek(prompt: string) {
  try {
    const res = await fetch("https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.QWEN_API_KEY}`,
      },
      body: JSON.stringify({
        model: "qwen-turbo-latest",
        messages: [
          { role: "system", content: "你是一个专业的招聘评估专家，只输出 JSON，不加任何解释。" },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      }),
    });
    const json = await res.json();
    const content = json.choices?.[0]?.message?.content || "{}";
    return JSON.parse(content);
  } catch (e) {
    return { score: 50, feedback: "评分引擎暂时不可用，已给予默认分数" };
  }
}

function getRecommendation(score: number) {
  if (score >= 85) return "强烈推荐 (Strong Hire)";
  if (score >= 70) return "建议录用 (Hire)";
  if (score >= 55) return "待定 (Borderline)";
  return "不予考虑 (No Hire)";
}
