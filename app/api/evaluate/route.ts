import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { multipleChoicePool } from "@/app/lib/questionBank";

const QWEN_TIMEOUT_MS = 15000;

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json();
    if (!sessionId) return NextResponse.json({ error: "sessionId required" }, { status: 400 });

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

    const totalScore = Math.round(p1Result.score * 0.3 + p2Result.score * 0.3 + p3Result.score * 0.4);

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
  if (!data || !data.answers) return { score: 0, feedback: "未提交", mcCorrect: 0, mcTotal: 0, mcScore: 0, essayScore: 0 };

  const questions = examSet?.part1?.questions || [];
  let mcCorrect = 0, mcTotal = 0;
  const essayAnswers: string[] = [];
  const wrongQuestions: any[] = [];

  questions.forEach((q: any) => {
    if (q.type === "multipleChoice") {
      mcTotal++;
      const original = multipleChoicePool.find((orig) => orig.question === q.question);
      const correctIdx = original?.correctAnswer ?? q.correctAnswer;
      const candidateAns = data.answers[q.id];
      if (candidateAns === correctIdx) {
        mcCorrect++;
      } else {
        wrongQuestions.push({
          question: q.question,
          options: q.options,
          candidateAnswer: candidateAns,
          correctAnswer: correctIdx,
        });
      }
    } else if (q.type === "essay") {
      essayAnswers.push(data.answers?.[q.id] || "");
    }
  });

  const mcScore = mcTotal > 0 ? Math.round((mcCorrect / mcTotal) * 40) : 0;

  let essayScore = 0;
  if (essayAnswers.some(a => a.length > 0)) {
    const essayQuestions = questions.filter((q: any) => q.type === "essay");
    const prompt = `你是资深 AI 产品专家，请评估以下问答题的回答质量（总分20分）。

评分参考（few-shot）：
- 满分回答：能准确定义概念，结合实际案例，提出自己的判断和延伸思考
- 15分回答：定义正确，有一定案例，但缺少深度判断
- 10分回答：概念模糊，描述表面，无实质案例
- 5分以下：回答严重偏题或字数极少

${essayQuestions.map((q: any, i: number) => `题目${i + 1}：${q.question}\n候选人回答：${essayAnswers[i] || "（未作答）"}`).join("\n\n")}

请返回 JSON：{"score": 0-20整数, "feedback": "评语"}`;
    const result = await callQwen(prompt);
    essayScore = Math.min(20, Math.max(0, result.score || 0));
  }

  const rawTotal = mcScore + essayScore;
  const score = Math.min(100, Math.round(rawTotal / 60 * 100));

  return { score, mcCorrect, mcTotal, mcScore, essayScore, wrongQuestions, feedback: `选择题 ${mcCorrect}/${mcTotal} 正确` };
}

async function evaluatePart2(data: any, examSet: any) {
  if (!data || !data.messages || data.messages.length === 0) {
    return { score: 0, feedback: "未提交或无对话记录" };
  }

  const task = examSet?.part2?.tasks?.[0];
  const rubric = task?.evaluationFocus || [];
  const msgs: any[] = data.messages;

  // 行为指标统计
  const userMsgs = msgs.filter((m: any) => m.role === "user");
  const userTotalChars = userMsgs.reduce((sum: number, m: any) => sum + (m.content?.length || 0), 0);
  const totalTurns = userMsgs.length;
  const taskDescription = task?.description || "";
  const firstUserMsg = userMsgs[0]?.content || "";
  const isPasteDetected = taskDescription.length > 50 && firstUserMsg.includes(taskDescription.slice(0, 50));

  const conversation = msgs
    .map((m: any) => `${m.role === "user" ? "候选人" : "AI"}: ${m.content}`)
    .join("\n")
    .slice(0, 6000);

  const prompt = `你是资深 AI 产品专家，请严格评估候选人的 AI 协作能力。

【任务信息】
任务：${task?.title || "AI协作任务"}
任务描述：${task?.description || ""}
评估要点：${JSON.stringify(rubric)}

【候选人行为数据（客观统计）】
- 总对话轮数：${totalTurns} 轮
- 候选人消息总字数：${userTotalChars} 字
- 疑似直接粘贴题目：${isPasteDetected ? "是" : "否"}
- AI使用次数：${data.aiCount || 0}

【完整对话记录】
${conversation}

【严格评分规则 - 必须遵守】
- 对话轮数 < 3 轮 → Prompt迭代维度强制 ≤ 40 分
- 候选人总字数 < 100 字 → 整体参与度不足，总分强制 ≤ 40 分
- 疑似直接粘贴题目且后续无自主延展/追问 → 批判性思维 ≤ 20 分，Prompt设计 ≤ 30 分
- 全程只有"帮我做X"式提问，无自己的观点/判断 → 需求理解维度 ≤ 40 分

【正向加分信号（需明确出现才能给高分）】
- 对AI回答提出质疑或要求修改
- 主动追问"为什么"、"还有哪些可能"
- 提出自己的假设或约束条件
- 对AI输出进行筛选并说明理由
- 自主延展任务场景

请从4个维度打分并给出加权总分：
1. 需求理解与问题拆解（25%）
2. Prompt设计质量与迭代深度（35%）
3. 批判性思维与自主判断（25%）
4. 最终方案完整性与任务完成度（15%）

返回 JSON：{"score": 0-100, "feedback": "整体评语（需引用具体对话内容）", "dimensions": [{"name": "维度名", "score": 分数, "comment": "评语"}], "behaviorFlags": {"turns": ${totalTurns}, "totalChars": ${userTotalChars}, "pasteDetected": ${isPasteDetected}}}`;

  return await callQwen(prompt);
}

async function fetchGitHubContent(repoUrl: string): Promise<{ content: string; isEmpty: boolean }> {
  try {
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/\s?#]+)/);
    if (!match) return { content: "无法解析GitHub链接", isEmpty: true };

    const owner = match[1];
    const repo = match[2].replace(/\.git$/, "");
    const apiBase = `https://api.github.com/repos/${owner}/${repo}`;

    const [readmeRes, treeRes, repoInfoRes] = await Promise.all([
      fetch(`${apiBase}/readme`, { headers: { Accept: "application/vnd.github.v3.raw" } }),
      fetch(`${apiBase}/git/trees/HEAD?recursive=1`, { headers: { Accept: "application/vnd.github.v3+json" } }),
      fetch(apiBase, { headers: { Accept: "application/vnd.github.v3+json" } }),
    ]);

    // 404 → 仓库不存在或为空
    if (repoInfoRes.status === 404) return { content: "仓库不存在或为私有仓库", isEmpty: true };

    const info = repoInfoRes.ok ? await repoInfoRes.json() : {};
    let fileCount = 0;
    let fileList = "";

    if (treeRes.ok) {
      const tree = await treeRes.json();
      const files = (tree.tree || []).filter((f: any) => f.type === "blob");
      fileCount = files.length;
      fileList = files.map((f: any) => f.path).slice(0, 60).join("\n");
    }

    // 文件数为 0 → 空仓库
    if (fileCount === 0) return { content: "仓库为空，没有任何文件", isEmpty: true };

    let summary = `【仓库信息】\n名称：${info.name}\n描述：${info.description || "无"}\n主要语言：${info.language || "未知"}\n文件数：${fileCount}\n最后更新：${info.updated_at}\n\n`;

    if (readmeRes.ok) {
      const readme = await readmeRes.text();
      summary += `【README内容】\n${readme.slice(0, 3000)}\n\n`;
    } else {
      summary += "【README】：无 README 文件\n\n";
    }

    summary += `【文件结构】\n${fileList}`;
    return { content: summary, isEmpty: false };
  } catch (e) {
    return { content: `GitHub内容获取失败：${e}`, isEmpty: true };
  }
}

async function evaluatePart3(data: any, examSet: any) {
  if (!data || !data.repoUrl) return { score: 0, feedback: "项目未提交" };
  if (!data.repoUrl.includes("github.com")) return { score: 0, feedback: "请提交有效的 GitHub 仓库链接" };

  const task = examSet?.part3?.task;
  const rubric = task?.rubric || [];

  const { content: githubContent, isEmpty } = await fetchGitHubContent(data.repoUrl);

  // 空仓库直接 0 分
  if (isEmpty) {
    return { score: 0, feedback: `仓库无效或为空：${githubContent}`, dimensions: [] };
  }

  const prompt = `你是一名资深技术专家和产品评审官，请对候选人提交的项目进行专业的多维度评估。

【项目题目】${task?.title || "项目实战"}
【项目要求】${JSON.stringify(task?.requirements || [])}
【交付物要求】${JSON.stringify(task?.deliverables || [])}

【候选人GitHub仓库内容】
${githubContent}

【候选人提交说明】
${data.notes || "（无说明）"}

【评分维度】
${rubric.map((r: any) => `- ${r.dimension}（权重${r.weight}%）：${r.whatGoodLooksLike}`).join("\n")}

请从技术专家视角进行客观评估：
- 基于仓库真实内容（文件结构、README质量、代码组织）打分
- 指出具体做得好的地方（引用文件名或README内容）
- 指出明显不足或可改进的地方
- 评估AI工具使用痕迹和产品思维

返回 JSON：{"score": 0-100, "feedback": "总体评语（技术专家视角，具体有据）", "dimensions": [{"name": "维度名", "score": 分数, "comment": "具体评语"}], "highlights": ["优点1", "优点2"], "improvements": ["改进点1", "改进点2"]}`;

  return await callQwen(prompt);
}

async function callQwen(prompt: string): Promise<any> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), QWEN_TIMEOUT_MS);
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
          { role: "system", content: "你是专业招聘评估专家，只输出 JSON，不加任何解释或markdown。" },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const json = await res.json();
    const content = json.choices?.[0]?.message?.content || "{}";
    return JSON.parse(content);
  } catch (e: any) {
    clearTimeout(timeout);
    if (e.name === "AbortError") return { score: 50, feedback: "评分超时，已给予默认分数" };
    return { score: 50, feedback: "评分引擎暂时不可用" };
  }
}

function getRecommendation(score: number) {
  if (score >= 85) return "强烈推荐 (Strong Hire)";
  if (score >= 70) return "建议录用 (Hire)";
  if (score >= 55) return "待定 (Borderline)";
  return "不予考虑 (No Hire)";
}
