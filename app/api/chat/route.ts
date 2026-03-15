import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages, task } = await req.json();

    const apiKey = process.env.QWEN_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    let systemPrompt = `你是一个 AI 产品经理面试评测系统中的 AI 助手，帮助候选人完成面试任务。

回复要求：
- 每次回复严格控制在300字以内，超出则截断
- 使用清晰的段落结构，重点用【】标注
- 列表用数字或"·"符号，每段之间空一行
- 直接给要点，不展开背景，不重复题目`;

    if (task) {
      systemPrompt += `

当前面试任务：
【标题】${task.title || ""}
【背景】${task.background || ""}
【要求】
${(task.requirements || []).map((r: string, i: number) => `${i + 1}. ${r}`).join("\n")}

请帮助候选人理清思路、拆解需求、给出具体建议。`;
    }

    const formattedMessages = Array.isArray(messages)
      ? messages.map((m: any) => ({ role: m.role, content: m.content }))
      : [];

    const response = await fetch(
      "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "qwen-flash",
          messages: [
            { role: "system", content: systemPrompt },
            ...formattedMessages,
          ],
          temperature: 0.7,
          max_tokens: 450,  // ~300中文字
          stream: false,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Qwen API error:", JSON.stringify(data));
      return NextResponse.json(
        { error: "Qwen API error", details: data },
        { status: response.status }
      );
    }

    const content = data?.choices?.[0]?.message?.content || "模型未返回内容";
    return NextResponse.json({ content });
  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Server internal error", details: error?.message },
      { status: 500 }
    );
  }
}
