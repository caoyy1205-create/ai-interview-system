import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, task } = await req.json();

    // B: Use DEEPSEEK_API_KEY (A fix)
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // B: Build system prompt that injects task context
    let systemPrompt = "You are a helpful AI assistant for a technical interview.";
    if (task) {
      systemPrompt = `You are a helpful AI assistant supporting a candidate during an interview exam.

Current Interview Task:
Title: ${task.title || ""}
Background: ${task.background || ""}
Requirements:
${(task.requirements || []).map((r: string, i: number) => `${i + 1}. ${r}`).join("\n")}

Help the candidate think through this task. You can answer questions, help break down requirements, suggest approaches, review code logic, etc. Be concise and helpful.`;
    }

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
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: message,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      }
    );

    const data = await response.json();

    console.log(
      "DeepSeek raw response:",
      JSON.stringify(data, null, 2)
    );

    // 如果返回异常
    if (!response.ok) {
      return NextResponse.json(
        {
          error: "DeepSeek API error",
          details: data,
        },
        { status: response.status }
      );
    }

    // 正常返回
    const reply =
      data?.choices?.[0]?.message?.content || "模型未返回内容";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Server error:", error);

    return NextResponse.json(
      {
        error: "Server internal error",
        details: error?.message,
      },
      { status: 500 }
    );
  }
}
