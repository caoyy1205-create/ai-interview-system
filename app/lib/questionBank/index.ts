// 选择题题库（示例20道，后续扩充到200）
export const multipleChoicePool = [
  {
    id: "mc_001",
    question: "关于大模型的 Temperature 参数，以下说法正确的是：",
    options: [
      "Temperature 越高，输出越确定",
      "Temperature 越低，输出多样性越高", 
      "Temperature 越高，输出越随机/有创意",
      "Temperature 不影响输出质量"
    ],
    correctAnswer: 2,
    explanation: "Temperature 控制采样随机性，值越高输出越多样/有创意，值越低输出越确定/保守。",
    difficulty: "easy",
    topics: ["参数调优", "采样策略"]
  },
  {
    id: "mc_002", 
    question: "RAG（检索增强生成）的核心作用是：",
    options: [
      "提高模型训练速度",
      "让模型访问外部知识库，减少幻觉",
      "降低 API 调用成本",
      "增加模型参数量"
    ],
    correctAnswer: 1,
    explanation: "RAG 通过检索外部知识库为生成提供证据，减少模型编造事实（幻觉）。",
    difficulty: "easy",
    topics: ["RAG", "幻觉减少"]
  },
  // ... 更多题目
];

// 问答题题库（示例10道，后续扩充到50）
export const essayQuestionPool = [
  {
    id: "essay_001",
    question: "假设你要设计一个'AI 客服系统'的评估指标体系，请列出至少 5 个核心指标，并说明为什么选择这些指标。",
    evaluationPoints: [
      "是否涵盖准确性、效率、满意度等维度",
      "是否考虑业务场景差异",
      "是否有量化方法",
      "是否考虑负面指标（如升级率、投诉率）"
    ],
    difficulty: "medium",
    topics: ["评估指标", "产品设计"]
  },
  // ... 更多题目
];

// AI 协作题题库（示例10道，后续扩充到50）
export const collaborationTaskPool = [
  {
    id: "collab_001",
    title: "矛盾需求拆解",
    description: "公司要求设计'企业内部 AI 知识助手'，需求：成本极低（<500元/月）、准确率接近 100%、不允许存储用户数据、支持复杂推理、2 周内上线。",
    conflicts: [
      "成本 vs 准确率",
      "隐私 vs 功能", 
      "时间 vs 质量"
    ],
    evaluationFocus: [
      "是否识别出需求矛盾",
      "如何与 AI 协作澄清问题",
      "Prompt 迭代质量",
      "最终方案的可行性与取舍说明"
    ],
    timeLimitMinutes: 20
  },
  // ... 更多题目
];

// 项目题题库（示例10道，后续扩充到50）
export const projectTaskPool = [
  {
    id: "project_001",
    title: "购物车拯救者：游戏化清仓助手",
    description: "设计一个游戏化工具，帮助用户有趣地决策购物车商品的去留。",
    background: "用户购物车常堆积大量'犹豫商品'，既不想直接删除，又难以下单。需要让清仓过程变得有趣、有成就感。",
    requirements: [
      "展示购物车商品卡片（图片、名称、价格、加入时间）",
      "交互方式：'拯救'（保留）、'放生'（删除）、'犹豫'（暂留）",
      "游戏化进度条与徽章系统",
      "生成'购物车诊断报告'与可分享战绩图"
    ],
    deliverables: [
      "可运行的前端应用",
      "完整的 README 文档",
      "项目说明与设计思路"
    ],
    antiCheatMeasures: "要求解释游戏化规则设计原理、提供个性化推荐逻辑证据",
    difficulty: "hard",
    topics: ["电商", "游戏化设计", "用户决策"],
    timeLimitMinutes: 90,
    rubric: [
      { dimension: "问题理解", weight: 20, whatGoodLooksLike: "准确识别用户犹豫痛点，提出有效游戏化解决方案" },
      { dimension: "交互设计", weight: 25, whatGoodLooksLike: "界面直观，操作流畅，游戏化元素自然融入" },
      { dimension: "AI协作质量", weight: 25, whatGoodLooksLike: "有效引导AI生成创意方案，批判性优化输出" },
      { dimension: "工程实现", weight: 20, whatGoodLooksLike: "代码可运行，结构清晰，考虑边界情况" },
      { dimension: "README完整性", weight: 10, whatGoodLooksLike: "完整披露工具使用、AI生成部分、自主设计内容" }
    ]
  },
  // ... 更多题目
];

// ===== 随机选择函数 =====

export function getRandomMultipleChoice(count: number = 8) {
  return shuffleArray([...multipleChoicePool]).slice(0, count);
}

export function getRandomEssayQuestions(count: number = 2) {
  return shuffleArray([...essayQuestionPool]).slice(0, count);
}

export function getRandomCollaborationTasks(count: number = 2) {
  return shuffleArray([...collaborationTaskPool]).slice(0, count);
}

export function getRandomProjectTask(count: number = 1) {
  return shuffleArray([...projectTaskPool])[0];
}

// 辅助函数
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
