// ===== AI 面试题库 v2 =====
// 每月更新一次，当前版本：2026-03

// ===== 选择题（100道）=====
// 新选择题题库 v3 - 100道
// 约束：正确答案非最长选项，四选项字数差异<30%，干扰项有迷惑性
// 选择题题库 v4 - 100道
// 设计原则：正确答案用简短核心表达，干扰项更长但包含错误
// Agent相关：40道（topics含Agent/ReAct/工具调用等）
// 其他方向：60道，覆盖Prompt/RAG/模型能力/AI产品/AI安全/模型评估各10道
export const multipleChoicePool = [

  // ══════════════════════════════════════
  // Agent 方向（40道）
  // ══════════════════════════════════════

  {
    id: "mc_a01",
    question: "ReAct 框架中 'Thought' 步骤的作用是什么？",
    options: ["触发外部工具调用", "模型的推理过程，用于决定下一步动作", "记录用户的输入内容并格式化为JSON", "存储上一步工具调用的输出结果到内存中"],
    correctAnswer: 1,
    explanation: "Thought 是模型的内部推理，分析当前状态并决定下一步该做什么，不直接调用工具。",
    difficulty: "medium",
    topics: ["ReAct", "Agent框架"]
  },
  {
    id: "mc_a02",
    question: "AI Agent 与普通 LLM 调用的核心区别是？",
    options: ["模型参数量更大", "能自主循环执行多步骤", "界面更美观响应更快", "每次请求消耗更少token数量"],
    correctAnswer: 1,
    explanation: "Agent 能感知环境、决策、执行工具并循环直到完成目标，普通 LLM 只做单次问答。",
    difficulty: "easy",
    topics: ["Agent基础", "自主规划"]
  },
  {
    id: "mc_a03",
    question: "Function Calling 让 LLM 能做到什么？",
    options: ["直接访问互联网", "结构化调用外部工具", "修改自身权重参数", "执行任意系统级命令不受限制"],
    correctAnswer: 1,
    explanation: "Function Calling 输出结构化的工具调用参数，由外部代码执行后将结果返回给模型。",
    difficulty: "easy",
    topics: ["工具调用", "Function Calling"]
  },
  {
    id: "mc_a04",
    question: "Agent 的 Memory 模块核心功能是？",
    options: ["提高模型推理速度", "跨步骤保存状态与历史", "替代知识库存储全量数据", "自动压缩所有对话历史并上传到云端"],
    correctAnswer: 1,
    explanation: "Memory 让 Agent 在多步任务中保留中间状态、工具输出和对话历史，支持连续决策。",
    difficulty: "medium",
    topics: ["Agent记忆", "状态管理"]
  },
  {
    id: "mc_a05",
    question: "Multi-agent 系统最适合解决什么问题？",
    options: ["简单问答加速响应", "复杂任务并行分工协作", "降低单次API调用的成本费用", "减少模型在推理时所需的显存占用"],
    correctAnswer: 1,
    explanation: "多 Agent 通过任务分解和专业化分工，解决单 Agent 难以处理的复杂并行任务。",
    difficulty: "medium",
    topics: ["多Agent架构", "并行工具调用"]
  },
  {
    id: "mc_a06",
    question: "Orchestrator-Worker 架构中 Orchestrator 负责什么？",
    options: ["直接执行工具调用", "协调分配任务给子Agent", "存储所有执行结果到数据库中", "对用户输入做语法检查和格式验证"],
    correctAnswer: 1,
    explanation: "Orchestrator 负责任务分解和分配，Worker 负责具体执行，形成分层协作架构。",
    difficulty: "hard",
    topics: ["多Agent架构", "Orchestrator"]
  },
  {
    id: "mc_a07",
    question: "Agent 设计中 'guardrails' 的作用是？",
    options: ["加速Agent执行速度", "限制行为范围防止越权", "增加Agent可调用的工具数量上限", "帮助Agent自动学习用户的使用习惯"],
    correctAnswer: 1,
    explanation: "护栏约束 Agent 的行为边界，如禁止删除操作、限制访问范围，保障系统安全。",
    difficulty: "medium",
    topics: ["Agent安全", "安全执行"]
  },
  {
    id: "mc_a08",
    question: "Tool schema 在工具调用中的作用是？",
    options: ["加密工具的API密钥", "描述工具名称和参数供模型调用", "记录工具的历史调用日志信息", "限制工具每秒钟的最大调用频率（不影响"],
    correctAnswer: 1,
    explanation: "Tool schema 是工具的接口文档，模型根据 schema 生成正确格式的调用参数。",
    difficulty: "medium",
    topics: ["工具调用", "工具选择"]
  },
  {
    id: "mc_a09",
    question: "Agent 执行长任务时最常见的失败模式是？",
    options: ["API密钥失效", "推理链偏离目标陷入循环", "工具调用返回格式错误导致崩溃", "用户在任务执行中途主动取消了请求"],
    correctAnswer: 1,
    explanation: "长任务中 Agent 容易积累错误、偏离原始目标或陷入无意义的重复循环。",
    difficulty: "medium",
    topics: ["Agent局限", "错误处理"]
  },
  {
    id: "mc_a10",
    question: "Human-in-the-loop 模式的核心目的是？",
    options: ["让人类执行所有操作", "在关键节点引入人工确认", "减少Agent需要做出的决策次数", "让用户实时查看Agent的全部内部状态"],
    correctAnswer: 1,
    explanation: "在高风险或不确定步骤引入人工审批，平衡自动化效率与操作安全性。",
    difficulty: "medium",
    topics: ["人机协作", "Human-in-the-Loop"]
  },
  {
    id: "mc_a11",
    question: "Agent 进行代码执行时最重要的安全考量是？",
    options: ["代码的运行速度", "沙箱隔离防止危险命令", "代码注释是否完整规范", "选择何种编程语言来执行代码"],
    correctAnswer: 1,
    explanation: "Agent 生成的代码必须在受控沙箱运行，防止越权访问文件系统或执行危险命令。",
    difficulty: "medium",
    topics: ["代码执行", "安全沙箱"]
  },
  {
    id: "mc_a12",
    question: "Agentic 系统中幂等性设计的意义是？",
    options: ["让Agent每次给出不同答案", "重复执行不产生额外副作用", "让工具调用速度倍增提升效率", "减少Agent在执行期间的内存占用"],
    correctAnswer: 1,
    explanation: "幂等设计确保网络重试或重复执行时不会造成数据重复写入、重复支付等问题。",
    difficulty: "hard",
    topics: ["系统设计", "幂等性"]
  },
  {
    id: "mc_a13",
    question: "Agent Planning（规划）能力主要解决什么问题？",
    options: ["减少模型推理时间", "将目标分解为有序步骤", "自动生成用户界面布局", "压缩对话历史至更少的token数量"],
    correctAnswer: 1,
    explanation: "规划让 Agent 在行动前制定方案，避免盲目执行导致资源浪费和错误积累。",
    difficulty: "medium",
    topics: ["规划能力", "任务分解"]
  },
  {
    id: "mc_a14",
    question: "以下哪种任务最适合 Single Agent 处理？",
    options: ["需要多个领域专家协作的任务", "流程清晰的单链条任务", "需要同时并行处理多个独立子任务", "任务规模远超单模型上下文窗口限制"],
    correctAnswer: 1,
    explanation: "单链条、可控复杂度的任务用单 Agent 更高效，多 Agent 会引入不必要的协调开销。",
    difficulty: "medium",
    topics: ["架构选择", "单Agent"]
  },
  {
    id: "mc_a15",
    question: "Agent 的 Observation 步骤在 ReAct 中指的是？",
    options: ["Agent向用户提问", "获取工具执行的返回结果", "模型输出最终答案给用户", "用户对Agent回答进行满意度评分"],
    correctAnswer: 1,
    explanation: "Observation 将工具调用的实际执行结果返回给模型，作为下一步推理的输入。",
    difficulty: "medium",
    topics: ["ReAct", "Agent循环"]
  },
  {
    id: "mc_a16",
    question: "以下哪种工具最适合 Agent 获取实时数据？",
    options: ["静态知识库查询", "实时API或Web搜索", "本地文件系统读取", "历史对话记录的检索回放（不影响"],
    correctAnswer: 1,
    explanation: "实时数据需通过搜索引擎或实时 API 获取，静态知识库无法覆盖最新信息。",
    difficulty: "easy",
    topics: ["工具选择", "实时数据"]
  },
  {
    id: "mc_a17",
    question: "Agent 系统中 'self-reflection'（自我反思）的作用是？",
    options: ["让Agent展示自我意识", "检查输出并修正错误后重试", "增加Agent对话的趣味性内容", "让Agent自动向用户道歉并请求帮助"],
    correctAnswer: 1,
    explanation: "自我反思让 Agent 在行动后评估结果是否符合目标，不符合则调整策略重试。",
    difficulty: "hard",
    topics: ["自我反思", "错误处理"]
  },
  {
    id: "mc_a18",
    question: "Agent 可观测性（Observability）主要包含什么？",
    options: ["用户界面的可视化设计", "追踪推理链路和工具调用日志", "监控服务器CPU和内存使用率", "记录每个用户的操作行为和偏好"],
    correctAnswer: 1,
    explanation: "可观测性包括推理链追踪、工具调用记录、中间状态日志，用于调试和性能优化。",
    difficulty: "medium",
    topics: ["可观测性", "Agent评估"]
  },
  {
    id: "mc_a19",
    question: "以下哪种场景最体现 Agent 相比普通 RAG 的优势？",
    options: ["简单文档问答", "需要多轮搜索并汇总的复杂研究", "单次知识库检索返回结果", "静态内容的格式化转换处理（不影响核心"],
    correctAnswer: 1,
    explanation: "复杂研究需要多轮迭代、中间决策和不同工具组合，这正是 Agent 循环规划的优势所在。",
    difficulty: "medium",
    topics: ["Agent能力", "Agent产品"]
  },
  {
    id: "mc_a20",
    question: "Agent 中 'tool use'（工具使用）的关键设计原则是？",
    options: ["工具越多越好", "工具职责单一边界清晰", "所有工具应共享同一个接口格式", "工具应该能够自主修改系统的核心配置"],
    correctAnswer: 1,
    explanation: "每个工具应有清晰的职责边界，避免功能重叠，便于模型准确选择合适的工具。",
    difficulty: "medium",
    topics: ["工具调用", "工具选择"]
  },
  {
    id: "mc_a21",
    question: "以下哪个指标最适合评估 Agent 的任务完成能力？",
    options: ["对话轮次数量", "任务成功率（Task Success Rate）", "每次工具调用的平均耗时", "Agent在每轮输出的平均token数量（不影响核心结论"],
    correctAnswer: 1,
    explanation: "任务成功率直接衡量 Agent 能否完成目标任务，是最核心的能力评估指标。",
    difficulty: "medium",
    topics: ["Agent评估", "可观测性"]
  },
  {
    id: "mc_a22",
    question: "长期记忆（Long-term memory）在 Agent 中通常如何实现？",
    options: ["扩大上下文窗口", "写入外部存储并检索", "增加模型参数量", "在系统提示中硬编码所有历史信息"],
    correctAnswer: 1,
    explanation: "长期记忆通过向量数据库或键值存储持久化，需要时检索注入上下文，突破窗口限制。",
    difficulty: "medium",
    topics: ["Agent记忆", "状态管理"]
  },
  {
    id: "mc_a23",
    question: "Agent 中 'context window management' 的核心挑战是？",
    options: ["窗口尺寸影响模型价格", "随步骤增加内容超出上限", "窗口内容需要加密存储", "每轮对话都需要重新初始化窗口"],
    correctAnswer: 1,
    explanation: "多步执行中工具输出不断积累，需要摘要压缩或滑动窗口等策略防止超出限制。",
    difficulty: "medium",
    topics: ["上下文管理", "Agent框架"]
  },
  {
    id: "mc_a24",
    question: "以下哪种方法最能提升 Agent 的工具选择准确性？",
    options: ["增加工具总数量", "提供清晰的工具描述和使用示例", "让模型随机尝试所有工具", "减少系统提示的长度来节省token"],
    correctAnswer: 1,
    explanation: "清晰的工具描述和示例帮助模型理解每个工具的适用场景，减少错误调用。",
    difficulty: "medium",
    topics: ["工具调用", "工具选择"]
  },
  {
    id: "mc_a25",
    question: "Agent 的 'parallel tool calling'（并行工具调用）的优势是？",
    options: ["降低工具调用的错误率", "同时执行独立工具节省时间", "让每个工具获得更多计算资源", "避免工具之间产生数据依赖冲突"],
    correctAnswer: 1,
    explanation: "对无依赖关系的工具并行调用，可大幅缩短总执行时间，提升 Agent 效率。",
    difficulty: "medium",
    topics: ["并行工具调用", "效率优化"]
  },
  {
    id: "mc_a26",
    question: "在 Agent 产品设计中 'escalation'（升级）机制是指？",
    options: ["提升Agent的模型规模", "在Agent无法处理时转人工", "扩大Agent的工具调用权限范围", "让Agent主动向用户推销更高级的服务"],
    correctAnswer: 1,
    explanation: "升级机制确保 Agent 遇到超出能力的情况时平滑转接人工，保障用户体验。",
    difficulty: "medium",
    topics: ["Agent产品", "人机协作"]
  },
  {
    id: "mc_a27",
    question: "Skill（技能）在 Agent 系统中通常指什么？",
    options: ["模型的微调数据", "封装特定能力的可复用工具模块", "Agent的系统提示模板文件", "用于评估Agent的标准化测试集合"],
    correctAnswer: 1,
    explanation: "Skill 是封装了特定能力（如发邮件、查日历）的可复用模块，Agent 按需调用。",
    difficulty: "medium",
    topics: ["工具调用", "Agent能力"]
  },
  {
    id: "mc_a28",
    question: "以下哪种场景最需要 Agent 具备 'error recovery'（错误恢复）能力？",
    options: ["简单问答任务", "多步骤自动化流程", "单次文本生成任务", "固定模板的内容格式化处理"],
    correctAnswer: 1,
    explanation: "多步骤自动化中任何一步失败都可能导致整体失败，错误恢复能力至关重要。",
    difficulty: "medium",
    topics: ["错误处理", "Agent框架"]
  },
  {
    id: "mc_a29",
    question: "Agent 与 Copilot 的主要区别是？",
    options: ["使用的模型不同", "Agent自主执行，Copilot辅助人决策", "Copilot比Agent消耗更少的API费用", "Agent只能处理代码而Copilot处理文本"],
    correctAnswer: 1,
    explanation: "Agent 自主决策并执行行动，Copilot 提供建议但最终决策仍由人类做出。",
    difficulty: "easy",
    topics: ["Agent基础", "Agent产品"]
  },
  {
    id: "mc_a30",
    question: "以下哪种工具组合让 Agent 具备完整的信息处理能力？",
    options: ["搜索工具", "搜索+计算+记忆+代码执行", "搜索+文本生成", "代码执行+数据库读取工具（不影响核"],
    correctAnswer: 1,
    explanation: "完整的信息处理需要实时检索、精确计算、状态记忆和代码执行的综合工具支持。",
    difficulty: "medium",
    topics: ["工具选择", "Agent能力"]
  },
  {
    id: "mc_a31",
    question: "以下哪种行为最能体现 Agent 的'自主性'？",
    options: ["自动补全用户输入", "独立判断下一步并执行", "提供多个选项供用户选择", "根据预定脚本按顺序执行固定步骤"],
    correctAnswer: 1,
    explanation: "自主性的核心是 Agent 能根据环境状态独立做出决策并执行，而非被动响应。",
    difficulty: "easy",
    topics: ["自主性设计", "Agent基础"]
  },
  {
    id: "mc_a32",
    question: "在多 Agent 系统中，消息路由（Message Routing）的主要作用是？",
    options: ["加密Agent间通信", "将任务分发给合适的Agent", "记录所有消息日志供审计", "限制Agent之间的通信频率上限"],
    correctAnswer: 1,
    explanation: "消息路由根据任务类型或内容将请求分发到最合适的专业 Agent 处理。",
    difficulty: "medium",
    topics: ["消息路由", "多Agent架构"]
  },
  {
    id: "mc_a33",
    question: "Agent 系统中'幻觉级联'（Hallucination Cascade）指的是？",
    options: ["模型在多个任务中都表现良好", "一步的幻觉被后续步骤放大传递", "Agent调用工具时产生的随机错误", "多个Agent同时产生相同幻觉的情况"],
    correctAnswer: 1,
    explanation: "多步 Agent 中，前一步的幻觉输出作为后一步的输入，错误会逐步放大最终失控。",
    difficulty: "hard",
    topics: ["幻觉级联", "Agent局限"]
  },
  {
    id: "mc_a34",
    question: "触发词设计（Trigger Word Design）在 Agent 系统中的作用是？",
    options: ["防止用户滥用Agent", "让Agent识别何时调用特定Skill", "加密Agent的系统提示内容（不影响核心结论）", "限制用户可以输入的词汇范围"],
    correctAnswer: 1,
    explanation: "触发词帮助 Agent 或路由层识别用户意图，决定激活哪个 Skill 或工具。",
    difficulty: "medium",
    topics: ["触发词设计", "Skill路由"]
  },
  {
    id: "mc_a35",
    question: "以下哪个设计能最有效防止 Agent 执行破坏性不可逆操作？",
    options: ["增加系统提示的长度", "执行前需人工确认的审批流程", "使用更大参数量的底层模型", "记录所有操作日志以便事后追溯"],
    correctAnswer: 1,
    explanation: "不可逆操作（如删除数据）执行前引入人工确认是防止 Agent 误操作的最有效手段。",
    difficulty: "medium",
    topics: ["Human-in-the-Loop", "安全执行"]
  },
  {
    id: "mc_a36",
    question: "Agent 系统中的'工具链'（Tool Chain）是指？",
    options: ["工具的安全调用权限", "多个工具按顺序协作完成任务", "工具的版本管理系统", "记录工具调用历史的数据结构（不影响"],
    correctAnswer: 1,
    explanation: "工具链是多个工具按依赖顺序串联，前一工具的输出作为后一工具的输入。",
    difficulty: "medium",
    topics: ["工具链", "工具调用"]
  },
  {
    id: "mc_a37",
    question: "Agentic Loop（智能体循环）的终止条件通常是？",
    options: ["固定执行10步后停止", "达成目标或超出最大步数限制", "用户发送停止命令才会终止", "工具调用失败超过3次后自动停止"],
    correctAnswer: 1,
    explanation: "循环在完成目标时正常终止，或在超出预设最大步数（防无限循环）时强制中断。",
    difficulty: "medium",
    topics: ["Agentic Loop", "Agent框架"]
  },
  {
    id: "mc_a38",
    question: "以下哪种方法最能减少 Agent 的 token 消耗？",
    options: ["增加系统提示的详细程度", "压缩中间步骤只保留关键信息", "关闭所有工具调用功能", "让Agent每步都请求用户确认"],
    correctAnswer: 1,
    explanation: "对中间推理和工具输出做摘要压缩，保留关键信息舍弃冗余，是降低 token 消耗的核心方法。",
    difficulty: "medium",
    topics: ["上下文管理", "效率优化"]
  },
  {
    id: "mc_a39",
    question: "以下哪种场景 Agent 相比人工有明显优势？",
    options: ["需要情感判断的复杂对话", "24小时高频率重复性操作", "需要创造性突破的产品设计", "需要法律责任归属的重要决策"],
    correctAnswer: 1,
    explanation: "高频率、重复性、规则明确的操作是 Agent 的最佳场景，人工效率低且易出错。",
    difficulty: "easy",
    topics: ["Agent产品", "自主性设计"]
  },
  {
    id: "mc_a40",
    question: "以下哪个描述最准确地定义了 AI Agent？",
    options: ["能回答问题的聊天机器人", "感知环境并自主行动以达成目标的系统", "只能执行预编程脚本的自动化工具（不影响核心", "内置了联网功能的大型语言模型"],
    correctAnswer: 1,
    explanation: "Agent 的本质是感知-决策-行动的循环系统，具备自主性和目标导向性。",
    difficulty: "easy",
    topics: ["Agent基础", "Agent能力"]
  },

  // ══════════════════════════════════════
  // Prompt 工程（10道）
  // ══════════════════════════════════════

  {
    id: "mc_p01",
    question: "Temperature=0 时模型输出特征是？",
    options: ["完全随机输出", "趋于确定的最高概率token", "拒绝所有请求", "输出长度变为零字符（不影响核心结论）"],
    correctAnswer: 1,
    explanation: "Temperature=0 做贪心解码，每次选概率最高的 token，结果趋于固定可复现。",
    difficulty: "easy",
    topics: ["参数调优", "Prompt工程"]
  },
  {
    id: "mc_p02",
    question: "Chain-of-Thought 相比 Standard Prompt 的最大优势是？",
    options: ["减少token消耗", "提升推理任务准确率", "让输出更简短精炼", "降低API调用延迟时间"],
    correctAnswer: 1,
    explanation: "CoT 让模型逐步展示推理过程，显著提升复杂推理和数学类任务的准确率。",
    difficulty: "easy",
    topics: ["CoT", "Prompt工程"]
  },
  {
    id: "mc_p03",
    question: "Prompt 中出现指令冲突时，模型通常怎么处理？",
    options: ["报错并拒绝执行", "优先遵循后出现的指令或折中", "随机选择一条指令", "忽略所有指令只输出空内容（不影响核"],
    correctAnswer: 1,
    explanation: "模型通常优先遵循更靠后的指令，或尝试折中处理，不同模型行为略有差异。",
    difficulty: "medium",
    topics: ["Prompt设计", "Prompt工程"]
  },
  {
    id: "mc_p04",
    question: "以下哪种方式最能减少模型对 Prompt 的歧义理解？",
    options: ["使用简短模糊的描述", "提供格式示例和约束条件", "让模型自由发挥输出", "大量修饰词增加描述丰富度"],
    correctAnswer: 1,
    explanation: "明确格式要求、示例和约束能有效减少模型的多种解读可能性，输出更可控。",
    difficulty: "easy",
    topics: ["Prompt设计", "Prompt工程"]
  },
  {
    id: "mc_p05",
    question: "Prompt Injection 攻击的本质是？",
    options: ["注入恶意代码到服务器", "构造输入让模型忽略原有指令", "暴力破解API密钥", "向模型输入超长文本导致崩溃（不影响"],
    correctAnswer: 1,
    explanation: "Prompt injection 通过精心构造的输入，覆盖或绕过 system prompt 中的安全指令。",
    difficulty: "medium",
    topics: ["安全", "Prompt工程"]
  },
  {
    id: "mc_p06",
    question: "以下哪种 Prompt 技巧最适合复杂多步推理？",
    options: ["Zero-shot直接询问", "让模型先列假设再逐步推导", "要求模型直接给最终答案", "增加无关背景信息"],
    correctAnswer: 1,
    explanation: "显式要求列举前提和逐步推导，可减少跳步导致的逻辑错误，提升推理质量。",
    difficulty: "medium",
    topics: ["推理", "Prompt工程"]
  },
  {
    id: "mc_p07",
    question: "强制模型输出合法 JSON 最可靠的方法是？",
    options: ["在Prompt中说请输出JSON（不影响核心结", "使用response_format参数", "增大temperature参数值", "减少max_tokens参数限制"],
    correctAnswer: 1,
    explanation: "response_format 参数在底层强制保证输出合法 JSON，比仅靠 Prompt 指令更可靠。",
    difficulty: "medium",
    topics: ["输出格式", "Prompt工程"]
  },
  {
    id: "mc_p08",
    question: "Few-shot 示例质量不高时最可能导致什么？",
    options: ["模型完全无法运行", "模型学到错误输出模式质量下降", "模型自动忽略所有示例（不影响核心结论", "模型输出速度明显加快"],
    correctAnswer: 1,
    explanation: "低质量示例会误导模型学习错误格式或答案，有时反而比 Zero-shot 效果更差。",
    difficulty: "medium",
    topics: ["Few-shot", "Prompt工程"]
  },
  {
    id: "mc_p09",
    question: "Negative Prompting（负面提示）的主要用途是？",
    options: ["让模型输出负面情绪（不影响核心结", "明确告知模型不应该做什么", "降低模型回复质量", "减少输出长度"],
    correctAnswer: 1,
    explanation: "通过明确禁止行为来约束模型输出，如'不要提供医疗建议''不要使用专业术语'。",
    difficulty: "medium",
    topics: ["Prompt设计", "Prompt工程"]
  },
  {
    id: "mc_p10",
    question: "Self-consistency 技术的核心思路是？",
    options: ["让模型只回答一次", "多次采样后取多数投票结果", "让多个不同模型同时回答（不影响核", "检查模型语法错误后修正"],
    correctAnswer: 1,
    explanation: "Self-consistency 多次用 CoT 采样，取多数一致的答案，显著提升推理准确率。",
    difficulty: "hard",
    topics: ["Self-consistency", "Prompt工程"]
  },

  // ══════════════════════════════════════
  // RAG（10道）
  // ══════════════════════════════════════

  {
    id: "mc_r01",
    question: "RAG 系统减少幻觉的核心机制是？",
    options: ["微调模型参数", "将外部知识注入Prompt供模型参考", "增加模型参数规模", "让模型自动爬取互联网内容（不影响核心结论）"],
    correctAnswer: 1,
    explanation: "RAG 检索相关文档注入 Prompt，让模型基于事实回答，而非完全依赖参数记忆。",
    difficulty: "easy",
    topics: ["RAG基础", "RAG"]
  },
  {
    id: "mc_r02",
    question: "向量数据库在 RAG 中的核心作用是？",
    options: ["存储模型权重", "支持语义相似度快速检索", "替代关系型数据库", "训练Embedding模型"],
    correctAnswer: 1,
    explanation: "向量数据库将文档转为向量，支持高效相似度搜索，是 RAG 的核心检索组件。",
    difficulty: "easy",
    topics: ["向量数据库", "RAG"]
  },
  {
    id: "mc_r03",
    question: "Chunk size 过大会导致 RAG 出现什么问题？",
    options: ["检索速度加快", "召回内容含过多无关信息", "减少存储空间占用", "Embedding模型无法正常工作"],
    correctAnswer: 1,
    explanation: "chunk 过大会让每块包含多个话题，检索时引入噪音，模型难以聚焦关键信息。",
    difficulty: "medium",
    topics: ["分块策略", "RAG"]
  },
  {
    id: "mc_r04",
    question: "Hybrid Search（混合搜索）结合了哪两种检索方式？",
    options: ["多个向量库结果", "语义向量和关键词精确匹配", "多种嵌入模型输出", "向量检索和图数据库（不影响核心结"],
    correctAnswer: 1,
    explanation: "混合搜索结合语义相似度（dense）和 BM25 关键词匹配（sparse），互补提升召回质量。",
    difficulty: "medium",
    topics: ["检索策略", "RAG"]
  },
  {
    id: "mc_r05",
    question: "Re-ranking 在 RAG 中的作用是？",
    options: ["重新建立文档索引（不影响核心结论）", "对粗召回结果精细打分提升精度", "加快向量检索速度", "减少文档分块数量"],
    correctAnswer: 1,
    explanation: "Re-ranker 对粗检索候选文档精确打分，筛选出质量更高的内容传给生成模型。",
    difficulty: "hard",
    topics: ["Re-ranking", "RAG"]
  },
  {
    id: "mc_r06",
    question: "RAG 中 'context stuffing' 过多会造成什么后果？",
    options: ["模型回答速度加快", "关键信息被稀释准确率下降", "提高检索召回率", "触发向量数据库更新（不影响核心结"],
    correctAnswer: 1,
    explanation: "塞入过多检索结果会出现'lost in the middle'，模型难以聚焦正确答案，准确率下降。",
    difficulty: "hard",
    topics: ["RAG优化", "RAG"]
  },
  {
    id: "mc_r07",
    question: "RAG 评估中 'faithfulness' 衡量的是？",
    options: ["模型回答速度", "生成内容是否基于检索文档", "向量检索准确率（不影响核心结论）", "用户满意度评分"],
    correctAnswer: 1,
    explanation: "faithfulness 衡量模型输出是否有文档依据，高分说明模型没有凭空编造内容。",
    difficulty: "hard",
    topics: ["RAG评估", "RAG"]
  },
  {
    id: "mc_r08",
    question: "知识库文档更新后 RAG 系统最需要做什么？",
    options: ["重新训练生成模型", "更新向量索引保持检索准确", "重新设计Prompt模板（不影响", "更换向量数据库类型"],
    correctAnswer: 1,
    explanation: "文档更新后需重新嵌入并更新索引，否则检索到旧版内容，影响回答时效性。",
    difficulty: "medium",
    topics: ["知识更新", "RAG"]
  },
  {
    id: "mc_r09",
    question: "Query Expansion（查询扩展）主要解决什么问题？",
    options: ["减少向量库存储占用", "弥补查询词与文档词汇的差异", "加快模型生成速度", "降低Embedding成本（不影响"],
    correctAnswer: 1,
    explanation: "用户查询词与文档用词不一致时，通过扩展同义词或多查询变体来提升召回率。",
    difficulty: "hard",
    topics: ["查询优化", "RAG"]
  },
  {
    id: "mc_r10",
    question: "Parent Document Retriever 策略的核心思想是？",
    options: ["用父类模型替代标准模型（不影响核心", "检索小块但将父文档传给模型", "只索引文档的父级目录", "将多个小块合并成大块"],
    correctAnswer: 1,
    explanation: "小块便于精准检索，大块提供完整上下文，Parent Retriever 兼顾精准度和完整性。",
    difficulty: "hard",
    topics: ["检索策略", "RAG"]
  },

  // ══════════════════════════════════════
  // 大模型能力边界（10道）
  // ══════════════════════════════════════

  {
    id: "mc_m01",
    question: "大模型 knowledge cutoff 意味着什么？",
    options: ["模型只处理短文本", "训练截止后的事件模型不了解", "模型无法回答专业问题（不影响核心结", "模型每次回答都不同"],
    correctAnswer: 1,
    explanation: "知识截止日期后发生的事件不在训练数据中，模型无法可靠回答，需 RAG 或工具补充。",
    difficulty: "easy",
    topics: ["模型局限", "大模型能力边界"]
  },
  {
    id: "mc_m02",
    question: "大模型天然表现最差的任务类型是？",
    options: ["文本摘要", "精确数值计算", "创意写作", "多语言翻译（不影响核"],
    correctAnswer: 1,
    explanation: "LLM 是概率模型，不擅长精确计算，需借助 code interpreter 或计算器工具。",
    difficulty: "easy",
    topics: ["模型局限", "大模型能力边界"]
  },
  {
    id: "mc_m03",
    question: "'涌现能力'（Emergent Abilities）的特点是？",
    options: ["在小模型上充分展现", "规模达到阈值后突然出现", "通过微调获得", "只在特定语言任务中表现（不影响"],
    correctAnswer: 1,
    explanation: "涌现能力是在模型规模达到一定量级后突然具备的新能力，小模型几乎不存在。",
    difficulty: "medium",
    topics: ["涌现能力", "大模型能力边界"]
  },
  {
    id: "mc_m04",
    question: "大模型 'positional bias' 偏差是指？",
    options: ["模型偏向某种政治立场", "对输入列表特定位置内容权重过高", "模型只关注正面内容", "模型偏好处理更长的文本（不影响核心结论"],
    correctAnswer: 1,
    explanation: "模型倾向关注列表的首尾位置内容，中间内容容易被忽视（lost in the middle）。",
    difficulty: "hard",
    topics: ["模型偏差", "大模型能力边界"]
  },
  {
    id: "mc_m05",
    question: "RLHF 的目标是？",
    options: ["加速模型训练", "让输出更符合人类偏好", "减少模型参数量（不影响核心结", "提升数学能力"],
    correctAnswer: 1,
    explanation: "RLHF 通过人类偏好数据训练奖励模型，再用强化学习引导 LLM 向人类偏好对齐。",
    difficulty: "medium",
    topics: ["RLHF", "大模型能力边界"]
  },
  {
    id: "mc_m06",
    question: "'Needle in a Haystack' 问题描述的是？",
    options: ["文档含敏感信息", "超长文本中模型难以利用关键细节", "文档格式不兼容", "模型处理时间过长（不影响核心结论）"],
    correctAnswer: 1,
    explanation: "在极长上下文中，模型倾向忽视中间的关键信息，无法有效检索'针'（关键细节）。",
    difficulty: "hard",
    topics: ["长上下文", "大模型能力边界"]
  },
  {
    id: "mc_m07",
    question: "大模型 'sycophancy'（奉承）问题是指？",
    options: ["模型输出过于简短", "模型迎合用户观点而非客观正确", "模型回答速度过慢", "模型拒绝回答争议问题（不影响核心结论"],
    correctAnswer: 1,
    explanation: "RLHF 训练可能导致模型学会迎合而非纠正用户，影响回答的客观准确性。",
    difficulty: "medium",
    topics: ["模型偏差", "大模型能力边界"]
  },
  {
    id: "mc_m08",
    question: "量化（Quantization）对模型的主要影响是？",
    options: ["提升数学任务能力（不影响核心结", "减少内存占用和推理延迟", "增加训练数据量", "提高输出多样性"],
    correctAnswer: 1,
    explanation: "量化将权重从 FP32 压缩到 INT8/INT4，显著减少显存需求，加快推理速度。",
    difficulty: "medium",
    topics: ["量化", "大模型能力边界"]
  },
  {
    id: "mc_m09",
    question: "Multimodal LLM 相比纯文本模型的核心扩展是？",
    options: ["支持更多编程语言（不影响核心结论）", "能理解和处理图像音频等非文本", "参数量翻倍", "支持更长的上下文"],
    correctAnswer: 1,
    explanation: "多模态模型通过统一编码器处理图文音视频，实现跨模态理解和生成。",
    difficulty: "easy",
    topics: ["多模态", "大模型能力边界"]
  },
  {
    id: "mc_m10",
    question: "减少大模型幻觉最有效的方法是？",
    options: ["增大temperature参数", "引入知识检索并要求给出来源", "减少Prompt长度", "提高模型推理温度"],
    correctAnswer: 1,
    explanation: "RAG+引用要求让模型基于可验证来源作答，比单纯依赖参数记忆更能减少幻觉。",
    difficulty: "medium",
    topics: ["幻觉", "大模型能力边界"]
  },

  // ══════════════════════════════════════
  // AI 产品设计（10道）
  // ══════════════════════════════════════

  {
    id: "mc_d01",
    question: "'Graceful degradation'（优雅降级）在 AI 产品中指的是？",
    options: ["逐步减少功能", "AI不足时回退到可靠备选方案", "降低产品视觉质量（不影响核心结论）", "减少AI响应频率"],
    correctAnswer: 1,
    explanation: "优雅降级确保 AI 失败时产品仍可用，如超时时显示缓存答案或提示人工介入。",
    difficulty: "medium",
    topics: ["产品设计", "AI产品设计"]
  },
  {
    id: "mc_d02",
    question: "最需要在 AI 产品中加入人工审核的场景是？",
    options: ["生成表情包", "影响用户权益的高风险决策", "自动补全搜索词", "生成产品描述文案（不影响核心结论"],
    correctAnswer: 1,
    explanation: "高风险决策涉及用户权益，AI 错误代价极高，必须加入人工审核保障准确性和合规性。",
    difficulty: "medium",
    topics: ["人机协作", "AI产品设计"]
  },
  {
    id: "mc_d03",
    question: "AI 客服中 intent recognition 准确率低直接导致？",
    options: ["响应速度变慢", "用户进入错误解决流程满意度下降", "API调用次数增多（不影响核心结论）", "知识库更新频率变高"],
    correctAnswer: 1,
    explanation: "意图识别错误让用户进入错误的对话分支，无法解决实际问题，是客服体验的核心痛点。",
    difficulty: "medium",
    topics: ["AI客服", "AI产品设计"]
  },
  {
    id: "mc_d04",
    question: "Streaming output（流式输出）的用户体验优势是？",
    options: ["减少服务器计算量", "让用户即时看到输出感知等待更短", "提高输出准确性", "降低API调用费用（不影响核心结论）"],
    correctAnswer: 1,
    explanation: "流式输出让用户看到 token 逐步生成，相比等待完整结果，主观感受响应更快。",
    difficulty: "easy",
    topics: ["用户体验", "AI产品设计"]
  },
  {
    id: "mc_d05",
    question: "衡量 AI 客服替代人工效果的最直接指标是？",
    options: ["API调用成功率（不影响核心结论）", "AI自主解决率（无需转人工比例）", "对话轮次数量", "系统平均响应时间"],
    correctAnswer: 1,
    explanation: "自主解决率（containment rate）直接反映 AI 多大程度替代了人工，是核心业务指标。",
    difficulty: "medium",
    topics: ["AI客服指标", "AI产品设计"]
  },
  {
    id: "mc_d06",
    question: "AI 产品 'cold start problem'（冷启动问题）主要指？",
    options: ["服务器启动时间过长", "新用户缺乏数据导致AI效果差", "API接口调用失败", "模型在低温下性能下降（不影响核心结论"],
    correctAnswer: 1,
    explanation: "AI 产品依赖历史数据做个性化，新用户无历史数据时效果差，需设计冷启动策略。",
    difficulty: "medium",
    topics: ["冷启动", "AI产品设计"]
  },
  {
    id: "mc_d07",
    question: "A/B 测试中最常见的误区是？",
    options: ["测试周期过长", "样本量不足时过早宣布结果", "测试指标过多", "未记录实验参数（不影响核心结论）"],
    correctAnswer: 1,
    explanation: "过早停止测试受'窥视问题'影响，样本不足时的显著差异很可能是随机误差。",
    difficulty: "hard",
    topics: ["A/B测试", "AI产品设计"]
  },
  {
    id: "mc_d08",
    question: "AI 产品设计 'user control' 原则要求？",
    options: ["让AI完全替代用户（不影响核心结论）", "保留用户修改和拒绝AI建议的能力", "限制用户输入内容", "让AI自动发布内容"],
    correctAnswer: 1,
    explanation: "用户控制原则确保人类始终是最终决策者，AI 是辅助工具不强制替代人类判断。",
    difficulty: "easy",
    topics: ["用户控制", "AI产品设计"]
  },
  {
    id: "mc_d09",
    question: "AI 产品 onboarding 中最能帮助用户建立正确心智模型的方式是？",
    options: ["展示大量技术参数", "具体示例展示能做什么不能做什么", "只提供文字说明文档（不影响核心结论）", "让用户自行探索功能"],
    correctAnswer: 1,
    explanation: "具体示例帮助用户快速校准对 AI 的预期，避免过度依赖或误解 AI 能力边界。",
    difficulty: "medium",
    topics: ["用户引导", "AI产品设计"]
  },
  {
    id: "mc_d10",
    question: "AI 产品出现输出质量问题时最科学的定位方法是？",
    options: ["立即更换底层模型（不影响核心结论）", "通过错误案例系统分析根本原因", "增加人工客服", "扩大训练数据量"],
    correctAnswer: 1,
    explanation: "系统性错误分析（案例归因、错误分类）才能识别是 Prompt、数据、模型还是工程问题。",
    difficulty: "medium",
    topics: ["质量改进", "AI产品设计"]
  },

  // ══════════════════════════════════════
  // AI 安全与伦理（10道）
  // ══════════════════════════════════════

  {
    id: "mc_s01",
    question: "'Algorithmic bias'（算法偏见）最可能源于？",
    options: ["服务器硬件故障", "训练数据中的历史偏见被放大", "模型参数设置不当（不影响核心结论）", "用户界面设计缺陷"],
    correctAnswer: 1,
    explanation: "训练数据反映现实偏见（种族、性别等），模型学习后可能在决策中复制和放大。",
    difficulty: "medium",
    topics: ["算法偏见", "AI安全与伦理"]
  },
  {
    id: "mc_s02",
    question: "GDPR 对 AI 产品的核心合规要求是？",
    options: ["必须使用开源模型", "用户数据收集需告知同意并支持删除", "AI必须由人类监督所有决策（不影响核心结", "产品必须在欧盟境内托管服务"],
    correctAnswer: 1,
    explanation: "GDPR 核心要求：明确告知数据用途、获取同意、支持访问/更正/删除权，数据最小化。",
    difficulty: "medium",
    topics: ["GDPR", "AI安全与伦理"]
  },
  {
    id: "mc_s03",
    question: "AI 系统对用户不利决策最重要的设计原则是？",
    options: ["让模型输出更自信", "提供可解释理由并设申诉渠道", "加快决策处理速度", "降低模型置信度阈值（不影响核心结论"],
    correctAnswer: 1,
    explanation: "高风险自动化决策必须可解释，用户有权了解原因并提出异议，这是程序公正的基本要求。",
    difficulty: "medium",
    topics: ["AI伦理", "AI安全与伦理"]
  },
  {
    id: "mc_s04",
    question: "AI 公平性最难解决的挑战是？",
    options: ["计算公平性指标成本高", "不同公平性定义之间数学上不可兼得", "公平性只适用于分类任务（不影响核心结论）", "公平性与用户体验无关"],
    correctAnswer: 1,
    explanation: "个体公平与群体公平等不同定义数学上无法同时满足，需根据场景做权衡取舍。",
    difficulty: "hard",
    topics: ["AI公平性", "AI安全与伦理"]
  },
  {
    id: "mc_s05",
    question: "Deepfake 对 AI 伦理的主要挑战是？",
    options: ["生成成本过高", "使伪造媒体变易威胁信任安全", "只影响娱乐行业", "技术难度高普通人无法使用（不影响核"],
    correctAnswer: 1,
    explanation: "Deepfake 让身份伪造、虚假信息传播门槛大幅降低，威胁政治、金融和个人隐私。",
    difficulty: "easy",
    topics: ["Deepfake", "AI安全与伦理"]
  },
  {
    id: "mc_s06",
    question: "防御 Prompt Injection 攻击最有效的方式是？",
    options: ["增加API调用频率限制（不影响核心结论）", "输入验证+权限分离+输出过滤组合", "关闭用户自定义输入", "使用更大参数量的模型"],
    correctAnswer: 1,
    explanation: "单一防御难以应对多样攻击，需要输入清洗、权限隔离、输出监控等多层防御策略。",
    difficulty: "hard",
    topics: ["安全防御", "AI安全与伦理"]
  },
  {
    id: "mc_s07",
    question: "Responsible AI（负责任AI）的核心思路是？",
    options: ["先部署后修复", "设计阶段就融入安全公平透明", "只考虑用户便利性", "减少人类对AI的干预（不影响核心结"],
    correctAnswer: 1,
    explanation: "负责任 AI 要求将伦理和安全前置到设计阶段（by design），而非出现问题后打补丁。",
    difficulty: "medium",
    topics: ["负责任AI", "AI安全与伦理"]
  },
  {
    id: "mc_s08",
    question: "AI 系统 'transparency'（透明度）主要体现在？",
    options: ["开放模型全部源代码", "清晰告知决策依据局限性和数据", "公开所有用户数据", "将所有算法细节对外发布（不影响核心结"],
    correctAnswer: 1,
    explanation: "透明度包括：AI 如何工作、哪些数据被使用、决策依据是什么，而非要求全部开源。",
    difficulty: "medium",
    topics: ["透明度", "AI安全与伦理"]
  },
  {
    id: "mc_s09",
    question: "以下哪种 AI 应用风险最高，最需要伦理审查？",
    options: ["生成营销文案", "刑事司法风险评估系统", "自动翻译邮件内容（不影响核心", "智能家居设备控制"],
    correctAnswer: 1,
    explanation: "刑事司法决策影响人身自由，AI 偏见或错误的代价极高，必须经过严格的伦理审查。",
    difficulty: "medium",
    topics: ["高风险AI", "AI安全与伦理"]
  },
  {
    id: "mc_s10",
    question: "AI 系统的 'auditability'（可审计性）对企业最重要的意义是？",
    options: ["提高模型训练速度", "在出错时能追溯决策过程和责任", "减少AI产品开发周期（不影响核心结论", "帮助模型自动优化参数"],
    correctAnswer: 1,
    explanation: "可审计性让组织能在 AI 出错时还原决策路径，满足监管要求并明确责任归属。",
    difficulty: "medium",
    topics: ["AI治理", "AI安全与伦理"]
  },

  // ══════════════════════════════════════
  // 模型评估（10道）
  // ══════════════════════════════════════

  {
    id: "mc_e01",
    question: "BLEU 分数的主要局限性是？",
    options: ["计算速度太慢", "只衡量词汇重叠忽略语义等价", "只适用于图像评估（不影响核心结论）", "需要大量人工标注"],
    correctAnswer: 1,
    explanation: "BLEU 基于 n-gram 匹配，语义相同但词汇不同的表达得分低，对摘要评估不够准确。",
    difficulty: "medium",
    topics: ["评估指标", "模型评估"]
  },
  {
    id: "mc_e02",
    question: "LLM-as-judge 方法的主要风险是？",
    options: ["评估速度太慢效率低下", "评估模型可能与被评估模型有相同偏差", "成本比人工更高且需要额外的平台配置工作", "无法处理中文及多语言场景下的评估任务"],
    correctAnswer: 1,
    explanation: "同族模型可能共享相同偏见，导致评估失去客观性，最好用不同系列模型交叉评估。",
    difficulty: "hard",
    topics: ["LLM评估", "模型评估"]
  },
  {
    id: "mc_e03",
    question: "Perplexity（困惑度）值越低意味着？",
    options: ["模型越难预测下一个词", "模型预测能力越强", "模型参数量越少", "模型训练时间越短"],
    correctAnswer: 1,
    explanation: "困惑度衡量模型对文本的不确定性，值越低说明模型越能准确预测，语言建模能力越强。",
    difficulty: "medium",
    topics: ["困惑度", "模型评估"]
  },
  {
    id: "mc_e04",
    question: "'Benchmark saturation'（基准饱和）指的是？",
    options: ["训练数据用完", "模型在旧基准接近满分区分度下降", "评估服务器过载（不影响核心结论）", "测试题目太简单"],
    correctAnswer: 1,
    explanation: "随模型能力提升，旧基准趋于饱和失去区分度，需要更难的新基准衡量真实能力差距。",
    difficulty: "hard",
    topics: ["基准测试", "模型评估"]
  },
  {
    id: "mc_e05",
    question: "精确率（Precision）和召回率（Recall）需要平衡的原因是？",
    options: ["两者计算公式相同", "提高精确率通常会降低召回率", "两者只能同时提高", "只有分类任务需要考虑（不影响核心结"],
    correctAnswer: 1,
    explanation: "精确率提高意味着更保守的判断，会漏掉更多正例（召回率降），需根据业务代价权衡。",
    difficulty: "medium",
    topics: ["精确率召回率", "模型评估"]
  },
  {
    id: "mc_e06",
    question: "Shadow testing（影子测试）的作用是？",
    options: ["在夜间对服务器进行安全性和性能检查确保稳定", "新模型并行运行对比差异但不影响用户", "测试产品暗色主题模式下的界面显示效果", "用线上真实流量模拟对新版本进行全链路压测"],
    correctAnswer: 1,
    explanation: "影子测试让新模型接收真实流量但不返回给用户，安全评估线上真实场景性能差异。",
    difficulty: "hard",
    topics: ["部署策略", "模型评估"]
  },
  {
    id: "mc_e07",
    question: "RAGAS 框架专门用于评估什么？",
    options: ["图像生成质量", "RAG系统端到端质量", "代码生成准确率（不影响核心结", "多语言翻译效果"],
    correctAnswer: 1,
    explanation: "RAGAS 提供 faithfulness、answer relevancy、context precision 等专门针对 RAG 的评估指标。",
    difficulty: "hard",
    topics: ["RAGAS", "模型评估"]
  },
  {
    id: "mc_e08",
    question: "Online evaluation 相比 offline evaluation 的核心优势是？",
    options: ["评估成本更低且计算资源消耗少", "反映真实用户行为捕捉离线无法体现的问题", "评估速度更快且支持大批量自动处理", "完全不需要任何人工参与介入就能完成全部评估"],
    correctAnswer: 1,
    explanation: "在线评估通过真实用户行为（点击、转化、留存）验证模型，比离线指标更贴近业务效果。",
    difficulty: "medium",
    topics: ["在线评估", "模型评估"]
  },
  {
    id: "mc_e09",
    question: "人工评估 AI 输出时最常见的标注挑战是？",
    options: ["硬件设备故障", "不同标注员对相同输出判断存在差异", "数据存储格式问题", "标注工具界面不友好（不影响核心结论）"],
    correctAnswer: 1,
    explanation: "主观性任务标注员间一致性（inter-annotator agreement）通常较低，需明确评分标准。",
    difficulty: "medium",
    topics: ["人工评估", "模型评估"]
  },
  {
    id: "mc_e10",
    question: "'Groundedness'（有据性）指标在 RAG 评估中衡量什么？",
    options: ["回答是否够简短", "回答内容是否能被文档支持验证", "回答是否包含专业词汇（不影响核心结论", "回答速度是否够快"],
    correctAnswer: 1,
    explanation: "Groundedness 评估模型声明是否有明确文档依据，是 RAG 质量评估的核心指标之一。",
    difficulty: "medium",
    topics: ["有据性", "模型评估"]
  }
];



// ===== 问答题（30道）=====
export const essayQuestionPool = [
  {
    id: "essay_001",
    question: "假设你要设计一个 AI 客服系统，请列出至少 5 个核心评估指标，并说明为什么选择这些指标以及如何量化。",
    evaluationPoints: [
      "是否涵盖准确性（答案正确率）、效率（首次解决率FCR）、满意度（CSAT）等多维度",
      "是否考虑负面指标：升级率（转人工率）、投诉率、错误率",
      "是否给出量化方法：如何收集数据、计算公式",
      "是否考虑业务场景差异（不同场景指标权重不同）",
      "是否提到成本相关指标：每次服务成本、成本节约率"
    ],
    difficulty: "medium",
    topics: ["AI客服", "评估指标", "产品设计"]
  },
  {
    id: "essay_002",
    question: "请比较 RAG 和 Fine-tuning 两种技术路线的适用场景、优缺点，以及如何在实际项目中做选择。",
    evaluationPoints: [
      "RAG 适用场景：知识频繁更新、私有数据、需要引用来源",
      "Fine-tuning 适用场景：固定领域知识、风格迁移、特定格式输出",
      "成本对比：RAG 无需训练但有检索延迟，Fine-tuning 有训练成本",
      "是否提到可以组合使用（RAG + 微调）",
      "决策框架：根据数据更新频率、预算、延迟要求做选择"
    ],
    difficulty: "hard",
    topics: ["RAG", "Fine-tuning", "技术选型"]
  },
  {
    id: "essay_003",
    question: "描述你对 AI Agent 的理解，并设计一个具体的 AI Agent 产品，说明其核心能力、架构和潜在风险。",
    evaluationPoints: [
      "Agent 核心特征：感知→规划→执行→反馈的循环",
      "具体产品设计有明确的应用场景和用户价值",
      "架构描述：工具集（Tool Use）、记忆（Memory）、规划（Planning）",
      "风险识别：错误级联、无限循环、安全越权、成本失控",
      "是否提到 Human-in-the-loop 和 Guardrails 设计"
    ],
    difficulty: "hard",
    topics: ["AI Agent", "产品设计", "系统架构"]
  },
  {
    id: "essay_004",
    question: "如果你是一个 AI 写作助手产品的 PM，如何设计功能来提升用户留存率？请给出至少 3 个具体功能方案并说明理由。",
    evaluationPoints: [
      "功能与留存的逻辑链条要清晰（为什么这个功能能提留存）",
      "是否涉及个性化（风格学习、模板收藏）",
      "是否涉及习惯养成（写作提醒、进度追踪）",
      "是否涉及数据迁移成本（历史文档、个人知识库）",
      "是否考虑不同用户分层的留存策略"
    ],
    difficulty: "medium",
    topics: ["用户留存", "功能设计", "写作助手"]
  },
  {
    id: "essay_005",
    question: "请解释什么是 Prompt Engineering，并举例说明一个'好的 Prompt'和'差的 Prompt'在处理同一任务时的差异。",
    evaluationPoints: [
      "Prompt Engineering 定义准确：设计输入指令以获得期望输出的方法论",
      "举例具体，差异对比明显（不能只说'好坏'，要写出具体内容）",
      "分析为什么好的 Prompt 更好：上下文、格式、约束、示例",
      "是否提到 Prompt 设计的核心原则：清晰、具体、有约束",
      "是否提到迭代测试的重要性"
    ],
    difficulty: "easy",
    topics: ["Prompt Engineering", "基础概念"]
  },
  {
    id: "essay_006",
    question: "AI 产品如何平衡'安全性'和'有用性'（helpfulness vs safety）？请以具体产品为例说明设计思路。",
    evaluationPoints: [
      "理解两者天然存在张力：过度安全导致产品无用，过度开放带来风险",
      "结合具体场景讨论：医疗建议、法律咨询、内容生成等",
      "设计思路：分级内容策略、用户意图识别、上下文感知过滤",
      "是否提到不同用户群体的差异化策略（企业用户 vs 消费者）",
      "是否提到持续运营中的人工审核和快速响应机制"
    ],
    difficulty: "hard",
    topics: ["AI安全", "产品设计", "权衡思维"]
  },
  {
    id: "essay_007",
    question: "如何构建一套完整的 LLM 应用评估体系？包括离线评估和在线评估两个维度。",
    evaluationPoints: [
      "离线评估：Golden Dataset、自动指标（BLEU/ROUGE/BERTScore）、LLM-as-Judge",
      "在线评估：A/B Test、用户反馈（点赞/点踩）、隐式信号（复制率、停留时间）",
      "是否提到评估体系的迭代：随产品演进调整评估重点",
      "是否提到不同任务类型用不同评估方法",
      "是否提到评估的基准线（baseline）和回归测试"
    ],
    difficulty: "hard",
    topics: ["评估体系", "LLM评估", "产品运营"]
  },
  {
    id: "essay_008",
    question: "请描述一个你认为被 AI 严重低估的垂直场景，并说明为什么 AI 能在这个场景创造巨大价值。",
    evaluationPoints: [
      "场景选择有洞察力，不是明显的大热方向",
      "清晰描述该场景的痛点和现有解决方案的局限",
      "解释 AI 为何特别适合这个场景（数据特征、重复性、规模化潜力）",
      "是否考虑落地障碍（监管、数据可得性、用户接受度）",
      "是否有量化的价值估算或类比参考"
    ],
    difficulty: "hard",
    topics: ["机会洞察", "垂直场景", "产品眼光"]
  },
  {
    id: "essay_009",
    question: "解释'数据飞轮'概念，并分析哪类 AI 产品能建立真正的数据飞轮，哪类不能。",
    evaluationPoints: [
      "数据飞轮定义准确：用户→数据→改进→更多用户的正反馈循环",
      "能建立飞轮的特征：高频使用、用户数据能直接改进体验、数据具有独特性",
      "举具体能建立飞轮的例子并说明逻辑",
      "举不能建立飞轮的例子（如纯调用 API 的 wrapper 产品）并说明原因",
      "是否提到数据飞轮的前提条件：有足够的用户基数才能启动"
    ],
    difficulty: "medium",
    topics: ["数据飞轮", "竞争壁垒", "产品战略"]
  },
  {
    id: "essay_010",
    question: "假设你负责一款 B2B AI 产品的商业化，如何设计定价策略？请说明考虑因素和推理过程。",
    evaluationPoints: [
      "了解主要 B2B AI 定价模式：按用量（Token/API调用）、按席位、按功能分级",
      "考虑客户价值感知：AI 能帮客户省多少钱/赚多少钱",
      "是否提到竞品定价参考",
      "是否考虑客户规模分层（SMB vs Enterprise）",
      "是否提到免费试用/Freemium 策略及其逻辑"
    ],
    difficulty: "medium",
    topics: ["B2B定价", "商业化", "SaaS"]
  },
  {
    id: "essay_011",
    question: "如何向一个完全不懂技术的高管解释 RAG 是什么以及为什么公司需要它？",
    evaluationPoints: [
      "能用非技术语言解释清楚（类比图书馆员、助手查阅资料等）",
      "说明业务价值：减少错误回答、引用内部知识、知识实时更新",
      "是否针对高管关心的点（成本、风险、竞争优势）展开",
      "避免技术术语堆砌",
      "是否有清晰的投资回报（ROI）论证"
    ],
    difficulty: "medium",
    topics: ["沟通能力", "RAG", "向上汇报"]
  },
  {
    id: "essay_012",
    question: "AI 产品的'冷启动'问题有哪些常见解法？请结合具体案例说明。",
    evaluationPoints: [
      "理解冷启动本质：无数据→无个性化→难获用户的恶性循环",
      "解法1：合成数据/人工构造初始数据",
      "解法2：迁移学习，利用相似场景数据",
      "解法3：产品设计绕过冷启动（如降低对个性化的依赖）",
      "解法4：找到种子用户，深度服务换取高质量初始数据",
      "举出具体产品案例并说明采用了哪种解法"
    ],
    difficulty: "medium",
    topics: ["冷启动", "产品策略", "增长"]
  },
  {
    id: "essay_013",
    question: "请分析 AI 产品在中国市场和海外市场落地时的主要差异，并给出产品策略建议。",
    evaluationPoints: [
      "监管差异：国内 AI 生成内容需备案，海外有 GDPR 等",
      "用户行为差异：国内用户更习惯移动端/微信生态，海外多独立应用",
      "数据本地化要求差异",
      "竞争格局差异：国内有百度/阿里/腾讯强竞争，海外 OpenAI 生态主导",
      "语言和文化适配，不只是翻译"
    ],
    difficulty: "hard",
    topics: ["国际化", "产品策略", "市场差异"]
  },
  {
    id: "essay_014",
    question: "请设计一套 AI 面试系统的完整功能方案，包括题目类型、评分机制和报告呈现。",
    evaluationPoints: [
      "题目类型设计有层次感（选择→问答→实操）",
      "评分机制考虑到 AI 评判的局限性和人工复核",
      "报告呈现对招聘方有实用价值（维度清晰、可比较）",
      "是否考虑防作弊机制（AI 使用检测、时间分析等）",
      "是否考虑候选人体验（不只是招聘方视角）"
    ],
    difficulty: "medium",
    topics: ["AI面试", "产品设计", "场景规划"]
  },
  {
    id: "essay_015",
    question: "如何评估一个 AI 功能是否真正带来了商业价值？请设计一套验证方法。",
    evaluationPoints: [
      "区分'虚荣指标'（使用率）和'北极星指标'（业务转化）",
      "实验设计：A/B 测试方法论（对照组、处理组、样本量）",
      "因果推断注意点：避免混淆变量",
      "短期指标 vs 长期指标的平衡",
      "是否提到定性研究（用户访谈）补充定量数据"
    ],
    difficulty: "hard",
    topics: ["价值验证", "数据分析", "实验设计"]
  },
  {
    id: "essay_016",
    question: "描述你对'多模态 AI'的理解，并举例说明多模态能力在具体产品中的应用价值。",
    evaluationPoints: [
      "多模态定义准确：处理文本+图像+音频+视频等多种模态",
      "举出的应用例子有实际价值（不只是'看图说话'）",
      "是否提到多模态的技术挑战（模态对齐、数据稀缺）",
      "是否提到多模态 vs 单模态的场景选择",
      "是否有对用户价值的量化或类比"
    ],
    difficulty: "medium",
    topics: ["多模态", "产品应用", "技术理解"]
  },
  {
    id: "essay_017",
    question: "AI 产品如何处理'长尾需求'（低频但重要的用户需求）？请提出解决思路。",
    evaluationPoints: [
      "理解长尾需求的特点：低频、多样、难以规则化",
      "AI 处理长尾需求的优势：通用理解能力",
      "具体方案：Few-shot 示例动态插入、用户自定义模板、Prompt 可配置化",
      "是否提到长尾需求的发现机制（日志分析、用户反馈）",
      "是否提到长尾需求和主流功能的资源平衡"
    ],
    difficulty: "medium",
    topics: ["长尾需求", "产品策略", "个性化"]
  },
  {
    id: "essay_018",
    question: "请分析'AI 替代工作'这个话题，哪些工作最容易被替代，哪些最难，判断标准是什么？",
    evaluationPoints: [
      "判断标准要有分析框架，不是直觉（如：规则化程度、创意要求、人际关系、物理操作）",
      "易被替代举例合理（重复性、规则化、数据密集的工作）",
      "难被替代举例合理（高情感、高创意、复杂决策、物理技能）",
      "是否提到'协作增强'（Human+AI）vs '完全替代'的区别",
      "是否有对时间维度的考虑（短期 vs 长期）"
    ],
    difficulty: "medium",
    topics: ["未来工作", "AI影响", "批判性思维"]
  },
  {
    id: "essay_019",
    question: "如何设计一个 AI 工具的新手引导（Onboarding）流程，确保用户能快速感知到产品价值？",
    evaluationPoints: [
      "Onboarding 目标明确：让用户尽快达到'Aha Moment'",
      "设计思路：减少初始摩擦、提供示例/模板、引导完成第一个有价值的任务",
      "是否针对 AI 工具的特殊性：需要教用户写好 Prompt",
      "是否考虑不同用户类型的差异化引导",
      "是否有效果评估指标（如引导完成率、D1留存率）"
    ],
    difficulty: "medium",
    topics: ["Onboarding", "用户体验", "产品设计"]
  },
  {
    id: "essay_020",
    question: "假设你发现公司的 AI 产品存在性别偏见（如对不同性别用户给出质量不一致的回答），你会如何处理这个问题？",
    evaluationPoints: [
      "识别问题严重性并正确分类（是 Prompt 问题、数据问题还是模型问题）",
      "调查方法：构建测试集，量化偏见程度",
      "处理方案：短期（Prompt 干预）、中期（数据补充）、长期（模型层面）",
      "是否提到向上汇报和跨部门协作",
      "是否考虑对已经受影响的用户的补救措施"
    ],
    difficulty: "hard",
    topics: ["AI偏见", "伦理处理", "产品运营"]
  },
  {
    id: "essay_021",
    question: "请描述一个你认为特别成功的 AI 产品，并分析其成功的关键因素。",
    evaluationPoints: [
      "选择的产品有代表性，分析深度不是表面",
      "成功因素分析多维度：技术、产品设计、时机、商业模式",
      "是否有竞争对比：同类产品为何这个更成功",
      "是否提到可复制的经验 vs 难以复制的独特优势",
      "是否有对其局限性和潜在风险的客观分析"
    ],
    difficulty: "medium",
    topics: ["产品分析", "成功因素", "案例研究"]
  },
  {
    id: "essay_022",
    question: "如何为一个企业内部 AI 助手设计权限管理系统，确保不同角色只能访问对应级别的信息？",
    evaluationPoints: [
      "权限模型设计：RBAC（基于角色的访问控制）在 AI 场景的应用",
      "AI 特有挑战：模型可能'推断'出不该知道的信息",
      "技术实现思路：RAG 层权限过滤、Prompt 层权限声明",
      "审计和监控：记录 AI 访问了什么信息",
      "是否考虑权限粒度（文档级 vs 字段级）和动态权限"
    ],
    difficulty: "hard",
    topics: ["企业AI", "权限管理", "安全设计"]
  },
  {
    id: "essay_023",
    question: "请解释'提示词泄露'（Prompt Leaking）是什么，企业为什么要防范，以及常见的防范措施。",
    evaluationPoints: [
      "Prompt Leaking 定义准确：通过引导让模型输出系统 Prompt",
      "业务风险：商业机密（独特 Prompt 逻辑）泄露给竞争对手",
      "防范方法：指令中声明不泄露、使用防护 Prompt、监控异常请求",
      "是否提到 Prompt Leaking 和 Prompt Injection 的区别",
      "是否提到不要过度依赖 Prompt 保密作为核心竞争力"
    ],
    difficulty: "medium",
    topics: ["Prompt安全", "企业AI", "知识产权"]
  },
  {
    id: "essay_024",
    question: "如果你要向投资人 pitch 一个 AI 创业项目，如何讲清楚技术壁垒和商业壁垒？",
    evaluationPoints: [
      "技术壁垒和商业壁垒的区分：技术领先能维持多久？",
      "可能的真实壁垒：数据飞轮、用户迁移成本、网络效应、独家协议",
      "是否识别出'伪壁垒'（如'我们用了最新模型'）",
      "投资人视角：壁垒的可持续性和可防御性",
      "是否有竞争格局分析和差异化定位"
    ],
    difficulty: "hard",
    topics: ["创业pitch", "竞争壁垒", "商业思维"]
  },
  {
    id: "essay_025",
    question: "请设计一套 AI 产品功能优先级排序框架，说明如何在资源有限的情况下做取舍。",
    evaluationPoints: [
      "提出具体的优先级框架（如 RICE、ICE、Kano 模型），并适配 AI 产品特点",
      "考虑 AI 产品特有因素：数据收集价值、模型改进潜力",
      "是否提到用户分层：核心用户诉求优先于边缘用户",
      "是否提到快速验证机制：如何用低成本验证功能价值再投入",
      "是否考虑技术债和基础设施建设的权衡"
    ],
    difficulty: "medium",
    topics: ["优先级排序", "产品方法论", "资源分配"]
  },
  {
    id: "essay_026",
    question: "AI 在内容审核领域的应用现状如何？请分析其能力边界和设计挑战。",
    evaluationPoints: [
      "AI 内容审核的优势：规模、速度、一致性",
      "能力边界：上下文依赖的内容（讽刺、文化特异性）、低频新型违规",
      "设计挑战：误判（漏判 vs 误杀）的权衡、多语言多文化",
      "是否提到 AI+人工的 mixed review 方案",
      "是否提到对抗性内容（专门绕过 AI 审核的内容）的挑战"
    ],
    difficulty: "hard",
    topics: ["内容审核", "AI应用", "能力边界"]
  },
  {
    id: "essay_027",
    question: "请分析'AI 幻觉'对不同行业的影响程度差异，并提出针对性的缓解策略。",
    evaluationPoints: [
      "不同行业影响程度不同：医疗>金融>法律>教育>娱乐",
      "是否能解释为什么某些行业影响更大（决策不可逆性、权威性要求）",
      "缓解策略因行业而异：医疗需要引用来源+人工审核，娱乐可接受部分不准确",
      "是否提到 RAG 和 Grounding（接地气：把 AI 回答锚定在可验证事实上）",
      "是否提到向用户诚实披露 AI 可能出错的边界"
    ],
    difficulty: "medium",
    topics: ["幻觉问题", "行业差异", "风险管理"]
  },
  {
    id: "essay_028",
    question: "如何衡量一个 Prompt 的质量？请设计一套系统性的评估方法。",
    evaluationPoints: [
      "评估维度：准确率、格式一致性、指令遵循度、边界情况处理",
      "评估方法：构建测试集（正常case + 边界case + 对抗case）",
      "量化方法：自动评估 vs 人工评估的结合",
      "是否提到 Prompt 的鲁棒性测试（稍微改变输入 Prompt 不应该崩溃）",
      "是否提到成本效率：在达到质量目标前提下最短的 Prompt"
    ],
    difficulty: "hard",
    topics: ["Prompt质量", "评估方法", "工程实践"]
  },
  {
    id: "essay_029",
    question: "描述你理想中未来5年的 AI 助手是什么样的，它解决了哪些当前 AI 助手的核心痛点？",
    evaluationPoints: [
      "基于对当前 AI 助手真实痛点的准确识别（记忆断裂、无法执行、幻觉、被动响应）",
      "未来愿景有具体的功能描述，不是泛泛而谈",
      "是否考虑技术可行性（哪些当前已经有方向，哪些仍是难题）",
      "是否考虑隐私和安全：更强大的助手意味着更大的风险",
      "是否有对用户和社会影响的深度思考"
    ],
    difficulty: "medium",
    topics: ["未来展望", "产品愿景", "洞察力"]
  },
  {
    id: "essay_030",
    question: "如果你要在一个传统企业（如制造业）推动 AI 转型，你会如何制定路线图和说服内部利益相关方？",
    evaluationPoints: [
      "路线图要分阶段：从'低风险验证'到'核心业务集成'",
      "找对切入点：从痛点最大、风险最低的场景开始",
      "利益相关方分析：识别支持者、反对者、中立者，制定不同沟通策略",
      "是否提到'展示胜利'（Quick Win）的重要性",
      "是否考虑组织变革管理：人员技能升级、岗位调整的应对"
    ],
    difficulty: "hard",
    topics: ["AI转型", "变革管理", "内部推动"]
  }
];

// ===== AI协作题（20道）=====
export const collaborationTaskPool = [
  {
    id: "collab_001",
    title: "矛盾需求拆解",
    description: "公司要求设计'企业内部 AI 知识助手'，需求：成本极低（<500元/月）、准确率接近 100%、不允许存储用户数据、支持复杂推理、2 周内上线。",
    conflicts: ["成本 vs 准确率", "隐私 vs 功能", "时间 vs 质量"],
    evaluationFocus: [
      "是否识别出需求矛盾并明确指出",
      "如何与 AI 协作澄清问题、分解约束",
      "Prompt 迭代质量：是否有效引导 AI 提出方案",
      "最终方案的可行性与取舍说明",
      "是否主动与'需求方'（考官）确认优先级"
    ],
    timeLimitMinutes: 20
  },
  {
    id: "collab_002",
    title: "模糊需求澄清",
    description: "产品总监说：'我想要一个像 GPT 一样的东西，但是是我们自己的，而且要比 GPT 更智能，下个月上线。'请用 AI 帮助澄清需求，产出可执行的需求文档。",
    conflicts: ["模糊目标 vs 可执行需求", "期望 vs 现实", "时间 vs 范围"],
    evaluationFocus: [
      "是否识别出需求的模糊性和不可操作性",
      "是否用 AI 辅助生成澄清问题清单",
      "最终需求文档是否具体可执行",
      "是否合理管理期望（'比 GPT 更智能'是否可达）",
      "沟通策略：如何向总监呈现澄清结果"
    ],
    timeLimitMinutes: 20
  },
  {
    id: "collab_003",
    title: "用户研究 AI 辅助",
    description: "你需要在3天内完成一份关于'AI 编程助手用户痛点'的研究报告，但没有时间做用户访谈。请用 AI 协作完成这份研究。",
    conflicts: ["时间限制 vs 研究质量", "AI生成内容 vs 真实用户洞察", "效率 vs 严谨性"],
    evaluationFocus: [
      "是否合理利用 AI 生成假设和分析框架",
      "是否识别 AI 研究的局限性（无法替代真实用户访谈）",
      "Prompt 设计：如何引导 AI 提出有价值的洞察而非泛泛之谈",
      "是否补充了可验证的次级数据来源（论坛、评论等）",
      "报告框架的完整性和逻辑性"
    ],
    timeLimitMinutes: 25
  },
  {
    id: "collab_004",
    title: "竞品分析加速",
    description: "你有4小时需要完成一份覆盖10个竞品的 AI 写作助手市场分析报告，包括功能对比、定价、用户评价和差异化建议。请用 AI 协作完成。",
    conflicts: ["时间压力 vs 分析深度", "AI效率 vs 分析准确性", "广度 vs 深度"],
    evaluationFocus: [
      "是否设计了高效的 AI 协作分析流程",
      "如何验证 AI 提供的竞品信息准确性",
      "分析框架的结构性和实用性",
      "是否有意义的差异化洞察（不只是罗列功能）",
      "时间分配是否合理（哪些让 AI 做，哪些自己做）"
    ],
    timeLimitMinutes: 25
  },
  {
    id: "collab_005",
    title: "PRD 快速起草",
    description: "你需要在2小时内为'AI 会议纪要助手'功能起草一份 PRD（产品需求文档），包括背景、目标用户、功能列表、验收标准。请用 AI 协作完成。",
    conflicts: ["速度 vs 质量", "AI生成内容 vs 产品判断", "完整性 vs 时间"],
    evaluationFocus: [
      "Prompt 设计：如何让 AI 生成高质量的 PRD 框架",
      "是否对 AI 输出进行了有价值的修改和判断",
      "PRD 的实用性：开发能否按此实现",
      "是否包含了关键的边界情况和验收标准",
      "是否体现了对用户需求的真实理解（而非 AI 臆想）"
    ],
    timeLimitMinutes: 20
  },
  {
    id: "collab_006",
    title: "技术可行性评估",
    description: "业务方提出：'我们希望 AI 能实时分析客服对话，在对话进行中预测用户情绪并自动生成建议回复，延迟要求<200ms，准确率>95%。' 请用 AI 协作进行技术可行性评估。",
    conflicts: ["延迟要求 vs 模型能力", "准确率目标 vs 现实", "实时性 vs 处理复杂度"],
    evaluationFocus: [
      "是否识别出技术约束（<200ms vs LLM延迟）",
      "是否用 AI 辅助拆解可行与不可行的部分",
      "是否提出替代方案（如异步建议、预设模板）",
      "与业务方沟通时如何呈现可行性评估结果",
      "是否考虑分阶段实现：先实现核心价值，再优化性能"
    ],
    timeLimitMinutes: 20
  },
  {
    id: "collab_007",
    title: "多方利益平衡",
    description: "你是 AI 内容审核产品的 PM。平台方希望 AI 审核更严格（减少违规），内容创作者希望更宽松（不误杀），用户希望更准确（少看到有害内容但不影响优质内容）。请用 AI 协作提出解决方案。",
    conflicts: ["平台方 vs 创作者 vs 用户三方诉求", "安全 vs 创作自由", "准确率 vs 召回率"],
    evaluationFocus: [
      "是否清晰梳理各方诉求和底线",
      "是否用 AI 辅助分析了不同参数配置的影响",
      "提出的方案是否能平衡三方利益（而非只满足一方）",
      "是否考虑了申诉机制和人工复核",
      "方案的可落地性：是否考虑了运营成本"
    ],
    timeLimitMinutes: 25
  },
  {
    id: "collab_008",
    title: "快速原型设计",
    description: "你需要在明天的会议上展示一个'AI 健身教练'小程序的产品概念，包括核心功能流程和关键界面描述。请用 AI 协作在1小时内完成展示材料。",
    conflicts: ["时间极限 vs 展示质量", "AI生成内容 vs 产品创意", "广度 vs 核心聚焦"],
    evaluationFocus: [
      "是否快速确定了展示的核心重点（不是面面俱到）",
      "AI 协作效率：如何用 AI 快速生成结构化内容",
      "产品洞察：AI 健身教练的差异化价值点是否清晰",
      "展示材料的说服力：是否有用户场景和数据支撑",
      "是否识别并规避了常见的 AI 产品设计误区"
    ],
    timeLimitMinutes: 20
  },
  {
    id: "collab_009",
    title: "数据分析解读",
    description: "你获得了一份 AI 客服产品的用户行为数据：日活10万，平均对话轮次3轮，问题解决率45%，用户满意度3.2/5，第7天留存率15%。请用 AI 协作分析数据并提出改进方向。",
    conflicts: ["数据充分解读 vs 时间限制", "数据分析 vs 行动建议", "现象描述 vs 根因分析"],
    evaluationFocus: [
      "是否识别了数据中的关键问题（45%解决率偏低，留存率低）",
      "是否用 AI 辅助了假设生成（可能的根因是什么）",
      "行动建议的优先级和可落地性",
      "是否考虑了数据局限性（单一数据集，缺乏对比基准）",
      "是否提出了验证假设的方法（如何确认根因）"
    ],
    timeLimitMinutes: 20
  },
  {
    id: "collab_010",
    title: "危机公关文案",
    description: "公司的 AI 产品被媒体曝光存在性别偏见问题（对女性用户的简历修改建议系统性地低于男性）。你需要在2小时内用 AI 协作起草一份公开声明，同时准备内部应对方案。",
    conflicts: ["速度 vs 质量", "诚实 vs 形象保护", "公关需求 vs 法律风险"],
    evaluationFocus: [
      "危机公关声明的专业性：是否承认问题、说明原因、提出行动",
      "是否用 AI 检查了声明的法律风险",
      "内部应对方案的完整性：技术修复、受影响用户补救、流程改进",
      "是否考虑了不同受众（媒体、用户、投资人）的不同沟通策略",
      "AI 协作过程：是否有效利用 AI 加速而非完全依赖"
    ],
    timeLimitMinutes: 25
  },
  {
    id: "collab_011",
    title: "跨部门沟通材料",
    description: "你需要说服技术团队优先支持'AI 个性化推荐'功能，但技术团队认为当前基础设施不支持，需要3个月重构。请用 AI 协作准备一份说服材料。",
    conflicts: ["业务紧迫性 vs 技术合理性", "功能价值 vs 技术债务", "速度 vs 质量"],
    evaluationFocus: [
      "是否站在技术团队角度理解其顾虑（不是单方面施压）",
      "是否用 AI 辅助寻找了折中方案（如MVP版本、分阶段实现）",
      "商业价值量化：如何让技术团队理解业务影响",
      "是否提出了降低技术复杂度的替代方案",
      "沟通策略：如何在不伤害关系的前提下推动决策"
    ],
    timeLimitMinutes: 20
  },
  {
    id: "collab_012",
    title: "用户故事生成",
    description: "你正在为'AI 法律咨询助手'产品准备 Sprint 计划，需要为以下用户群体生成用户故事：普通用户（不懂法律）、小微企业主、法律专业学生。请用 AI 协作完成。",
    conflicts: ["三类用户需求差异大", "功能深度 vs 覆盖广度", "专业性 vs 易用性"],
    evaluationFocus: [
      "用户故事的标准格式和质量（As a...I want...So that...）",
      "三类用户的差异化需求是否真实捕捉",
      "是否识别了不同用户群体的核心痛点差异",
      "AI 生成的用户故事是否经过了有价值的筛选和修改",
      "优先级排序：哪些用户故事最值得优先实现"
    ],
    timeLimitMinutes: 20
  },
  {
    id: "collab_013",
    title: "A/B 测试方案设计",
    description: "你想测试两个不同的 AI 客服入口文案：A版'Hi，我是 AI 助手，有什么可以帮你' vs B版'告诉我你的问题，我来帮你解决'。请用 AI 协作设计完整的 A/B 测试方案。",
    conflicts: ["测试严谨性 vs 时间成本", "单一变量 vs 多维分析", "数据量需求 vs 上线时间"],
    evaluationFocus: [
      "实验设计的规范性：样本量计算、分配比例、运行周期",
      "指标选择：主要指标和次要指标的合理性",
      "是否识别了 A/B 测试的注意事项（分组污染、季节效应）",
      "是否用 AI 辅助了样本量计算和统计显著性",
      "测试结论的解读框架：什么结果算'赢'"
    ],
    timeLimitMinutes: 20
  },
  {
    id: "collab_014",
    title: "商业模式验证",
    description: "你有一个 AI 创业想法：'用 AI 帮助中小学生写作文'。投资人给了你30分钟 office hour。请用 AI 协作准备30分钟内你需要验证的最关键假设和对应的验证方法。",
    conflicts: ["时间极限 vs 验证深度", "多个假设 vs 核心聚焦", "快速验证 vs 可靠结论"],
    evaluationFocus: [
      "是否识别了最关键的假设（不是所有假设都同等重要）",
      "假设优先级逻辑：哪个假设如果错了就整个商业模式不成立",
      "验证方法的可操作性：30分钟内真的能验证吗",
      "是否考虑了监管和伦理风险（AI帮中小学生写作文是否合规）",
      "与 AI 协作的质量：AI 辅助提升了哪些思考维度"
    ],
    timeLimitMinutes: 20
  },
  {
    id: "collab_015",
    title: "复杂 Prompt 调试",
    description: "你有一个 AI 简历分析的 Prompt，但发现它对同样的简历给出的评分差异很大（有时7分，有时4分）。请用 AI 协作诊断问题并优化 Prompt，使评分更稳定。",
    conflicts: ["随机性 vs 一致性", "创意评估 vs 标准化评估", "Prompt优化速度 vs 彻底解决"],
    evaluationFocus: [
      "问题诊断能力：识别评分不稳定的可能原因",
      "优化策略：如何让 Prompt 更有确定性（Temperature 降低、评分标准具体化、示例锚定）",
      "测试方法：如何验证优化后的 Prompt 更稳定",
      "是否考虑了 Temperature 参数调整",
      "是否提出了自动化测试方案（批量测试多份简历）"
    ],
    timeLimitMinutes: 20
  },
  {
    id: "collab_016",
    title: "产品文案优化",
    description: "你的 AI 工具注册转化率只有3%，登录页文案是'强大的 AI，助力你的工作'。请用 AI 协作在20分钟内生成至少5个更好的文案版本并说明每个版本的设计逻辑。",
    conflicts: ["文案创意 vs 量化效果", "广泛用户 vs 精准定位", "强调功能 vs 强调价值"],
    evaluationFocus: [
      "文案版本有明显差异化，不是同质化改写",
      "每个版本背后有清晰的设计逻辑",
      "是否考虑了不同目标用户的心理诉求",
      "AI 协作效率：如何引导 AI 生成多样化创意",
      "是否提出了如何测试哪个版本效果最好"
    ],
    timeLimitMinutes: 20
  },
  {
    id: "collab_017",
    title: "用户投诉处理",
    description: "一个用户在社交媒体上投诉：'你们的 AI 给我出了错误的医疗建议，我去医院后医生说完全不对，你们要负责！'请用 AI 协作起草回复并设计处理流程。",
    conflicts: ["安抚用户 vs 法律风险规避", "速度 vs 谨慎", "公开回复 vs 私下处理"],
    evaluationFocus: [
      "回复内容的法律合规性（不能过度承认责任）",
      "是否展现了真诚的关心而非公关话术",
      "内部处理流程的完整性：调查、改进、预防",
      "是否识别了这个案例对产品设计的影响（医疗类建议需要免责声明）",
      "AI 协作：如何用 AI 帮助起草既真诚又安全的回复"
    ],
    timeLimitMinutes: 20
  },
  {
    id: "collab_018",
    title: "功能迭代优先级",
    description: "用户反馈积压了50条优化建议，时间有限只能做5条。请用 AI 协作建立筛选框架，从这些场景中挑选出最有价值的5条：[① 更快的响应速度 ② 支持上传PDF ③ 历史对话搜索 ④ 多语言支持 ⑤ 语音输入 ⑥ 导出为Word ⑦ 暗色模式 ⑧ 分享链接 ⑨ 团队协作 ⑩ API接口]",
    conflicts: ["用户需求广度 vs 开发资源", "高频需求 vs 高价值需求", "技术复杂度 vs 用户价值"],
    evaluationFocus: [
      "是否建立了清晰的优先级框架（而非凭感觉选）",
      "框架维度合理性：用户影响面、开发成本、战略价值",
      "最终选择是否有说服力的理由",
      "是否用 AI 辅助了权重打分或评估",
      "是否考虑了不同功能之间的依赖关系"
    ],
    timeLimitMinutes: 20
  },
  {
    id: "collab_019",
    title: "竞争对手出新品应对",
    description: "你负责的 AI 翻译产品刚刚被竞争对手超越：对方昨天发布了支持100种语言、实时语音翻译、价格降价50%的新版本。你需要在今天的紧急会议上给出应对方案。",
    conflicts: ["短期应对 vs 长期战略", "价格战 vs 差异化", "速度 vs 质量"],
    evaluationFocus: [
      "危机分析：客观评估差距，不夸大也不轻视",
      "是否用 AI 辅助了快速竞品分析",
      "应对方案有层次：短期（稳住用户）、中期（功能追赶）、长期（差异化）",
      "是否识别了对方方案的潜在弱点（100种语言质量如何？）",
      "内部沟通策略：如何在会议上有效呈现分析"
    ],
    timeLimitMinutes: 25
  },
  {
    id: "collab_020",
    title: "AI 产品伦理困境",
    description: "你发现你们的 AI 招聘筛选系统可以显著提升筛选效率（从3天→2小时），但内部测试数据显示对特定学校背景的候选人有轻微偏见（通过率低约5%）。是否应该上线？请用 AI 协作分析利弊并提出决策建议。",
    conflicts: ["效率提升 vs 公平性", "商业压力 vs 伦理责任", "轻微偏见 vs 系统性影响"],
    evaluationFocus: [
      "是否客观评估了'5%偏差'的实际影响（规模×5%=多少人）",
      "是否用 AI 辅助分析了法律合规风险",
      "决策建议的可行性：是否提供了'修复后上线'的路径",
      "利益相关方分析：候选人、企业客户、公司自身的不同视角",
      "是否提出了减轻偏见的技术方案，而非'不上线'或'忽视'"
    ],
    timeLimitMinutes: 25
  }
];

// ===== 项目实战题（20道）=====
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
    deliverables: ["可运行的前端应用", "完整的 README 文档", "项目说明与设计思路"],
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
  {
    id: "project_002",
    title: "AI 面试官模拟器",
    description: "构建一个模拟 AI 产品经理面试的对话系统，让用户练习回答 AI 相关面试问题。",
    background: "求职者缺乏专业的 AI PM 面试练习平台，现有的模拟面试工具不够专业。",
    requirements: [
      "模拟面试官角色：提问→追问→总结反馈",
      "题库覆盖：技术理解、案例分析、产品设计",
      "实时评分反馈：答题质量的即时评估",
      "生成面试报告：优势与改进建议"
    ],
    deliverables: ["可运行的对话应用", "至少30道面试题库", "评分维度说明文档"],
    antiCheatMeasures: "要求解释评分算法设计逻辑、展示不同质量答案的评分差异",
    difficulty: "hard",
    topics: ["面试工具", "对话系统", "教育科技"],
    timeLimitMinutes: 90,
    rubric: [
      { dimension: "对话自然度", weight: 20, whatGoodLooksLike: "面试官角色真实，追问有逻辑，不像机器人" },
      { dimension: "题库质量", weight: 20, whatGoodLooksLike: "题目有区分度，覆盖不同难度和维度" },
      { dimension: "评分合理性", weight: 25, whatGoodLooksLike: "评分标准清晰，高质量答案得高分，弱答案得低分" },
      { dimension: "AI协作质量", weight: 25, whatGoodLooksLike: "有效利用AI构建对话逻辑，不只是转发问题" },
      { dimension: "用户体验", weight: 10, whatGoodLooksLike: "界面清晰，流程顺畅，反馈及时" }
    ]
  },
  {
    id: "project_003",
    title: "智能日程优化助手",
    description: "构建一个帮助用户分析和优化每日日程的 AI 工具，识别时间浪费并提供优化建议。",
    background: "知识工作者普遍感到时间不够用，但难以客观分析自己的时间使用模式。",
    requirements: [
      "日程输入：文本输入或结构化录入",
      "时间分析：按类别（深度工作/会议/行政）统计",
      "优化建议：基于最佳实践给出个性化建议",
      "对比展示：'当前状态' vs '优化后预期'"
    ],
    deliverables: ["可运行的 Web 应用", "分析报告模板", "用户使用指南"],
    antiCheatMeasures: "要求解释优化建议的依据，展示不同场景下的差异化建议",
    difficulty: "hard",
    topics: ["时间管理", "生产力工具", "个人成长"],
    timeLimitMinutes: 90,
    rubric: [
      { dimension: "分析深度", weight: 25, whatGoodLooksLike: "时间分析细致，能识别出有价值的模式和问题" },
      { dimension: "建议质量", weight: 25, whatGoodLooksLike: "建议具体可执行，有依据，不是泛泛而谈" },
      { dimension: "个性化程度", weight: 20, whatGoodLooksLike: "建议根据用户输入的具体情况调整，不是模板套用" },
      { dimension: "AI协作质量", weight: 20, whatGoodLooksLike: "有效提示AI产生有洞察力的分析，而非只整理信息" },
      { dimension: "工程实现", weight: 10, whatGoodLooksLike: "应用可稳定运行，数据处理正确" }
    ]
  },
  {
    id: "project_004",
    title: "餐厅点评智能摘要工具",
    description: "构建一个分析餐厅用户评论，自动生成结构化摘要和洞察报告的工具。",
    background: "消费者选餐厅时面对大量评论无从下手，商家也难以从评论中提炼改进方向。",
    requirements: [
      "评论输入：粘贴文本评论（模拟数据）",
      "关键词提取：菜品、服务、环境、价格等维度",
      "情感分析：正面/负面/中立分类",
      "生成摘要：一段话总结餐厅整体评价",
      "洞察报告：最常被提到的优缺点"
    ],
    deliverables: ["可运行的分析工具", "示例分析报告", "技术实现说明"],
    antiCheatMeasures: "要求处理不同类型餐厅（中餐/西餐/日料）并展示差异化分析",
    difficulty: "hard",
    topics: ["NLP应用", "评论分析", "消费决策"],
    timeLimitMinutes: 90,
    rubric: [
      { dimension: "分析准确性", weight: 30, whatGoodLooksLike: "情感分析准确，关键词提取有意义" },
      { dimension: "摘要质量", weight: 25, whatGoodLooksLike: "摘要简洁有信息量，抓住评论核心" },
      { dimension: "洞察深度", weight: 20, whatGoodLooksLike: "超出表面统计，提供有价值的分析角度" },
      { dimension: "AI协作质量", weight: 15, whatGoodLooksLike: "有效设计分析 Prompt，处理边界情况" },
      { dimension: "工程实现", weight: 10, whatGoodLooksLike: "工具稳定，支持批量处理" }
    ]
  },
  {
    id: "project_005",
    title: "个人知识库问答系统",
    description: "构建一个可以上传文档、然后通过对话查询文档内容的个人 RAG 知识库系统。",
    background: "知识工作者积累了大量文档但难以快速检索利用，需要一个智能查询系统。",
    requirements: [
      "文档上传：支持 TXT/Markdown 格式",
      "自动分块和向量化处理",
      "自然语言问答：基于文档内容回答问题",
      "来源引用：标注答案来自哪个文档的哪个部分",
      "不相关问题识别：如果文档中没有答案，应如实告知"
    ],
    deliverables: ["可运行的 RAG 应用", "架构说明文档", "测试案例（至少5个问答对）"],
    antiCheatMeasures: "要求解释向量化和检索的技术选型，展示对跨文档问题的处理",
    difficulty: "hard",
    topics: ["RAG", "知识管理", "信息检索"],
    timeLimitMinutes: 90,
    rubric: [
      { dimension: "检索准确性", weight: 30, whatGoodLooksLike: "问题的答案能被正确检索到，相关文档排名靠前" },
      { dimension: "答案质量", weight: 25, whatGoodLooksLike: "答案基于文档内容，有引用，不编造" },
      { dimension: "边界处理", weight: 20, whatGoodLooksLike: "正确识别文档外问题，不强行回答" },
      { dimension: "AI协作质量", weight: 15, whatGoodLooksLike: "合理利用 AI 辅助架构设计和 Prompt 优化" },
      { dimension: "工程实现", weight: 10, whatGoodLooksLike: "系统可运行，文档处理流程完整" }
    ]
  },
  {
    id: "project_006",
    title: "代码 Review 助手",
    description: "构建一个自动分析代码质量并给出改进建议的 AI 工具。",
    background: "代码 Review 是软件开发的重要环节，但人工 Review 耗时且质量不稳定。",
    requirements: [
      "代码输入：支持粘贴 Python/JavaScript 代码",
      "多维分析：可读性、性能、安全性、最佳实践",
      "问题定位：指出具体行号和问题描述",
      "改进建议：提供修改后的代码示例",
      "严重程度分级：Critical/Warning/Info"
    ],
    deliverables: ["可运行的代码 Review 工具", "5个不同质量等级的代码测试用例", "评审标准说明"],
    antiCheatMeasures: "要求处理有安全漏洞的代码（如 SQL 注入），展示工具能否识别",
    difficulty: "hard",
    topics: ["代码质量", "开发工具", "安全审计"],
    timeLimitMinutes: 90,
    rubric: [
      { dimension: "问题识别准确性", weight: 30, whatGoodLooksLike: "真实的代码问题被准确识别，减少误报" },
      { dimension: "建议实用性", weight: 25, whatGoodLooksLike: "改进建议具体、正确、可直接采用" },
      { dimension: "安全问题覆盖", weight: 20, whatGoodLooksLike: "能识别常见安全漏洞（注入、XSS等）" },
      { dimension: "AI协作质量", weight: 15, whatGoodLooksLike: "有效设计 Review Prompt，不遗漏重要维度" },
      { dimension: "工程实现", weight: 10, whatGoodLooksLike: "工具稳定，输出格式清晰易读" }
    ]
  },
  {
    id: "project_007",
    title: "会议纪要自动生成器",
    description: "构建一个将会议文字记录转化为结构化会议纪要的 AI 工具。",
    background: "会后整理会议纪要耗时且容易遗漏重要信息，需要自动化工具提升效率。",
    requirements: [
      "输入：会议对话文本（模拟数据）",
      "自动提取：议题、决策、行动项（含负责人和截止日期）",
      "参与者发言总结：每个参与者的核心观点",
      "优先级标注：重要决策和行动项自动标红",
      "导出格式：Markdown 格式纪要"
    ],
    deliverables: ["可运行的纪要生成工具", "3个不同类型会议的测试用例", "提示词设计说明"],
    antiCheatMeasures: "要求处理有争议的会议（双方意见不一），展示工具如何处理冲突性内容",
    difficulty: "hard",
    topics: ["会议效率", "文本处理", "办公自动化"],
    timeLimitMinutes: 90,
    rubric: [
      { dimension: "信息完整性", weight: 25, whatGoodLooksLike: "重要决策和行动项无遗漏" },
      { dimension: "提取准确性", weight: 25, whatGoodLooksLike: "行动项有具体的人、事、时间" },
      { dimension: "结构清晰度", weight: 20, whatGoodLooksLike: "纪要结构合理，易于快速浏览" },
      { dimension: "AI协作质量", weight: 20, whatGoodLooksLike: "Prompt 设计有效处理了信息提取的边界情况" },
      { dimension: "工程实现", weight: 10, whatGoodLooksLike: "工具稳定，导出格式正确" }
    ]
  },
  {
    id: "project_008",
    title: "AI 生成内容检测工具",
    description: "构建一个帮助识别文本是否由 AI 生成的检测工具，并给出置信度评估。",
    background: "随着 AI 内容泛滥，学术机构和媒体需要工具识别 AI 生成内容。",
    requirements: [
      "文本输入：支持粘贴任意文本",
      "检测维度：语言模式、词汇多样性、句式特征",
      "置信度输出：给出'AI生成'的概率和判断依据",
      "特征高亮：标注触发检测的具体文本特征",
      "局限性说明：诚实告知工具的准确率边界"
    ],
    deliverables: ["可运行的检测工具", "10个测试案例（含人工和AI写作）", "技术原理说明"],
    antiCheatMeasures: "要求测试经过人工润色的AI内容，展示工具在此场景的表现",
    difficulty: "hard",
    topics: ["AI检测", "内容鉴别", "学术诚信"],
    timeLimitMinutes: 90,
    rubric: [
      { dimension: "检测准确率", weight: 30, whatGoodLooksLike: "在测试集上准确率>70%，能处理常见 AI 文本特征" },
      { dimension: "解释能力", weight: 25, whatGoodLooksLike: "能说明为何判断为 AI 生成，特征有说服力" },
      { dimension: "诚实性", weight: 20, whatGoodLooksLike: "对润色的 AI 内容诚实表示不确定，不过度自信" },
      { dimension: "AI协作质量", weight: 15, whatGoodLooksLike: "利用 AI 分析文本特征的 Prompt 设计有效" },
      { dimension: "工程实现", weight: 10, whatGoodLooksLike: "工具可运行，输出清晰" }
    ]
  },
  {
    id: "project_009",
    title: "英语学习对话伙伴",
    description: "构建一个模拟真实英语对话场景的 AI 练习工具，帮助用户提升英语口语和写作。",
    background: "英语学习者缺乏低压力、高频率的英语使用机会，需要可以随时练习的对话伙伴。",
    requirements: [
      "场景选择：商务会议/日常聊天/面试练习/旅游情景",
      "对话交互：用户用英语输入，AI 用英语回应",
      "错误纠正：温和指出语法和用词错误，提供正确表达",
      "难度自适应：根据用户水平调整词汇和句式复杂度",
      "学习报告：本次对话中的常见错误总结"
    ],
    deliverables: ["可运行的对话应用", "4个不同场景的对话示例", "纠错机制说明"],
    antiCheatMeasures: "要求展示对高级英语输入和初级英语输入的差异化处理",
    difficulty: "hard",
    topics: ["语言学习", "对话系统", "教育科技"],
    timeLimitMinutes: 90,
    rubric: [
      { dimension: "对话自然度", weight: 25, whatGoodLooksLike: "AI 回应自然，符合场景，不像教学机器人" },
      { dimension: "纠错质量", weight: 25, whatGoodLooksLike: "错误识别准确，纠错温和有效，不打断对话流" },
      { dimension: "难度适应性", weight: 20, whatGoodLooksLike: "能识别用户水平并调整对话复杂度" },
      { dimension: "AI协作质量", weight: 20, whatGoodLooksLike: "Prompt 设计实现了自然+教学双重目标" },
      { dimension: "工程实现", weight: 10, whatGoodLooksLike: "对话流程完整，报告生成正确" }
    ]
  },
  {
    id: "project_010",
    title: "产品需求文档（PRD）生成助手",
    description: "构建一个帮助产品经理快速起草 PRD 的 AI 工具，从一段产品描述生成结构化需求文档。",
    background: "产品经理花费大量时间在文档起草上，需要 AI 工具帮助加速这一过程。",
    requirements: [
      "输入：一段产品功能描述（自然语言）",
      "输出：标准 PRD 结构（背景、目标用户、功能列表、用户故事、验收标准、边界情况）",
      "可编辑：生成后允许用户修改和补充",
      "版本管理：支持保存不同版本",
      "导出：Markdown 格式导出"
    ],
    deliverables: ["可运行的 PRD 生成工具", "3个不同功能场景的示例 PRD", "生成质量评估说明"],
    antiCheatMeasures: "要求处理模糊输入（如'做一个用户管理功能'），展示如何处理信息不足的情况",
    difficulty: "hard",
    topics: ["产品工具", "文档自动化", "工作效率"],
    timeLimitMinutes: 90,
    rubric: [
      { dimension: "文档完整性", weight: 25, whatGoodLooksLike: "生成的 PRD 覆盖所有关键部分，无明显遗漏" },
      { dimension: "内容质量", weight: 25, whatGoodLooksLike: "用户故事有价值，验收标准可测试" },
      { dimension: "模糊输入处理", weight: 20, whatGoodLooksLike: "信息不足时主动澄清而非胡乱填充" },
      { dimension: "AI协作质量", weight: 20, whatGoodLooksLike: "Prompt 设计产出结构化、高质量 PRD" },
      { dimension: "工程实现", weight: 10, whatGoodLooksLike: "工具稳定，导出格式正确" }
    ]
  },
  {
    id: "project_011",
    title: "情绪日记分析器",
    description: "构建一个分析用户日记文本，追踪情绪变化趋势并提供积极反馈的 AI 工具。",
    background: "越来越多的人写数字日记，但缺乏工具帮助他们理解自己的情绪模式和成长轨迹。",
    requirements: [
      "日记输入：支持多条日记文本输入（模拟历史数据）",
      "情绪分析：识别主要情绪和强度（正向/负向/中性）",
      "趋势可视化：简单的情绪变化展示（文字描述或图表）",
      "触发因素识别：什么事件与情绪低落/高涨相关",
      "积极反馈：温暖的、有建设性的回应，不是心理咨询建议"
    ],
    deliverables: ["可运行的日记分析工具", "5条不同情绪日记的测试数据", "伦理说明（数据隐私处理）"],
    antiCheatMeasures: "要求展示对极度负面内容（如抑郁倾向）的安全处理方式",
    difficulty: "hard",
    topics: ["心理健康", "情感分析", "个人成长"],
    timeLimitMinutes: 90,
    rubric: [
      { dimension: "情绪分析准确性", weight: 25, whatGoodLooksLike: "情绪识别准确，强度判断合理" },
      { dimension: "反馈质量", weight: 25, whatGoodLooksLike: "反馈温暖有共情，具体而非泛泛" },
      { dimension: "安全性设计", weight: 25, whatGoodLooksLike: "对高风险内容有合理处理，不提供超出能力的建议" },
      { dimension: "AI协作质量", weight: 15, whatGoodLooksLike: "Prompt 设计兼顾准确分析和温暖表达" },
      { dimension: "工程实现", weight: 10, whatGoodLooksLike: "工具运行稳定，数据处理正确" }
    ]
  },
  {
    id: "project_012",
    title: "新闻偏见检测器",
    description: "构建一个分析新闻文章，识别潜在偏见和立场倾向的 AI 工具。",
    background: "信息茧房和媒体偏见是现代社会的重要问题，用户需要工具帮助批判性阅读新闻。",
    requirements: [
      "新闻输入：粘贴新闻文章全文",
      "立场分析：识别文章的整体倾向（中立/偏左/偏右）",
      "偏见标注：高亮有偏见嫌疑的句子并说明原因",
      "情绪词汇识别：标注情绪化/中性的用词选择",
      "多角度建议：推荐可补充阅读的对立视角内容类型"
    ],
    deliverables: ["可运行的检测工具", "3篇测试文章（含不同立场）", "分析标准说明"],
    antiCheatMeasures: "要求处理中立新闻（不应被误判为有偏见），展示工具的假阳性率",
    difficulty: "hard",
    topics: ["媒体素养", "文本分析", "批判性思维工具"],
    timeLimitMinutes: 90,
    rubric: [
      { dimension: "偏见识别准确性", weight: 30, whatGoodLooksLike: "真实偏见被识别，中立内容不被误判" },
      { dimension: "分析有依据", weight: 25, whatGoodLooksLike: "每个偏见标注都有文本证据支撑" },
      { dimension: "平衡性", weight: 20, whatGoodLooksLike: "工具本身没有明显政治倾向" },
      { dimension: "AI协作质量", weight: 15, whatGoodLooksLike: "Prompt 设计有效处理了偏见分析的复杂性" },
      { dimension: "工程实现", weight: 10, whatGoodLooksLike: "工具稳定，标注清晰易读" }
    ]
  },
  {
    id: "project_013",
    title: "简历优化助手",
    description: "构建一个帮助求职者针对特定职位描述优化简历内容的 AI 工具。",
    background: "求职者常常不知道如何针对特定岗位调整简历，导致投递成功率低。",
    requirements: [
      "双输入：简历文本 + 目标职位描述（JD）",
      "关键词匹配：识别 JD 中的关键词并检查简历覆盖度",
      "针对性优化建议：如何改写简历以更好匹配该 JD",
      "优化前后对比：展示修改建议的具体措辞",
      "整体评分：简历与 JD 的匹配度（0-100分）"
    ],
    deliverables: ["可运行的简历优化工具", "3组简历+JD测试数据", "优化建议质量说明"],
    antiCheatMeasures: "要求处理简历和JD完全不匹配的场景（如用设计师简历申请数据科学职位）",
    difficulty: "hard",
    topics: ["求职工具", "文本匹配", "职场助手"],
    timeLimitMinutes: 90,
    rubric: [
      { dimension: "匹配分析准确性", weight: 25, whatGoodLooksLike: "关键词识别准确，不相关内容被正确过滤" },
      { dimension: "优化建议质量", weight: 30, whatGoodLooksLike: "建议具体可执行，改写后的措辞更专业" },
      { dimension: "不匹配处理", weight: 20, whatGoodLooksLike: "诚实告知不匹配情况，不给出虚假希望" },
      { dimension: "AI协作质量", weight: 15, whatGoodLooksLike: "有效设计双文档分析的 Prompt 策略" },
      { dimension: "工程实现", weight: 10, whatGoodLooksLike: "对比展示清晰，工具稳定" }
    ]
  },
  {
    id: "project_014",
    title: "产品功能命名生成器",
    description: "构建一个帮助产品团队生成功能名称和品牌语言的 AI 创意工具。",
    background: "产品功能命名往往被低估，但好的命名能大幅提升用户理解和品牌认知。",
    requirements: [
      "输入：功能描述 + 品牌调性（可选）+ 目标用户",
      "生成10个命名方案，每个附带命名理由",
      "命名维度：直白型/隐喻型/情感型/动词型",
      "可行性评估：简单评估是否容易发音、记忆、商标注册",
      "对比评分：从多个维度对候选名称打分"
    ],
    deliverables: ["可运行的命名生成工具", "3个不同产品场景的命名示例", "命名评估框架说明"],
    antiCheatMeasures: "要求处理已有强竞品名称（如'智能搜索'），说明如何差异化",
    difficulty: "hard",
    topics: ["品牌语言", "创意工具", "产品运营"],
    timeLimitMinutes: 90,
    rubric: [
      { dimension: "命名创意度", weight: 25, whatGoodLooksLike: "命名多样，涵盖不同风格，有真正的创意" },
      { dimension: "命名有依据", weight: 25, whatGoodLooksLike: "每个名字的理由清晰，不是随机生成" },
      { dimension: "可行性评估", weight: 20, whatGoodLooksLike: "实际考虑了发音、记忆、文化含义等因素" },
      { dimension: "AI协作质量", weight: 20, whatGoodLooksLike: "Prompt 设计引导 AI 生成有质量的创意而非堆砌" },
      { dimension: "工程实现", weight: 10, whatGoodLooksLike: "工具运行稳定，输出格式清晰" }
    ]
  },
  {
    id: "project_015",
    title: "社交媒体内容日历生成器",
    description: "构建一个帮助内容创作者规划社交媒体发布计划的 AI 工具。",
    background: "内容创作者需要持续产出内容，但内容策划耗时耗力，需要工具辅助规划。",
    requirements: [
      "输入：账号定位（领域、受众、风格）+ 计划周期（1周或1月）",
      "生成内容日历：每天的发布主题和内容方向",
      "内容类型多样化：干货/互动/故事/热点借势",
      "热点关联：结合常见节假日和行业热点安排",
      "执行难度标注：每条内容的生产难度（低/中/高）"
    ],
    deliverables: ["可运行的内容日历工具", "2个不同领域的内容日历示例", "内容策略说明"],
    antiCheatMeasures: "要求处理一个非常小众的领域（如工业设计），展示差异化内容策略",
    difficulty: "hard",
    topics: ["内容营销", "社交媒体", "创作工具"],
    timeLimitMinutes: 90,
    rubric: [
      { dimension: "内容多样性", weight: 25, whatGoodLooksLike: "内容类型丰富，不重复，有节奏感" },
      { dimension: "领域适配性", weight: 25, whatGoodLooksLike: "内容方向符合领域特点和受众需求" },
      { dimension: "可执行性", weight: 20, whatGoodLooksLike: "每个主题方向有足够的方向性，创作者知道怎么做" },
      { dimension: "AI协作质量", weight: 20, whatGoodLooksLike: "Prompt 设计结合了内容策略知识，而非简单列举" },
      { dimension: "工程实现", weight: 10, whatGoodLooksLike: "日历格式清晰，工具运行稳定" }
    ]
  },
  {
    id: "project_016",
    title: "客户流失预警分析工具",
    description: "构建一个分析用户行为数据，预测哪些用户可能即将流失并给出挽留建议的 AI 工具。",
    background: "SaaS 产品最重要的问题之一是用户留存，早期识别流失风险并干预是关键策略。",
    requirements: [
      "数据输入：模拟用户行为数据（登录频率、功能使用、支付记录）",
      "流失风险评估：对每个用户给出高/中/低风险评级",
      "风险因素分析：说明为什么该用户被判定为高风险",
      "挽留策略建议：针对不同风险原因的差异化挽留方案",
      "优先级排序：哪些用户最值得优先挽留（结合付费金额）"
    ],
    deliverables: ["可运行的分析工具", "包含10个用户的模拟数据集", "挽留策略框架说明"],
    antiCheatMeasures: "要求解释为什么某个高付费用户被判为低流失风险，验证逻辑一致性",
    difficulty: "hard",
    topics: ["用户运营", "流失预测", "数据分析"],
    timeLimitMinutes: 90,
    rubric: [
      { dimension: "分析逻辑合理性", weight: 30, whatGoodLooksLike: "风险判断有明确依据，逻辑自洽" },
      { dimension: "挽留策略质量", weight: 25, whatGoodLooksLike: "策略针对性强，不是千篇一律的折扣优惠" },
      { dimension: "优先级判断", weight: 20, whatGoodLooksLike: "综合考虑了风险+价值，优先级合理" },
      { dimension: "AI协作质量", weight: 15, whatGoodLooksLike: "有效利用 AI 进行模式识别和策略生成" },
      { dimension: "工程实现", weight: 10, whatGoodLooksLike: "工具可运行，分析结果清晰展示" }
    ]
  },
  {
    id: "project_017",
    title: "合同关键条款提取器",
    description: "构建一个帮助非法律专业人士快速理解合同关键内容的 AI 工具。",
    background: "普通人签署合同时常常无法快速理解法律条款，需要简单易懂的关键信息提取。",
    requirements: [
      "合同文本输入（模拟数据）",
      "关键条款提取：付款条件、违约责任、保密条款、终止条件",
      "风险条款标注：对用户不利的条款特别提示",
      "白话文翻译：将法律语言转化为普通人能理解的表达",
      "缺失条款提示：重要条款缺失时提醒用户"
    ],
    deliverables: ["可运行的合同分析工具", "2份模拟合同文本（含不同风险级别）", "免责说明设计"],
    antiCheatMeasures: "要求工具在提醒用户不利条款时，不误判中性条款为不利条款",
    difficulty: "hard",
    topics: ["法律科技", "合同分析", "用户保护"],
    timeLimitMinutes: 90,
    rubric: [
      { dimension: "关键信息提取", weight: 30, whatGoodLooksLike: "重要条款无遗漏，提取准确" },
      { dimension: "风险识别准确性", weight: 25, whatGoodLooksLike: "不利条款被正确标注，中性条款不被误判" },
      { dimension: "白话文质量", weight: 20, whatGoodLooksLike: "转化后普通人能理解，保留法律含义" },
      { dimension: "AI协作质量", weight: 15, whatGoodLooksLike: "有效设计了法律文本分析的 Prompt 策略" },
      { dimension: "工程实现", weight: 10, whatGoodLooksLike: "工具稳定，高亮标注清晰" }
    ]
  },
  {
    id: "project_018",
    title: "竞品功能对比自动化工具",
    description: "构建一个自动分析多个竞品的功能矩阵并生成对比报告的 AI 工具。",
    background: "产品团队需要持续了解竞品动态，但手工整理功能对比矩阵耗时且难以保持更新。",
    requirements: [
      "竞品描述输入：粘贴竞品官网文案或功能介绍（模拟数据）",
      "功能矩阵生成：自动识别各产品的功能点并对比",
      "差异化识别：高亮每个产品独有的特性",
      "强弱势分析：对每个维度的强弱势进行评估",
      "机会点建议：基于对比结果给出差异化机会"
    ],
    deliverables: ["可运行的对比工具", "3个竞品的模拟功能描述数据", "分析框架说明"],
    antiCheatMeasures: "要求处理功能描述模糊的竞品，展示工具如何处理信息不完整的情况",
    difficulty: "hard",
    topics: ["竞品分析", "产品策略", "信息整理"],
    timeLimitMinutes: 90,
    rubric: [
      { dimension: "功能识别完整性", weight: 25, whatGoodLooksLike: "功能点提取完整，不遗漏关键特性" },
      { dimension: "对比维度合理性", weight: 25, whatGoodLooksLike: "对比维度有意义，不是简单罗列" },
      { dimension: "机会点洞察", weight: 25, whatGoodLooksLike: "机会点有具体依据，不是泛泛建议" },
      { dimension: "AI协作质量", weight: 15, whatGoodLooksLike: "Prompt 设计有效处理了多文档分析" },
      { dimension: "工程实现", weight: 10, whatGoodLooksLike: "矩阵展示清晰，工具运行稳定" }
    ]
  },
  {
    id: "project_019",
    title: "个性化学习路径生成器",
    description: "构建一个根据用户的学习目标、现有水平和时间约束，生成定制化学习计划的 AI 工具。",
    background: "学习者面对海量学习资源不知从哪开始，需要根据个人情况定制学习路径。",
    requirements: [
      "信息收集：学习目标、当前水平（自测）、可用时间/周、期望完成时间",
      "学习路径生成：有序的学习步骤和里程碑",
      "资源推荐类型：每个阶段推荐的学习资源类型（不要求真实链接）",
      "进度追踪设计：如何检验每个阶段的掌握情况",
      "动态调整建议：如果学习进度落后，如何调整计划"
    ],
    deliverables: ["可运行的学习规划工具", "3个不同目标的学习路径示例", "路径生成逻辑说明"],
    antiCheatMeasures: "要求处理'1周学会机器学习'这种不现实的目标，展示工具如何管理期望",
    difficulty: "hard",
    topics: ["教育科技", "个性化学习", "成长工具"],
    timeLimitMinutes: 90,
    rubric: [
      { dimension: "路径合理性", weight: 30, whatGoodLooksLike: "学习顺序符合认知规律，里程碑清晰" },
      { dimension: "个性化程度", weight: 25, whatGoodLooksLike: "相同目标不同水平的用户得到不同路径" },
      { dimension: "期望管理", weight: 20, whatGoodLooksLike: "不现实的目标被合理告知并给出调整方案" },
      { dimension: "AI协作质量", weight: 15, whatGoodLooksLike: "Prompt 设计结合了教学法知识" },
      { dimension: "工程实现", weight: 10, whatGoodLooksLike: "工具运行稳定，路径展示清晰" }
    ]
  },
  {
    id: "project_020",
    title: "用户反馈智能分类与洞察系统",
    description: "构建一个自动分类和分析大量用户反馈，提炼产品改进洞察的 AI 工具。",
    background: "产品团队收到大量用户反馈（邮件、评论、工单），手工分析耗时且容易遗漏。",
    requirements: [
      "反馈批量输入（至少20条模拟数据）",
      "自动分类：Bug报告/功能请求/满意度反馈/混合类型",
      "主题聚类：将相似反馈归组，识别高频问题",
      "优先级评估：结合频率和严重程度给出优先处理建议",
      "洞察摘要：一页纸的产品改进优先级建议报告"
    ],
    deliverables: ["可运行的反馈分析工具", "包含20条模拟反馈的测试数据集", "分类标准说明"],
    antiCheatMeasures: "要求处理一条混合了Bug报告和功能请求的反馈，展示分类逻辑",
    difficulty: "hard",
    topics: ["用户运营", "反馈分析", "产品决策"],
    timeLimitMinutes: 90,
    rubric: [
      { dimension: "分类准确性", weight: 25, whatGoodLooksLike: "类别划分准确，混合反馈有合理处理" },
      { dimension: "聚类质量", weight: 25, whatGoodLooksLike: "相似问题被归到一起，主题命名有意义" },
      { dimension: "优先级洞察", weight: 25, whatGoodLooksLike: "优先级建议有依据，对产品团队有实际价值" },
      { dimension: "AI协作质量", weight: 15, whatGoodLooksLike: "有效设计了批量分析的 Prompt 流程" },
      { dimension: "工程实现", weight: 10, whatGoodLooksLike: "工具可处理批量数据，报告格式清晰" }
    ]
  }
];

// ===== 随机选择函数 =====

// Agent/OpenClaw/Skill 相关 topics 集合
const AGENT_TOPICS = new Set([
  "Agent", "OpenClaw", "Skill", "Sub-Agent", "Multi-Agent", "Agentic",
  "ReAct", "Heartbeat", "Cron", "Workspace", "Agentic Loop", "Tool Use",
  "AGENTS.md", "SOUL.md", "Agent安全", "Agent产品", "Agent能力", "Agent框架",
  "Agent记忆", "Agent评估", "Multi-Agent架构", "Skill生态", "Skill设计",
  "Skill优先", "Skill路由", "Daxiang Skill", "Canvas工具", "工具链",
  "推理机制", "自我反思", "工具与行动", "记忆工具", "幻觉级联", "状态管理",
  "触发词设计", "并行工具调用", "事实锚定", "工具选择", "自主性设计",
  "消息路由", "群聊行为", "初始化", "安全执行", "Human-in-the-Loop",
  "上下文管理", "任务分解", "可观测性", "错误处理", "规划能力"
]);

function isAgentQuestion(q: { topics: string[] }): boolean {
  return q.topics.some(t => AGENT_TOPICS.has(t));
}

export function getRandomMultipleChoice(count: number = 8) {
  const AGENT_GUARANTEED = 4; // 强制至少4道 Agent/OpenClaw/Skill 题
  const otherCount = count - AGENT_GUARANTEED;

  // 分类
  const agentPool = multipleChoicePool.filter(isAgentQuestion);
  const otherPool = multipleChoicePool.filter(q => !isAgentQuestion(q));

  // 1. 抽 Agent 题（保证4道，不足时取全部）
  const agentPick = shuffleArray([...agentPool]).slice(0, Math.min(AGENT_GUARANTEED, agentPool.length));

  // 2. 其余题按 topic 去重：每个 topic[0] 方向最多1道
  const shuffledOther = shuffleArray([...otherPool]);
  const usedTopics = new Set<string>();
  const otherPick: typeof otherPool = [];

  for (const q of shuffledOther) {
    if (otherPick.length >= otherCount) break;
    const primaryTopic = q.topics[0] || "other";
    if (!usedTopics.has(primaryTopic)) {
      usedTopics.add(primaryTopic);
      otherPick.push(q);
    }
  }

  // 如果 topic 去重后数量不够，补充允许重复 topic（兜底）
  if (otherPick.length < otherCount) {
    for (const q of shuffledOther) {
      if (otherPick.length >= otherCount) break;
      if (!otherPick.includes(q)) otherPick.push(q);
    }
  }

  // 合并后打乱顺序（避免前4题永远是 Agent 题）
  return shuffleArray([...agentPick, ...otherPick]);
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