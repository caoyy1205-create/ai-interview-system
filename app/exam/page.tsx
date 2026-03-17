"use client";

import { useEffect, useRef, useState, useCallback } from "react";

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
  options?: string[];
  correctAnswer?: number;
  evaluationPoints?: string[];
  difficulty?: string;
};

type Part2Task = {
  id: string;
  title: string;
  description: string;
  conflicts: string[];
  evaluationFocus: string[];
  deliverable?: string;
};

type ExamSet = {
  part1: { type: string; allowAI: boolean; timeLimitMinutes: number; questions: Part1Question[] };
  part2: { type: string; allowAI: boolean; timeLimitMinutes: number; tasks: Part2Task[] };
  part3: { type: string; allowAI: boolean; timeLimitMinutes: number; task: Task };
};

type ChatMessage = { role: "user" | "assistant"; content: string; time: number };

// 单道问答题的对话状态
type EssayConvMsg = {
  role: "candidate" | "interviewer";
  content: string;
  time: number;
};

type EssayState = {
  // answering=候选人正在写初始回答
  // waiting_r1=等AI第1次追问
  // followup_r1=显示了AI第1次追问，等候选人回答
  // answering_r1=候选人正在写第1次补充
  // waiting_r2=等AI第2次追问
  // followup_r2=显示了AI第2次追问，等候选人回答
  // answering_r2=候选人正在写第2次补充
  // done=该题完成
  phase: "answering" | "waiting_r1" | "followup_r1" | "answering_r1" | "waiting_r2" | "followup_r2" | "answering_r2" | "done";
  conversation: EssayConvMsg[];
  currentInput: string;
};

type Part2Message = { role: "user" | "assistant"; content: string; time: number };

type IntegrityEvent = {
  type: "paste" | "tab_switch" | "fast_input";
  questionId: string;
  timestamp: number;
  detail?: string;
};

const TOTAL_SECONDS = 6 * 60 * 60;
const SESSION_KEY_PREFIX = "examSession_v8";
const sessionKey = (id: string) => `${SESSION_KEY_PREFIX}_${id}`;
const MC_LIMIT = 5 * 60;
const ESSAY_LIMIT = 15 * 60;   // 问答题 2 题共 15 分钟
const PART2_LIMIT = 15 * 60;
const PART3_LIMIT = 5 * 60 * 60;
const MAX_AI_TURNS = 10;

function formatTime(s: number) {
  s = Math.max(0, s);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

const S = {
  page: { minHeight: "100vh", background: "#fff", color: "#111", fontFamily: "'Inter', -apple-system, sans-serif" } as React.CSSProperties,
  topbar: { borderBottom: "1px solid #f0f0f0", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "56px", position: "sticky" as const, top: 0, zIndex: 100, background: "#fff" } as React.CSSProperties,
  logo: { fontWeight: 700, fontSize: "15px", letterSpacing: "-0.01em" } as React.CSSProperties,
  tabs: { borderBottom: "1px solid #f0f0f0", padding: "0 32px", display: "flex", position: "sticky" as const, top: "56px", zIndex: 99, background: "#fff" } as React.CSSProperties,
  tab: (active: boolean): React.CSSProperties => ({ padding: "14px 20px", fontSize: "13px", fontWeight: active ? 600 : 400, color: active ? "#111" : "#888", borderBottom: "2px solid " + (active ? "#111" : "transparent"), cursor: "pointer", background: "none", border: "none", borderBottomWidth: "2px", borderBottomStyle: "solid", borderBottomColor: active ? "#111" : "transparent" }),
  body: { maxWidth: "760px", margin: "0 auto", padding: "40px 32px 80px" } as React.CSSProperties,
  badge: (color: string): React.CSSProperties => ({ display: "inline-block", fontSize: "11px", fontWeight: 500, padding: "2px 8px", borderRadius: "4px", background: color === "yellow" ? "#fefce8" : color === "blue" ? "#eff6ff" : color === "green" ? "#f0fdf4" : color === "red" ? "#fef2f2" : color === "purple" ? "#faf5ff" : "#f9fafb", color: color === "yellow" ? "#854d0e" : color === "blue" ? "#1d4ed8" : color === "green" ? "#15803d" : color === "red" ? "#dc2626" : color === "purple" ? "#7c3aed" : "#444", border: `1px solid ${color === "yellow" ? "#fef08a" : color === "blue" ? "#bfdbfe" : color === "green" ? "#bbf7d0" : color === "red" ? "#fecaca" : color === "purple" ? "#ddd6fe" : "#e5e7eb"}` }),
  card: { border: "1px solid #f0f0f0", borderRadius: "8px", padding: "24px", marginBottom: "20px" } as React.CSSProperties,
  label: { fontSize: "12px", fontWeight: 500, color: "#888", marginBottom: "6px", display: "block", textTransform: "uppercase" as const, letterSpacing: "0.05em" },
  input: { width: "100%", border: "1px solid #e5e5e5", borderRadius: "6px", padding: "10px 12px", fontSize: "13px", color: "#111", outline: "none", boxSizing: "border-box" as const, background: "#fff" },
  textarea: { width: "100%", border: "1px solid #e5e5e5", borderRadius: "6px", padding: "10px 12px", fontSize: "13px", color: "#111", outline: "none", boxSizing: "border-box" as const, background: "#fff", minHeight: "120px", resize: "vertical" as const },
  btnPrimary: (disabled?: boolean): React.CSSProperties => ({ background: disabled ? "#e5e5e5" : "#111", color: disabled ? "#aaa" : "#fff", border: "none", borderRadius: "6px", padding: "10px 20px", fontSize: "13px", fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer" }),
  btnSecondary: (disabled?: boolean): React.CSSProperties => ({ background: "transparent", color: disabled ? "#bbb" : "#111", border: `1px solid ${disabled ? "#e5e5e5" : "#ddd"}`, borderRadius: "6px", padding: "9px 18px", fontSize: "13px", fontWeight: 500, cursor: disabled ? "not-allowed" : "pointer" }),
  divider: { borderTop: "1px solid #f0f0f0", margin: "28px 0" } as React.CSSProperties,
  sectionTitle: { fontSize: "18px", fontWeight: 700, letterSpacing: "-0.01em", marginBottom: "4px" } as React.CSSProperties,
  sectionSub: { fontSize: "13px", color: "#888", marginBottom: "28px" } as React.CSSProperties,
  statusBar: { position: "fixed" as const, bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #f0f0f0", padding: "10px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "#888" },
};

// ─── SectionTimer ─────────────────────────────────────────────────────────────
function SectionTimer({ label, limitSeconds, savedLeft, onExpire, onTick, locked, paused, mode = "bar" }: {
  label: string; limitSeconds: number; savedLeft?: number;
  onExpire: () => void; onTick?: (left: number) => void;
  locked: boolean; paused?: boolean; mode?: "bar" | "inline";
}) {
  const [left, setLeft] = useState(savedLeft ?? limitSeconds);
  const calledRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  const onTickRef = useRef(onTick);
  useEffect(() => { onExpireRef.current = onExpire; }, [onExpire]);
  useEffect(() => { onTickRef.current = onTick; }, [onTick]);

  // sync savedLeft when it changes externally (e.g. restore from localStorage)
  useEffect(() => {
    if (savedLeft !== undefined) setLeft(savedLeft);
  }, [savedLeft]);

  useEffect(() => {
    if (locked || paused) return;
    if (left <= 0) { if (!calledRef.current) { calledRef.current = true; onExpireRef.current(); } return; }
    const t = setTimeout(() => { const n = left - 1; setLeft(n); onTickRef.current?.(n); }, 1000);
    return () => clearTimeout(t);
  }, [left, locked, paused]);

  if (locked) {
    if (mode === "inline") return <span style={{ fontSize: "12px", color: "#888" }}>⏱ 时间已结束</span>;
    return null;
  }

  const pct = left / limitSeconds;
  const urgent = pct < 0.2;
  const critical = left <= 60;
  const barColor = critical ? "#dc2626" : urgent ? "#f59e0b" : "#16a34a";

  if (mode === "inline") {
    return (
      <span style={{ fontSize: "12px", color: critical ? "#dc2626" : urgent ? "#d97706" : "#888", fontWeight: (urgent || critical) ? 700 : 400 }}>
        ⏱ {label}剩余 <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "13px" }}>{formatTime(left)}</span>
        {critical && " ⚠️ 即将锁定！"}
      </span>
    );
  }

  return (
    <div style={{
      position: "sticky", top: "104px", zIndex: 98,
      background: paused ? "#f9fafb" : (critical ? "#fef2f2" : urgent ? "#fffbeb" : "#f9fafb"),
      border: `1px solid ${paused ? "#e5e7eb" : (critical ? "#fca5a5" : urgent ? "#fde68a" : "#e5e7eb")}`,
      borderRadius: "8px", padding: "12px 20px", marginBottom: "20px",
      display: "flex", alignItems: "center", gap: "16px",
      boxShadow: (!paused && (urgent || critical)) ? "0 2px 8px rgba(220,38,38,0.12)" : "none",
      animation: (!paused && critical) ? "timerPulse 1s ease-in-out infinite" : "none",
    }}>
      <span style={{ fontSize: "13px", color: paused ? "#888" : (critical ? "#dc2626" : urgent ? "#92400e" : "#555"), fontWeight: 600, whiteSpace: "nowrap" }}>
        ⏱ {label}
      </span>
      <span style={{ fontFamily: "monospace", fontSize: "22px", fontWeight: 800, color: paused ? "#aaa" : (critical ? "#dc2626" : urgent ? "#b45309" : "#111"), letterSpacing: "0.05em" }}>
        {formatTime(left)}
      </span>
      <div style={{ flex: 1, height: "6px", background: "#e5e7eb", borderRadius: "3px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct * 100}%`, background: paused ? "#d1d5db" : barColor, borderRadius: "3px", transition: "width 1s linear, background 0.5s" }} />
      </div>
      {paused && <span style={{ fontSize: "12px", color: "#888", whiteSpace: "nowrap" }}>⏸ 已暂停</span>}
      {!paused && critical && <span style={{ fontSize: "12px", color: "#dc2626", fontWeight: 700, whiteSpace: "nowrap" }}>⚠️ 即将结束！</span>}
      {!paused && urgent && !critical && <span style={{ fontSize: "12px", color: "#b45309", fontWeight: 600, whiteSpace: "nowrap" }}>请抓紧时间</span>}
    </div>
  );
}

// ─── EssayConversation：单道问答题的对话式追问组件 ─────────────────────────────
function EssayConversation({
  question,
  questionIndex,
  locked,
  state,
  onChange,
  onQuestionDone,
}: {
  question: Part1Question;
  questionIndex: number;
  locked: boolean;
  state: EssayState;
  onChange: (patch: Partial<EssayState>) => void;
  onQuestionDone: () => void;
}) {
  const [fetchingAI, setFetchingAI] = useState(false);
  const convEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    convEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.conversation, fetchingAI]);

  const phase = state.phase;
  const conv = state.conversation;
  const inputVal = state.currentInput;

  const isInputPhase = phase === "answering" || phase === "answering_r1" || phase === "answering_r2";
  const isDone = phase === "done";

  // 当前输入框 placeholder
  const placeholder = (() => {
    if (locked) return "已锁定";
    if (phase === "answering") return "请输入你的回答（建议 200-400 字）...";
    if (phase === "answering_r1" || phase === "answering_r2") return "请补充回答...";
    if (phase === "waiting_r1" || phase === "waiting_r2") return "AI 正在思考追问...";
    if (phase === "followup_r1" || phase === "followup_r2") return "请回答面试官的追问...";
    return "";
  })();

  // 提交按钮文字
  const submitLabel = (() => {
    if (phase === "answering") return "提交回答";
    if (phase === "answering_r1") return "提交补充";
    if (phase === "answering_r2") return "完成本题";
    return "";
  })();

  const handleSubmit = async () => {
    if (!inputVal.trim() || fetchingAI || locked) return;

    const newMsg: EssayConvMsg = { role: "candidate", content: inputVal.trim(), time: Date.now() };
    const newConv = [...conv, newMsg];

    if (phase === "answering") {
      // 提交初始回答 → 等 AI 第1次追问
      onChange({ conversation: newConv, currentInput: "", phase: "waiting_r1" });
      setFetchingAI(true);
      const followup = await fetchFollowup(question.question, newConv, 1);
      setFetchingAI(false);
      const aiMsg: EssayConvMsg = { role: "interviewer", content: followup, time: Date.now() };
      onChange({ conversation: [...newConv, aiMsg], phase: "followup_r1" });
    } else if (phase === "answering_r1") {
      // 提交第1次补充 → 等 AI 第2次追问
      onChange({ conversation: newConv, currentInput: "", phase: "waiting_r2" });
      setFetchingAI(true);
      const followup = await fetchFollowup(question.question, newConv, 2);
      setFetchingAI(false);
      const aiMsg: EssayConvMsg = { role: "interviewer", content: followup, time: Date.now() };
      onChange({ conversation: [...newConv, aiMsg], phase: "followup_r2" });
    } else if (phase === "answering_r2") {
      // 提交第2次补充 → 本题结束
      onChange({ conversation: newConv, currentInput: "", phase: "done" });
      onQuestionDone();
    }
  };

  // followup_r1/r2 阶段：点"开始回答"按钮进入 answering_r1/r2
  const handleStartAnswer = () => {
    if (phase === "followup_r1") onChange({ phase: "answering_r1" });
    if (phase === "followup_r2") onChange({ phase: "answering_r2" });
  };

  return (
    <div>
      {/* 题目 */}
      <div style={{ fontSize: "14px", fontWeight: 500, lineHeight: "1.7", marginBottom: "20px", color: "#111" }}>
        {question.question}
      </div>

      {/* 对话流 */}
      {conv.length > 0 && (
        <div style={{ marginBottom: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {conv.map((msg, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "candidate" ? "flex-end" : "flex-start" }}>
              <div style={{ fontSize: "11px", color: "#ccc", marginBottom: "4px" }}>
                {msg.role === "candidate" ? "你" : "🎙 面试官"} · {new Date(msg.time).toLocaleTimeString()}
              </div>
              <div style={{
                maxWidth: "85%",
                padding: "12px 16px",
                borderRadius: "10px",
                fontSize: "13px",
                lineHeight: "1.7",
                background: msg.role === "candidate" ? "#111" : "#f5f5f5",
                color: msg.role === "candidate" ? "#fff" : "#111",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                border: msg.role === "interviewer" ? "1px solid #ebebeb" : "none",
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          {fetchingAI && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <div style={{ fontSize: "11px", color: "#ccc", marginBottom: "4px" }}>🎙 面试官</div>
              <div style={{ padding: "12px 16px", borderRadius: "10px", fontSize: "13px", background: "#f5f5f5", color: "#aaa", border: "1px solid #ebebeb" }}>
                思考中...
              </div>
            </div>
          )}
          <div ref={convEndRef} />
        </div>
      )}

      {/* 已完成 */}
      {isDone && (
        <div style={{ padding: "12px 16px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", fontSize: "13px", color: "#15803d", fontWeight: 600 }}>
          ✓ 本题已完成
        </div>
      )}

      {/* followup_r1/r2：显示追问，等候选人点"开始回答" */}
      {(phase === "followup_r1" || phase === "followup_r2") && !locked && (
        <div style={{ marginTop: "4px" }}>
          <button style={S.btnPrimary(false)} onClick={handleStartAnswer}>
            开始回答 →
          </button>
        </div>
      )}

      {/* 输入区：answering / answering_r1 / answering_r2 */}
      {isInputPhase && !locked && !isDone && (
        <div>
          <textarea
            style={{ ...S.textarea, marginBottom: "12px" }}
            value={inputVal}
            onChange={e => onChange({ currentInput: e.target.value })}
            placeholder={placeholder}
            disabled={fetchingAI}
          />
          <button
            style={S.btnPrimary(!inputVal.trim() || fetchingAI)}
            onClick={handleSubmit}
            disabled={!inputVal.trim() || fetchingAI}
          >
            {fetchingAI ? "AI 思考中..." : submitLabel}
          </button>
        </div>
      )}

      {/* 超时锁定状态 */}
      {locked && !isDone && (
        <div style={{ padding: "12px 16px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "8px", fontSize: "13px", color: "#92400e" }}>
          🔒 时间已到，本题锁定
        </div>
      )}
    </div>
  );
}

async function fetchFollowup(question: string, conversation: EssayConvMsg[], round: number): Promise<string> {
  try {
    const r = await fetch("/api/followup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, conversation, round }),
    });
    const d = await r.json();
    return d.content || "（AI 追问失败，请继续作答）";
  } catch {
    return "（网络错误，请继续作答）";
  }
}

// ─── 主组件 ───────────────────────────────────────────────────────────────────
export default function ExamPage() {
  type ActivePart = "part1" | "part2" | "part3";
  const [activePart, setActivePart] = useState<ActivePart>("part1");
  const [sessionId, setSessionId] = useState("");
  const [task, setTask] = useState<Task | null>(null);
  const [part1, setPart1] = useState<ExamSet["part1"] | null>(null);
  const [part2, setPart2] = useState<ExamSet["part2"] | null>(null);
  const [part3, setPart3] = useState<ExamSet["part3"] | null>(null);
  const [leftSeconds, setLeftSeconds] = useState(TOTAL_SECONDS);
  const [messages, setMessages] = useState<Part2Message[]>([]);
  const [input, setInput] = useState("");
  const [aiCount, setAiCount] = useState(0);
  const [aiLoading, setAiLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [part1Answers, setPart1Answers] = useState<{ [id: string]: string | number }>({});
  const [repoUrl, setRepoUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [part1Submitted, setPart1Submitted] = useState(false);
  const [part2Submitted, setPart2Submitted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [lockedQuestions, setLockedQuestions] = useState<{ [id: string]: boolean }>({});
  const [mcTimerLeft, setMcTimerLeft] = useState(MC_LIMIT);
  const [essayTimerLeft, setEssayTimerLeft] = useState(ESSAY_LIMIT);
  const [mcLocked, setMcLocked] = useState(false);
  const [essayLocked, setEssayLocked] = useState(false);
  const [essayStarted, setEssayStarted] = useState(false);
  // 问答题计时是否暂停（第1题完成后暂停，等用户点"继续"）
  const [essayTimerPaused, setEssayTimerPaused] = useState(false);

  // 问答题对话状态（每题独立）
  const [essayStates, setEssayStates] = useState<{ [id: string]: EssayState }>({});
  // 第1道问答题是否已完成（done），用于控制"继续下一题"按钮
  const [essay1Done, setEssay1Done] = useState(false);
  // 是否已展示第2道问答题
  const [essay2Unlocked, setEssay2Unlocked] = useState(false);

  const [part2TimerLeft, setPart2TimerLeft] = useState(PART2_LIMIT);
  const [part3TimerLeft, setPart3TimerLeft] = useState(PART3_LIMIT);
  const [part3TimeLocked, setPart3TimeLocked] = useState(false);
  const [part2TimerStarted, setPart2TimerStarted] = useState(false);
  const [part3TimerStarted, setPart3TimerStarted] = useState(false);
  const [part2TimeLocked, setPart2TimeLocked] = useState(false);
  const [finalSolution, setFinalSolution] = useState("");
  const [integrityEvents, setIntegrityEvents] = useState<IntegrityEvent[]>([]);

  const currentEssayQId = useRef<string>("");
  const lastInputLen = useRef<{ [id: string]: number }>({});
  const lastInputTime = useRef<{ [id: string]: number }>({});
  const part1AnswersRef = useRef(part1Answers);
  useEffect(() => { part1AnswersRef.current = part1Answers; }, [part1Answers]);
  const essayStatesRef = useRef(essayStates);
  useEffect(() => { essayStatesRef.current = essayStates; }, [essayStates]);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        const pending = localStorage.getItem("pendingSession");
        if (pending) {
          const parsed = JSON.parse(pending);
          if (parsed.sessionId && parsed.examSet) {
            localStorage.removeItem("pendingSession");
            const state = buildInitialState(parsed.sessionId, parsed.examSet);
            try { localStorage.setItem(sessionKey(parsed.sessionId), JSON.stringify(state)); } catch {}
            if (!cancelled) restoreSession(state);
            return;
          }
        }
      } catch {}
      const candidateName = localStorage.getItem("candidateName") || "";
      const candidateEmail = localStorage.getItem("candidateEmail") || "";
      const res = await fetch("/api/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateName, candidateEmail }),
      });
      const data = await res.json();
      if (cancelled) return;
      const { sessionId, examSet } = data;
      const state = buildInitialState(sessionId, examSet);
      try { localStorage.setItem(sessionKey(sessionId), JSON.stringify(state)); } catch {}
      restoreSession(state);
    }
    init();
    return () => { cancelled = true; };
  }, []);

  function buildInitialState(sid: string, examSet: ExamSet) {
    return {
      sessionId: sid, examSet,
      leftSeconds: TOTAL_SECONDS, messages: [], aiCount: 0,
      part1Answers: {}, repoUrl: "", notes: "",
      part1Submitted: false, part2Submitted: false,
      lockedQuestions: {},
      mcTimerLeft: MC_LIMIT, essayTimerLeft: ESSAY_LIMIT,
      mcLocked: false, essayLocked: false, essayStarted: false,
      essayTimerPaused: false,
      essayStates: {}, essay1Done: false, essay2Unlocked: false,
      part2TimerLeft: PART2_LIMIT, part2TimeLocked: false,
      part3TimerLeft: PART3_LIMIT, part3TimeLocked: false,
      part2TimerStarted: false, part3TimerStarted: false,
      finalSolution: "", integrityEvents: [],
    };
  }

  function restoreSession(state: any) {
    setSessionId(state.sessionId);
    setPart1(state.examSet.part1);
    setPart2(state.examSet.part2);
    setPart3(state.examSet.part3);
    setTask(state.examSet.part3.task);
    setLeftSeconds(state.leftSeconds ?? TOTAL_SECONDS);
    setMessages(state.messages ?? []);
    setAiCount(state.aiCount ?? 0);
    setPart1Answers(state.part1Answers ?? {});
    setRepoUrl(state.repoUrl ?? "");
    setNotes(state.notes ?? "");
    setPart1Submitted(state.part1Submitted ?? false);
    setPart2Submitted(state.part2Submitted ?? false);
    setLockedQuestions(state.lockedQuestions ?? {});
    setMcTimerLeft(state.mcTimerLeft ?? MC_LIMIT);
    setEssayTimerLeft(state.essayTimerLeft ?? ESSAY_LIMIT);
    setMcLocked(state.mcLocked ?? false);
    setEssayLocked(state.essayLocked ?? false);
    setEssayStarted(state.essayStarted ?? false);
    setEssayTimerPaused(state.essayTimerPaused ?? false);
    setEssayStates(state.essayStates ?? {});
    setEssay1Done(state.essay1Done ?? false);
    setEssay2Unlocked(state.essay2Unlocked ?? false);
    setPart2TimerLeft(state.part2TimerLeft ?? PART2_LIMIT);
    setPart3TimerLeft(state.part3TimerLeft ?? PART3_LIMIT);
    setPart3TimeLocked(state.part3TimeLocked ?? false);
    setPart2TimerStarted(state.part2TimerStarted ?? false);
    setPart3TimerStarted(state.part3TimerStarted ?? false);
    setPart2TimeLocked(state.part2TimeLocked ?? false);
    setFinalSolution(state.finalSolution ?? "");
    setIntegrityEvents(state.integrityEvents ?? []);
  }

  function persistState(patch: object) {
    try {
      const id = sessionId;
      if (!id) return;
      const saved = localStorage.getItem(sessionKey(id));
      const current = saved ? JSON.parse(saved) : {};
      localStorage.setItem(sessionKey(id), JSON.stringify({ ...current, ...patch }));
    } catch {}
  }

  useEffect(() => {
    if (typeof document === "undefined") return;
    const id = "section-timer-style";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `@keyframes timerPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.7;transform:scale(1.03)} }`;
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    timerRef.current = setInterval(() => {
      setLeftSeconds(prev => { const next = prev <= 1 ? 0 : prev - 1; persistState({ leftSeconds: next }); return next; });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [sessionId]);

  const integrityEventsRef = useRef(integrityEvents);
  useEffect(() => { integrityEventsRef.current = integrityEvents; }, [integrityEvents]);
  const messagesRef = useRef(messages);
  useEffect(() => { messagesRef.current = messages; }, [messages]);
  const aiCountRef = useRef(aiCount);
  useEffect(() => { aiCountRef.current = aiCount; }, [aiCount]);
  const finalSolutionRef = useRef(finalSolution);
  useEffect(() => { finalSolutionRef.current = finalSolution; }, [finalSolution]);

  useEffect(() => {
    if (leftSeconds === 0 && sessionId) {
      if (activePart === "part1" && !part1Submitted) {
        submitPart("part1", { answers: part1AnswersRef.current, essayStates: essayStatesRef.current, completedAt: Date.now(), autoSubmit: true, integrityEvents: integrityEventsRef.current }, "part2");
      } else if (activePart === "part2" && !part2Submitted) {
        submitPart("part2", { messages: messagesRef.current, aiCount: aiCountRef.current, finalSolution: finalSolutionRef.current, completedAt: Date.now(), autoSubmit: true }, "part3");
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftSeconds]);

  useEffect(() => {
    const handler = () => {
      if (document.hidden && currentEssayQId.current && !part1Submitted) {
        const evt: IntegrityEvent = { type: "tab_switch", questionId: currentEssayQId.current, timestamp: Date.now() };
        setIntegrityEvents(prev => { const next = [...prev, evt]; persistState({ integrityEvents: next }); return next; });
      }
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [part1Submitted]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const isReady = !!task && !!sessionId;
  const isTimeUp = leftSeconds <= 0 && isReady;

  const handleMcTick = useCallback((left: number) => { setMcTimerLeft(left); persistState({ mcTimerLeft: left }); }, []);
  const handleMcExpire = useCallback(() => { setMcLocked(true); persistState({ mcLocked: true }); }, []);
  const handleEssayTick = useCallback((left: number) => { setEssayTimerLeft(left); persistState({ essayTimerLeft: left }); }, []);
  const handleEssayExpire = useCallback(() => {
    setEssayLocked(true);
    persistState({ essayLocked: true });
    if (!part1Submitted) {
      submitPart("part1", { answers: part1AnswersRef.current, essayStates: essayStatesRef.current, completedAt: Date.now(), autoSubmit: true, integrityEvents: integrityEventsRef.current }, "part2");
    }
  }, [part1Submitted]);
  const handlePart2Expire = useCallback(() => { setPart2TimeLocked(true); persistState({ part2TimeLocked: true }); }, []);

  const addIntegrityEvent = useCallback((evt: IntegrityEvent) => {
    setIntegrityEvents(prev => { const next = [...prev, evt]; persistState({ integrityEvents: next }); return next; });
  }, []);

  // 更新某道 essay 题的状态
  const updateEssayState = useCallback((qId: string, patch: Partial<EssayState>) => {
    setEssayStates(prev => {
      const cur = prev[qId] || { phase: "answering", conversation: [], currentInput: "" };
      const next = { ...prev, [qId]: { ...cur, ...patch } };
      persistState({ essayStates: next });
      return next;
    });
  }, []);

  // 获取某道 essay 题的状态
  const getEssayState = (qId: string): EssayState => {
    return essayStates[qId] || { phase: "answering", conversation: [], currentInput: "" };
  };

  const sendMessage = async () => {
    if (!input.trim() || isTimeUp || aiLoading || part2TimeLocked) return;
    const userMsg: Part2Message = { role: "user", content: input, time: Date.now() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setAiCount(p => p + 1);
    setInput("");
    setAiLoading(true);
    persistState({ messages: newMessages, aiCount: aiCount + 1 });
    try {
      const r = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, task: part2?.tasks?.[0] }),
      });
      const d = await r.json();
      const aiMsg: Part2Message = { role: "assistant", content: d.content || "（无回复）", time: Date.now() };
      const withAi = [...newMessages, aiMsg];
      setMessages(withAi);
      persistState({ messages: withAi });
    } catch {
      setMessages(p => [...p, { role: "assistant", content: "网络错误，请重试", time: Date.now() }]);
    }
    setAiLoading(false);
  };

  const submitPart = async (part: "part1" | "part2" | "part3", data: any, next?: ActivePart) => {
    setSubmitStatus("submitting");
    try {
      const r = await fetch("/api/submit", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, part, data }),
      });
      if (r.ok) {
        setSubmitStatus("success");
        if (part === "part1") { setPart1Submitted(true); persistState({ part1Submitted: true }); }
        if (part === "part2") { setPart2Submitted(true); persistState({ part2Submitted: true }); }
        if (next) { setTimeout(() => {
          setSubmitStatus("idle"); setActivePart(next);
          if (next === "part2" && !part2TimerStarted) { setPart2TimerStarted(true); persistState({ part2TimerStarted: true }); }
          if (next === "part3" && !part3TimerStarted) { setPart3TimerStarted(true); persistState({ part3TimerStarted: true }); }
        }, 800); }
        else { try { localStorage.removeItem(sessionKey(sessionId)); } catch {} window.location.href = "/report?sessionId=" + sessionId; }
      } else { setSubmitStatus("error"); }
    } catch { setSubmitStatus("error"); }
  };

  // ─── renderPart1 ────────────────────────────────────────────────────────────
  const renderPart1 = () => {
    if (!part1) return null;
    const pasteCount = integrityEvents.filter(e => e.type === "paste").length;
    const tabCount = integrityEvents.filter(e => e.type === "tab_switch").length;
    const fastCount = integrityEvents.filter(e => e.type === "fast_input").length;
    const essayQuestions = part1.questions.filter(q => q.type === "essay");
    const firstEssayId = essayQuestions[0]?.id;

    // 判断 2 道问答题是否都已完成
    const allEssaysDone = essayQuestions.every(q => getEssayState(q.id).phase === "done");

    return (
      <div>
        <div style={S.sectionTitle}>第一部分：基础认知</div>
        <div style={S.sectionSub}>{part1.questions.length} 题 · 禁止使用 AI 工具</div>
        {!part1Submitted && (
          <SectionTimer
            label="选择题剩余时间"
            limitSeconds={MC_LIMIT}
            savedLeft={mcTimerLeft}
            onExpire={handleMcExpire}
            onTick={handleMcTick}
            locked={mcLocked}
            mode="bar"
          />
        )}
        {part1Submitted && (
          <div style={{ ...S.card, background: "#f0fdf4", borderColor: "#bbf7d0" }}>
            <div style={{ fontSize: "13px", color: "#15803d", fontWeight: 600, marginBottom: tabCount + pasteCount + fastCount > 0 ? "12px" : "0" }}>✓ 已提交，可切换到第二部分</div>
            {(tabCount + pasteCount + fastCount > 0) && (
              <div style={{ fontSize: "12px", color: "#555" }}>
                <span style={{ fontWeight: 600 }}>可信度信号：</span>
                切换标签页 {tabCount} 次 · 粘贴操作 {pasteCount} 次 · 异常快速输入 {fastCount} 次
              </div>
            )}
          </div>
        )}
        <div style={{ ...S.card, background: "#fffbeb", borderColor: "#fde68a" }}>
          <span style={S.badge("yellow")}>⚠️ 禁止 AI</span>
          <span style={{ fontSize: "13px", color: "#92400e", marginLeft: "10px" }}>
            选择题 5 分钟（独立计时） · 问答题 2 题共 15 分钟
          </span>
        </div>

        {part1.questions.map((q, idx) => {
          const isMcLocked = part1Submitted || (q.type === "multipleChoice" && mcLocked);

          if (q.type === "multipleChoice") {
            return (
              <div key={q.id} style={{ ...S.card, borderColor: isMcLocked && !part1Submitted ? "#fde68a" : "#f0f0f0", background: isMcLocked && !part1Submitted ? "#fffbeb" : "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <span style={S.badge("blue")}>{`选择题 ${idx + 1}`}</span>
                  {q.difficulty && <span style={{ fontSize: "11px", color: "#aaa" }}>{q.difficulty}</span>}
                  {isMcLocked && !part1Submitted && <span style={{ fontSize: "11px", color: "#b45309", fontWeight: 600, marginLeft: "auto" }}>🔒 已超时锁定</span>}
                </div>
                <div style={{ fontSize: "14px", fontWeight: 500, marginBottom: "16px", lineHeight: "1.6" }}>{q.question}</div>
                {q.options?.map((opt, i) => (
                  <label key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "10px 12px", border: `1px solid ${part1Answers[q.id] === i ? "#111" : "#e5e5e5"}`, borderRadius: "6px", marginBottom: "8px", cursor: isMcLocked ? "not-allowed" : "pointer", fontSize: "13px", background: part1Answers[q.id] === i ? "#f9f9f9" : "#fff", opacity: isMcLocked && part1Answers[q.id] !== i ? 0.5 : 1 }}>
                    <input type="radio" name={q.id} checked={part1Answers[q.id] === i} onChange={() => { if (isMcLocked) return; setPart1Answers(p => ({ ...p, [q.id]: i })); persistState({ part1Answers: { ...part1Answers, [q.id]: i } }); }} disabled={isMcLocked} />
                    <span style={{ flex: 1, whiteSpace: "normal", wordBreak: "break-word" }}>{opt}</span>
                  </label>
                ))}
              </div>
            );
          }

          // ── 问答题 ──
          const isFirst = q.id === firstEssayId;
          const essayIdx = essayQuestions.findIndex(eq => eq.id === q.id);
          const essayState = getEssayState(q.id);
          const isEssayLocked = part1Submitted || essayLocked;

          // 第2道问答题：只有 essay2Unlocked 才显示
          if (!isFirst && !essay2Unlocked) return null;

          currentEssayQId.current = q.id;

          // 问答题计时器：在第1道问答题上方显示（共享计时）
          const showEssayTimer = isFirst && !part1Submitted;
          // 计时开始条件：essayStarted
          // 暂停条件：第1题 done 且 !essay2Unlocked

          return (
            <div key={q.id}>
              {showEssayTimer && (
                <div style={{ marginBottom: "8px" }}>
                  {essayStarted ? (
                    <SectionTimer
                      label="问答题剩余时间（2题共用）"
                      limitSeconds={ESSAY_LIMIT}
                      savedLeft={essayTimerLeft}
                      onExpire={handleEssayExpire}
                      onTick={handleEssayTick}
                      locked={essayLocked}
                      paused={essayTimerPaused}
                      mode="bar"
                    />
                  ) : (
                    <div style={{ padding: "12px 20px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "13px", color: "#888", marginBottom: "0" }}>
                      ⏱ 问答题计时：<strong style={{ color: "#555" }}>开始作答时自动启动</strong>（2 题共 15 分钟）
                    </div>
                  )}
                </div>
              )}
              <div style={{ ...S.card }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <span style={S.badge("green")}>问答题 {essayIdx + 1}</span>
                  {q.difficulty && <span style={{ fontSize: "11px", color: "#aaa" }}>{q.difficulty}</span>}
                  {essayState.phase === "done" && <span style={{ fontSize: "11px", color: "#15803d", fontWeight: 600, marginLeft: "auto" }}>✓ 已完成</span>}
                  {isEssayLocked && essayState.phase !== "done" && <span style={{ fontSize: "11px", color: "#b45309", fontWeight: 600, marginLeft: "auto" }}>🔒 已锁定</span>}
                </div>
                <EssayConversation
                  question={q}
                  questionIndex={essayIdx}
                  locked={isEssayLocked}
                  state={essayState}
                  onChange={(patch) => {
                    // 在初始回答阶段启动计时器
                    if (!essayStarted && patch.currentInput && (patch.currentInput as string).length > 0) {
                      setEssayStarted(true);
                      persistState({ essayStarted: true });
                    }
                    updateEssayState(q.id, patch);
                  }}
                  onQuestionDone={() => {
                    if (isFirst) {
                      // 第1题完成：暂停计时
                      setEssay1Done(true);
                      setEssayTimerPaused(true);
                      persistState({ essay1Done: true, essayTimerPaused: true });
                    } else {
                      // 第2题完成：停表，允许提交
                      setEssayTimerPaused(true);
                      persistState({ essayTimerPaused: true });
                    }
                  }}
                />
              </div>

              {/* 第1题完成后：继续下一题按钮 */}
              {isFirst && essay1Done && !essay2Unlocked && !part1Submitted && (
                <div style={{ ...S.card, background: "#f8faff", borderColor: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#1d4ed8", marginBottom: "4px" }}>✓ 第一题完成，计时已暂停</div>
                    <div style={{ fontSize: "12px", color: "#888" }}>点击继续后，计时将恢复</div>
                  </div>
                  <button
                    style={S.btnPrimary(false)}
                    onClick={() => {
                      setEssay2Unlocked(true);
                      setEssayTimerPaused(false);
                      persistState({ essay2Unlocked: true, essayTimerPaused: false });
                    }}
                  >
                    继续第二题 →
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* 提交按钮：2道问答题都完成后才可提交（或超时自动提交） */}
        {!part1Submitted && (allEssaysDone || essayLocked) && (
          <>
            <div style={S.divider} />
            <button
              style={S.btnPrimary(submitStatus === "submitting")}
              onClick={() => submitPart("part1", { answers: part1Answers, essayStates, completedAt: Date.now(), integrityEvents }, "part2")}
              disabled={submitStatus === "submitting"}
            >
              {submitStatus === "submitting" ? "提交中..." : "提交并进入第二部分 →"}
            </button>
            {submitStatus === "error" && <span style={{ fontSize: "13px", color: "#dc2626", marginLeft: "12px" }}>提交失败，请重试</span>}
          </>
        )}
      </div>
    );
  };

  // ─── renderPart2 ────────────────────────────────────────────────────────────
  const renderPart2 = () => {
    if (!part2) return null;
    const t = part2.tasks[0];
    const chatDisabled = isTimeUp || aiLoading || part2TimeLocked || part2Submitted || aiCount >= MAX_AI_TURNS;

    return (
      <div>
        <div style={S.sectionTitle}>第二部分：AI 协作能力</div>
        <div style={S.sectionSub}>可使用系统内置 AI 助手 · 限时 {PART2_LIMIT / 60} 分钟</div>
        {part2Submitted && (
          <div style={{ ...S.card, background: "#f0fdf4", borderColor: "#bbf7d0" }}>
            <span style={{ fontSize: "13px", color: "#15803d", fontWeight: 600 }}>✓ 已提交，可切换到第三部分</span>
          </div>
        )}
        <div style={{ ...S.card, background: "#f8faff", borderColor: "#dbeafe" }}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#1d4ed8", marginBottom: "6px" }}>📌 本部分是开放协作任务，没有标准答案</div>
          <div style={{ fontSize: "13px", color: "#374151", lineHeight: "1.8" }}>
            你将借助系统内置 AI 助手完成以下任务。建议通过<strong>多轮对话</strong>来分析问题、拆解方案、反复打磨——<strong>我们关注你如何用 AI，而不只是最终写了什么。</strong>完成后将方案填写到下方「最终方案」区域并提交。
          </div>
        </div>
        <div style={S.card}>
          <div style={{ fontSize: "15px", fontWeight: 600, marginBottom: "8px" }}>{t.title}</div>
          <div style={{ fontSize: "13px", color: "#555", lineHeight: "1.7", marginBottom: t.deliverable ? "12px" : "0" }}>{t.description}</div>
          {t.deliverable && (
            <div style={{ fontSize: "13px", color: "#555", lineHeight: "1.7", marginTop: "12px" }}>
              <div style={{ fontWeight: 600, color: "#333", marginBottom: "4px" }}>产出目标：</div>
              <div>{t.deliverable}</div>
            </div>
          )}
        </div>
        {!part2Submitted && part2TimerStarted && (
          <SectionTimer
            label="AI协作剩余时间"
            limitSeconds={PART2_LIMIT}
            savedLeft={part2TimerLeft}
            onExpire={handlePart2Expire}
            onTick={(left) => { setPart2TimerLeft(left); persistState({ part2TimerLeft: left }); }}
            locked={part2TimeLocked}
            mode="bar"
          />
        )}
        {!part2Submitted && !part2TimerStarted && (
          <div style={{ padding: "12px 20px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "13px", color: "#888", marginBottom: "20px" }}>
            ⏱ AI协作计时将在此页面打开时自动启动
          </div>
        )}
        <div style={{ ...S.card, padding: "0" }}>
          <div style={{ padding: "12px 20px", borderBottom: "1px solid #f0f0f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontSize: "13px", fontWeight: 600 }}>AI 对话</span>
            </div>
            <div style={{ fontSize: "11px", color: aiCount >= MAX_AI_TURNS ? "#dc2626" : "#888", fontWeight: aiCount >= MAX_AI_TURNS ? 600 : 400 }}>
              {aiCount >= MAX_AI_TURNS ? "⚠️ 已达到最大交互次数（10次），无法继续提问" : `已使用 ${aiCount} / ${MAX_AI_TURNS} 次 · 剩余 ${MAX_AI_TURNS - aiCount} 次`}
            </div>
          </div>
          <div style={{ height: "360px", overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {messages.length === 0 ? (
              <div style={{ fontSize: "13px", color: "#bbb", textAlign: "center", marginTop: "80px" }}>开始与 AI 对话来完成任务...</div>
            ) : messages.map((m, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{ fontSize: "11px", color: "#ccc", marginBottom: "3px" }}>{m.role === "user" ? "你" : "AI"} · {new Date(m.time).toLocaleTimeString()}</div>
                <div style={{ maxWidth: "80%", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", lineHeight: "1.7", background: m.role === "user" ? "#111" : "#f5f5f5", color: m.role === "user" ? "#fff" : "#111", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                  {m.content}
                </div>
              </div>
            ))}
            {aiLoading && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <div style={{ fontSize: "11px", color: "#ccc", marginBottom: "3px" }}>AI</div>
                <div style={{ padding: "10px 14px", borderRadius: "8px", fontSize: "13px", background: "#f5f5f5", color: "#aaa" }}>思考中...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {!part2Submitted && (
            <div style={{ padding: "12px 16px", borderTop: "1px solid #f0f0f0", display: "flex", gap: "8px", alignItems: "flex-end" }}>
              <textarea
                style={{ ...S.textarea, flex: 1, minHeight: "60px", maxHeight: "120px", marginBottom: 0 }}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={part2TimeLocked ? "AI协作时间已结束" : isTimeUp ? "时间已结束" : "输入问题（点击发送按钮发送）..."}
                disabled={chatDisabled}
                rows={2}
              />
              <button style={{ ...S.btnPrimary(chatDisabled), alignSelf: "flex-end" }} onClick={sendMessage} disabled={chatDisabled}>发送</button>
            </div>
          )}
        </div>
        {!part2Submitted && (
          <div style={S.card}>
            <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>最终方案</div>
            <div style={{ fontSize: "12px", color: "#888", marginBottom: "12px" }}>请将与 AI 协作后最终确定的方案整理并填写在此处，提交后将作为评估依据</div>
            <textarea
              style={S.textarea}
              value={finalSolution}
              onChange={e => { setFinalSolution(e.target.value); persistState({ finalSolution: e.target.value }); }}
              placeholder="总结你与 AI 协作后的最终方案，包括核心思路、关键决策和具体方案..."
            />
          </div>
        )}
        {!part2Submitted && (
          <>
            <div style={S.divider} />
            <button
              style={S.btnPrimary(submitStatus === "submitting")}
              onClick={() => submitPart("part2", { messages, aiCount, finalSolution, completedAt: Date.now() }, "part3")}
              disabled={submitStatus === "submitting"}
            >
              {submitStatus === "submitting" ? "提交中..." : "提交并进入第三部分 →"}
            </button>
          </>
        )}
      </div>
    );
  };

  // ─── renderPart3 ────────────────────────────────────────────────────────────
  const renderPart3 = () => {
    if (!part3) return null;
    return (
      <div>
        <div style={S.sectionTitle}>第三部分：项目实战</div>
        <div style={S.sectionSub}>不限工具，提交可运行的项目仓库 · 限时 5 小时</div>
        {part3TimerStarted && (
          <SectionTimer
            label="第三部分剩余时间"
            limitSeconds={PART3_LIMIT}
            savedLeft={part3TimerLeft}
            onExpire={() => { setPart3TimeLocked(true); persistState({ part3TimeLocked: true }); }}
            onTick={(left) => { setPart3TimerLeft(left); persistState({ part3TimerLeft: left }); }}
            locked={part3TimeLocked}
            mode="bar"
          />
        )}
        <div style={S.card}>
          <div style={{ fontSize: "15px", fontWeight: 700, marginBottom: "16px" }}>{part3.task.title}</div>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>背景</div>
          <div style={{ fontSize: "13px", color: "#555", lineHeight: "1.7", marginBottom: "16px" }}>{part3.task.background}</div>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>要求</div>
          {part3.task.requirements.map((r, i) => <div key={i} style={{ fontSize: "13px", color: "#555", padding: "4px 0" }}>· {r}</div>)}
          <div style={{ borderTop: "1px solid #f0f0f0", margin: "16px 0" }} />
          <div style={{ fontSize: "12px", fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>交付物</div>
          {part3.task.deliverables.map((d, i) => <div key={i} style={{ fontSize: "13px", color: "#555", padding: "4px 0" }}>· {d}</div>)}
        </div>
        <div style={S.card}>
          <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "20px" }}>项目提交</div>
          <label style={S.label}>GitHub 仓库链接 *</label>
          <input style={{ ...S.input, marginBottom: "16px" }} value={repoUrl} onChange={e => { setRepoUrl(e.target.value); persistState({ repoUrl: e.target.value }); }} placeholder="https://github.com/username/project-name" />
          <label style={S.label}>提交说明</label>
          <textarea style={{ ...S.textarea, marginBottom: "0" }} value={notes} onChange={e => { setNotes(e.target.value); persistState({ notes: e.target.value }); }} placeholder="简述你如何拆解需求、如何使用 AI、关键取舍与未完成项..." />
        </div>
        <div style={S.divider} />
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button style={S.btnPrimary(submitStatus === "submitting")} onClick={() => submitPart("part3", { repoUrl, notes, completedAt: Date.now() })} disabled={submitStatus === "submitting"}>
            {submitStatus === "submitting" ? "提交中..." : "完成面试并提交"}
          </button>
          {submitStatus === "success" && <span style={{ fontSize: "13px", color: "#16a34a" }}>✓ 提交成功，正在跳转...</span>}
          {submitStatus === "error" && <span style={{ fontSize: "13px", color: "#dc2626" }}>提交失败，请重试</span>}
        </div>
      </div>
    );
  };

  return (
    <div style={S.page}>
      <div style={S.topbar}>
        <div style={S.logo}>AI 面试系统</div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {isTimeUp && <span style={{ fontSize: "12px", color: "#dc2626", fontWeight: 600 }}>⏰ 时间已结束</span>}
        </div>
      </div>
      <div style={S.tabs}>
        {(["part1", "part2", "part3"] as ActivePart[]).map((p, i) => {
          const isDisabled = (p === "part2" && !part1Submitted) || (p === "part3" && !part2Submitted);
          return (
            <button
              key={p}
              style={{ ...S.tab(activePart === p), opacity: isDisabled ? 0.35 : 1, cursor: isDisabled ? "not-allowed" : "pointer" }}
              onClick={() => {
                if (!isDisabled) {
                  setActivePart(p);
                  if (p === "part2" && !part2TimerStarted) { setPart2TimerStarted(true); persistState({ part2TimerStarted: true }); }
                  if (p === "part3" && !part3TimerStarted) { setPart3TimerStarted(true); persistState({ part3TimerStarted: true }); }
                }
              }}
              title={isDisabled ? "请先完成并提交前一部分" : undefined}
            >
              {["第一部分 基础认知", "第二部分 AI 协作", "第三部分 项目实战"][i]}
              {[part1Submitted, part2Submitted, false][i] && <span style={{ marginLeft: "6px", color: "#16a34a", fontSize: "11px" }}>✓</span>}
              {isDisabled && <span style={{ marginLeft: "4px", fontSize: "10px", color: "#bbb" }}>🔒</span>}
            </button>
          );
        })}
      </div>
      <div style={S.body}>
        {!part1 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#bbb", fontSize: "13px" }}>正在加载题目...</div>
        ) : (
          <>
            {activePart === "part1" && renderPart1()}
            {activePart === "part2" && renderPart2()}
            {activePart === "part3" && renderPart3()}
          </>
        )}
      </div>
      <div style={S.statusBar}>
        <span>Session: {sessionId || "—"}</span>
        <span>AI 使用次数: {aiCount}</span>
      </div>
    </div>
  );
}
