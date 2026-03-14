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
      const original = multipleChoicePool.find((orig) => orig.question === q.question);
      const correctIdx = original?.correctAnswer ?? q.correctAnswer;
      if (data.answers[q.id] === correctIdx) mcCorrect++;
    } else if (q.type === "essay") {
      const ans = data.answers?.[q.id];
      if (ans) essayAnswers.push(ans);
    }
  });

  const mcScore = mcTotal > 0 ? Math.round((mcCorrect / mcTotal) * 40) : 0;

  let essayScore = 0;
  if (essayAnswers.length > 0) {
    const essayQuestions = questions.filter((q: any) => q.type === "essay");
    const prompt = `你是资深 AI 产品专家，请评估以下问答题的回答质量（总分20分）。

${essayQuestions.map((q: any, i: number) => `题目${i + 1}：${q.question}\n回答：${essayAnswers[i] || "未作答"}`).join("\n\n")}

评分标准：理解深度(40%)、实践经验(30%)、表达清晰(30%)。
请返回 JSON：{"score": 0-20的整数, "feedback": "评语"}`;
    const result = await callDeepSeek(prompt);
    essayScore = Math.min(20, Math.max(0, result.score || 0));
  }

  const rawTotal = mcScore + essayScore;
  // 满分：mcScore最高40 + essayScore最高20 = 60，标准化到100
  const score = Math.min(100, Math.round(rawTotal / 60 * 100));

  return {
    score,
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
    .slice(0, 6000);

  const prompt = `你是资深 AI 产品专家，请评估候选人在以下协作任务中的 AI 协作能力。

任务：${task?.title || "AI协作任务"}
任务描述：${task?.description || ""}
评估要点：${JSON.stringify(rubric)}

候选人与AI的完整对话（共 ${data.messages.length} 条）：
${conversation}

AI使用次数：${data.aiCount || 0}

请从以下4个维度各自打分（0-100分），然后给出加权总分：
1. 需求理解与问题拆解能力（权重25%）
2. Prompt设计质量与迭代深度（权重35%）
3. 批判性思维——是否对AI输出进行筛选和改进（权重25%）
4. 最终方案完整性（权重15%）

请返回 JSON：{"score": 加权总分0-100, "feedback": "整体评语", "dimensions": [{"name": "维度名", "score": 分数, "comment": "评语"}]}`;

  return await callDeepSeek(prompt);
}

// 从 GitHub 仓库获取内容摘要
async function fetchGitHubContent(repoUrl: string): Promise<string> {
  try {
    // 解析 GitHub URL: https://github.com/owner/repo
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/\s?#]+)/);
    if (!match) return "无法解析GitHub链接";

    const owner = match[1];
    const repo = match[2].replace(/\.git$/, "");
    const apiBase = `https://api.github.com/repos/${owner}/${repo}`;

    // 并发获取 README 和文件结构
    const [readmeRes, treeRes, repoInfoRes] = await Promise.all([
      fetch(`${apiBase}/readme`, { headers: { Accept: "application/vnd.github.v3.raw" } }),
      fetch(`${apiBase}/git/trees/HEAD?recursive=1`, { headers: { Accept: "application/vnd.github.v3+json" } }),
      fetch(apiBase, { headers: { Accept: "application/vnd.github.v3+json" } }),
    ]);

    let summary = "";

    // 仓库基本信息
    if (repoInfoRes.ok) {
      const info = await repoInfoRes.json();
      summary += `【仓库信息】\n名称：${info.name}\n描述：${info.description || "无"}\n语言：${info.language || "未知"}\nStars：${info.stargazers_count}\n最后更新：${info.updated_at}\n\n`;
    }

    // README 内容（截取前3000字）
    if (readmeRes.ok) {
      const readme = await readmeRes.text();
      summary += `【README内容】\n${readme.slice(0, 3000)}\n\n`;
    } else {
      summary += "【README】：仓库没有 README 文件\n\n";
    }

    // 文件结构
    if (treeRes.ok) {
      const tree = await treeRes.json();
      const files = (tree.tree || [])
        .filter((f: any) => f.type === "blob")
        .map((f: any) => f.path)
        .slice(0, 60)
        .join("\n");
      summary += `【文件结构】\n${files}\n`;
    }

    return summary || "获取仓库内容失败";
  } catch (e) {
    return `GitHub内容获取失败：${e}`;
  }
}

async function evaluatePart3(data: any, examSet: any) {
  if (!data || !data.repoUrl) return { score: 0, feedback: "项目未提交" };

  // 验证 URL 格式
  if (!data.repoUrl.includes("github.com")) {
    return { score: 0, feedback: "请提交有效的 GitHub 仓库链接" };
  }

  const task = examSet?.part3?.task;
  const rubric = task?.rubric || [];

  // 实际读取 GitHub 仓库内容
  const githubContent = await fetchGitHubContent(data.repoUrl);

  const prompt = `你是资深技术面试官，请基于候选人的实际 GitHub 仓库内容进行评估。

项目题目：${task?.title || "项目实战"}
项目要求：${JSON.stringify(task?.requirements || [])}
交付物要求：${JSON.stringify(task?.deliverables || [])}

候选人提交的仓库内容：
${githubContent}

候选人的提交说明：
${data.notes || "（无说明）"}

评分标准：
${rubric.map((r: any) => `- ${r.dimension}（权重${r.weight}%）：${r.whatGoodLooksLike}`).join("\n")}

请基于仓库的真实内容（README、代码结构、文件组织等）进行客观评估。
如果仓库为空或内容极少，应给出较低分数（20分以下）。
如果仓库有完整内容，则按评分标准评分。

请返回 JSON：{"score": 总分0-100, "feedback": "评语（需引用具体仓库内容）", "dimensions": [{"name": "维度名", "score": 分数, "comment": "评语"}]}`;

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
        model: "qwen-flash",
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
    return { score: 50, feedback: "评分引擎暂时不可用" };
  }
}

function getRecommendation(score: number) {
  if (score >= 85) return "强烈推荐 (Strong Hire)";
  if (score >= 70) return "建议录用 (Hire)";
  if (score >= 55) return "待定 (Borderline)";
  return "不予考虑 (No Hire)";
}
