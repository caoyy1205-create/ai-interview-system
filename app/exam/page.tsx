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

type Message = { role: "user" | "assistant"; content: string; time: number };

type IntegrityEvent = {
  type: "paste" | "tab_switch" | "fast_input";
  questionId: string;
  timestamp: number;
  detail?: string;
};

const TOTAL_SECONDS = 6 * 60 * 60;
const SESSION_KEY_PREFIX = "examSession_v5";
const sessionKey = (id: string) => `${SESSION_KEY_PREFIX}_${id}`;
const MC_LIMIT = 5 * 60;
const ESSAY_LIMIT = 5 * 60;
const PART1_LIMIT = 30 * 60;  // 第一部分总计时 30 分钟
const PART2_LIMIT = 5 * 60;
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
  timer: (urgent: boolean): React.CSSProperties => ({ fontFamily: "monospace", fontSize: "15px", fontWeight: 600, color: urgent ? "#dc2626" : "#111" }),
  tabs: { borderBottom: "1px solid #f0f0f0", padding: "0 32px", display: "flex", position: "sticky" as const, top: "56px", zIndex: 99, background: "#fff" } as React.CSSProperties,
  tab: (active: boolean): React.CSSProperties => ({ padding: "14px 20px", fontSize: "13px", fontWeight: active ? 600 : 400, color: active ? "#111" : "#888", borderBottom: "2px solid " + (active ? "#111" : "transparent"), cursor: "pointer", background: "none", border: "none", borderBottomWidth: "2px", borderBottomStyle: "solid", borderBottomColor: active ? "#111" : "transparent" }),
  body: { maxWidth: "760px", margin: "0 auto", padding: "40px 32px 80px" } as React.CSSProperties,
  badge: (color: string): React.CSSProperties => ({ display: "inline-block", fontSize: "11px", fontWeight: 500, padding: "2px 8px", borderRadius: "4px", background: color === "yellow" ? "#fefce8" : color === "blue" ? "#eff6ff" : color === "green" ? "#f0fdf4" : color === "red" ? "#fef2f2" : "#f9fafb", color: color === "yellow" ? "#854d0e" : color === "blue" ? "#1d4ed8" : color === "green" ? "#15803d" : color === "red" ? "#dc2626" : "#444", border: `1px solid ${color === "yellow" ? "#fef08a" : color === "blue" ? "#bfdbfe" : color === "green" ? "#bbf7d0" : color === "red" ? "#fecaca" : "#e5e7eb"}` }),
  card: { border: "1px solid #f0f0f0", borderRadius: "8px", padding: "24px", marginBottom: "20px" } as React.CSSProperties,
  label: { fontSize: "12px", fontWeight: 500, color: "#888", marginBottom: "6px", display: "block", textTransform: "uppercase" as const, letterSpacing: "0.05em" },
  input: { width: "100%", border: "1px solid #e5e5e5", borderRadius: "6px", padding: "10px 12px", fontSize: "13px", color: "#111", outline: "none", boxSizing: "border-box" as const, background: "#fff" },
  textarea: { width: "100%", border: "1px solid #e5e5e5", borderRadius: "6px", padding: "10px 12px", fontSize: "13px", color: "#111", outline: "none", boxSizing: "border-box" as const, background: "#fff", minHeight: "120px", resize: "vertical" as const },
  btnPrimary: (disabled?: boolean): React.CSSProperties => ({ background: disabled ? "#e5e5e5" : "#111", color: disabled ? "#aaa" : "#fff", border: "none", borderRadius: "6px", padding: "10px 20px", fontSize: "13px", fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer" }),
  divider: { borderTop: "1px solid #f0f0f0", margin: "28px 0" } as React.CSSProperties,
  sectionTitle: { fontSize: "18px", fontWeight: 700, letterSpacing: "-0.01em", marginBottom: "4px" } as React.CSSProperties,
  sectionSub: { fontSize: "13px", color: "#888", marginBottom: "28px" } as React.CSSProperties,
  statusBar: { position: "fixed" as const, bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #f0f0f0", padding: "10px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "#888" },
};

// ─── 单题倒计时 ───────────────────────────────────────────────────────────────
function QuestionTimer({ questionId, limitSeconds, savedLeft, onExpire, onTick, locked }: {
  questionId: string; limitSeconds: number; savedLeft?: number;
  onExpire: (id: string) => void; onTick: (id: string, left: number) => void; locked: boolean;
}) {
  const [left, setLeft] = useState(savedLeft ?? limitSeconds);
  const calledRef = useRef(false);

  useEffect(() => { setLeft(savedLeft ?? limitSeconds); calledRef.current = false; }, [questionId, limitSeconds, savedLeft]);

  useEffect(() => {
    if (locked) return;
    if (left <= 0) { if (!calledRef.current) { calledRef.current = true; onExpire(questionId); } return; }
    const t = setTimeout(() => { const n = left - 1; setLeft(n); onTick(questionId, n); }, 1000);
    return () => clearTimeout(t);
  }, [left, locked, questionId, onExpire, onTick]);

  const pct = left / limitSeconds;
  const urgent = pct < 0.25;
  const barColor = urgent ? "#dc2626" : pct < 0.5 ? "#f59e0b" : "#16a34a";

  if (locked) return <div style={{ fontSize: "11px", color: "#888", marginBottom: "14px" }}>⏱ 已锁定</div>;

  return (
    <div style={{ marginBottom: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span style={{ fontSize: "11px", color: "#888", fontWeight: 500 }}>剩余时间</span>
        <span style={{ fontFamily: "monospace", fontSize: "13px", fontWeight: 700, color: urgent ? "#dc2626" : "#555" }}>{formatTime(left)}</span>
      </div>
      <div style={{ height: "3px", background: "#f0f0f0", borderRadius: "2px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct * 100}%`, background: barColor, borderRadius: "2px", transition: "width 1s linear, background 0.3s" }} />
      </div>
      {urgent && left > 0 && <div style={{ fontSize: "11px", color: "#dc2626", marginTop: "4px", fontWeight: 500 }}>⚠️ 即将锁定，请尽快作答！</div>}
    </div>
  );
}

// ─── 第一部分总倒计时 ───────────────────────────────────────────────────────────
function Part1Timer({ limitSeconds, savedLeft, onExpire, onTick, locked }: {
  limitSeconds: number; savedLeft?: number; onExpire: () => void; onTick?: (left: number) => void; locked: boolean;
}) {
  const [left, setLeft] = useState(savedLeft ?? limitSeconds);
  const calledRef = useRef(false);

  useEffect(() => {
    if (locked) return;
    if (left <= 0) { if (!calledRef.current) { calledRef.current = true; onExpire(); } return; }
    const t = setTimeout(() => { const n = left - 1; setLeft(n); onTick?.(n); }, 1000);
    return () => clearTimeout(t);
  }, [left, locked, onExpire, onTick]);

  if (locked) return null;

  const pct = left / limitSeconds;
  const urgent = pct < 0.2;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 16px", background: urgent ? "#fef2f2" : "#f9fafb", borderRadius: "8px", border: `1px solid ${urgent ? "#fecaca" : "#f0f0f0"}`, marginBottom: "20px" }}>
      <span style={{ fontSize: "12px", color: urgent ? "#dc2626" : "#888", fontWeight: 500 }}>⏱ 第一部分剩余时间</span>
      <span style={{ fontFamily: "monospace", fontSize: "15px", fontWeight: 700, color: urgent ? "#dc2626" : "#111" }}>{formatTime(left)}</span>
      {urgent && <span style={{ fontSize: "11px", color: "#dc2626", fontWeight: 600 }}>⚠️ 时间即将结束！</span>}
      <div style={{ flex: 1, height: "3px", background: "#f0f0f0", borderRadius: "2px", overflow: "hidden", marginLeft: "4px" }}>
        <div style={{ height: "100%", width: `${pct * 100}%`, background: urgent ? "#dc2626" : pct < 0.5 ? "#f59e0b" : "#16a34a", borderRadius: "2px", transition: "width 1s linear" }} />
      </div>
    </div>
  );
}

// ─── 第二部分倒计时 ───────────────────────────────────────────────────────────
function Part2Timer({ limitSeconds, savedLeft, onExpire, locked }: {
  limitSeconds: number; savedLeft?: number; onExpire: () => void; locked: boolean;
}) {
  const [left, setLeft] = useState(savedLeft ?? limitSeconds);
  const calledRef = useRef(false);

  useEffect(() => {
    if (locked) return;
    if (left <= 0) { if (!calledRef.current) { calledRef.current = true; onExpire(); } return; }
    const t = setTimeout(() => setLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [left, locked, onExpire]);

  if (locked) return <span style={{ fontSize: "12px", color: "#888" }}>⏱ AI协作时间已结束</span>;

  const pct = left / limitSeconds;
  const urgent = pct < 0.25;
  return (
    <span style={{ fontSize: "12px", color: urgent ? "#dc2626" : "#888", fontWeight: urgent ? 600 : 400 }}>
      ⏱ AI协作剩余 <span style={{ fontFamily: "monospace", fontWeight: 700 }}>{formatTime(left)}</span>
      {urgent && " ⚠️ 即将锁定！"}
    </span>
  );
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
  const [messages, setMessages] = useState<Message[]>([]);
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
  const [questionTimerLeft, setQuestionTimerLeft] = useState<{ [id: string]: number }>({});
  const [part1TimerLeft, setPart1TimerLeft] = useState(PART1_LIMIT);
  const [part2TimerLeft, setPart2TimerLeft] = useState(PART2_LIMIT);
  const [part2TimeLocked, setPart2TimeLocked] = useState(false);
  const [finalSolution, setFinalSolution] = useState("");
  const [integrityEvents, setIntegrityEvents] = useState<IntegrityEvent[]>([]);

  const currentEssayQId = useRef<string>("");
  const lastInputLen = useRef<{ [id: string]: number }>({});
  const lastInputTime = useRef<{ [id: string]: number }>({});
  // keep part1Answers ref for use in callbacks
  const part1AnswersRef = useRef(part1Answers);
  useEffect(() => { part1AnswersRef.current = part1Answers; }, [part1Answers]);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      // 优先读首页传过来的 pendingSession（已包含 sessionId 和 examSet）
      try {
        const pending = localStorage.getItem("pendingSession");
        if (pending) {
          const parsed = JSON.parse(pending);
          if (parsed.sessionId && parsed.examSet) {
            localStorage.removeItem("pendingSession"); // 消费后立即清除
            const state = {
              sessionId: parsed.sessionId,
              examSet: parsed.examSet,
              leftSeconds: TOTAL_SECONDS, messages: [], aiCount: 0,
              part1Answers: {}, repoUrl: "", notes: "",
              part1Submitted: false, part2Submitted: false,
              lockedQuestions: {}, questionTimerLeft: {},
              part1TimerLeft: PART1_LIMIT,
              part2TimerLeft: PART2_LIMIT, part2TimeLocked: false,
              finalSolution: "", integrityEvents: [],
            };
            try { localStorage.setItem(sessionKey(parsed.sessionId), JSON.stringify(state)); } catch {}
            if (!cancelled) restoreSession(state);
            return;
          }
        }
      } catch {}
      // 没有 pendingSession 才兜底发起新 session
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
      const state = {
        sessionId, examSet,
        leftSeconds: TOTAL_SECONDS, messages: [], aiCount: 0,
        part1Answers: {}, repoUrl: "", notes: "",
        part1Submitted: false, part2Submitted: false,
        lockedQuestions: {}, questionTimerLeft: {},
        part1TimerLeft: PART1_LIMIT,
        part2TimerLeft: PART2_LIMIT, part2TimeLocked: false,
        finalSolution: "", integrityEvents: [],
      };
      try { localStorage.setItem(sessionKey(sessionId), JSON.stringify(state)); } catch {}
      restoreSession(state);
    }
    init();
    return () => { cancelled = true; };
  }, []);

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
    setQuestionTimerLeft(state.questionTimerLeft ?? {});
    setPart1TimerLeft(state.part1TimerLeft ?? PART1_LIMIT);
    setPart2TimerLeft(state.part2TimerLeft ?? PART2_LIMIT);
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
        submitPart("part1", { answers: part1AnswersRef.current, completedAt: Date.now(), autoSubmit: true, integrityEvents: integrityEventsRef.current }, "part2");
      } else if (activePart === "part2" && !part2Submitted) {
        submitPart("part2", { messages: messagesRef.current, aiCount: aiCountRef.current, finalSolution: finalSolutionRef.current, completedAt: Date.now(), autoSubmit: true }, "part3");
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftSeconds]);

  // 标签页切换检测
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

  const handleQuestionExpire = useCallback((questionId: string) => {
    setLockedQuestions(prev => { const next = { ...prev, [questionId]: true }; persistState({ lockedQuestions: next }); return next; });
  }, []);

  const handleQuestionTick = useCallback((questionId: string, left: number) => {
    setQuestionTimerLeft(prev => { const next = { ...prev, [questionId]: left }; persistState({ questionTimerLeft: next }); return next; });
  }, []);

  const handlePart1Tick = useCallback((left: number) => {
    setPart1TimerLeft(left);
    persistState({ part1TimerLeft: left });
  }, []);

  const handlePart1Expire = useCallback(() => {
    // 整体计时到期：触发自动提交
    if (!part1Submitted) {
      submitPart("part1", { answers: part1AnswersRef.current, completedAt: Date.now(), autoSubmit: true, integrityEvents: integrityEventsRef.current }, "part2");
    }
  }, [part1Submitted]);

  const handlePart2Expire = useCallback(() => {
    setPart2TimeLocked(true);
    persistState({ part2TimeLocked: true });
  }, []);

  const addIntegrityEvent = useCallback((evt: IntegrityEvent) => {
    setIntegrityEvents(prev => { const next = [...prev, evt]; persistState({ integrityEvents: next }); return next; });
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isTimeUp || aiLoading || part2TimeLocked) return;
    const userMsg: Message = { role: "user", content: input, time: Date.now() };
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
      const aiMsg: Message = { role: "assistant", content: d.content || "（无回复）", time: Date.now() };
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
        if (next) { setTimeout(() => { setSubmitStatus("idle"); setActivePart(next); }, 800); }
        else { try { localStorage.removeItem(sessionKey(sessionId)); } catch {} window.location.href = "/report?sessionId=" + sessionId; }
      } else { setSubmitStatus("error"); }
    } catch { setSubmitStatus("error"); }
  };

  // ─── 渲染第一部分 ───────────────────────────────────────────────────────────
  const renderPart1 = () => {
    if (!part1) return null;
    const pasteCount = integrityEvents.filter(e => e.type === "paste").length;
    const tabCount = integrityEvents.filter(e => e.type === "tab_switch").length;
    const fastCount = integrityEvents.filter(e => e.type === "fast_input").length;

    return (
      <div>
        <div style={S.sectionTitle}>第一部分：基础认知</div>
        <div style={S.sectionSub}>{part1.questions.length} 题 · 禁止使用 AI 工具 · 限时 30 分钟</div>
        {!part1Submitted && (
          <Part1Timer
            limitSeconds={PART1_LIMIT}
            savedLeft={part1TimerLeft}
            onExpire={handlePart1Expire}
            onTick={handlePart1Tick}
            locked={part1Submitted}
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
            注意顶部倒计时 · 30分钟内完成所有题目
          </span>
        </div>

        {part1.questions.map((q, idx) => {
          const isLocked = part1Submitted || !!lockedQuestions[q.id];
          if (q.type === "essay") currentEssayQId.current = q.id;

          return (
            <div key={q.id} style={{ ...S.card, borderColor: isLocked && !part1Submitted ? "#fde68a" : "#f0f0f0", background: isLocked && !part1Submitted ? "#fffbeb" : "#fff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <span style={S.badge(q.type === "multipleChoice" ? "blue" : "green")}>
                  {q.type === "multipleChoice" ? `选择题 ${idx + 1}` : "问答题"}
                </span>
                {q.difficulty && <span style={{ fontSize: "11px", color: "#aaa" }}>{q.difficulty}</span>}
                {isLocked && !part1Submitted && <span style={{ fontSize: "11px", color: "#b45309", fontWeight: 600, marginLeft: "auto" }}>🔒 已超时锁定</span>}
              </div>


              <div style={{ fontSize: "14px", fontWeight: 500, marginBottom: "16px", lineHeight: "1.6" }}>{q.question}</div>

              {q.type === "multipleChoice" && q.options?.map((opt, i) => (
                <label key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "10px 12px", border: `1px solid ${part1Answers[q.id] === i ? "#111" : "#e5e5e5"}`, borderRadius: "6px", marginBottom: "8px", cursor: isLocked ? "not-allowed" : "pointer", fontSize: "13px", background: part1Answers[q.id] === i ? "#f9f9f9" : "#fff", opacity: isLocked && part1Answers[q.id] !== i ? 0.5 : 1 }}>
                  <input type="radio" name={q.id} checked={part1Answers[q.id] === i} onChange={() => { if (isLocked) return; setPart1Answers(p => ({ ...p, [q.id]: i })); persistState({ part1Answers: { ...part1Answers, [q.id]: i } }); }} disabled={isLocked} />
                  <span style={{ flex: 1, whiteSpace: "normal", wordBreak: "break-word" }}>{opt}</span>
                </label>
              ))}

              {q.type === "essay" && (
                <textarea
                  style={{ ...S.textarea, background: isLocked ? "#fafafa" : "#fff", color: isLocked ? "#888" : "#111" }}
                  value={(part1Answers[q.id] as string) || ""}
                  onFocus={() => { currentEssayQId.current = q.id; }}
                  onPaste={() => {
                    if (!isLocked) addIntegrityEvent({ type: "paste", questionId: q.id, timestamp: Date.now() });
                  }}
                  onChange={e => {
                    if (isLocked) return;
                    const val = e.target.value;
                    const now = Date.now();
                    const prevLen = lastInputLen.current[q.id] ?? 0;
                    const prevTime = lastInputTime.current[q.id] ?? now;
                    const delta = val.length - prevLen;
                    const elapsed = now - prevTime;
                    if (delta > 20 && elapsed < 500) {
                      addIntegrityEvent({ type: "fast_input", questionId: q.id, timestamp: now, detail: `+${delta}字/${elapsed}ms` });
                    }
                    lastInputLen.current[q.id] = val.length;
                    lastInputTime.current[q.id] = now;
                    setPart1Answers(p => ({ ...p, [q.id]: val }));
                    persistState({ part1Answers: { ...part1Answers, [q.id]: val } });
                  }}
                  placeholder={isLocked ? "已超时锁定" : "请输入你的回答（建议 300-500 字）..."}
                  disabled={isLocked}
                />
              )}
            </div>
          );
        })}

        {!part1Submitted && (
          <>
            <div style={S.divider} />
            <button
              style={S.btnPrimary(submitStatus === "submitting")}
              onClick={() => submitPart("part1", { answers: part1Answers, completedAt: Date.now(), integrityEvents }, "part2")}
              disabled={submitStatus === "submitting"}
            >
              {submitStatus === "submitting" ? "提交中..." : "提交并进入第二部分 →"}
            </button>
          </>
        )}
      </div>
    );
  };

  // ─── 渲染第二部分 ───────────────────────────────────────────────────────────
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
        {/* 引导语 */}
        <div style={{ ...S.card, background: "#f8faff", borderColor: "#dbeafe" }}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#1d4ed8", marginBottom: "6px" }}>📌 本部分是开放协作任务，没有标准答案</div>
          <div style={{ fontSize: "13px", color: "#374151", lineHeight: "1.8" }}>
            你将借助系统内置 AI 助手完成以下任务。建议通过<strong>多轮对话</strong>来分析问题、拆解方案、反复打磨——<strong>我们关注你如何用 AI，而不只是最终写了什么。</strong>完成后将方案填写到下方「最终方案」区域并提交。
          </div>
        </div>

        <div style={S.card}>
          <div style={{ fontSize: "15px", fontWeight: 600, marginBottom: "8px" }}>{t.title}</div>
          <div style={{ fontSize: "13px", color: "#555", lineHeight: "1.7", marginBottom: "16px" }}>{t.description}</div>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>挑战与冲突</div>
          {t.conflicts.map((c, i) => (
            <div key={i} style={{ fontSize: "13px", color: "#555", padding: "6px 0", borderTop: i > 0 ? "1px solid #f5f5f5" : "none" }}>· {c}</div>
          ))}
          {t.deliverable && (
            <>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "16px", marginBottom: "8px" }}>产出目标</div>
              <div style={{ fontSize: "13px", color: "#555", padding: "8px 12px", background: "#fffbeb", borderRadius: "6px", border: "1px solid #fde68a", lineHeight: "1.7" }}>{t.deliverable}</div>
            </>
          )}
        </div>

        {/* 对话区 */}
        <div style={{ ...S.card, padding: "0" }}>
          <div style={{ padding: "12px 20px", borderBottom: "1px solid #f0f0f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontSize: "13px", fontWeight: 600 }}>AI 对话</span>
              {!part2Submitted && (
                <Part2Timer limitSeconds={PART2_LIMIT} savedLeft={part2TimerLeft} onExpire={handlePart2Expire} locked={part2TimeLocked} />
              )}
            </div>
            <div style={{ fontSize: "11px", color: aiCount >= MAX_AI_TURNS ? "#dc2626" : "#888", fontWeight: aiCount >= MAX_AI_TURNS ? 600 : 400 }}>
              {aiCount >= MAX_AI_TURNS
                ? "⚠️ 已达到最大交互次数（10次），无法继续提问"
                : `已使用 ${aiCount} / ${MAX_AI_TURNS} 次 · 剩余 ${MAX_AI_TURNS - aiCount} 次`}
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

        {/* 最终方案 */}
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

  // ─── 渲染第三部分 ───────────────────────────────────────────────────────────
  const renderPart3 = () => {
    if (!part3) return null;
    return (
      <div>
        <div style={S.sectionTitle}>第三部分：项目实战</div>
        <div style={S.sectionSub}>不限工具，提交可运行的项目仓库</div>
        <div style={S.card}>
          <div style={{ fontSize: "15px", fontWeight: 700, marginBottom: "16px" }}>{part3.task.title}</div>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>背景</div>
          <div style={{ fontSize: "13px", color: "#555", lineHeight: "1.7", marginBottom: "16px" }}>{part3.task.background}</div>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>要求</div>
          {part3.task.requirements.map((r, i) => <div key={i} style={{ fontSize: "13px", color: "#555", padding: "4px 0" }}>· {r}</div>)}
          <div style={{ ...S.divider, margin: "16px 0" }} />
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
          // part2 需要 part1 已提交；part3 需要 part2 已提交
          const isDisabled = (p === "part2" && !part1Submitted) || (p === "part3" && !part2Submitted);
          return (
            <button
              key={p}
              style={{ ...S.tab(activePart === p), opacity: isDisabled ? 0.35 : 1, cursor: isDisabled ? "not-allowed" : "pointer" }}
              onClick={() => { if (!isDisabled) setActivePart(p); }}
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
