export type RubricItem = {
  dimension: string; // 评分维度名称
  weight: number; // 权重（总和建议 100）
  whatGoodLooksLike: string; // 好的表现长什么样（给 LLM 评估用）
};

export type Task = {
  id: string;
  title: string;
  timeLimitMinutes: number;
  difficulty: "junior" | "mid" | "senior";
  tags: string[];
  background: string;
  requirements: string[];
  deliverables: string[];
  rubric: RubricItem[];
};

export const TASKS: Task[] = [
  {
    id: "task-ai-interview-mvp-01",
    title: "构建 AI 面试系统 MVP：出题 + AI 使用日志 + 提交入口 + 初评报告",
    timeLimitMinutes: 60,
    difficulty: "mid",
    tags: ["product", "prompt", "evaluation", "logging", "mvp"],
    background:
      "你正在开发一个用于面试 AI 产品经理的系统。候选人需要在规定时间内完成任务并提交，系统用于评估其 AI 协作与问题解决能力。",
    requirements: [
      "实现一个面试页：展示题目、倒计时、AI 对话区、提交入口（repo 链接 + 说明）。",
      "系统需要记录 AI 使用行为（至少记录 user/assistant 内容与时间戳）。",
      "产出一个初步评估报告页面：展示题目、AI 使用摘要、提交信息（可先占位结构）。",
    ],
    deliverables: [
      "可运行项目代码。",
      "README：说明你如何使用 AI、关键取舍、未完成项与原因、如何继续迭代。",
    ],
    rubric: [
      {
        dimension: "需求拆解与MVP取舍",
        weight: 25,
        whatGoodLooksLike:
          "能把模糊目标拆解为可交付的最小闭环；取舍合理；能解释为什么先做什么、后做什么。",
      },
      {
        dimension: "AI 协作能力（提示词与迭代）",
        weight: 25,
        whatGoodLooksLike:
          "提问具体、有约束；能多轮迭代改进；能识别 AI 输出风险并修正，而非盲拷贝。",
      },
      {
        dimension: "工程意识（结构、可维护性、边界处理）",
        weight: 25,
        whatGoodLooksLike:
          "结构清晰；错误处理基本到位；考虑扩展点（例如 session、题库、日志、评估模块分层）。",
      },
      {
        dimension: "表达与交付质量（README/说明）",
        weight: 25,
        whatGoodLooksLike:
          "README 清晰、诚实；能说明决策与权衡；交付物可运行、可复核。",
      },
    ],
  },
  {
    id: "task-rag-mvp-02",
    title: "设计一个 RAG 小工具：上传文档 → 检索问答 → 评估与防幻觉",
    timeLimitMinutes: 70,
    difficulty: "senior",
    tags: ["RAG", "evaluation", "product", "risk"],
    background:
      "你要做一个面向内部知识库的 RAG 工具 MVP。目标是能回答文档相关问题，并对答案给出引用与置信提示。",
    requirements: [
      "给出系统设计与数据流说明（可用文字）。",
      "说明如何做引用/溯源、如何降低幻觉、如何做最小评估。",
      "如果实现：可先做纯前端 demo + 伪接口，但要说清真实实现路径。",
    ],
    deliverables: ["方案说明（README 或页面说明）", "可选：代码实现/原型"],
    rubric: [
      {
        dimension: "RAG 流程完整性",
        weight: 30,
        whatGoodLooksLike:
          "清楚说明切分、向量化、检索、重排、生成、引用；能说清 trade-off。",
      },
      {
        dimension: "评估与风险控制",
        weight: 40,
        whatGoodLooksLike:
          "提出可落地评估方法（如命中率、引用一致性、人工抽检）；说明防幻觉策略。",
      },
      {
        dimension: "产品化思维",
        weight: 30,
        whatGoodLooksLike:
          "能定义 MVP、目标用户、边界场景、失败兜底与后续迭代。",
      },
    ],
  },
  {
    id: "task-debug-03",
    title: "AI 生成代码的 Debug：定位问题 → 修复 → 给出复盘与预防策略",
    timeLimitMinutes: 45,
    difficulty: "mid",
    tags: ["debug", "ai-collaboration", "engineering"],
    background:
      "你接手了一段 AI 生成的代码，功能大致正确但存在关键缺陷。你需要定位问题、修复并解释原因。",
    requirements: [
      "说明你如何排查（日志/复现/定位）。",
      "修复后给出复盘：问题根因、如何避免 AI 生成代码引入类似问题。",
    ],
    deliverables: ["修复后的代码", "复盘说明（README）"],
    rubric: [
      {
        dimension: "定位与验证能力",
        weight: 40,
        whatGoodLooksLike:
          "能快速定位问题、写出最小复现、验证修复有效。",
      },
      {
        dimension: "AI 输出的批判性使用",
        weight: 30,
        whatGoodLooksLike:
          "不盲信 AI；能审查、对照文档/日志；提出更稳的提示策略。",
      },
      {
        dimension: "复盘与工程化预防",
        weight: 30,
        whatGoodLooksLike:
          "能总结共性风险与预防机制（测试、lint、review checklist）。",
      },
    ],
  },
];

export function pickTask(taskId?: string) {
  if (taskId) {
    const t = TASKS.find((x) => x.id === taskId);
    if (t) return t;
  }
  // 默认随机选题
  return TASKS[Math.floor(Math.random() * TASKS.length)];
}
