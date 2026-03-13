"use client";

import { useEffect, useState } from "react";

type Submission = {
  sessionId: string;
  taskId: string;
  repoUrl: string;
  notes: string;
  submittedAt: number;
  candidateName?: string;
  candidateEmail?: string;
};

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [inputToken, setInputToken] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  async function fetchSubmissions(adminToken: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/submit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": adminToken,
        },
      });

      if (res.status === 401) {
        setError("Invalid admin token.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setSubmissions(data.submissions || []);
      setTotal(data.total || 0);
      setToken(adminToken);
    } catch {
      setError("Failed to fetch submissions.");
    }
    setLoading(false);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (inputToken.trim()) {
      fetchSubmissions(inputToken.trim());
    }
  }

  if (!token) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">面试官入口</h1>
          <p className="text-sm text-gray-500 mb-6">请输入管理员 Token 以查看候选人提交记录</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              placeholder="Admin Token"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
            >
              进入
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">面试官控制台</h1>
            <p className="text-sm text-gray-500 mt-1">共 {total} 份提交</p>
          </div>
          <button
            onClick={() => fetchSubmissions(token)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
          >
            刷新
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-20">加载中…</div>
        ) : submissions.length === 0 ? (
          <div className="text-center text-gray-400 py-20">暂无提交记录</div>
        ) : (
          <div className="space-y-3">
            {submissions.map((s) => (
              <div
                key={s.sessionId}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 hover:border-gray-300 transition cursor-pointer"
                onClick={() =>
                  setSelectedSession(
                    selectedSession === s.sessionId ? null : s.sessionId
                  )
                }
              >
                {/* Row summary */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {s.candidateName || "匿名候选人"}
                      </span>
                      {s.candidateEmail && (
                        <span className="text-xs text-gray-400">{s.candidateEmail}</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      题目：<span className="text-gray-700">{s.taskId}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-gray-400">
                      {new Date(s.submittedAt).toLocaleString()}
                    </div>
                    <a
                      href={`/report?sessionId=${encodeURIComponent(s.sessionId)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-900 underline underline-offset-2 hover:text-gray-600"
                      onClick={(e) => e.stopPropagation()}
                    >
                      查看报告 →
                    </a>
                  </div>
                </div>

                {/* Expanded detail */}
                {selectedSession === s.sessionId && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-3 text-sm">
                    <div>
                      <span className="text-gray-400">Session ID：</span>
                      <span className="text-gray-600 font-mono text-xs">{s.sessionId}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">仓库链接：</span>
                      <a
                        href={s.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-900 underline underline-offset-2 break-all"
                      >
                        {s.repoUrl}
                      </a>
                    </div>
                    {s.notes && (
                      <div>
                        <div className="text-gray-400 mb-1">提交说明：</div>
                        <div className="whitespace-pre-wrap text-gray-700 bg-gray-50 rounded-lg p-3 text-xs leading-relaxed">
                          {s.notes}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
