"use client";

import { useEffect, useState } from "react";

type ReviewState = "idle" | "loading" | "done" | "error";

function ReviewSection({
  icon, title, type, sessionId,
}: { icon: string; title: string; type: string; sessionId: string }) {
  const [state, setState] = useState<ReviewState>("idle");
  const [data, setData] = useState<any>(null);

  async function load() {
    setState("loading");
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, type }),
      });
      const d = await res.json();
      setData(d);
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <div style={{ border: "1px solid #f0f0f0", borderRadius: "8px", overflow: "hidden", background: "#fff" }}>
      <div
        style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: state === "idle" ? "pointer" : "default", background: state === "done" ? "#fafafa" : "#fff" }}
        onClick={() => state === "idle" && load()}
      >
        <div style={{ fontSize: "13px", fontWeight: 600 }}>{icon} {title}</div>
        {state === "idle" && <span style={{ fontSize: "12px", color: "#888" }}>点击展开 →</span>}
        {state === "loading" && <span style={{ fontSize: "12px", color: "#aaa" }}>加载中...</span>}
        {state === "error" && <span style={{ fontSize: "12px", color: "#dc2626", cursor: "pointer" }} onClick={load}>重试</span>}
      </div>
      {state === "done" && data && (
        <div style={{ padding: "0 20px 20px", borderTop: "1px solid #f5f5f5" }}>
          {type === "mc" && <MCReview data={data} />}
          {type === "essay" && <EssayReview data={data} />}
          {type === "collab" && <CollabReview data={data} />}
          {type === "project" && <ProjectReview data={data} />}
        </div>
      )}
    </div>
  );
}

function MCReview({ data }: { data: any }) {
  const optionLabels = ["A", "B", "C", "D"];
  if (data.message) return <div style={{ padding: "16px 0", fontSize: "13px", color: "#16a34a", fontWeight: 600 }}>🎉 {data.message}</div>;
  if (!data.items?.length) return <div style={{ padding: "16px 0", fontSize: "13px", color: "#aaa" }}>无错题数据</div>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingTop: "16px" }}>
      {data.items.map((item: any, i: number) => (
        <div key={i} style={{ border: "1px solid #fee2e2", borderRadius: "8px", padding: "14px 16px", background: "#fff5f5" }}>
          <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "10px" }}>{item.question}</div>
          <div style={{ display: "flex", gap: "16px", fontSize: "12px", marginBottom: "10px" }}>
            <span style={{ color: "#dc2626" }}>你的答案：{item.candidateAnswer !== undefined && item.candidateAnswer !== null ? `${optionLabels[item.candidateAnswer]}. ${item.options?.[item.candidateAnswer] || "未选"}` : "未选"}</span>
            <span style={{ color: "#16a34a" }}>正确答案：{optionLabels[item.correctAnswer]}. {item.options?.[item.correctAnswer]}</span>
          </div>
          <div style={{ fontSize: "12px", color: "#555", lineHeight: "1.7", background: "#fff", borderRadius: "6px", padding: "10px 12px", border: "1px solid #f0f0f0" }}>
            💡 {item.explanation}
          </div>
        </div>
      ))}
    </div>
  );
}

function EssayReview({ data }: { data: any }) {
  if (!data.items?.length) return <div style={{ padding: "16px 0", fontSize: "13px", color: "#aaa" }}>无数据</div>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", paddingTop: "16px" }}>
      {data.items.map((item: any, i: number) => (
        <div key={i}>
          <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>题目 {i + 1}：{item.question}</div>
          {item.candidateAnswer && item.candidateAnswer !== "（未作答）" && (
            <div style={{ fontSize: "12px", color: "#555", background: "#f5f5f5", borderRadius: "6px", padding: "10px 12px", marginBottom: "8px", lineHeight: "1.6" }}>
              <span style={{ color: "#888", fontWeight: 500 }}>你的回答：</span>{item.candidateAnswer}
            </div>
          )}
          {item.comment && (
            <div style={{ fontSize: "12px", color: "#1d4ed8", background: "#eff6ff", borderRadius: "6px", padding: "8px 12px", marginBottom: "8px", border: "1px solid #bfdbfe" }}>
              📝 点评：{item.comment}
            </div>
          )}
          <div style={{ fontSize: "12px", color: "#333", background: "#f0fdf4", borderRadius: "6px", padding: "12px 14px", border: "1px solid #bbf7d0", lineHeight: "1.7", whiteSpace: "pre-wrap" }}>
            <span style={{ color: "#15803d", fontWeight: 600 }}>✅ 参考答案：</span><br />{item.referenceAnswer}
          </div>
        </div>
      ))}
    </div>
  );
}

function CollabReview({ data }: { data: any }) {
  if (!data.dialogue) return <div style={{ padding: "16px 0", fontSize: "13px", color: "#aaa" }}>无示例数据</div>;
  return (
    <div style={{ paddingTop: "16px" }}>
      {data.keyPoints?.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "#888", marginBottom: "6px" }}>高分关键行为</div>
          {data.keyPoints.map((p: string, i: number) => (
            <div key={i} style={{ fontSize: "12px", color: "#555", padding: "3px 0" }}>✦ {p}</div>
          ))}
        </div>
      )}
      <div style={{ fontSize: "12px", fontWeight: 600, color: "#888", marginBottom: "10px" }}>示例对话</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {data.dialogue.map((m: any, i: number) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "candidate" ? "flex-end" : "flex-start" }}>
            <div style={{ fontSize: "11px", color: "#ccc", marginBottom: "2px" }}>{m.role === "candidate" ? "高分候选人" : "AI"}</div>
            <div style={{ maxWidth: "85%", padding: "9px 13px", borderRadius: "8px", fontSize: "12px", lineHeight: "1.6", background: m.role === "candidate" ? "#111" : "#f5f5f5", color: m.role === "candidate" ? "#fff" : "#111", whiteSpace: "pre-wrap" }}>
              {m.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectReview({ data }: { data: any }) {
  if (typeof data.review === "string") return <div style={{ padding: "16px 0", fontSize: "13px", color: "#aaa" }}>{data.review}</div>;
  return (
    <div style={{ paddingTop: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
      {data.overview && (
        <div style={{ fontSize: "13px", color: "#333", lineHeight: "1.7", padding: "12px 14px", background: "#fafafa", borderRadius: "8px", border: "1px solid #f0f0f0" }}>
          {data.overview}
        </div>
      )}
      {data.strengths?.length > 0 && (
        <div>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "#15803d", marginBottom: "6px" }}>✅ 优点</div>
          {data.strengths.map((s: string, i: number) => <div key={i} style={{ fontSize: "12px", color: "#555", padding: "3px 0", lineHeight: "1.6" }}>· {s}</div>)}
        </div>
      )}
      {data.improvements?.length > 0 && (
        <div>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "#dc2626", marginBottom: "6px" }}>⚠️ 改进建议</div>
          {data.improvements.map((s: string, i: number) => <div key={i} style={{ fontSize: "12px", color: "#555", padding: "3px 0", lineHeight: "1.6" }}>· {s}</div>)}
        </div>
      )}
      {data.aiUsageComment && (
        <div style={{ fontSize: "12px", color: "#1d4ed8", padding: "10px 12px", background: "#eff6ff", borderRadius: "6px", border: "1px solid #bfdbfe", lineHeight: "1.6" }}>
          🤖 AI使用评价：{data.aiUsageComment}
        </div>
      )}
      {data.technicalDepth && (
        <div style={{ fontSize: "12px", color: "#555", padding: "10px 12px", background: "#fafafa", borderRadius: "6px", border: "1px solid #f0f0f0", lineHeight: "1.6" }}>
          🔍 技术深度：{data.technicalDepth}
        </div>
      )}
    </div>
  );
}

export default function ReportPage() {
  const [sessionId, setSessionId] = useState<string>("");
  const [candidateName, setCandidateName] = useState<string>("");
  const [evaluation, setEvaluation] = useState<any>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState("");
  const [isAdminView, setIsAdminView] = useState(false);
  // 是否已生成过（持久化，防重复生成）
  const [alreadyGenerated, setAlreadyGenerated] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get("sessionId") || "";
    const admin = params.get("admin") === "1";
    setSessionId(sid);
    setIsAdminView(admin);

    // 候选人名字：优先从 Supabase 获取（通过 evaluate 结果），fallback localStorage
    try { setCandidateName(localStorage.getItem("candidateName") || ""); } catch {}

    if (sid) {
      // 面试官视图 或 已生成过：自动加载缓存结果
      if (admin) {
        autoEvaluate(sid);
      } else {
        // 候选人已生成过，自动加载已有报告（走缓存，不重新计算）
        const generated = localStorage.getItem(`reportGenerated_${sid}`);
        if (generated === "1") {
          autoEvaluate(sid);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function autoEvaluate(sid: string) {
    setEvaluating(true);
    setError("");
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sid }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "评估失败");
      else {
        setEvaluation(data);
        // 从评估结果里读候选人名字（Supabase 存的）
        if (data.candidateName) setCandidateName(data.candidateName);
      }
    } catch { setError("网络错误，请重试"); }
    setEvaluating(false);
  }

  async function runEvaluation() {
    if (!sessionId || alreadyGenerated) return;
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
        if (data.candidateName) setCandidateName(data.candidateName);
        // 标记已生成，防止重复点击
        try { localStorage.setItem(`reportGenerated_${sessionId}`, "1"); } catch {}
        setAlreadyGenerated(true);
      }
    } catch { setError("网络错误，请重试"); }
    setEvaluating(false);
  }

  const getScoreColor = (score: number) => score >= 70 ? "#16a34a" : score >= 50 ? "#d97706" : "#dc2626";

  const getRecStyle = (rec: string) => {
    if (rec?.includes("强烈推荐")) return { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" };
    if (rec?.includes("建议录用")) return { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" };
    if (rec?.includes("待定")) return { bg: "#fefce8", color: "#854d0e", border: "#fef08a" };
    return { bg: "#fef2f2", color: "#991b1b", border: "#fecaca" };
  };

  return (
    <main style={{ minHeight: "100vh", background: "#FAFAFA", color: "#111", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div style={{ borderBottom: "1px solid #f0f0f0", padding: "0 32px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff" }}>
        <div style={{ fontWeight: 700, fontSize: "15px" }}>AI 面试系统</div>
        <div style={{ fontSize: "12px", color: "#aaa" }}>{isAdminView ? "面试官视图" : "面试报告"}</div>
      </div>

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "40px 32px 80px" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.01em", marginBottom: "6px" }}>面试报告</h1>
          {candidateName && <div style={{ fontSize: "14px", color: "#555" }}>候选人：{candidateName}</div>}
          {/* ✅ 3: 不再显示 session id */}
        </div>

        {/* 面试官视图：自动触发，只显示加载状态 */}
        {isAdminView && evaluating && (
          <div style={{ border: "1px solid #f0f0f0", borderRadius: "8px", padding: "32px 24px", background: "#fff", marginBottom: "24px", textAlign: "center" }}>
            <div style={{ fontSize: "13px", color: "#888" }}>正在加载评估报告，请稍候…</div>
          </div>
        )}
        {isAdminView && error && (
          <div style={{ border: "1px solid #fee2e2", borderRadius: "8px", padding: "16px 24px", background: "#fff5f5", marginBottom: "24px" }}>
            <div style={{ fontSize: "13px", color: "#dc2626" }}>{error}</div>
          </div>
        )}

        {/* 候选人视图：手动触发按钮 */}
        {!isAdminView && !evaluation && (
          <div style={{ border: "1px solid #f0f0f0", borderRadius: "8px", padding: "20px 24px", background: "#fff", marginBottom: "24px" }}>
            <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>🎉 面试已完成</div>
            <div style={{ fontSize: "13px", color: "#555", lineHeight: "1.7", marginBottom: "16px" }}>
              点击下方按钮生成你的评估报告，包含三部分评分和录用建议。
            </div>
            {/* ✅ 4: 生成后按钮置灰 */}
            <button
              onClick={runEvaluation}
              disabled={evaluating || !sessionId || alreadyGenerated}
              style={{
                background: (evaluating || alreadyGenerated) ? "#e5e5e5" : "#111",
                color: (evaluating || alreadyGenerated) ? "#aaa" : "#fff",
                border: "none", borderRadius: "6px", padding: "10px 20px",
                fontSize: "13px", fontWeight: 600,
                cursor: (evaluating || alreadyGenerated) ? "not-allowed" : "pointer",
              }}
            >
              {evaluating ? "评估中，请稍候（约15秒）..." : alreadyGenerated ? "已生成评估报告" : "生成评估报告"}
            </button>
            {error && <div style={{ marginTop: "10px", fontSize: "13px", color: "#dc2626" }}>{error}</div>}
          </div>
        )}

        {evaluation && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* 总分 */}
            <div style={{ border: "1px solid #f0f0f0", borderRadius: "8px", padding: "24px", background: "#fff", display: "flex", alignItems: "center", gap: "24px" }}>
              <div style={{ fontSize: "56px", fontWeight: 700, color: getScoreColor(evaluation.totalScore), lineHeight: 1 }}>{evaluation.totalScore}</div>
              <div>
                <div style={{ fontSize: "13px", color: "#888", marginBottom: "6px" }}>综合评分（满分100）</div>
              </div>
            </div>

            {/* 分部评分 */}
            {evaluation.breakdown && (
              <div style={{ border: "1px solid #f0f0f0", borderRadius: "8px", background: "#fff", overflow: "hidden" }}>
                <div style={{ padding: "16px 24px", borderBottom: "1px solid #f0f0f0", fontSize: "13px", fontWeight: 600 }}>分部评分</div>
                {[
                  { key: "part1", label: "第一部分：基础认知", weight: "30%" },
                  { key: "part2", label: "第二部分：AI 协作", weight: "30%" },
                  { key: "part3", label: "第三部分：项目实战", weight: "40%" },
                ].map(({ key, label, weight }) => {
                  const part = evaluation.breakdown[key];
                  if (!part) return null;
                  return (
                    <div key={key} style={{ padding: "16px 24px", borderBottom: "1px solid #f5f5f5", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
                          {label}<span style={{ fontSize: "11px", color: "#aaa", fontWeight: 400, marginLeft: "6px" }}>权重 {weight}</span>
                        </div>
                        {key !== "part1" && part.feedback && <div style={{ fontSize: "12px", color: "#555", lineHeight: "1.6" }}>{part.feedback}</div>}
                        {key === "part1" && part.mcCorrect !== undefined && (
                          <div style={{ fontSize: "12px", color: "#888", display: "flex", gap: "12px", flexWrap: "wrap" as const }}>
                            <span>选择题：{part.mcCorrect}/{part.mcTotal} 正确（{part.mcScore} / 70分）</span>
                            {part.essayScore !== undefined && <span>问答题：{part.essayScore} / 30分</span>}
                          </div>
                        )}
                        {key === "part1" && part.credibility && (part.credibility.pasteCount > 0 || part.credibility.tabSwitchCount > 0 || part.credibility.fastInputCount > 0) && (
                          <div style={{ fontSize: "11px", color: "#d97706", marginTop: "6px", background: "#fffbeb", borderRadius: "4px", padding: "4px 8px", border: "1px solid #fde68a" }}>
                            候选人回答问答题时，粘贴 {part.credibility.pasteCount} 次 · 切换标签 {part.credibility.tabSwitchCount} 次 · 异常快速输入 {part.credibility.fastInputCount} 次
                            {part.credibility.note && part.credibility.note !== "正常" && <span style={{ marginLeft: "6px" }}>· {part.credibility.note}</span>}
                          </div>
                        )}
                        {key === "part2" && part.behaviorFlags && (
                          <div style={{ fontSize: "11px", color: "#aaa", marginTop: "4px" }}>
                            对话 {part.behaviorFlags.turns} 轮 · {part.behaviorFlags.totalChars} 字
                            {part.behaviorFlags.pasteDetected && <span style={{ color: "#dc2626", marginLeft: "6px" }}>⚠️ 疑似粘贴题目</span>}
                          </div>
                        )}
                      </div>
                      <div style={{ flexShrink: 0, textAlign: "center" as const }}>
                        <span style={{ fontSize: "24px", fontWeight: 700, color: getScoreColor(part.score) }}>{part.score}</span>
                        {key !== "part1" && <span style={{ fontSize: "12px", color: "#bbb" }}> / 100</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Part2 维度 */}
            {evaluation.breakdown?.part2?.dimensions?.length > 0 && (
              <div style={{ border: "1px solid #f0f0f0", borderRadius: "8px", background: "#fff", overflow: "hidden" }}>
                <div style={{ padding: "16px 24px", borderBottom: "1px solid #f0f0f0", fontSize: "13px", fontWeight: 600 }}>AI 协作能力分析</div>
                {(() => {
                  const maxScores: Record<number, number> = { 0: 25, 1: 35, 2: 25, 3: 15 };
                  return evaluation.breakdown.part2.dimensions.map((d: any, i: number) => {
                    const max = maxScores[i] ?? 100;
                    return (
                      <div key={i} style={{ padding: "14px 24px", borderBottom: "1px solid #f5f5f5", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "13px", fontWeight: 500, marginBottom: "2px" }}>{d.name}</div>
                          <div style={{ fontSize: "12px", color: "#666", lineHeight: "1.5" }}>{d.comment}</div>
                        </div>
                        <div style={{ textAlign: "center" as const, flexShrink: 0 }}>
                          <span style={{ fontSize: "20px", fontWeight: 700, color: getScoreColor(d.score) }}>{d.score}</span>
                          <span style={{ fontSize: "11px", color: "#bbb" }}> / {max}</span>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            )}

            {/* Part3 维度 */}
            {evaluation.breakdown?.part3?.dimensions?.length > 0 && (
              <div style={{ border: "1px solid #f0f0f0", borderRadius: "8px", background: "#fff", overflow: "hidden" }}>
                <div style={{ padding: "16px 24px", borderBottom: "1px solid #f0f0f0", fontSize: "13px", fontWeight: 600 }}>项目实战评估</div>
                {evaluation.breakdown.part3.dimensions.map((d: any, i: number) => (
                  <div key={i} style={{ padding: "14px 24px", borderBottom: "1px solid #f5f5f5", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "13px", fontWeight: 500, marginBottom: "2px" }}>{d.name}</div>
                      <div style={{ fontSize: "12px", color: "#666", lineHeight: "1.5" }}>{d.comment}</div>
                    </div>
                    <div style={{ textAlign: "center" as const, flexShrink: 0 }}>
                      <span style={{ fontSize: "20px", fontWeight: 700, color: getScoreColor(d.score) }}>{d.score}</span>
                      {d.max !== undefined && <span style={{ fontSize: "11px", color: "#bbb" }}> / {d.max}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 学习参考 */}
            <div>
              <div style={{ fontSize: "15px", fontWeight: 700, marginBottom: "12px" }}>📚 学习参考</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <ReviewSection icon="📝" title="选择题错题解析" type="mc" sessionId={sessionId} />
                <ReviewSection icon="💡" title="问答题参考答案" type="essay" sessionId={sessionId} />
                <ReviewSection icon="🤖" title="AI 协作高分示例" type="collab" sessionId={sessionId} />
                <ReviewSection icon="🔍" title="项目技术专家点评" type="project" sessionId={sessionId} />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
