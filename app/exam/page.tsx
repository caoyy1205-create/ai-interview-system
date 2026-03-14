"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Task = {
id: string;
title: string;
timeLimitMinutes: number;
difficulty: "junior" | "mid" | "senior";
tags: string[];
background: string;
requirements: string[];
deliverables: string[];
rubric: { dimension: string; weight: number; whatGoodLooksLike: string }[];
};

type Part1Question = {
id: string;
type: "multipleChoice" | "essay";
question: string;
options?: string[];
correctAnswer?: number;
evaluationPoints?: string[];
difficulty?: string;
topics?: string[];
};

type Part2Task = {
id: string;
title: string;
description: string;
conflicts: string[];
evaluationFocus: string[];
timeLimitMinutes?: number;
};

type ExamSet = {
part1: { type: string; allowAI: boolean; timeLimitMinutes: number; questions: Part1Question[] };
part2: { type: string; allowAI: boolean; timeLimitMinutes: number; tasks: Part2Task[] };
part3: { type: string; allowAI: boolean; timeLimitMinutes: number; task: Task };
};

type Message = { role: "user" | "assistant"; content: string; time: number };

function formatTime(s: number) {
s = Math.max(0, s);
return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

const S = {
page: { minHeight: "100vh", background: "#fff", color: "#111", fontFamily: "'Inter', -apple-system, sans-serif" } as React.CSSProperties,
topbar: { borderBottom: "1px solid #f0f0f0", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "56px" } as React.CSSProperties,
logo: { fontWeight: 700, fontSize: "15px", letterSpacing: "-0.01em" } as React.CSSProperties,
timer: { fontFamily: "monospace", fontSize: "15px", fontWeight: 600, color: "#111" } as React.CSSProperties,
tabs: { borderBottom: "1px solid #f0f0f0", padding: "0 32px", display: "flex" } as React.CSSProperties,
tab: (active: boolean): React.CSSProperties => ({ padding: "14px 20px", fontSize: "13px", fontWeight: active ? 600 : 400, color: active ? "#111" : "#888", borderBottom: active ? "2px solid #111" : "2px solid transparent", cursor: "pointer", background: "none", border: "none", borderBottomWidth: "2px", borderBottomStyle: "solid", borderBottomColor: active ? "#111" : "transparent" }),
body: { maxWidth: "760px", margin: "0 auto", padding: "40px 32px 80px" } as React.CSSProperties,
badge: (color: string): React.CSSProperties => ({ display: "inline-block", fontSize: "11px", fontWeight: 500, padding: "2px 8px", borderRadius: "4px", background: color === "yellow" ? "#fefce8" : color === "blue" ? "#eff6ff" : color === "green" ? "#f0fdf4" : "#f9fafb", color: color === "yellow" ? "#854d0e" : color === "blue" ? "#1d4ed8" : color === "green" ? "#15803d" : "#444", border: `1px solid ${color === "yellow" ? "#fef08a" : color === "blue" ? "#bfdbfe" : color === "green" ? "#bbf7d0" : "#e5e7eb"}` }),
card: { border: "1px solid #f0f0f0", borderRadius: "8px", padding: "24px", marginBottom: "20px" } as React.CSSProperties,
label: { fontSize: "12px", fontWeight: 500, color: "#888", marginBottom: "6px", display: "block", textTransform: "uppercase" as const, letterSpacing: "0.05em" },
input: { width: "100%", border: "1px solid #e5e5e5", borderRadius: "6px", padding: "10px 12px", fontSize: "13px", color: "#111", outline: "none", boxSizing: "border-box" as const, background: "#fff" },
textarea: { width: "100%", border: "1px solid #e5e5e5", borderRadius: "6px", padding: "10px 12px", fontSize: "13px", color: "#111", outline: "none", boxSizing: "border-box" as const, background: "#fff", minHeight: "120px", resize: "vertical" as const },
btnPrimary: (disabled?: boolean): React.CSSProperties => ({ background: disabled ? "#e5e5e5" : "#111", color: disabled ? "#aaa" : "#fff", border: "none", borderRadius: "6px", padding: "10px 20px", fontSize: "13px", fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer" }),
divider: { borderTop: "1px solid #f0f0f0", margin: "28px 0" } as React.CSSProperties,
sectionTitle: { fontSize: "18px", fontWeight: 700, letterSpacing: "-0.01em", marginBottom: "4px" } as React.CSSProperties,
sectionSub: { fontSize: "13px", color: "#888", marginBottom: "28px" } as React.CSSProperties,
statusBar: { position: "fixed" as const, bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #f0f0f0", padding: "10px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "#888" },
};

export default function ExamPage() {
type ActivePart = "part1" | "part2" | "part3";
const [activePart, setActivePart] = useState<ActivePart>("part1");
const [sessionId, setSessionId] = useState("");
const [task, setTask] = useState<Task | null>(null);
const [part1, setPart1] = useState<ExamSet["part1"] | null>(null);
const [part2, setPart2] = useState<ExamSet["part2"] | null>(null);
const [part3, setPart3] = useState<ExamSet["part3"] | null>(null);
const totalSeconds = useMemo(() => (part3?.task ? part3.task.timeLimitMinutes * 60 : 0), [part3]);
const [leftSeconds, setLeftSeconds] = useState(0);
const [messages, setMessages] = useState<Message[]>([]);
const [input, setInput] = useState("");
const [aiCount, setAiCount] = useState(0);
const messagesEndRef = useRef<HTMLDivElement>(null);
const [part1Answers, setPart1Answers] = useState<{ [id: string]: string | number }>({});
const [repoUrl, setRepoUrl] = useState("");
const [notes, setNotes] = useState("");
const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

useEffect(() => {
let cancelled = false;
fetch("/api/session/start", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) })
.then(r => r.json()).then(data => {
if (cancelled) return;
const { sessionId, examSet } = data;
setSessionId(sessionId);
setPart1(examSet.part1); setPart2(examSet.part2); setPart3(examSet.part3);
setTask(examSet.part3.task);
setLeftSeconds(examSet.part3.task.timeLimitMinutes * 60);
});
return () => { cancelled = true; };
}, []);

useEffect(() => {
if (leftSeconds <= 0) return;
const t = setInterval(() => setLeftSeconds(p => p <= 1 ? (clearInterval(t), 0) : p - 1), 1000);
return () => clearInterval(t);
}, [leftSeconds]);

useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

const isReady = !!task && !!sessionId;
const isTimeUp = leftSeconds <= 0 && isReady && totalSeconds > 0;

const sendMessage = async () => {
if (!input.trim() || isTimeUp) return;
const userMsg: Message = { role: "user", content: input, time: Date.now() };
setMessages(p => [...p, userMsg]); setAiCount(p => p + 1); setInput("");
try {
const r = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId, messages: [...messages, userMsg] }) });
const d = await r.json();
setMessages(p => [...p, { role: "assistant", content: d.content, time: Date.now() }]);
} catch {}
};

const submitPart = async (part: "part1" | "part2" | "part3", data: any, next?: ActivePart) => {
setSubmitStatus("submitting");
try {
const r = await fetch("/api/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId, part, data }) });
if (r.ok) {
setSubmitStatus("success");
if (next) setTimeout(() => { setSubmitStatus("idle"); setActivePart(next); }, 800);
else {
const submission = {
sessionId,
taskId: task?.id || '',
taskTitle: task?.title || '',
repoUrl: data.repoUrl || '',
notes: data.notes || '',
submittedAt: Date.now(),
aiCount,
messages,
rubric: task?.rubric || [],
};
localStorage.setItem('submission:' + sessionId, JSON.stringify(submission));
window.location.href = '/report?sessionId=' + sessionId;
}
} else setSubmitStatus("error");
} catch { setSubmitStatus("error"); }
};

const renderPart1 = () => {
if (!part1) return null;
return (
<div>
<div style={S.sectionTitle}>第一部分：基础认知</div>
<div style={S.sectionSub}>{part1.timeLimitMinutes} 分钟 · {part1.questions.length} 题 · 禁止使用 AI 工具</div>
<div style={{ ...S.card, background: "#fffbeb", borderColor: "#fde68a" }}>
<span style={S.badge("yellow")}>⚠️ 禁止 AI</span>
<span style={{ fontSize: "13px", color: "#92400e", marginLeft: "10px" }}>本部分请独立完成，系统会记录答题过程</span>
</div>
{part1.questions.map((q, idx) => (
<div key={q.id} style={S.card}>
<div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
<span style={S.badge(q.type === "multipleChoice" ? "blue" : "green")}>
{q.type === "multipleChoice" ? `选择题 ${idx + 1}` : `问答题`}
</span>
{q.difficulty && <span style={{ fontSize: "11px", color: "#aaa" }}>{q.difficulty}</span>}
</div>
<div style={{ fontSize: "14px", fontWeight: 500, marginBottom: "16px", lineHeight: "1.6" }}>{q.question}</div>
{q.type === "multipleChoice" && q.options?.map((opt, i) => (
<label key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", border: `1px solid ${part1Answers[q.id] === i ? "#111" : "#e5e5e5"}`, borderRadius: "6px", marginBottom: "8px", cursor: "pointer", fontSize: "13px", background: part1Answers[q.id] === i ? "#f9f9f9" : "#fff" }}>
<input type="radio" name={q.id} checked={part1Answers[q.id] === i} onChange={() => setPart1Answers(p => ({ ...p, [q.id]: i }))} />
{opt}
</label>
))}
{q.type === "essay" && (
<textarea style={S.textarea} value={(part1Answers[q.id] as string) || ""} onChange={e => setPart1Answers(p => ({ ...p, [q.id]: e.target.value }))} placeholder="请输入你的回答（建议 300-500 字）..." />
)}
</div>
))}
<div style={S.divider} />
<button style={S.btnPrimary(submitStatus === "submitting")} onClick={() => submitPart("part1", { answers: part1Answers, completedAt: Date.now() }, "part2")} disabled={submitStatus === "submitting"}>
{submitStatus === "submitting" ? "提交中..." : "提交并进入第二部分 →"}
</button>
</div>
);
};

const renderPart2 = () => {
if (!part2) return null;
const t = part2.tasks[0];
return (
<div>
<div style={S.sectionTitle}>第二部分：AI 协作能力</div>
<div style={S.sectionSub}>{part2.timeLimitMinutes} 分钟 · 可使用系统内置 AI 助手</div>
<div style={S.card}>
<div style={{ fontSize: "15px", fontWeight: 600, marginBottom: "8px" }}>{t.title}</div>
<div style={{ fontSize: "13px", color: "#555", lineHeight: "1.7", marginBottom: "16px" }}>{t.description}</div>
<div style={{ fontSize: "12px", fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>挑战与冲突</div>
{t.conflicts.map((c, i) => <div key={i} style={{ fontSize: "13px", color: "#555", padding: "6px 0", borderTop: i > 0 ? "1px solid #f5f5f5" : "none" }}>· {c}</div>)}
</div>
<div style={{ ...S.card, padding: "0" }}>
<div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
<span style={{ fontSize: "13px", fontWeight: 600 }}>AI 对话</span>
<span style={{ fontSize: "12px", color: "#aaa" }}>已使用 {aiCount} 次</span>
</div>
<div style={{ height: "320px", overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: "12px" }}>
{messages.length === 0 ? (
<div style={{ fontSize: "13px", color: "#bbb", textAlign: "center", marginTop: "80px" }}>开始与 AI 对话来完成任务...</div>
) : messages.map((m, i) => (
<div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
<div style={{ fontSize: "11px", color: "#ccc", marginBottom: "3px" }}>{m.role === "user" ? "你" : "AI"} · {new Date(m.time).toLocaleTimeString()}</div>
<div style={{ maxWidth: "80%", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", lineHeight: "1.6", background: m.role === "user" ? "#111" : "#f5f5f5", color: m.role === "user" ? "#fff" : "#111" }}>{m.content}</div>
</div>
))}
<div ref={messagesEndRef} />
</div>
<div style={{ padding: "12px 16px", borderTop: "1px solid #f0f0f0", display: "flex", gap: "8px" }}>
<input style={{ ...S.input, flex: 1 }} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder={isTimeUp ? "时间已结束" : "输入问题..."} disabled={isTimeUp} />
<button style={S.btnPrimary(isTimeUp)} onClick={sendMessage} disabled={isTimeUp}>发送</button>
</div>
</div>
<div style={S.divider} />
<button style={S.btnPrimary(submitStatus === "submitting")} onClick={() => submitPart("part2", { messages, aiCount, completedAt: Date.now() }, "part3")} disabled={submitStatus === "submitting"}>
{submitStatus === "submitting" ? "提交中..." : "提交并进入第三部分 →"}
</button>
</div>
);
};

const renderPart3 = () => {
if (!part3) return null;
return (
<div>
<div style={S.sectionTitle}>第三部分：项目实战</div>
<div style={S.sectionSub}>{part3.task.timeLimitMinutes} 分钟 · 不限工具，提交可运行的项目仓库</div>
<div style={S.card}>
<div style={{ fontSize: "15px", fontWeight: 700, marginBottom: "16px" }}>{part3.task.title}</div>
<div style={{ fontSize: "12px", fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>背景</div>
<div style={{ fontSize: "13px", color: "#555", lineHeight: "1.7", marginBottom: "16px" }}>{part3.task.background}</div>
<div style={{ fontSize: "12px", fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>要求</div>
{part3.task.requirements.map((r, i) => <div key={i} style={{ fontSize: "13px", color: "#555", padding: "4px 0" }}>· {r}</div>)}
<div style={{ ...S.divider, margin: "16px 0" }} />
<div style={{ fontSize: "12px", fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>交付物</div>
{part3.task.deliverables.map((d, i) => <div key={i} style={{ fontSize: "13px", color: "#555", padding: "4px 0" }}>· {d}</div>)}
</div>
<div style={S.card}>
<div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "20px" }}>项目提交</div>
<label style={S.label}>GitHub 仓库链接 *</label>
<input style={{ ...S.input, marginBottom: "16px" }} type="url" value={repoUrl} onChange={e => setRepoUrl(e.target.value)} placeholder="https://github.com/username/project-name" />
<label style={S.label}>提交说明</label>
<textarea style={{ ...S.textarea, marginBottom: "0" }} value={notes} onChange={e => setNotes(e.target.value)} placeholder="简述你如何拆解需求、如何使用 AI、关键取舍与未完成项..." />
</div>
<div style={S.divider} />
<div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
<button style={S.btnPrimary(submitStatus === "submitting" || !repoUrl.trim())} onClick={() => submitPart("part3", { repoUrl, notes, completedAt: Date.now() })} disabled={submitStatus === "submitting" || !repoUrl.trim()}>
{submitStatus === "submitting" ? "提交中..." : "完成面试并提交"}
</button>
{submitStatus === "success" && <span style={{ fontSize: "13px", color: "#16a34a" }}>✓ 提交成功，正在跳转...</span>}
{submitStatus === "error" && <span style={{ fontSize: "13px", color: "#dc2626" }}>提交失败，请重试</span>}
</div>
</div>
);
};

return (
<div style={S.page}>
<div style={S.topbar}>
<div style={S.logo}>AI 面试系统</div>
<div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
{isTimeUp && <span style={{ fontSize: "12px", color: "#dc2626", fontWeight: 600 }}>⏰ 时间已结束</span>}
<div style={S.timer}>{isReady ? formatTime(leftSeconds) : "--:--"}</div>
</div>
</div>
<div style={S.tabs}>
{(["part1", "part2", "part3"] as ActivePart[]).map((p, i) => (
<button key={p} style={S.tab(activePart === p)} onClick={() => setActivePart(p)}>
{["第一部分 基础认知", "第二部分 AI 协作", "第三部分 项目实战"][i]}
</button>
))}
</div>
<div style={S.body}>
{!part1 ? (
<div style={{ textAlign: "center", padding: "80px 0", color: "#bbb", fontSize: "13px" }}>正在加载题目...</div>
) : (
<>
{activePart === "part1" && renderPart1()}
{activePart === "part2" && renderPart2()}
{activePart === "part3" && renderPart3()}
</>
)}
</div>
<div style={S.statusBar}>
<span>Session: {sessionId || "—"}</span>
<span>AI 使用次数: {aiCount}</span>
</div>
</div>
);
}
