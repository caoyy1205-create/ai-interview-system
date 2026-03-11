"use client";

import { useEffect, useMemo, useState } from "react";

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

  const [repoUrl, setRepoUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");


  // ===== start session on mount =====
  useEffect(() => {
    let cancelled = false;

    async function start() {
      const res = await fetch("/api/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 可选：传 taskId 指定题目；不传则随机
        body: JSON.stringify({}),
      });

      const data = await res.json();

      if (cancelled) return;

      setSessionId(data.sessionId);
      setStartedAt(data.startedAt);
      setTask(data.task);

      // 初始化倒计时
      setLeftSeconds(data.task.timeLimitMinutes * 60);

      // 清空上一场残留（MVP：每次刷新开始新 session）
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

  async function sendMessage() {
    if (!input.trim()) return;

    const userText = input;
    const userMessage: Message = {
      role: "user",
      content: userText,
      time: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userText,
        // 预留：后续你可以把 sessionId/taskId 一并传给后端做落库
        sessionId,
        taskId: task?.id,
      }),
    });

    const data = await res.json();

    const aiMessage: Message = {
      role: "assistant",
      content: data.reply || "无回复",
      time: Date.now(),
    };

    setMessages((prev) => [...prev, aiMessage]);

    // 统计 AI 使用次数：以“收到 assistant 回复”为一次
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
    }),
  });

  if (!res.ok) {
    setSubmitStatus("error");
    const data = await res.json().catch(() => ({}));
    alert(`提交失败：${data?.error || res.statusText}`);
    return;
  }

  setSubmitStatus("success");

  // MVP：同时写入 localStorage，避免 dev server 重启导致内存丢失
  try {
    localStorage.setItem(
      `submission:${sessionId}`,
      JSON.stringify({
        sessionId,
        taskId: task.id,
        repoUrl,
        notes,
        submittedAt: Date.now(),
        aiCount,
        messages,   // ✅ 把完整对话存下来
      })
    );

  } catch {}

  // 跳转到报告页（下一步做）
  window.location.href = `/report?sessionId=${encodeURIComponent(sessionId)}`;
}

  const isReady = !!task && !!sessionId;
  const isTimeUp = leftSeconds <= 0 && isReady;

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {task ? task.title : "正在下发题目…"}
            </h1>

            <div className="text-sm text-gray-400 space-y-1">
              <div>
                Session：<span className="text-gray-200">{sessionId || "—"}</span>
              </div>
              <div>
                AI 已使用次数：<span className="text-gray-200">{aiCount}</span> 次
              </div>
              <div>
                {task ? (
                  <>
                    难度：<span className="text-gray-200">{task.difficulty}</span>{" "}
                    · 标签：{" "}
                    <span className="text-gray-200">
                      {task.tags.join(", ")}
                    </span>
                  </>
                ) : (
                  "题目加载中…"
                )}
              </div>
              {startedAt ? (
                <div>
                  开始时间：{" "}
                  <span className="text-gray-200">
                    {new Date(startedAt).toLocaleString()}
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Timer */}
          <div className="shrink-0 rounded-xl border border-gray-800 bg-gray-900/40 px-5 py-4">
            <div className="text-sm text-gray-400">剩余时间</div>
            <div
              className={[
                "mt-1 text-3xl font-mono font-semibold",
                isTimeUp ? "text-red-400" : "text-white",
              ].join(" ")}
            >
              {isReady ? formatTime(leftSeconds) : "--:--"}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {task ? `限时：${task.timeLimitMinutes} 分钟` : "—"}
            </div>
          </div>
        </div>

        {/* Task */}
        <section className="rounded-2xl border border-gray-800 bg-gray-900/30 p-6 space-y-5">
          {!task ? (
            <div className="text-gray-400">题目正在加载中，请稍等…</div>
          ) : (
            <>
              <div>
                <h2 className="text-lg font-semibold">背景</h2>
                <p className="mt-2 text-gray-300 leading-relaxed">
                  {task.background}
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold">需求</h2>
                <ul className="mt-2 list-disc list-inside text-gray-300 space-y-1">
                  {task.requirements.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-semibold">交付物</h2>
                <ul className="mt-2 list-disc list-inside text-gray-300 space-y-1">
                  {task.deliverables.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-semibold">评分维度（Rubric）</h2>
                <div className="mt-3 space-y-3">
                  {task.rubric.map((r) => (
                    <div
                      key={r.dimension}
                      className="rounded-xl border border-gray-800 bg-gray-950/20 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{r.dimension}</div>
                        <div className="text-sm text-gray-400">
                          权重 {r.weight}
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-300 leading-relaxed">
                        {r.whatGoodLooksLike}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </section>

        {/* Workspace */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chat */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900/30 p-6">
            <h3 className="text-lg font-semibold">AI 对话区</h3>
            <p className="mt-2 text-gray-400 text-sm leading-relaxed">
              系统会记录对话内容与时间戳，用于评估 AI 协作能力。
            </p>

            <div className="mt-4 space-y-4">
              <div className="h-64 overflow-y-auto bg-gray-900 rounded-xl p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-sm text-gray-500">
                    暂无对话。你可以从“需求拆解、技术方案、评估维度、边界情况”开始提问。
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div key={idx} className="text-sm">
                      <div className="text-xs text-gray-500">
                        {new Date(msg.time).toLocaleTimeString()}
                      </div>
                      <div className="mt-1">
                        <strong>{msg.role === "user" ? "你" : "AI"}：</strong>{" "}
                        {msg.content}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-gray-800 rounded-lg px-3 py-2 text-sm"
                  placeholder={isReady ? "输入你的问题…" : "等待题目下发…"}
                  disabled={!isReady}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm disabled:opacity-50"
                  disabled={!isReady}
                >
                  发送
                </button>
              </div>
            </div>
          </div>

          {/* Submit placeholder */}
         <div className="rounded-2xl border border-gray-800 bg-gray-900/30 p-6">
            <h3 className="text-lg font-semibold">项目提交</h3>
            <p className="mt-2 text-gray-400 text-sm leading-relaxed">
              请提交仓库链接（建议包含 README），并补充说明你如何使用 AI、关键取舍与未完成项。
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <div className="text-sm text-gray-300 mb-1">仓库链接（repoUrl）</div>
                <input
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm"
                  placeholder="https://github.com/xxx/yyy"
                  disabled={!isReady || submitStatus === "submitting"}
                />
              </div>

              <div>
                <div className="text-sm text-gray-300 mb-1">提交说明（notes）</div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm min-h-[120px]"
                  placeholder="简述：你如何拆解需求、如何使用 AI、做了哪些取舍、还有哪些未完成项与原因。"
                  disabled={!isReady || submitStatus === "submitting"}
                />
              </div>

              <button
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 transition px-4 py-3 font-medium disabled:opacity-50"
                onClick={submitProject}
                disabled={!isReady || submitStatus === "submitting"}
              >
                {submitStatus === "submitting" ? "提交中…" : "提交项目"}
              </button>

              {submitStatus === "success" ? (
                <div className="text-sm text-green-400">提交成功，正在跳转报告页…</div>
              ) : submitStatus === "error" ? (
                <div className="text-sm text-red-400">提交失败，请重试。</div>
              ) : (
                <div className="text-xs text-gray-500">
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
