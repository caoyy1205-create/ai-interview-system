import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { question, conversation, round } = await req.json();

    const apiKey = process.env.QWEN_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const systemPrompt = `你是一位资深 AI 产品面试官，正在对候选人进行追问。

追问原则：
- 针对候选人回答中最模糊、最浅显或遗漏的核心点提问
- Round 1（第一次追问）：追问初始回答中最关键的不足点，比如缺乏细节、未说明机制、逻辑跳跃等
- Round 2（第二次追问）：追问边界情况、反例、实际落地挑战，或对前两轮回答做一个收尾性追问
- 每次追问只问 1 个问题，1-2 句话，简洁有力
- 不要评价或鼓励候选人，直接提问
- 不要重复前面已经追问过的内容`;

    const conversationContext = conversation.map((c: { role: string; content: string }) => ({
      role: c.role === "interviewer" ? "assistant" : "user",
      content: c.content,
    }));

    const userPrompt = `面试题目：${question}\n\n这是第 ${round} 次追问，请针对候选人的回答提出追问。`;

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
            ...conversationContext,
            { role: "user", content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 150,
          stream: false,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: "Qwen API error", details: data }, { status: response.status });
    }

    const content = data?.choices?.[0]?.message?.content || "（无追问）";
    return NextResponse.json({ content });
  } catch (error: any) {
    return NextResponse.json({ error: "Server internal error", details: error?.message }, { status: 500 });
  }
}
