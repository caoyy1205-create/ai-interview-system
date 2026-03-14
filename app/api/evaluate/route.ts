import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import {
multipleChoicePool,
collaborationTaskPool,
projectTaskPool,
} from "@/app/lib/questionBank";

export async function POST(request: Request) {
try {
const { sessionId } = await request.json();

const { data: sessionData, error: dbError } = await supabase
.from("interview_sessions")
.select("*")
.eq("session_id", sessionId)
.single();

if (dbError || !sessionData) {
return NextResponse.json({ error: "面试记录未找到" }, { status: 404 });
}

const { part1_data, part2_data, part3_data } = sessionData;

const [p1Result, p2Result, p3Result] = await Promise.all([
evaluatePart1(part1_data),
evaluatePart2(part2_data),
evaluatePart3(part3_data),
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
hiringAdvice: await generateExecutiveSummary(p1Result, p2Result, p3Result),
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

async function evaluatePart1(data: any) {
if (!data) return { score: 0, feedback: "未提交" };
let mcScore = 0;
Object.entries(data.answers || {}).forEach(([id, ans]) => {
const question = multipleChoicePool.find((q) => q.id === id);
if (question && question.correctAnswer === ans) mcScore += 10;
});
return { score: mcScore, details: "选择题得分已自动校对" };
}

async function evaluatePart2(data: any) {
if (!data || !data.messages) return { score: 0, feedback: "对话记录缺失" };
const rubric = collaborationTaskPool[0].evaluationFocus;
const prompt = `你是一名资深 AI 产品专家。请根据以下面试对话记录评估候选人的 AI 协作能力。
评估量表（关键要点）：${JSON.stringify(rubric)}
对话记录：${JSON.stringify(data.messages)}
请从：1. 需求洞察力 2. Prompt 迭代深度 3. 批判性思维 三个维度打分（各 10 分）。
请返回 JSON 格式：{"score": 数字, "feedback": "简要评语", "analysis": "详细分析"}`;
return await callDeepSeek(prompt);
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

async function callDeepSeek(prompt: string) {
try {
const res = await fetch("https://api.deepseek.com/chat/completions", {
method: "POST",
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
},
body: JSON.stringify({
model: "deepseek-chat",
messages: [
{ role: "system", content: "你是一个专业的招聘评估专家，只输出 JSON。" },
{ role: "user", content: prompt },
],
response_format: { type: "json_object" },
}),
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
return `候选人在 AI 协作中表现出 ${p2.score > 7 ? "较强" : "一般"} 的提示词工程能力。项目实战分数为 ${p3.score}。`;
}
ENDOFFILE