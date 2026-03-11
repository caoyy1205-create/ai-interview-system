import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
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
              content: "You are a helpful AI assistant.",
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
