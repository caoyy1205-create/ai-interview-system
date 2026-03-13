import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

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

你的目标是：基于候选人的AI协作过程与最终提交说明，进行结构化、证据驱动的评分。

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
    );

    const data = await response.json();

    const content =
      data?.choices?.[0]?.message?.content || "{}";

    return NextResponse.json({
      raw: content,
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: "Evaluation failed", details: error?.message },
      { status: 500 }
    );
  }
}
