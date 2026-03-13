"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleStart(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("请填写姓名");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("请填写有效的邮箱地址");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateName: name.trim(),
          candidateEmail: email.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setError("请求过于频繁，请稍后再试");
        } else {
          setError(data?.error || "启动面试失败，请重试");
        }
        setLoading(false);
        return;
      }

      // Store candidate info + session data in localStorage
      try {
        localStorage.setItem("candidateName", data.candidate.name);
        localStorage.setItem("candidateEmail", data.candidate.email);
        localStorage.setItem("pendingSession", JSON.stringify({
          sessionId: data.sessionId,
          startedAt: data.startedAt,
          task: data.task,
        }));
        localStorage.setItem("currentTaskTitle", data.task?.title || "");
      } catch {}

      router.push("/exam");
    } catch {
      setError("网络错误，请重试");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Title */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E8E4F0] rounded-full text-xs text-gray-600 mb-4">
            AI 产品经理评测系统
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            开始面试
          </h1>
          <p className="mt-2 text-gray-500 text-sm leading-relaxed">
            请在规定时间内完成系统给定的项目任务，并合理使用 AI 工具
          </p>
        </div>

        {/* Form */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          <form onSubmit={handleStart} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                姓名
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="请输入你的真实姓名"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                邮箱
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入你的邮箱地址"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                disabled={loading}
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? "正在准备题目…" : "开始面试 →"}
            </button>
          </form>

          <p className="mt-4 text-xs text-gray-400 text-center leading-relaxed">
            提交后无法修改，请确保在规定时间内完成
          </p>
        </div>

        {/* Admin link */}
        <div className="mt-6 text-center">
          <a
            href="/admin"
            className="text-xs text-gray-400 hover:text-gray-600 transition"
          >
            面试官入口 →
          </a>
        </div>
      </div>
    </main>
  );
}
