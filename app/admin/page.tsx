"use client";

import { useState } from "react";

type Session = {
  session_id: string;
  candidate_name: string | null;
  candidate_email: string | null;
  status: string;
  started_at: string;
  updated_at: string | null;
  final_report: { totalScore?: number; recommendation?: string } | null;
};

type CandidateGroup = {
  name: string;
  email: string;
  sessions: Session[];
};

function scoreColor(score: number | undefined) {
  if (score === undefined || score === null) return "#aaa";
  if (score >= 85) return "#16a34a";
  if (score >= 70) return "#2563eb";
  if (score >= 55) return "#d97706";
  return "#dc2626";
}

function scoreBg(score: number | undefined) {
  if (score === undefined || score === null) return "#f5f5f5";
  if (score >= 85) return "#f0fdf4";
  if (score >= 70) return "#eff6ff";
  if (score >= 55) return "#fffbeb";
  return "#fef2f2";
}

function scoreLabel(score: number | undefined) {
  if (score === undefined || score === null) return "未评估";
  if (score >= 85) return "强烈推荐";
  if (score >= 70) return "建议录用";
  if (score >= 55) return "待定";
  return "不予考虑";
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [inputToken, setInputToken] = useState("");
  const [groups, setGroups] = useState<CandidateGroup[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  async function fetchSubmissions(adminToken: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/submit", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-token": adminToken },
      });
      if (res.status === 401) { setError("Invalid admin token."); setLoading(false); return; }
      const data = await res.json();
      const sessions: Session[] = data.submissions || [];
      // 过滤：只显示有名字或邮箱的记录，且 status=completed 或 evaluated
      const valid = sessions.filter(s =>
        (s.candidate_name?.trim() || s.candidate_email?.trim()) &&
        (s.status === "completed" || s.status === "evaluated")
      );
      setTotal(valid.length);
      setGroups(groupByCandidate(valid));
      setToken(adminToken);
    } catch { setError("Failed to fetch submissions."); }
    setLoading(false);
  }

  function groupByCandidate(sessions: Session[]): CandidateGroup[] {
    const map = new Map<string, CandidateGroup>();
    const sorted = [...sessions].sort((a, b) => new Date(a.started_at).getTime() - new Date(b.started_at).getTime());
    for (const s of sorted) {
      const key = (s.candidate_email || s.candidate_name || s.session_id).toLowerCase().trim();
      if (!map.has(key)) {
        map.set(key, { name: s.candidate_name || "匿名", email: s.candidate_email || "", sessions: [] });
      }
      map.get(key)!.sessions.push(s);
    }
    return Array.from(map.values()).sort((a, b) => {
      const aLast = a.sessions[a.sessions.length - 1].started_at;
      const bLast = b.sessions[b.sessions.length - 1].started_at;
      return new Date(bLast).getTime() - new Date(aLast).getTime();
    });
  }

  function avgScore(sessions: Session[]): number | undefined {
    const scored = sessions.map(s => s.final_report?.totalScore).filter(s => s !== undefined && s !== null) as number[];
    if (scored.length === 0) return undefined;
    return Math.round(scored.reduce((a, b) => a + b, 0) / scored.length);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (inputToken.trim()) fetchSubmissions(inputToken.trim());
  }

  if (!token) {
    return (
      <main style={{ minHeight: "100vh", background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', -apple-system, sans-serif" }}>
        <div style={{ width: "100%", maxWidth: "360px", background: "#fff", border: "1px solid #f0f0f0", borderRadius: "12px", padding: "32px" }}>
          <div style={{ fontSize: "20px", fontWeight: 700, marginBottom: "4px" }}>面试官入口</div>
          <div style={{ fontSize: "13px", color: "#888", marginBottom: "24px" }}>请输入管理员 Token 以查看候选人提交记录</div>
          <form onSubmit={handleLogin}>
            <input type="password" value={inputToken} onChange={e => setInputToken(e.target.value)} placeholder="Admin Token"
              style={{ width: "100%", border: "1px solid #e5e5e5", borderRadius: "6px", padding: "10px 12px", fontSize: "13px", outline: "none", boxSizing: "border-box" as const, marginBottom: "12px" }} />
            {error && <div style={{ fontSize: "12px", color: "#dc2626", marginBottom: "10px" }}>{error}</div>}
            <button type="submit" style={{ width: "100%", background: "#111", color: "#fff", border: "none", borderRadius: "6px", padding: "10px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>进入</button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
          <div>
            <div style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.01em" }}>面试官控制台</div>
            <div style={{ fontSize: "13px", color: "#888", marginTop: "2px" }}>{groups.length} 位候选人 · {total} 次有效面试</div>
          </div>
          <button onClick={() => fetchSubmissions(token)}
            style={{ border: "1px solid #e5e5e5", background: "#fff", borderRadius: "6px", padding: "8px 16px", fontSize: "12px", color: "#555", cursor: "pointer" }}>
            刷新
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#bbb", fontSize: "13px" }}>加载中…</div>
        ) : groups.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#bbb", fontSize: "13px" }}>暂无有效提交记录</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {groups.map(group => {
              const key = group.email || group.name;
              const isExpanded = expandedKey === key;
              const hasMultiple = group.sessions.length > 1;
              const singleSession = group.sessions[0];
              const avg = avgScore(group.sessions);

              return (
                <div key={key} style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: "10px", overflow: "hidden" }}>
                  {/* 候选人主行 */}
                  <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: "16px" }}>
                    {/* 头像 */}
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 700, flexShrink: 0 }}>
                      {(group.name || "?")[0].toUpperCase()}
                    </div>
                    {/* 姓名 + 邮箱 */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "15px", fontWeight: 600, color: "#111" }}>{group.name}</div>
                      {group.email && <div style={{ fontSize: "12px", color: "#aaa", marginTop: "2px" }}>{group.email}</div>}
                    </div>
                    {/* 最近提交时间 */}
                    <div style={{ fontSize: "11px", color: "#ccc", marginTop: "1px" }}>
                      {formatDate(group.sessions[group.sessions.length - 1].updated_at || group.sessions[group.sessions.length - 1].started_at)}
                    </div>
                    {/* 面试次数 */}
                    {hasMultiple && (
                      <div style={{ fontSize: "12px", color: "#888", background: "#f5f5f5", borderRadius: "4px", padding: "3px 8px", flexShrink: 0 }}>
                        {group.sessions.length} 次面试
                      </div>
                    )}
                    {/* 分数区：多次=平均分，单次=当次分 */}
                    <div style={{ background: scoreBg(avg), borderRadius: "8px", padding: "8px 16px", textAlign: "center", flexShrink: 0, minWidth: "72px" }}>
                      <div style={{ fontSize: "22px", fontWeight: 800, color: scoreColor(avg), lineHeight: 1 }}>
                        {avg !== undefined ? avg : "—"}
                      </div>
                      <div style={{ fontSize: "11px", color: scoreColor(avg), marginTop: "2px", fontWeight: 500 }}>
                        {hasMultiple ? "平均分" : scoreLabel(avg)}
                      </div>
                    </div>
                    {/* 单次面试：显示查看报告；多次面试：只显示展开按钮，报告在展开里 */}
                    {!hasMultiple ? (
                      <a href={`/report?sessionId=${encodeURIComponent(singleSession.session_id)}&admin=1`}
                        target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: "13px", color: "#111", fontWeight: 600, textDecoration: "none", border: "1px solid #111", borderRadius: "6px", padding: "6px 14px", flexShrink: 0, whiteSpace: "nowrap" }}>
                        查看报告 →
                      </a>
                    ) : (
                      <button onClick={() => setExpandedKey(isExpanded ? null : key)}
                        style={{ border: "1px solid #e5e5e5", background: "#fff", borderRadius: "6px", padding: "6px 14px", fontSize: "12px", color: "#555", cursor: "pointer", flexShrink: 0 }}>
                        {isExpanded ? "收起 ▲" : "历史记录 ▼"}
                      </button>
                    )}
                  </div>

                  {/* 展开的历史记录 */}
                  {hasMultiple && isExpanded && (
                    <div style={{ borderTop: "1px solid #f0f0f0", padding: "0 24px" }}>
                      <div style={{ fontSize: "11px", color: "#aaa", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", padding: "12px 0 8px" }}>
                        历史面试记录（按时间从早到晚）
                      </div>
                      {group.sessions.map((s, idx) => {
                        const score = s.final_report?.totalScore;
                        return (
                          <div key={s.session_id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderTop: idx > 0 ? "1px solid #f5f5f5" : "none" }}>
                            <div style={{ fontSize: "12px", color: "#aaa", width: "24px" }}>#{idx + 1}</div>
                            <div style={{ fontSize: "12px", color: "#888", flex: 1 }}>{formatDate(s.started_at)}</div>
                            <div style={{ fontSize: "14px", fontWeight: 700, color: scoreColor(score), background: scoreBg(score), borderRadius: "6px", padding: "4px 12px", minWidth: "52px", textAlign: "center" }}>
                              {score !== undefined && score !== null ? score : "—"}
                            </div>
                            <div style={{ fontSize: "11px", color: "#aaa", minWidth: "56px" }}>{scoreLabel(score)}</div>
                            <a href={`/report?sessionId=${encodeURIComponent(s.session_id)}&admin=1`}
                              target="_blank" rel="noopener noreferrer"
                              style={{ fontSize: "12px", color: "#111", fontWeight: 600, textDecoration: "none", border: "1px solid #ddd", borderRadius: "5px", padding: "4px 10px", whiteSpace: "nowrap" }}>
                              查看报告 →
                            </a>
                          </div>
                        );
                      })}
                      <div style={{ height: "12px" }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
