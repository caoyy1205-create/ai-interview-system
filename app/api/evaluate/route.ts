import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { 
  multipleChoicePool, 
  essayQuestionPool, 
  collaborationTaskPool, 
  projectTaskPool 
} from "@/app/lib/questionBank";

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json();
    
    // 1. 从数据库获取候选人全量面试数据
    const { data: sessionData, error: dbError } = await supabase
      .from("interview_sessions")
      .select("*")
      .eq("session_id", sessionId)
      .single();

    const {
      taskTitle,
      rubric,
      notes,
      aiCount,
      conversation,
    } = body;

    // A: Use DEEPSEEK_API_KEY
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // C: Use real rubric if provided, otherwise use a default rubric
    const rubricText = Array.isArray(rubric) && rubric.length > 0
      ? rubric.map((r: { dimension: string; weight: number; whatGoodLooksLike: string }) =>
          `- ${r.dimension}（权重${r.weight}）：${r.whatGoodLooksLike}`
        ).join("\n")
      : "- AI协作成熟度（25）\n- 产品思维与问题理解（25）\n- 工程与结构意识（25）\n- 表达与复盘能力（25）";

    const prompt = `
你是一名资深AI产品负责人，同时负责AI产品经理招聘评估。
    if (dbError || !sessionData) {
      return NextResponse.json({ error: "面试记录未找到" }, { status: 404 });
    }

    const { part1_data, part2_data, part3_data } = sessionData;

    // 2. 核心评估流程 (并发执行以提高效率)
    const [p1Result, p2Result, p3Result] = await Promise.all([
      evaluatePart1(part1_data),
      evaluatePart2(part2_data),
      evaluatePart3(part3_data)
    ]);

请严格遵守以下评估原则：

1. 不凭感觉评分。
2. 每个维度的评分必须基于"明确行为或文本证据"。
3. 过程能力优先于表面表达。
4. 不因为AI使用次数多或少而自动加减分，而是分析使用模式。
5. 若信息不足，应说明"不足以判断"，而不是臆测。

——————————————
【题目】
${taskTitle}

【评分维度（Rubric）】
${rubricText}

【候选人提交说明】
${notes || "（无）"}

【AI使用次数】
${aiCount || 0}

【AI完整对话记录（可能已摘要）】
${conversation || "（无对话记录）"}
——————————————

请按以下四大维度评分（每个维度0-100）：

1. AI协作成熟度
   - 是否主动拆解问题
   - 是否多轮优化prompt
   - 是否验证或修正AI输出
   - 是否存在盲目复制粘贴
   - 是否体现批判性思考

2. 产品思维与问题理解
   - 是否识别核心目标
   - 是否识别边界条件
   - 是否识别风险或trade-off
   - 是否体现MVP意识

3. 工程与结构意识
   - 是否结构清晰
   - 是否考虑扩展性
   - 是否体现模块化思维
   - 是否考虑异常与边界情况

4. 表达与复盘能力
   - 提交说明是否清晰
   - 是否诚实说明不足
   - 是否逻辑连贯

评分锚点说明：
- 90-100：结构化、系统性强、批判性明显、成熟协作模式
- 70-89：整体清晰，但深度或系统性略不足
- 50-69：能完成任务，但缺乏系统性或反思
- 0-49：内容混乱或缺乏有效信息

请输出严格JSON格式：

{
  "totalScore": number,
  "dimensions": [
    {
      "name": string,
      "score": number,
      "evidence": string,
      "comment": string
    }
  ],
  "aiUsageAnalysis": {
    "pattern": string,
    "riskLevel": "low" | "medium" | "high",
    "reason": string
  },
  "strengths": [string],
  "risks": [string],
  "followUpQuestions": [string]
}

不要输出markdown，不要输出解释文字，只输出JSON。

`;

    const response = await fetch(
      "https://api.deepseek.com/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: "You are a strict evaluator. Output only valid JSON." },
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
          max_tokens: 3000, // D: increased from 1000 to 3000
        }),
      }
    // 3. 计算加权总分
    const totalScore = Math.round(
      p1Result.score * 0.3 + 
      p2Result.score * 0.3 + 
      p3Result.score * 0.4
    );

    // 4. 生成综合报告
    const finalReport = {
      totalScore,
      recommendation: getRecommendation(totalScore),
      breakdown: {
        part1: p1Result,
        part2: p2Result,
        part3: p3Result
      },
      // 这里的全局分析可以再调一次 AI 汇总，或者直接由各部分拼接
      hiringAdvice: await generateExecutiveSummary(p1Result, p2Result, p3Result)
    };

    // 5. 将评估结果存回数据库，方便面试官后台查看
    await supabase
      .from("interview_sessions")
      .update({ 
        final_report: finalReport, 
        status: 'evaluated' 
      })
      .eq("session_id", sessionId);

    return NextResponse.json(finalReport);

  } catch (error: any) {
    console.error("Evaluation Error:", error);
    return NextResponse.json({ error: "评估系统故障" }, { status: 500 });
  }
}

// ===== 内部评估逻辑实现 =====

async function evaluatePart1(data: any) {
  if (!data) return { score: 0, feedback: "未提交" };
  let mcScore = 0;
  
  // 选择题逻辑：从题库匹配正确答案
  Object.entries(data.answers || {}).forEach(([id, ans]) => {
    const question = multipleChoicePool.find(q => q.id === id);
    if (question && question.correctAnswer === ans) mcScore += 10; 
  });

  // 问答题逻辑：调用 AI 评分
  // 这里简化演示只评第一个
  return {
    score: mcScore, // 实际应加上问答题分
    details: "选择题得分已自动校对"
  };
}

async function evaluatePart2(data: any) {
  if (!data || !data.messages) return { score: 0, feedback: "对话记录缺失" };

  // 获取对应的协作题 Rubric (示例取第一题)
  const rubric = collaborationTaskPool[0].evaluationFocus;

  // 调用 DeepSeek 进行专家评估
  const prompt = `你是一名资深 AI 产品专家。请根据以下面试对话记录评估候选人的 AI 协作能力。
  评估量表（关键要点）：${JSON.stringify(rubric)}
  对话记录：${JSON.stringify(data.messages)}
  
  请从：1. 需求洞察力 2. Prompt 迭代深度 3. 批判性思维 三个维度打分（各 10 分）。
  请返回 JSON 格式：{"score": 数字, "feedback": "简要评语", "analysis": "详细分析"}`;

  const aiRes = await callDeepSeek(prompt);
  return aiRes;
}

async function evaluatePart3(data: any) {
  if (!data || !data.repoUrl) return { score: 0, feedback: "项目未提交" };

  const rubric = projectTaskPool[0].rubric;
  const prompt = `评估候选人的 AI 项目实战能力。
  仓库地址：${data.repoUrl}
  项目备注：${data.notes}
  评分标准：${JSON.stringify(rubric)}
  
  请基于 README 说明和设计思路进行评分。
  请返回 JSON 格式：{"score": 数字, "feedback": "简要评语"}`;

  return await callDeepSeek(prompt);
}

// ===== 辅助函数 =====

async function callDeepSeek(prompt: string) {
  try {
    const res = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "system", content: "你是一个专业的招聘评估专家，只输出 JSON。" }, { role: "user", content: prompt }],
        response_format: { type: 'json_object' }
      })
    });
    const json = await res.json();
    return JSON.parse(json.choices[0].message.content);
  } catch (e) {
    return { score: 0, feedback: "评分引擎暂时不可用" };
  }
}

function getRecommendation(score: number) {
  if (score > 85) return "强烈推荐 (Strong Hire)";
  if (score > 70) return "建议录用 (Hire)";
  if (score > 55) return "待定 (Borderline)";
  return "不予考虑 (No Hire)";
}

async function generateExecutiveSummary(p1: any, p2: any, p3: any) {
  // 汇总各部分的 feedback，生成一段给面试官看的总结
  return `候选人在 AI 协作中表现出 ${p2.score > 7 ? '较强' : '一般'} 的提示词工程能力。项目实战分数为 ${p3.score}。`;
}