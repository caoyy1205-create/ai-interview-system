"use client";

import { useEffect, useState } from "react";

export default function ReportPage() {
  const [sessionId, setSessionId] = useState<string>("");
  const [candidateName, setCandidateName] = useState<string>("");
  const [evaluation, setEvaluation] = useState<any>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get("sessionId") || "";
    setSessionId(sid);
    try {
      const name = localStorage.getItem("candidateName") || "";
      setCandidateName(name);
    } catch {}
  }, []);

  async function runEvaluation() {
    if (!sessionId) return;
    setEvaluating(true);
    setError("");
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "评估失败，请重试");
      } else {
        setEvaluation(data);
      }
    } catch {
      setError("网络错误，请重试");
    }
    setEvaluating(false);
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return "#22c55e";
    if (score >= 50) return "#f59e0b";
    return "#ef4444";
  };

  const getRecommendationStyle = (rec: string) => {
    if (rec?.includes("强烈推荐")) return { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" };
    if (rec?.includes("建议录用")) return { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" };
    if (rec?.includes("待定")) return { bg: "#fefce8", color: "#854d0e", border: "#fef08a" };
    return { bg: "#fef2f2", color: "#991b1b", border: "#fecaca" };
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "#FAFAFA",
      color: "#111",
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      {/* Topbar */}
      <div style={{
        borderBottom: "1px solid #f0f0f0",
        padding: "0 32px",
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#fff",
      }}>
        <div style={{ fontWeight: 700, fontSize: "15px" }}>AI 面试系统</div>
        <div style={{ fontSize: "12px", color: "#aaa" }}>面试报告</div>
      </div>

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "40px 32px 80px" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.01em", marginBottom: "6px" }}>
            面试报告
          </h1>
          {candidateName && (
            <div style={{ fontSize: "14px", color: "#555" }}>候选人：{candidateName}</div>
          )}
          <div style={{ fontSize: "12px", color: "#aaa", marginTop: "2px" }}>
            Session ID：{sessionId || "—"}
          </div>
        </div>

        {/* 提示 */}
        <div style={{
          border: "1px solid #f0f0f0",
          borderRadius: "8px",
          padding: "20px 24px",
          background: "#fff",
          marginBottom: "24px",
        }}>
          <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>
            🎉 面试已完成
          </div>
          <div style={{ fontSize: "13px", color: "#555", lineHeight: "1.7", marginBottom: "16px" }}>
            感谢你完成本次 AI 产品经理测评。点击下方按钮生成详细的评估报告，包含三部分的评分和建议。
          </div>
          <button
            onClick={runEvaluation}
            disabled={evaluating || !sessionId}
            style={{
              background: evaluating ? "#e5e5e5" : "#111",
              color: evaluating ? "#aaa" : "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "10px 20px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: evaluating ? "not-allowed" : "pointer",
            }}
          >
            {evaluating ? "评估中，请稍候..." : "生成评估报告"}
          </button>
          {error && (
            <div style={{ marginTop: "10px", fontSize: "13px", color: "#dc2626" }}>{error}</div>
          )}
        </div>

        {/* 评估结果 */}
        {evaluation && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* 总分 */}
            <div style={{
              border: "1px solid #f0f0f0",
              borderRadius: "8px",
              padding: "24px",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              gap: "24px",
            }}>
              <div style={{
                fontSize: "56px",
                fontWeight: 700,
                color: getScoreColor(evaluation.totalScore),
                lineHeight: 1,
              }}>
                {evaluation.totalScore}
              </div>
              <div>
                <div style={{ fontSize: "13px", color: "#888", marginBottom: "6px" }}>综合评分（满分100）</div>
                {evaluation.recommendation && (() => {
                  const style = getRecommendationStyle(evaluation.recommendation);
                  return (
                    <div style={{
                      display: "inline-block",
                      fontSize: "13px",
                      fontWeight: 600,
                      padding: "4px 12px",
                      borderRadius: "6px",
                      background: style.bg,
                      color: style.color,
                      border: `1px solid ${style.border}`,
                    }}>
                      {evaluation.recommendation}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* 三部分分数 */}
            {evaluation.breakdown && (
              <div style={{
                border: "1px solid #f0f0f0",
                borderRadius: "8px",
                background: "#fff",
                overflow: "hidden",
              }}>
                <div style={{
                  padding: "16px 24px",
                  borderBottom: "1px solid #f0f0f0",
                  fontSize: "13px",
                  fontWeight: 600,
                }}>
                  分部评分
                </div>
                {[
                  { key: "part1", label: "第一部分：基础认知", weight: "30%" },
                  { key: "part2", label: "第二部分：AI 协作", weight: "30%" },
                  { key: "part3", label: "第三部分：项目实战", weight: "40%" },
                ].map(({ key, label, weight }) => {
                  const part = evaluation.breakdown[key];
                  if (!part) return null;
                  return (
                    <div key={key} style={{
                      padding: "16px 24px",
                      borderBottom: "1px solid #f5f5f5",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "16px",
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
                          {label}
                          <span style={{ fontSize: "11px", color: "#aaa", fontWeight: 400, marginLeft: "6px" }}>权重 {weight}</span>
                        </div>
                        {key !== "part1" && part.feedback && (
                          <div style={{ fontSize: "12px", color: "#555", lineHeight: "1.6" }}>
                            {part.feedback}
                          </div>
                        )}
                        {key === "part1" && part.mcCorrect !== undefined && (
                          <div style={{ fontSize: "12px", color: "#888", marginTop: "2px", display: "flex", gap: "12px" }}>
                            <span>选择题：{part.mcCorrect}/{part.mcTotal} 正确（{part.mcScore}分）</span>
                            {part.essayScore !== undefined && (
                              <span>问答题：{part.essayScore}分</span>
                            )}
                          </div>
                        )}
                      </div>
                      <div style={{
                        fontSize: "24px",
                        fontWeight: 700,
                        color: getScoreColor(part.score),
                        flexShrink: 0,
                      }}>
                        {part.score}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Part2 维度详情 */}
            {evaluation.breakdown?.part2?.dimensions?.length > 0 && (
              <div style={{ border: "1px solid #f0f0f0", borderRadius: "8px", background: "#fff", overflow: "hidden" }}>
                <div style={{ padding: "16px 24px", borderBottom: "1px solid #f0f0f0", fontSize: "13px", fontWeight: 600 }}>
                  AI 协作能力分析
                </div>
                {evaluation.breakdown.part2.dimensions.map((d: any, i: number) => (
                  <div key={i} style={{
                    padding: "14px 24px",
                    borderBottom: "1px solid #f5f5f5",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "16px",
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "13px", fontWeight: 500, marginBottom: "2px" }}>{d.name}</div>
                      <div style={{ fontSize: "12px", color: "#666", lineHeight: "1.5" }}>{d.comment}</div>
                    </div>
                    <div style={{ fontSize: "20px", fontWeight: 700, color: getScoreColor(d.score), flexShrink: 0 }}>
                      {d.score}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Part3 维度详情 */}
            {evaluation.breakdown?.part3?.dimensions?.length > 0 && (
              <div style={{ border: "1px solid #f0f0f0", borderRadius: "8px", background: "#fff", overflow: "hidden" }}>
                <div style={{ padding: "16px 24px", borderBottom: "1px solid #f0f0f0", fontSize: "13px", fontWeight: 600 }}>
                  项目实战评估
                </div>
                {evaluation.breakdown.part3.dimensions.map((d: any, i: number) => (
                  <div key={i} style={{
                    padding: "14px 24px",
                    borderBottom: "1px solid #f5f5f5",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "16px",
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "13px", fontWeight: 500, marginBottom: "2px" }}>{d.name}</div>
                      <div style={{ fontSize: "12px", color: "#666", lineHeight: "1.5" }}>{d.comment}</div>
                    </div>
                    <div style={{ fontSize: "20px", fontWeight: 700, color: getScoreColor(d.score), flexShrink: 0 }}>
                      {d.score}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
