"use client";

import { useEffect, useState } from "react";

type Submission = {
  sessionId: string;
  taskId: string;
  repoUrl: string;
  notes: string;
  submittedAt: number;
  aiCount?: number;
  messages?: {
    role: "user" | "assistant";
    content: string;
    time: number;
  }[];
};


export default function ReportPage() {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [sessionId, setSessionId] = useState<string>("");
  const [evaluation, setEvaluation] = useState<any>(null);
  const [evaluating, setEvaluating] = useState(false);


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get("sessionId") || "";
    setSessionId(sid);

    // MVP：优先从 localStorage 读取（更稳定）
    const cached = sid ? localStorage.getItem(`submission:${sid}`) : null;
    if (cached) {
      try {
        setSubmission(JSON.parse(cached));
        return;
      } catch {}
    }

    // 兜底：从内存 API 拉一次（dev server 不重启时可用）
    async function load() {
      if (!sid) return;
      const res = await fetch(`/api/submit?sessionId=${encodeURIComponent(sid)}`);
      const data = await res.json();
      setSubmission(data.submission || null);
    }
    load();
  }, []);

  async function runEvaluation() {
    if (!submission) return;

    setEvaluating(true);

    // ✅ 生成对话摘要（避免传太长）
    const conversationSummary = submission.messages
        ?.map((m) => `${m.role}: ${m.content}`)
        .join("\n")
        .slice(0, 4000) || "";


    const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            taskTitle: submission.taskId,
            rubric: [],
            notes: submission.notes,
            aiCount: submission.aiCount || 0,
            conversation: conversationSummary,
        }),
    });

    const data = await res.json();

    let text = data.raw || "";

    // 去掉 ```json 和 ``` 包裹
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
        const parsed = JSON.parse(text);
        setEvaluation(parsed);
    } catch (e) {
        console.error("解析失败:", text);
    }


    setEvaluating(false);
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        <h1 className="text-3xl font-bold">面试报告（MVP）</h1>
        <div className="text-sm text-gray-400">Session：{sessionId || "—"}</div>

        <section className="rounded-2xl border border-gray-800 bg-gray-900/30 p-6 space-y-3">
          <h2 className="text-lg font-semibold">提交信息</h2>

          {!submission ? (
            <div className="text-gray-400">未找到提交记录。</div>
          ) : (
            <>
              <div className="text-sm">
                <span className="text-gray-400">taskId：</span>
                <span className="text-gray-200">{submission.taskId}</span>
              </div>
              <div className="text-sm break-all">
                <span className="text-gray-400">repoUrl：</span>
                <span className="text-gray-200">{submission.repoUrl}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">submittedAt：</span>
                <span className="text-gray-200">
                  {new Date(submission.submittedAt).toLocaleString()}
                </span>
              </div>
              <div className="text-sm">
                <div className="text-gray-400 mb-1">notes：</div>
                <div className="whitespace-pre-wrap text-gray-200">
                  {submission.notes || "（无）"}
                </div>
              </div>
            </>
          )}
        </section>

        <section className="rounded-2xl border border-gray-800 bg-gray-900/30 p-6 space-y-4">
        <h2 className="text-lg font-semibold">自动评估</h2>

        <button
            onClick={runEvaluation}
            className="px-4 py-2 bg-blue-600 rounded-lg"
            disabled={evaluating}
        >
            {evaluating ? "评估中..." : "生成评估报告"}
        </button>

        {evaluation && (
            <div className="mt-4 space-y-4">
            <div>总评分：{evaluation.totalScore}</div>

            {evaluation.dimensions?.map((d: any) => (
                <div key={d.name}>
                <strong>{d.name}</strong>：{d.score}
                <div className="text-sm text-gray-400">{d.comment}</div>
                </div>
            ))}

            <div>
                <strong>优势：</strong>
                <ul>
                {evaluation.strengths?.map((s: string, i: number) => (
                    <li key={i}>- {s}</li>
                ))}
                </ul>
            </div>

            <div>
                <strong>风险：</strong>
                <ul>
                {evaluation.risks?.map((r: string, i: number) => (
                    <li key={i}>- {r}</li>
                ))}
                </ul>
            </div>

            <div>
                <strong>追问问题：</strong>
                <ul>
                {evaluation.followUpQuestions?.map((q: string, i: number) => (
                    <li key={i}>- {q}</li>
                ))}
                </ul>
            </div>
            </div>
        )}
        </section>

      </div>
    </main>
  );
}
