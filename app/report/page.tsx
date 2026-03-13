"use client";

import { useEffect, useState } from "react";

type RubricItem = {
  dimension: string;
  weight: number;
  whatGoodLooksLike: string;
};

type Submission = {
  sessionId: string;
  taskId: string;
  taskTitle?: string; // F: added taskTitle
  repoUrl: string;
  notes: string;
  submittedAt: number;
  aiCount?: number;
  rubric?: RubricItem[]; // C: added rubric
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

    // 兜底：从内存 API 拉一次
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

    // G: truncate conversation to avoid token limits
    const conversationSummary = submission.messages
      ?.map((m) => `${m.role}: ${m.content}`)
      .join("\n")
      .slice(0, 4000) || "";

    // F: use taskTitle if available, fallback to taskId
    const taskTitle = submission.taskTitle || submission.taskId;

    // C: pass real rubric array (not empty [])
    const rubric = Array.isArray(submission.rubric) && submission.rubric.length > 0
      ? submission.rubric
      : [];

    const res = await fetch("/api/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskTitle,    // F: real title
        rubric,       // C: real rubric
        notes: submission.notes,
        aiCount: submission.aiCount || 0,
        conversation: conversationSummary,
      }),
    });

    const data = await res.json();

    let text = data.raw || "";
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      const parsed = JSON.parse(text);
      setEvaluation(parsed);
    } catch (e) {
      console.error("解析失败:", text);
    }

    setEvaluating(false);
  }

  const getRiskColor = (level: string) => {
    if (level === "low") return "#22c55e";
    if (level === "medium") return "#f59e0b";
    return "#ef4444";
  };

  return (
    // H: light theme
    <main
      style={{
        minHeight: "100vh",
        background: "#FAFAFA",
        color: "#111",
        fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          padding: "40px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: 700, letterSpacing: "-0.02em", color: "#111" }}>
            面试报告
          </h1>
          <div style={{ fontSize: "12px", color: "#aaa", marginTop: "4px" }}>
            Session：{sessionId || "—"}
          </div>
        </div>

        {/* Submission Info */}
        <section
          style={{
            borderRadius: "16px",
            border: "1px solid #E8E4F0",
            background: "#fff",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            padding: "24px",
          }}
        >
          <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#111", marginBottom: "14px" }}>
            提交信息
          </h2>

          {!submission ? (
            <div style={{ color: "#aaa", fontSize: "13px" }}>未找到提交记录。</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
              {/* F: show taskTitle */}
              {submission.taskTitle && (
                <div>
                  <span style={{ color: "#aaa" }}>题目：</span>
                  <span style={{ color: "#333" }}>{submission.taskTitle}</span>
                </div>
              )}
              <div>
                <span style={{ color: "#aaa" }}>taskId：</span>
                <span style={{ color: "#333" }}>{submission.taskId}</span>
              </div>
              <div style={{ wordBreak: "break-all" }}>
                <span style={{ color: "#aaa" }}>repoUrl：</span>
                <a
                  href={submission.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#7C5CBF", textDecoration: "underline" }}
                >
                  {submission.repoUrl}
                </a>
              </div>
              <div>
                <span style={{ color: "#aaa" }}>提交时间：</span>
                <span style={{ color: "#333" }}>
                  {new Date(submission.submittedAt).toLocaleString()}
                </span>
              </div>
              <div>
                <span style={{ color: "#aaa" }}>AI 使用次数：</span>
                <span style={{ color: "#333" }}>{submission.aiCount ?? "—"}</span>
              </div>
              {submission.notes && (
                <div>
                  <div style={{ color: "#aaa", marginBottom: "4px" }}>提交说明：</div>
                  <div
                    style={{
                      whiteSpace: "pre-wrap",
                      color: "#333",
                      background: "#FAFAFA",
                      border: "1px solid #F0EDF8",
                      borderRadius: "10px",
                      padding: "10px 12px",
                      lineHeight: "1.6",
                    }}
                  >
                    {submission.notes}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Auto Evaluation */}
        <section
          style={{
            borderRadius: "16px",
            border: "1px solid #E8E4F0",
            background: "#fff",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            padding: "24px",
          }}
        >
          <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#111", marginBottom: "14px" }}>
            自动评估
          </h2>

          <button
            onClick={runEvaluation}
            style={{
              background: evaluating ? "#E8E4F0" : "#111",
              color: evaluating ? "#888" : "#fff",
              border: "none",
              borderRadius: "10px",
              padding: "9px 18px",
              fontSize: "13px",
              fontWeight: 500,
              cursor: evaluating ? "not-allowed" : "pointer",
              letterSpacing: "0.01em",
            }}
            disabled={evaluating || !submission}
          >
            {evaluating ? "评估中…" : "生成评估报告"}
          </button>

          {evaluation && (
            <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Total Score */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "16px",
                  borderRadius: "12px",
                  background: "#F9F8FF",
                  border: "1px solid #E8E4F0",
                }}
              >
                <div style={{ fontSize: "40px", fontWeight: 700, color: "#111" }}>
                  {evaluation.totalScore}
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#333" }}>总评分</div>
                  <div style={{ fontSize: "12px", color: "#aaa" }}>满分 100</div>
                </div>
              </div>

              {/* Dimensions */}
              {evaluation.dimensions?.length > 0 && (
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#555", marginBottom: "8px" }}>
                    各维度评分
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {evaluation.dimensions.map((d: any) => (
                      <div
                        key={d.name}
                        style={{
                          borderRadius: "12px",
                          border: "1px solid #F5E4E4",
                          background: "#FAFAFA",
                          padding: "14px 16px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "6px",
                          }}
                        >
                          <div style={{ fontWeight: 600, fontSize: "13px", color: "#111" }}>
                            {d.name}
                          </div>
                          <div
                            style={{
                              fontSize: "18px",
                              fontWeight: 700,
                              color: d.score >= 70 ? "#22c55e" : d.score >= 50 ? "#f59e0b" : "#ef4444",
                            }}
                          >
                            {d.score}
                          </div>
                        </div>
                        {d.evidence && (
                          <div style={{ fontSize: "12px", color: "#7C5CBF", marginBottom: "4px" }}>
                            📌 {d.evidence}
                          </div>
                        )}
                        <div style={{ fontSize: "12px", color: "#666", lineHeight: "1.6" }}>
                          {d.comment}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Usage Analysis */}
              {evaluation.aiUsageAnalysis && (
                <div
                  style={{
                    borderRadius: "12px",
                    border: "1px solid #E8E4F0",
                    background: "#FAFAFA",
                    padding: "14px 16px",
                  }}
                >
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#111", marginBottom: "8px" }}>
                    AI 使用分析
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "12px" }}>
                    <div>
                      <span style={{ color: "#aaa" }}>模式：</span>
                      <span style={{ color: "#333" }}>{evaluation.aiUsageAnalysis.pattern}</span>
                    </div>
                    <div>
                      <span style={{ color: "#aaa" }}>风险等级：</span>
                      <span
                        style={{
                          color: getRiskColor(evaluation.aiUsageAnalysis.riskLevel),
                          fontWeight: 600,
                        }}
                      >
                        {evaluation.aiUsageAnalysis.riskLevel}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: "#aaa" }}>说明：</span>
                      <span style={{ color: "#555" }}>{evaluation.aiUsageAnalysis.reason}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Strengths */}
              {evaluation.strengths?.length > 0 && (
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#22c55e", marginBottom: "6px" }}>
                    ✅ 优势
                  </div>
                  <ul style={{ paddingLeft: "16px", fontSize: "13px", color: "#333", lineHeight: "1.7" }}>
                    {evaluation.strengths.map((s: string, i: number) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Risks */}
              {evaluation.risks?.length > 0 && (
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#ef4444", marginBottom: "6px" }}>
                    ⚠️ 风险
                  </div>
                  <ul style={{ paddingLeft: "16px", fontSize: "13px", color: "#333", lineHeight: "1.7" }}>
                    {evaluation.risks.map((r: string, i: number) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Follow-up Questions */}
              {evaluation.followUpQuestions?.length > 0 && (
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#7C5CBF", marginBottom: "6px" }}>
                    💬 追问建议
                  </div>
                  <ul style={{ paddingLeft: "16px", fontSize: "13px", color: "#333", lineHeight: "1.7" }}>
                    {evaluation.followUpQuestions.map((q: string, i: number) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
