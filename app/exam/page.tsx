"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// 类型定义
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
  options?: string[]; // 选择题有
  correctAnswer?: number; // 选择题有
  evaluationPoints?: string[]; // 问答题有
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
  part1: {
    type: string;
    allowAI: boolean;
    timeLimitMinutes: number;
    questions: Part1Question[];
  };
  part2: {
    type: string;
    allowAI: boolean;
    timeLimitMinutes: number;
    tasks: Part2Task[];
  };
  part3: {
    type: string;
    allowAI: boolean;
    timeLimitMinutes: number;
    task: Task;
  };
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
  // ===== 面试部分状态 =====
  type ActivePart = "part1" | "part2" | "part3";
  const [activePart, setActivePart] = useState<ActivePart>("part1");

  // ===== session & task =====
  const [sessionId, setSessionId] = useState<string>("");
  const [task, setTask] = useState<Task | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);

  // ===== 三部分题目数据 =====
  const [part1, setPart1] = useState<ExamSet["part1"] | null>(null);
  const [part2, setPart2] = useState<ExamSet["part2"] | null>(null);
  const [part3, setPart3] = useState<ExamSet["part3"] | null>(null);

  // ===== timer =====
  const totalSeconds = useMemo(() => {
    if (!part3?.task) return 0;
    return part3.task.timeLimitMinutes * 60;
  }, [part3]);

  const [leftSeconds, setLeftSeconds] = useState(0);

  // ===== chat =====
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [aiCount, setAiCount] = useState(0);
  // G: ref for auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ===== 第一部分答案 =====
  const [part1Answers, setPart1Answers] = useState<{
    [questionId: string]: string | number;
  }>({});

  // ===== 项目提交 =====
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
      const res = await fetch("/api/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await res.json();
      if (cancelled) return;

      // 新 API 返回 examSet
      const { sessionId, startedAt, examSet } = data;
      const { part1, part2, part3 } = examSet;

      setSessionId(sessionId);
      setStartedAt(startedAt);

      // 设置三部分数据
      setPart1(part1);
      setPart2(part2);
      setPart3(part3);

      // 保持向后兼容：task 现在对应 part3.task
      setTask(part3.task);

      // 初始化倒计时（使用 part3 的时间限制）
      setLeftSeconds(part3.task.timeLimitMinutes * 60);

      // 清空上一场残留
      setMessages([]);
      setAiCount(0);
      setInput("");
      setPart1Answers({});
    }

    start();

    return () => {
      cancelled = true;
    };
  }, []);

  // ===== 倒计时 =====
  useEffect(() => {
    if (leftSeconds <= 0) return;

    const timer = setInterval(() => {
      setLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [leftSeconds]);

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
  // ===== AI 对话 =====
  const sendMessage = async () => {
    if (!input.trim()) return;
    // E: block sending if time is up
    if (isChatLocked) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      time: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setAiCount((prev) => prev + 1);
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
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          messages: [...messages, userMessage],
        }),
      });

      const data = await res.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.content,
        time: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
    }
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
  // ===== 第一部分答案处理 =====
  const handlePart1Answer = (questionId: string, answer: string | number) => {
    setPart1Answers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  // ===== 提交第一部分 =====
  const submitPart1 = async () => {
    if (!part1) return;

    setSubmitStatus("submitting");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          part: "part1",
          data: {
            answers: part1Answers,
            completedAt: Date.now(),
          },
        }),
      });

      if (res.ok) {
        setSubmitStatus("success");
        // 自动切换到第二部分
        setTimeout(() => setActivePart("part2"), 1000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitStatus("error");
    }
  };

  // ===== 提交第二部分 =====
  const submitPart2 = async () => {
    setSubmitStatus("submitting");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          part: "part2",
          data: {
            messages,
            aiCount,
            completedAt: Date.now(),
          },
        }),
      });

      if (res.ok) {
        setSubmitStatus("success");
        // 自动切换到第三部分
        setTimeout(() => setActivePart("part3"), 1000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitStatus("error");
    }
  };

  // ===== 提交第三部分 =====
  const submitPart3 = async () => {
    if (!repoUrl.trim()) {
      alert("请填写项目仓库链接");
      return;
    }

    setSubmitStatus("submitting");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          part: "part3",
          data: {
            repoUrl,
            notes,
            completedAt: Date.now(),
          },
        }),
      });

      if (res.ok) {
        setSubmitStatus("success");
        // 跳转到报告页面
        window.location.href = `/report?sessionId=${sessionId}`;
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitStatus("error");
    }
  };

  // ===== 渲染第一部分：基础认知 =====
  const renderPart1 = () => {
    if (!part1) return null;

    return (
      <div className="part1-container p-6">
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <span className="text-yellow-600 mr-2">⚠️</span>
            <span className="font-medium text-yellow-800">
              本部分禁止使用任何 AI 工具（含 Copilot、ChatGPT、网页问答等）
            </span>
          </div>
          <p className="text-yellow-700 text-sm mt-2">
            请独立完成以下题目，系统会记录你的答题过程
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-6">第一部分：基础认知</h2>
        <p className="text-gray-600 mb-8">
          时间限制：{part1.timeLimitMinutes} 分钟 | 共 {part1.questions.length}{" "}
          题
        </p>

        {/* 选择题 */}
        {part1.questions
          .filter((q) => q.type === "multipleChoice")
          .map((q, idx) => (
            <div key={q.id} className="mb-8 p-6 border rounded-lg">
              <div className="flex items-center mb-4">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mr-3">
                  选择题 {idx + 1}
                </span>
                <span className="text-sm text-gray-500">
                  {q.difficulty} · {q.topics?.join(", ")}
                </span>
              </div>
              <h3 className="text-lg font-medium mb-4">{q.question}</h3>
              <div className="space-y-3">
                {q.options?.map((option, optIdx) => (
                  <label
                    key={optIdx}
                    className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={optIdx}
                      checked={part1Answers[q.id] === optIdx}
                      onChange={(e) =>
                        handlePart1Answer(q.id, parseInt(e.target.value))
                      }
                      className="mr-3"
                    />
                    <span className="flex-1">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

        {/* 问答题 */}
        {part1.questions
          .filter((q) => q.type === "essay")
          .map((q, idx) => (
            <div key={q.id} className="mb-8 p-6 border rounded-lg">
              <div className="flex items-center mb-4">
                <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full mr-3">
                  问答题 {idx + 1}
                </span>
                <span className="text-sm text-gray-500">
                  {q.difficulty} · 建议字数：300-500字
                </span>
              </div>
              <h3 className="text-lg font-medium mb-4">{q.question}</h3>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  评分要点：
                </h4>
                <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                  {q.evaluationPoints?.map((point, pIdx) => (
                    <li key={pIdx}>{point}</li>
                  ))}
                </ul>
              </div>
              <textarea
                value={(part1Answers[q.id] as string) || ""}
                onChange={(e) => handlePart1Answer(q.id, e.target.value)}
                className="w-full h-48 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入你的回答..."
              />
            </div>
          ))}

        <div className="mt-8 pt-6 border-t">
          <button
            onClick={submitPart1}
            disabled={submitStatus === "submitting"}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitStatus === "submitting"
              ? "提交中..."
              : "提交第一部分并进入第二部分"}
          </button>
          <p className="text-sm text-gray-500 mt-2">
            提交后不可修改，系统将自动切换到第二部分
          </p>
        </div>
      </div>
    );
  };

  // ===== 渲染第二部分：AI 协作 =====
  const renderPart2 = () => {
    if (!part2) return null;

    const currentTask = part2.tasks[0]; // 暂时只显示第一个协作题

    return (
      <div className="part2-container p-6">
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <span className="text-blue-600 mr-2">🤖</span>
            <span className="font-medium text-blue-800">
              本部分允许使用系统内置 AI 助手进行协作
            </span>
          </div>
          <p className="text-blue-700 text-sm mt-2">
            请与 AI 助手协作完成以下任务，系统会记录你们的完整对话过程
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-6">第二部分：AI 协作能力</h2>
        <p className="text-gray-600 mb-8">
          时间限制：{part2.timeLimitMinutes} 分钟 | 共 {part2.tasks.length} 题
        </p>

        {/* 任务描述 */}
        <div className="mb-8 p-6 border rounded-lg bg-gray-50">
          <h3 className="text-xl font-semibold mb-3">{currentTask.title}</h3>
          <p className="text-gray-700 mb-4">{currentTask.description}</p>

          <div className="mb-4">
            <h4 className="font-medium text-red-600 mb-2">🚨 冲突与挑战：</h4>
            <ul className="list-disc pl-5 text-gray-700">
              {currentTask.conflicts.map((conflict, idx) => (
                <li key={idx}>{conflict}</li>
              ))}
            </ul>
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
          <div>
            <h4 className="font-medium text-green-600 mb-2">📋 评估重点：</h4>
            <ul className="list-disc pl-5 text-gray-700">
              {currentTask.evaluationFocus.map((focus, idx) => (
                <li key={idx}>{focus}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* AI 对话界面 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">AI 协作对话</h3>
            <div className="text-sm text-gray-500">
              已使用 AI {aiCount} 次
            </div>
          </div>

          <div className="border rounded-lg h-96 overflow-y-auto mb-4 p-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500">
                开始与 AI 对话来完成任务...
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-4 ${
                    msg.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block max-w-3/4 p-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-blue-100 text-blue-900"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="text-sm opacity-75 mb-1">
                      {msg.role === "user" ? "你" : "AI 助手"}
                    </div>
                    <div>{msg.content}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

          <div className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="输入你的问题或指令..."
              className="flex-1 p-3 border rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={sendMessage}
              className="px-6 bg-blue-600 text-white font-medium rounded-r-lg hover:bg-blue-700"
            >
              发送
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t">
          <button
            onClick={submitPart2}
            disabled={submitStatus === "submitting"}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitStatus === "submitting"
              ? "提交中..."
              : "提交第二部分并进入第三部分"}
          </button>
          <p className="text-sm text-gray-500 mt-2">
            提交后不可修改，系统将记录完整的对话日志用于评估
          </p>
        </div>
      </div>
    );
  };

  // ===== 渲染第三部分：项目实战 =====
  const renderPart3 = () => {
    if (!part3) return null;

    return (
      <div className="part3-container p-6">
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <span className="text-green-600 mr-2">🚀</span>
            <span className="font-medium text-green-800">
              本部分不限制工具使用，可自由使用任何 AI 工具
            </span>
          </div>
          <p className="text-green-700 text-sm mt-2">
            请完成以下项目题，并提交可运行的项目仓库链接
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-6">第三部分：项目实战</h2>
        <p className="text-gray-600 mb-8">
          时间限制：{part3.task.timeLimitMinutes} 分钟
        </p>

        {/* 项目任务描述 */}
        <div className="mb-8 p-6 border rounded-lg">
          <h3 className="text-2xl font-bold mb-4">{part3.task.title}</h3>

          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-2">📖 背景：</h4>
            <p className="text-gray-600">{part3.task.background}</p>
          </div>

          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-2">🎯 要求：</h4>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              {part3.task.requirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-2">📦 交付物：</h4>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              {part3.task.deliverables.map((deliverable, idx) => (
                <li key={idx}>{deliverable}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-medium text-red-700 mb-2">🔒 防投机设计：</h4>
            <p className="text-red-600 text-sm">
              本题设计具有高区分度，请确保 README 中详细说明：
              1. 使用了哪些工具（AI 工具、IDE 插件等）
              2. 如何使用这些工具
              3. 哪些部分是 AI 生成的
              4. 哪些部分是自己独立设计或修改的
            </p>
          </div>
        </div>

        {/* 项目提交表单 */}
        <div className="mb-8 p-6 border rounded-lg">
          <h3 className="text-lg font-medium mb-6">项目提交</h3>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GitHub 仓库链接 (repoUrl) *
            </label>
            <input
              type="url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/username/project-name"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-sm text-gray-500 mt-2">
              请确保仓库是公开的，包含完整的可运行代码
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              项目说明与备注
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="简要说明项目亮点、遇到的挑战、解决方案等..."
              className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-700 mb-2">📝 重要提示：</h4>
            <ul className="text-sm text-yellow-600 list-disc pl-5 space-y-1">
              <li>请确保 README 包含完整的工具使用说明</li>
              <li>系统将自动分析仓库内容和提交记录</li>
              <li>提交后不可修改，请仔细检查</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t">
          <button
            onClick={submitPart3}
            disabled={submitStatus === "submitting" || !repoUrl.trim()}
            className="px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitStatus === "submitting" ? "提交中..." : "完成面试并提交"}
          </button>
          {submitStatus === "success" && (
            <p className="text-green-600 mt-2">提交成功！正在跳转报告页面...</p>
          )}
          {submitStatus === "error" && (
            <p className="text-red-600 mt-2">提交失败，请重试</p>
          )}
        </div>
      </div>
    );
  };

  // ===== 主界面 =====
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">AI 产品经理面试系统</h1>
              <p className="text-gray-600">综合评估 AI 产品经理能力</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono font-bold">
                {formatTime(leftSeconds)}
              </div>
              <div className="text-sm text-gray-500">剩余时间</div>
            </div>
          </div>
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto">
          <div className="flex border-b">
            <button
              onClick={() => setActivePart("part1")}
              className={`px-6 py-4 font-medium ${
                activePart === "part1"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              第一部分：基础认知
              {part1 && (
                <span className="ml-2 text-sm font-normal">
                  ({part1.questions.length}题)
                </span>
              )}
            </button>
            <button
              onClick={() => setActivePart("part2")}
              className={`px-6 py-4 font-medium ${
                activePart === "part2"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              第二部分：AI 协作
              {part2 && (
                <span className="ml-2 text-sm font-normal">
                  ({part2.tasks.length}题)
                </span>
              )}
            </button>
            <button
              onClick={() => setActivePart("part3")}
              className={`px-6 py-4 font-medium ${
                activePart === "part3"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              第三部分：项目实战
              <span className="ml-2 text-sm font-normal">(1题)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {!part1 && !part2 && !part3 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">正在加载面试题目...</p>
          </div>
        ) : (
          <>
            {activePart === "part1" && renderPart1()}
            {activePart === "part2" && renderPart2()}
            {activePart === "part3" && renderPart3()}
          </>
        )}
      </div>

      {/* 底部状态栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Session ID: <span className="font-mono">{sessionId || "-"}</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="text-gray-600">当前部分：</span>
              <span className="font-medium">
                {activePart === "part1"
                  ? "基础认知"
                  : activePart === "part2"
                  ? "AI 协作"
                  : "项目实战"}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">AI 使用次数：</span>
              <span className="font-medium">{aiCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
