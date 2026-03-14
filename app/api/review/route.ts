import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { multipleChoicePool } from "@/app/lib/questionBank";

const QWEN_TIMEOUT_MS = 20000;

export async function POST(request: Request) {
  try {
    const { sessionId, type } = await request.json();
    if (!sessionId || !type) return NextResponse.json({ error: "sessionId and type required" }, { status: 400 });

    const { data: sessionData, error } = await supabase
      .from("interview_sessions")
      .select("*")
      .eq("session_id", sessionId)
      .single();

    if (error || !sessionData) return NextResponse.json({ error: "记录未找到" }, { status: 404 });

    const { part1_data, part2_data, part3_data, exam_set, final_report } = sessionData;

    switch (type) {
      case "mc": return NextResponse.json(await reviewMC(part1_data, exam_set, final_report));
      case "essay": return NextResponse.json(await reviewEssay(part1_data, exam_set));
      case "collab": return NextResponse.json(await reviewCollab(exam_set));
      case "project": return NextResponse.json(await reviewProject(part3_data, exam_set));
      default: return NextResponse.json({ error: "unknown type" }, { status: 400 });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

async function reviewMC(part1Data: any, examSet: any, finalReport: any) {
  const wrongQuestions = finalReport?.breakdown?.part1?.wrongQuestions || [];
  if (wrongQuestions.length === 0) return { items: [], message: "全部答对，无错题！" };

  const items = await Promise.all(wrongQuestions.map(async (wq: any) => {
    const optionLabels = ["A", "B", "C", "D"];
    const prompt = `请为以下 AI 产品经理面试选择题提供简短解析（不超过200字）。

题目：${wq.question}
选项：${(wq.options || []).map((o: string, i: number) => `${optionLabels[i]}. ${o}`).join("  |  ")}
正确答案：${optionLabels[wq.correctAnswer]}. ${wq.options?.[wq.correctAnswer] || ""}
候选人选择：${wq.candidateAnswer !== undefined && wq.candidateAnswer !== null ? `${optionLabels[wq.candidateAnswer]}. ${wq.options?.[wq.candidateAnswer] || "未选"}` : "未选"}

请解释为什么正确答案是对的，以及候选人答案的常见误区。控制在200字以内。
返回 JSON：{"explanation": "解析内容"}`;

    const result = await callQwen(prompt);
    return {
      question: wq.question,
      options: wq.options,
      correctAnswer: wq.correctAnswer,
      candidateAnswer: wq.candidateAnswer,
      explanation: result.explanation || "暂无解析",
    };
  }));

  return { items };
}

async function reviewEssay(part1Data: any, examSet: any) {
  const questions = (examSet?.part1?.questions || []).filter((q: any) => q.type === "essay");
  if (questions.length === 0) return { items: [] };

  const items = await Promise.all(questions.map(async (q: any) => {
    const candidateAnswer = part1Data?.answers?.[q.id] || "（未作答）";
    const prompt = `请为以下 AI 产品经理面试问答题提供参考答案。

题目：${q.question}
候选人回答：${candidateAnswer}

请提供：
1. 标准参考答案（300字左右，有要点框架，体现深度）
2. 对候选人回答的简短点评（100字以内）

返回 JSON：{"referenceAnswer": "参考答案", "comment": "点评"}`;
    const result = await callQwen(prompt);
    return {
      question: q.question,
      candidateAnswer,
      referenceAnswer: result.referenceAnswer || "暂无参考答案",
      comment: result.comment || "",
    };
  }));

  return { items };
}

async function reviewCollab(examSet: any) {
  const task = examSet?.part2?.tasks?.[0];
  if (!task) return { example: null };

  const prompt = `请为以下 AI 协作面试任务生成一个高分示例对话（展示优秀候选人应该如何与AI交互）。

任务：${task.title}
任务描述：${task.description}
评估要点：${JSON.stringify(task.evaluationFocus || [])}

请生成 4-6 轮对话，体现：
- 候选人主动拆解问题，而不是直接粘贴题目
- 对AI回答进行质疑和追问
- 提出自己的判断和约束条件
- 最终收敛到完整方案

返回 JSON：{
  "title": "高分示例说明",
  "keyPoints": ["亮点1", "亮点2", "亮点3"],
  "dialogue": [
    {"role": "candidate", "content": "消息内容"},
    {"role": "ai", "content": "消息内容"}
  ]
}`;

  const result = await callQwen(prompt);
  return { task: task.title, ...result };
}

async function reviewProject(part3Data: any, examSet: any) {
  const task = examSet?.part3?.task;
  if (!part3Data?.repoUrl) return { review: "候选人未提交项目" };

  // 读取 GitHub 内容
  let githubContent = "未能获取仓库内容";
  try {
    const match = part3Data.repoUrl.match(/github\.com\/([^/]+)\/([^/\s?#]+)/);
    if (match) {
      const [, owner, repoRaw] = match;
      const repo = repoRaw.replace(/\.git$/, "");
      const apiBase = `https://api.github.com/repos/${owner}/${repo}`;
      const [readmeRes, treeRes] = await Promise.all([
        fetch(`${apiBase}/readme`, { headers: { Accept: "application/vnd.github.v3.raw" } }),
        fetch(`${apiBase}/git/trees/HEAD?recursive=1`, { headers: { Accept: "application/vnd.github.v3+json" } }),
      ]);
      let content = "";
      if (readmeRes.ok) content += `README:\n${(await readmeRes.text()).slice(0, 2000)}\n\n`;
      if (treeRes.ok) {
        const tree = await treeRes.json();
        const files = (tree.tree || []).filter((f: any) => f.type === "blob").map((f: any) => f.path).slice(0, 50);
        content += `文件结构:\n${files.join("\n")}`;
      }
      if (content) githubContent = content;
    }
  } catch {}

  const prompt = `你是一名资深技术专家，请对候选人的项目进行深度技术点评。

项目题目：${task?.title || ""}
候选人提交：${part3Data.repoUrl}
提交说明：${part3Data.notes || "无"}

仓库内容：
${githubContent}

请从技术专家视角提供：
1. 整体项目评价（架构设计、代码质量、完整度）
2. 具体优点（引用具体文件或代码）
3. 改进建议（具体可执行）
4. AI工具使用评价（从代码/文档中推断）

返回 JSON：{
  "overview": "整体评价",
  "strengths": ["优点1（具体）", "优点2（具体）"],
  "improvements": ["改进建议1", "改进建议2"],
  "aiUsageComment": "AI工具使用评价",
  "technicalDepth": "技术深度评价"
}`;

  const result = await callQwen(prompt);
  return { repoUrl: part3Data.repoUrl, ...result };
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
          { role: "system", content: "你是专业技术评审专家，只输出JSON，不加任何解释或markdown代码块。" },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.4,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const json = await res.json();
    return JSON.parse(json.choices?.[0]?.message?.content || "{}");
  } catch (e: any) {
    clearTimeout(timeout);
    return { error: e.name === "AbortError" ? "请求超时" : "服务暂时不可用" };
  }
}
