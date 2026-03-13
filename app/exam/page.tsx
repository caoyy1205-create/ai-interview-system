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

type Message = {
  role: "user" | "assistant";
  content: string;
  time: number;
};

function formatTime(totalSeconds: number) {
  const s = Math.max(0, totalSeconds);
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function ExamPage() {
  // ===== session & task =====
  const [sessionId, setSessionId] = useState<string>("");
  const [task, setTask] = useState<Task | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);

  // ===== timer =====
  const totalSeconds = useMemo(() => {
    if (!task) return 0;
    return task.timeLimitMinutes * 60;
  }, [task]);

  const [leftSeconds, setLeftSeconds] = useState(0);

  // ===== chat =====
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [aiCount, setAiCount] = useState(0);
  // G: ref for auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [repoUrl, setRepoUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  // ===== start session on mount =====
  useEffect(() => {
    let cancelled = false;

    async function start() {
      // Read pre-created session from localStorage (set by home page form)
      let sessionData: { sessionId: string; startedAt: number; task: Task } | null = null;
      try {
        const pending = localStorage.getItem("pendingSession");
        if (pending) {
          sessionData = JSON.parse(pending);
          localStorage.removeItem("pendingSession"); // consume it
        }
      } catch {}

      if (!sessionData) {
        // Fallback: should not happen in normal flow (user came via home page)
        // Redirect back to home
        window.location.href = "/";
        return;
      }

      if (cancelled) return;

      setSessionId(sessionData.sessionId);
      setStartedAt(sessionData.startedAt);
      setTask(sessionData.task);

      // F: store taskTitle in localStorage
      try {
        localStorage.setItem("currentTaskTitle", sessionData.task.title || "");
      } catch {}

      setLeftSeconds(sessionData.task.timeLimitMinutes * 60);
      setMessages([]);
      setAiCount(0);
      setInput("");
    }

    start();

    return () => {
      cancelled = true;
    };
  }, []);

  // ===== countdown =====
  useEffect(() => {
    if (!task) return;
    const timer = window.setInterval(() => {
      setLeftSeconds((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [task]);

  // G: auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isReady = !!task && !!sessionId;
  // E: time up state
  const isTimeUp = leftSeconds <= 0 && isReady && totalSeconds > 0;
  // E: chat is locked when time is up
  const isChatLocked = isTimeUp;

  async function sendMessage() {
    if (!input.trim()) return;
    // E: block sending if time is up
    if (isChatLocked) return;

    const userText = input;
    const userMessage: Message = {
      role: "user",
      content: userText,
      time: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // B: pass full task object to chat API
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userText,
        sessionId,
        taskId: task?.id,
        task: task
          ? {
              title: task.title,
              background: task.background,
              requirements: task.requirements,
            }
          : undefined,
      }),
    });

    const data = await res.json();

    const aiMessage: Message = {
      role: "assistant",
      content: data.reply || "无回复",
      time: Date.now(),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setAiCount((prev) => prev + 1);
  }

  async function submitProject() {
    if (!task || !sessionId) return;

    if (!repoUrl.trim()) {
      alert("请填写仓库链接（repoUrl）。");
      return;
    }

    setSubmitStatus("submitting");

    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        taskId: task.id,
        repoUrl,
        notes,
        candidateName: (() => { try { return localStorage.getItem("candidateName") || ""; } catch { return ""; } })(),
        candidateEmail: (() => { try { return localStorage.getItem("candidateEmail") || ""; } catch { return ""; } })(),
      }),
    });

    if (!res.ok) {
      setSubmitStatus("error");
      const data = await res.json().catch(() => ({}));
      if (res.status === 409) {
        alert("该面试已提交，不允许重复提交。");
      } else if (res.status === 429) {
        alert("请求过于频繁，请稍后重试。");
      } else {
        alert(`提交失败：${data?.error || res.statusText}`);
      }
      return;
    }

    setSubmitStatus("success");

    // F: store taskTitle in localStorage alongside other submission data
    try {
      localStorage.setItem(
        `submission:${sessionId}`,
        JSON.stringify({
          sessionId,
          taskId: task.id,
          taskTitle: task.title, // F: store taskTitle
          repoUrl,
          notes,
          submittedAt: Date.now(),
          aiCount,
          messages,
          rubric: task.rubric, // C: also store rubric for evaluate page
        })
      );
    } catch {}

    window.location.href = `/report?sessionId=${encodeURIComponent(sessionId)}`;
  }

  return (
    // H: light theme redesign - #FAFAFA background, Inter font, Notion/Linear minimal style
    <main
      className="min-h-screen"
      style={{
        background: "#FAFAFA",
        color: "#111",
        fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">

        {/* E: Time-up banner */}
        {isTimeUp && (
          <div
            style={{
              background: "#ef4444",
              color: "#fff",
              borderRadius: "12px",
              padding: "14px 20px",
              fontWeight: 600,
              fontSize: "15px",
              textAlign: "center",
              letterSpacing: "0.01em",
            }}
          >
            ⏰ 考试时间已结束，请立即提交
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2">
            <h1
              style={{
                fontSize: "26px",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "#111",
              }}
            >
              {task ? task.title : "正在下发题目…"}
            </h1>

            <div style={{ fontSize: "13px", color: "#888", lineHeight: "1.8" }}>
              <div>
                Session：<span style={{ color: "#444" }}>{sessionId || "—"}</span>
              </div>
              <div>
                AI 已使用次数：<span style={{ color: "#444" }}>{aiCount}</span> 次
              </div>
              <div>
                {task ? (
                  <>
                    难度：<span style={{ color: "#444" }}>{task.difficulty}</span>{" "}
                    · 标签：{" "}
                    <span style={{ color: "#444" }}>{task.tags.join(", ")}</span>
                  </>
                ) : (
                  "题目加载中…"
                )}
              </div>
              {startedAt ? (
                <div>
                  开始时间：{" "}
                  <span style={{ color: "#444" }}>
                    {new Date(startedAt).toLocaleString()}
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Timer */}
          <div
            style={{
              flexShrink: 0,
              borderRadius: "16px",
              border: "1px solid #E8E4F0",
              background: "#fff",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              padding: "16px 24px",
            }}
          >
            <div style={{ fontSize: "12px", color: "#888" }}>剩余时间</div>
            <div
              style={{
                marginTop: "4px",
                fontSize: "32px",
                fontWeight: 600,
                fontFamily: "monospace",
                color: isTimeUp ? "#ef4444" : "#111",
              }}
            >
              {isReady ? formatTime(leftSeconds) : "--:--"}
            </div>
            <div style={{ marginTop: "6px", fontSize: "11px", color: "#aaa" }}>
              {task ? `限时：${task.timeLimitMinutes} 分钟` : "—"}
            </div>
          </div>
        </div>

        {/* Task */}
        <section
          style={{
            borderRadius: "16px",
            border: "1px solid #E8E4F0",
            background: "#fff",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            padding: "24px",
          }}
        >
          {!task ? (
            <div style={{ color: "#aaa" }}>题目正在加载中，请稍等…</div>
          ) : (
            <div className="space-y-5">
              <div>
                <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#111" }}>背景</h2>
                <p style={{ marginTop: "8px", color: "#555", lineHeight: "1.7", fontSize: "14px" }}>
                  {task.background}
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#111" }}>需求</h2>
                <ul style={{ marginTop: "8px", paddingLeft: "16px", color: "#555", fontSize: "14px" }}>
                  {task.requirements.map((x) => (
                    <li key={x} style={{ marginBottom: "4px", lineHeight: "1.6" }}>{x}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#111" }}>交付物</h2>
                <ul style={{ marginTop: "8px", paddingLeft: "16px", color: "#555", fontSize: "14px" }}>
                  {task.deliverables.map((x) => (
                    <li key={x} style={{ marginBottom: "4px", lineHeight: "1.6" }}>{x}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#111" }}>评分维度（Rubric）</h2>
                <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {task.rubric.map((r) => (
                    <div
                      key={r.dimension}
                      style={{
                        borderRadius: "12px",
                        border: "1px solid #F5E4E4",
                        background: "#FAFAFA",
                        padding: "14px 16px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ fontWeight: 500, fontSize: "14px", color: "#111" }}>{r.dimension}</div>
                        <div style={{ fontSize: "12px", color: "#aaa" }}>权重 {r.weight}</div>
                      </div>
                      <div style={{ marginTop: "6px", fontSize: "13px", color: "#666", lineHeight: "1.6" }}>
                        {r.whatGoodLooksLike}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Workspace */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          {/* Chat */}
          <div
            style={{
              borderRadius: "16px",
              border: "1px solid #E8E4F0",
              background: "#fff",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              padding: "24px",
            }}
          >
            <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#111" }}>AI 对话区</h3>
            <p style={{ marginTop: "6px", color: "#888", fontSize: "13px", lineHeight: "1.6" }}>
              系统会记录对话内容与时间戳，用于评估 AI 协作能力。
            </p>

            <div style={{ marginTop: "16px" }}>
              {/* G: message area with auto-scroll */}
              <div
                style={{
                  height: "256px",
                  overflowY: "auto",
                  background: "#FAFAFA",
                  borderRadius: "12px",
                  border: "1px solid #F0EDF8",
                  padding: "14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {messages.length === 0 ? (
                  <div style={{ fontSize: "13px", color: "#bbb" }}>
                    暂无对话。你可以从"需求拆解、技术方案、评估维度、边界情况"开始提问。
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div key={idx} style={{ fontSize: "13px" }}>
                      <div style={{ fontSize: "11px", color: "#bbb" }}>
                        {new Date(msg.time).toLocaleTimeString()}
                      </div>
                      <div style={{ marginTop: "3px", color: msg.role === "user" ? "#333" : "#555" }}>
                        <strong style={{ color: msg.role === "user" ? "#111" : "#7C5CBF" }}>
                          {msg.role === "user" ? "你" : "AI"}：
                        </strong>{" "}
                        {msg.content}
                      </div>
                    </div>
                  ))
                )}
                {/* G: scroll target */}
                <div ref={messagesEndRef} />
              </div>

              {/* E: Time-up lock indicator */}
              {isChatLocked && (
                <div
                  style={{
                    marginTop: "8px",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    color: "#ef4444",
                    fontSize: "12px",
                    fontWeight: 500,
                  }}
                >
                  ⏰ 时间已结束，聊天已锁定，请提交项目
                </div>
              )}

              <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  style={{
                    flex: 1,
                    background: isChatLocked ? "#f5f5f5" : "#F9F8FF",
                    border: "1px solid #E8E4F0",
                    borderRadius: "10px",
                    padding: "8px 12px",
                    fontSize: "13px",
                    color: "#111",
                    outline: "none",
                    cursor: isChatLocked ? "not-allowed" : "text",
                  }}
                  placeholder={
                    !isReady ? "等待题目下发…" : isChatLocked ? "时间已结束" : "输入你的问题…"
                  }
                  // E: disable input when time is up
                  disabled={!isReady || isChatLocked}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isChatLocked) sendMessage();
                  }}
                />
                <button
                  onClick={sendMessage}
                  style={{
                    background: isChatLocked ? "#ccc" : "#111",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    padding: "8px 16px",
                    fontSize: "13px",
                    fontWeight: 500,
                    cursor: (!isReady || isChatLocked) ? "not-allowed" : "pointer",
                    opacity: (!isReady || isChatLocked) ? 0.5 : 1,
                  }}
                  // E: disable button when time is up
                  disabled={!isReady || isChatLocked}
                >
                  发送
                </button>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div
            style={{
              borderRadius: "16px",
              border: "1px solid #E8E4F0",
              background: "#fff",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              padding: "24px",
            }}
          >
            <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#111" }}>项目提交</h3>
            <p style={{ marginTop: "6px", color: "#888", fontSize: "13px", lineHeight: "1.6" }}>
              请提交仓库链接（建议包含 README），并补充说明你如何使用 AI、关键取舍与未完成项。
            </p>

            <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <div style={{ fontSize: "13px", color: "#555", marginBottom: "4px", fontWeight: 500 }}>
                  仓库链接（repoUrl）
                </div>
                <input
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#F9F8FF",
                    border: "1px solid #E8E4F0",
                    borderRadius: "10px",
                    padding: "8px 12px",
                    fontSize: "13px",
                    color: "#111",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  placeholder="https://github.com/xxx/yyy"
                  disabled={!isReady || submitStatus === "submitting"}
                />
              </div>

              <div>
                <div style={{ fontSize: "13px", color: "#555", marginBottom: "4px", fontWeight: 500 }}>
                  提交说明（notes）
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#F9F8FF",
                    border: "1px solid #E8E4F0",
                    borderRadius: "10px",
                    padding: "8px 12px",
                    fontSize: "13px",
                    color: "#111",
                    outline: "none",
                    minHeight: "120px",
                    boxSizing: "border-box",
                    resize: "vertical",
                  }}
                  placeholder="简述：你如何拆解需求、如何使用 AI、做了哪些取舍、还有哪些未完成项与原因。"
                  disabled={!isReady || submitStatus === "submitting"}
                />
              </div>

              <button
                style={{
                  width: "100%",
                  borderRadius: "12px",
                  background: "#111",
                  color: "#fff",
                  border: "none",
                  padding: "12px",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: (!isReady || submitStatus === "submitting") ? "not-allowed" : "pointer",
                  opacity: (!isReady || submitStatus === "submitting") ? 0.5 : 1,
                  letterSpacing: "0.01em",
                }}
                onClick={submitProject}
                disabled={!isReady || submitStatus === "submitting"}
              >
                {submitStatus === "submitting" ? "提交中…" : "提交项目"}
              </button>

              {submitStatus === "success" ? (
                <div style={{ fontSize: "13px", color: "#22c55e" }}>提交成功，正在跳转报告页…</div>
              ) : submitStatus === "error" ? (
                <div style={{ fontSize: "13px", color: "#ef4444" }}>提交失败，请重试。</div>
              ) : (
                <div style={{ fontSize: "11px", color: "#bbb" }}>
                  绑定信息：sessionId={sessionId || "—"}，taskId={task?.id || "—"}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
