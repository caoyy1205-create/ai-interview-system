import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages, task, sessionId } = await req.json();

    const apiKey = process.env.QWEN_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    let systemPrompt = "You are a helpful AI assistant for a technical interview.";
    if (task) {
      systemPrompt = `你是一个 AI 产品经理面试评测系统中的 AI 助手。候选人正在完成以下面试任务，请帮助候选人思考和解决问题。

当前面试任务：
标题：${task.title || ""}
背景：${task.background || ""}
要求：
${(task.requirements || []).map((r: string, i: number) => `${i + 1}. ${r}`).join("\n")}

请用中文回复，保持简洁专业，帮助候选人理清思路、拆解需求、给出建议。`;
    }

    // 将消息历史格式化（去掉 time 字段）
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
          max_tokens: 800,
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

    const content =
      data?.choices?.[0]?.message?.content || "模型未返回内容";

    return NextResponse.json({ content });
  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Server internal error", details: error?.message },
      { status: 500 }
    );
  }
}
