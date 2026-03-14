// ===== AI 面试题库 v2 =====
// 每月更新一次，当前版本：2026-03

// ===== 选择题（100道）=====
export const multipleChoicePool = [
  // --- Prompt Engineering (20道) ---
  {
    id: "mc_001",
    question: "关于大模型的 Temperature 参数，以下说法正确的是：",
    options: ["Temperature 越高，输出越确定", "Temperature 越低，输出多样性越高", "Temperature 越高，输出越随机/有创意", "Temperature 不影响输出质量"],
    correctAnswer: 2,
    explanation: "Temperature 控制采样随机性，值越高输出越多样/有创意，值越低输出越确定/保守。",
    difficulty: "easy",
    topics: ["参数调优", "采样策略"]
  },
  {
    id: "mc_002",
    question: "以下哪种 Prompt 技巧最适合解决需要多步推理的复杂数学题？",
    options: ["Zero-shot prompting", "Few-shot prompting", "Chain-of-Thought prompting", "Role prompting"],
    correctAnswer: 2,
    explanation: "Chain-of-Thought 让模型一步步展示推理过程，显著提升复杂推理任务的准确率。",
    difficulty: "easy",
    topics: ["CoT", "推理"]
  },
  {
    id: "mc_003",
    question: "Few-shot prompting 中的 'shot' 指的是：",
    options: ["API 调用次数", "提供给模型的示例数量", "模型的参数量", "Token 数量"],
    correctAnswer: 1,
    explanation: "Few-shot 中的 shot 指的是在 prompt 中提供的示例（input-output 对），帮助模型理解任务格式。",
    difficulty: "easy",
    topics: ["Few-shot", "基础概念"]
  },
  {
    id: "mc_004",
    question: "System Prompt 与 User Prompt 的主要区别是：",
    options: ["System Prompt 每次都会变，User Prompt 固定", "System Prompt 定义模型角色和行为规则，User Prompt 是用户的实际输入", "System Prompt 只能由开发者设置，User Prompt 只能由终端用户设置", "两者没有本质区别"],
    correctAnswer: 1,
    explanation: "System Prompt 用于设定模型的行为准则、角色、约束等，User Prompt 是每轮对话中用户的实际输入。",
    difficulty: "easy",
    topics: ["Prompt结构", "角色设定"]
  },
  {
    id: "mc_005",
    question: "以下哪个 Prompt 写法最可能导致模型产生幻觉（hallucination）？",
    options: ["'请根据以下资料回答问题：[资料内容]'", "'请用你的知识告诉我2024年最新的股价'", "'请逐步思考，然后给出答案'", "'如果你不知道，请说不知道'"],
    correctAnswer: 1,
    explanation: "要求模型提供实时信息（如股价）时，模型没有该数据，容易编造（幻觉）。应使用 RAG 或工具调用获取实时数据。",
    difficulty: "medium",
    topics: ["幻觉", "Prompt设计"]
  },
  {
    id: "mc_006",
    question: "Prompt 注入攻击（Prompt Injection）的主要防御手段是：",
    options: ["增加 Temperature 值", "对用户输入进行严格过滤和沙箱化，以及使用独立的指令和数据通道", "使用更大的模型", "禁止用户输入中文"],
    correctAnswer: 1,
    explanation: "Prompt 注入通过在用户输入中嵌入恶意指令覆盖系统 prompt。防御需要隔离指令与数据、过滤特殊符号、使用结构化格式等。",
    difficulty: "hard",
    topics: ["安全", "Prompt注入"]
  },
  {
    id: "mc_007",
    question: "以下哪种方法可以有效减少模型输出格式不稳定的问题？",
    options: ["降低 Temperature", "在 Prompt 中提供输出格式示例并要求 JSON 输出", "增加 max_tokens", "使用更短的 Prompt"],
    correctAnswer: 1,
    explanation: "明确指定输出格式（如 JSON schema），并提供示例，是让模型稳定输出结构化内容的最有效方法。",
    difficulty: "medium",
    topics: ["结构化输出", "格式控制"]
  },
  {
    id: "mc_008",
    question: "ReAct（Reasoning + Acting）框架的核心思想是：",
    options: ["让模型只推理不行动", "交替进行推理和工具调用，形成思考-行动-观察的循环", "使用强化学习训练模型", "让多个模型并行推理"],
    correctAnswer: 1,
    explanation: "ReAct 结合了思维链推理（Reasoning）和工具使用（Acting），通过 Thought→Action→Observation 循环解决复杂任务。",
    difficulty: "medium",
    topics: ["Agent", "ReAct"]
  },
  {
    id: "mc_009",
    question: "当你需要模型扮演一个特定角色（如医生），以下哪种 Prompt 效果最好？",
    options: ["'你是医生，回答问题'", "'假装你是医生'", "'作为一名拥有10年临床经验的内科医生，请用专业但易懂的语言解释以下症状...'", "'以医生口吻回答'"],
    correctAnswer: 2,
    explanation: "越详细的角色设定（专业背景、年限、风格要求）越能帮助模型进入角色，输出更符合预期的内容。",
    difficulty: "medium",
    topics: ["角色设定", "Prompt质量"]
  },
  {
    id: "mc_010",
    question: "Top-P（nucleus sampling）参数的作用是：",
    options: ["控制输出的最大长度", "从累积概率达到 P 的最小词汇集合中采样，平衡多样性和质量", "设置模型的置信度阈值", "控制重复惩罚"],
    correctAnswer: 1,
    explanation: "Top-P 采样只考虑累积概率达到 P 的词，排除低概率的长尾词汇，比固定 Top-K 更灵活。",
    difficulty: "hard",
    topics: ["采样策略", "参数调优"]
  },
  {
    id: "mc_011",
    question: "以下哪种场景最适合使用 Zero-shot prompting？",
    options: ["需要精确格式输出的任务", "简单分类或问答，模型对任务类型已有充分训练", "需要复杂推理的数学题", "需要模仿特定写作风格"],
    correctAnswer: 1,
    explanation: "Zero-shot 适合简单、通用的任务。对于模型已充分训练的任务类型，无需示例即可完成。",
    difficulty: "easy",
    topics: ["Zero-shot", "任务类型"]
  },
  {
    id: "mc_012",
    question: "Prompt 中加入 '请一步步思考' 为何能提升推理质量？",
    options: ["增加了 Token 数，模型有更多计算预算", "迫使模型在中间步骤中自我纠错，减少跳步错误", "改变了模型的权重", "让模型进入特殊推理模式"],
    correctAnswer: 1,
    explanation: "CoT 通过让模型显式输出中间推理步骤，使错误更容易在过程中被纠正，而不是直接跳到错误结论。",
    difficulty: "medium",
    topics: ["CoT", "推理质量"]
  },
  {
    id: "mc_013",
    question: "以下哪种 Prompt 策略最适合让模型生成多个不同角度的方案？",
    options: ["降低 Temperature 至 0", "要求模型生成单一最优方案", "使用高 Temperature 或明确要求'列出3种不同思路'", "使用 system prompt 限制输出范围"],
    correctAnswer: 2,
    explanation: "高 Temperature 增加多样性，或明确指示模型提供多种视角，都能有效获得多元化方案。",
    difficulty: "easy",
    topics: ["多样性", "创意生成"]
  },
  {
    id: "mc_014",
    question: "Prompt 长度与效果的关系，以下说法最准确的是：",
    options: ["Prompt 越长越好，信息越多效果越好", "Prompt 越短越好，避免干扰", "Prompt 应包含必要的上下文和指令，去除冗余，精准为主", "Prompt 长度不影响输出质量"],
    correctAnswer: 2,
    explanation: "最优的 Prompt 是精准而非冗长，过多无关信息会稀释关键指令，影响模型注意力。",
    difficulty: "medium",
    topics: ["Prompt优化", "效率"]
  },
  {
    id: "mc_015",
    question: "以下哪个技巧可以有效防止模型在角色扮演中'出戏'（忘记角色设定）？",
    options: ["每次对话都重新发送 system prompt", "在对话中定期插入角色提醒", "使用更短的对话轮次", "以上方法都有效，但最根本是在 system prompt 中明确角色且在每个 API 调用中包含完整对话历史"],
    correctAnswer: 3,
    explanation: "模型没有持久记忆，每次调用都需要完整上下文。保持 system prompt + 完整对话历史是维持角色一致性的根本方法。",
    difficulty: "hard",
    topics: ["角色一致性", "上下文管理"]
  },
  {
    id: "mc_016",
    question: "以下关于 Prompt 工程的说法，哪个是错误的？",
    options: ["同一个 Prompt 在不同模型上效果可能不同", "Prompt 工程是一种软技能，不需要理解模型原理", "Good Prompt 通常包含任务描述、上下文、格式要求和示例", "迭代测试是 Prompt 工程的核心方法论"],
    correctAnswer: 1,
    explanation: "Prompt 工程需要理解模型的训练方式、注意力机制、上下文窗口等原理，才能写出高质量的 Prompt。",
    difficulty: "medium",
    topics: ["Prompt工程", "误区"]
  },
  {
    id: "mc_017",
    question: "在 Prompt 中使用分隔符（如 ###、---、<tag>）的主要目的是：",
    options: ["让 Prompt 看起来更专业", "明确区分指令区域和数据区域，防止注入攻击和格式混淆", "增加 Token 消耗", "触发模型的特殊模式"],
    correctAnswer: 1,
    explanation: "分隔符帮助模型区分'指令'和'数据'，提高解析准确性，同时降低 Prompt 注入风险。",
    difficulty: "medium",
    topics: ["Prompt结构", "安全"]
  },
  {
    id: "mc_018",
    question: "Self-consistency 提示技术的工作原理是：",
    options: ["让模型自我检查输出是否一致", "多次采样生成多个推理路径，通过投票选择最常见的答案", "使用一致的 Prompt 格式", "强制模型输出相同内容"],
    correctAnswer: 1,
    explanation: "Self-consistency 通过多次采样（高 Temperature）获得多条推理链，然后对最终答案进行多数投票，提升推理准确率。",
    difficulty: "hard",
    topics: ["Self-consistency", "推理增强"]
  },
  {
    id: "mc_019",
    question: "以下哪种任务最不适合用当前的大模型直接处理？",
    options: ["文本摘要", "代码生成", "实时股票价格查询", "情感分析"],
    correctAnswer: 2,
    explanation: "大模型有知识截止日期，无法获取实时数据。实时信息查询需要结合工具调用（Tool Use）或 RAG。",
    difficulty: "easy",
    topics: ["模型局限", "实时数据"]
  },
  {
    id: "mc_020",
    question: "Tree of Thought（ToT）相比 Chain of Thought（CoT）的主要优势是：",
    options: ["Token 消耗更少", "可以探索多条推理路径并回溯，适合需要规划的复杂任务", "更容易实现", "准确率在所有任务上都更高"],
    correctAnswer: 1,
    explanation: "ToT 像搜索树一样探索多条思维路径，允许回溯和评估，对于需要规划和试错的复杂问题比线性 CoT 更强。",
    difficulty: "hard",
    topics: ["ToT", "高级推理"]
  },

  // --- 大模型原理 (15道) ---
  {
    id: "mc_021",
    question: "Transformer 架构中 Attention 机制的核心作用是：",
    options: ["加速计算速度", "让模型动态关注输入序列中不同位置的信息，捕捉长距离依赖", "减少参数量", "处理图像数据"],
    correctAnswer: 1,
    explanation: "Self-attention 让每个 token 能够关注序列中所有其他 token，解决了 RNN 难以捕捉长距离依赖的问题。",
    difficulty: "medium",
    topics: ["Transformer", "Attention"]
  },
  {
    id: "mc_022",
    question: "大模型的'上下文窗口'（Context Window）限制的是：",
    options: ["模型参数量", "单次处理的最大 Token 数量（包括输入+输出）", "GPU 显存大小", "训练数据量"],
    correctAnswer: 1,
    explanation: "Context Window 限制了模型单次能处理的总 Token 数。超出窗口的内容模型无法直接访问，需要使用 RAG 或滑动窗口等技术。",
    difficulty: "easy",
    topics: ["上下文窗口", "模型限制"]
  },
  {
    id: "mc_023",
    question: "RLHF（基于人类反馈的强化学习）的主要目的是：",
    options: ["提高模型训练速度", "让模型输出更符合人类偏好，减少有害内容", "增加模型参数量", "降低推理成本"],
    correctAnswer: 1,
    explanation: "RLHF 通过人类标注员对模型输出进行偏好排序，训练奖励模型，再用 PPO 等算法微调 LLM，使其更安全、更有帮助。",
    difficulty: "medium",
    topics: ["RLHF", "对齐"]
  },
  {
    id: "mc_024",
    question: "以下关于模型'幻觉'（Hallucination）的说法，哪个最准确？",
    options: ["幻觉只在小模型中出现", "幻觉是模型生成统计上合理但事实不正确内容的倾向，所有模型都有", "增加模型参数可以完全消除幻觉", "幻觉只发生在数学题中"],
    correctAnswer: 1,
    explanation: "幻觉是 LLM 的固有问题，因为模型是在预测下一个 token，而非查询事实数据库。所有规模的模型都有幻觉问题，只是程度不同。",
    difficulty: "easy",
    topics: ["幻觉", "模型局限"]
  },
  {
    id: "mc_025",
    question: "Fine-tuning（微调）相比 Prompt Engineering 的主要优势是：",
    options: ["成本更低", "不需要训练数据", "可以让模型学习特定领域知识和风格，减少对长 Prompt 的依赖", "推理速度更快"],
    correctAnswer: 2,
    explanation: "微调通过在特定数据集上继续训练，让模型内化领域知识，可以用更短的 Prompt 获得更好的专业效果。但成本比 Prompt Engineering 高。",
    difficulty: "medium",
    topics: ["微调", "对比分析"]
  },
  {
    id: "mc_026",
    question: "Token 化（Tokenization）中，'cat' 通常被编码为：",
    options: ["3个 Token（c、a、t）", "1个 Token", "2个 Token", "取决于词表，通常是1个 Token"],
    correctAnswer: 3,
    explanation: "常见英文单词通常是1个 Token，但具体取决于分词器（tokenizer）的词表设计。中文通常每个汉字是1-2个 Token。",
    difficulty: "medium",
    topics: ["Tokenization", "基础概念"]
  },
  {
    id: "mc_027",
    question: "模型的'知识截止日期'（Knowledge Cutoff）意味着什么？",
    options: ["模型每天都会更新知识", "模型只知道训练数据截止日期之前的信息", "模型可以访问互联网获取最新信息", "模型对某些话题有意限制输出"],
    correctAnswer: 1,
    explanation: "LLM 的训练数据有截止日期，之后的事件模型不了解。获取实时信息需要借助工具（搜索、API）或 RAG。",
    difficulty: "easy",
    topics: ["知识截止", "模型局限"]
  },
  {
    id: "mc_028",
    question: "以下哪个描述最准确地解释了为什么大模型'不擅长计数'？",
    options: ["模型没有数字概念", "Tokenization 可能将数字分割，且模型是基于概率预测下一个 Token，不是真正在'数数'", "模型被限制了数学能力", "计数是模型训练数据中未覆盖的任务"],
    correctAnswer: 1,
    explanation: "LLM 不是执行确定性计算，而是预测概率最高的 Token 序列。计数需要精确逻辑，而 LLM 的统计性质使其在此类任务上不可靠。",
    difficulty: "hard",
    topics: ["模型局限", "计数问题"]
  },
  {
    id: "mc_029",
    question: "Embedding（词嵌入）的主要作用是：",
    options: ["将文本转换为数字向量，捕捉语义相似性", "压缩模型大小", "加速推理速度", "生成图像"],
    correctAnswer: 0,
    explanation: "Embedding 将离散文本映射到连续向量空间，语义相似的内容在向量空间中距离更近，是语义搜索和 RAG 的基础。",
    difficulty: "medium",
    topics: ["Embedding", "向量表示"]
  },
  {
    id: "mc_030",
    question: "以下关于模型规模（参数量）的说法，哪个是错误的？",
    options: ["参数量越大，模型能力通常越强", "参数量越大，推理成本越高", "7B 参数的模型一定比 70B 模型差", "大模型在部分任务上可能出现'涌现'能力"],
    correctAnswer: 2,
    explanation: "经过精心微调的小模型在特定任务上可能超过更大的通用模型。模型大小不是唯一决定因素，训练数据质量和微调策略同样重要。",
    difficulty: "medium",
    topics: ["模型规模", "能力评估"]
  },
  {
    id: "mc_031",
    question: "Position Encoding（位置编码）在 Transformer 中解决的问题是：",
    options: ["减少计算量", "告诉模型 Token 在序列中的位置，因为 Attention 本身是位置无关的", "处理超长文本", "支持多语言"],
    correctAnswer: 1,
    explanation: "Self-attention 机制本质上不区分顺序，位置编码将位置信息注入 Token 表示，让模型理解词序。",
    difficulty: "hard",
    topics: ["Transformer", "位置编码"]
  },
  {
    id: "mc_032",
    question: "以下哪种情况下，选择 API 调用大模型比本地部署开源模型更合适？",
    options: ["数据极度敏感，不能离开公司网络", "需要快速原型验证，无需处理基础设施", "需要完全定制化微调", "成本优先，长期高并发"],
    correctAnswer: 1,
    explanation: "快速原型阶段，API 调用无需部署成本，适合验证想法。敏感数据、高并发、深度定制场景则更适合本地部署。",
    difficulty: "medium",
    topics: ["部署策略", "API vs 本地"]
  },
  {
    id: "mc_033",
    question: "MoE（Mixture of Experts）架构的主要优势是：",
    options: ["减少模型层数", "在保持大参数量的同时，每次推理只激活部分专家网络，降低计算成本", "提高训练数据质量", "增强多语言能力"],
    correctAnswer: 1,
    explanation: "MoE 让每个 Token 只经过少数几个'专家'子网络，使得模型总参数量可以很大，但推理时的计算量（active parameters）相对较小。",
    difficulty: "hard",
    topics: ["MoE", "模型架构"]
  },
  {
    id: "mc_034",
    question: "预训练（Pre-training）和微调（Fine-tuning）的主要区别是：",
    options: ["预训练使用更多数据，微调使用更少数据但目标任务更明确", "预训练只能用于文本，微调可用于图像", "预训练不需要 GPU，微调需要", "两者没有本质区别"],
    correctAnswer: 0,
    explanation: "预训练在海量通用数据上学习语言理解能力，微调在特定任务数据上调整模型以适应特定场景，通常数据量更少但针对性更强。",
    difficulty: "easy",
    topics: ["预训练", "微调"]
  },
  {
    id: "mc_035",
    question: "以下哪个是衡量 LLM 推理性能的正确指标？",
    options: ["FLOPS（每秒浮点运算次数）", "Tokens per second（每秒生成的 Token 数）和 TTFT（首 Token 延迟）", "训练数据量", "参数量"],
    correctAnswer: 1,
    explanation: "对于用户体验，TPS（吞吐量）和 TTFT（Time To First Token，首响应延迟）是最直接的性能指标。",
    difficulty: "medium",
    topics: ["推理性能", "指标"]
  },

  // --- RAG/向量数据库 (10道) ---
  {
    id: "mc_036",
    question: "RAG（检索增强生成）的核心作用是：",
    options: ["提高模型训练速度", "让模型访问外部知识库，减少幻觉并提供最新信息", "降低 API 调用成本", "增加模型参数量"],
    correctAnswer: 1,
    explanation: "RAG 通过检索外部知识库为生成提供证据，减少模型编造事实，并能利用实时或私有数据。",
    difficulty: "easy",
    topics: ["RAG", "幻觉减少"]
  },
  {
    id: "mc_037",
    question: "向量数据库（Vector Database）存储的主要内容是：",
    options: ["原始文本", "文本的高维向量表示（Embedding）", "SQL 查询结果", "模型权重"],
    correctAnswer: 1,
    explanation: "向量数据库专门存储和检索 Embedding 向量，支持基于语义相似度（如余弦距离）的快速近似最近邻搜索。",
    difficulty: "easy",
    topics: ["向量数据库", "Embedding"]
  },
  {
    id: "mc_038",
    question: "在 RAG 流程中，'Chunking'（分块）策略会影响：",
    options: ["只影响存储成本，不影响检索质量", "检索粒度和上下文完整性，块太小丢失上下文，块太大引入噪声", "模型的参数量", "API 调用延迟"],
    correctAnswer: 1,
    explanation: "分块策略是 RAG 质量的关键。合适的 chunk size 需要在'足够语义完整'和'不包含过多噪声'之间平衡。",
    difficulty: "medium",
    topics: ["RAG", "Chunking"]
  },
  {
    id: "mc_039",
    question: "余弦相似度（Cosine Similarity）在向量检索中衡量的是：",
    options: ["两个向量的欧氏距离", "两个向量方向的相似程度（夹角余弦值），值越接近1越相似", "向量的长度差异", "向量的维度差异"],
    correctAnswer: 1,
    explanation: "余弦相似度衡量向量方向的一致性，值域 [-1,1]，1 表示完全同向（语义最相似），-1 表示完全反向。",
    difficulty: "medium",
    topics: ["相似度计算", "向量检索"]
  },
  {
    id: "mc_040",
    question: "以下哪种场景最适合使用 RAG 而非微调？",
    options: ["需要模型掌握特定写作风格", "需要模型访问频繁更新的公司内部知识库", "需要提高模型的代码能力", "需要模型支持新语言"],
    correctAnswer: 1,
    explanation: "频繁更新的知识库用 RAG 更合适：更新知识库不需要重新训练模型。微调适合固定的领域知识和风格迁移。",
    difficulty: "medium",
    topics: ["RAG vs 微调", "场景选择"]
  },
  {
    id: "mc_041",
    question: "Hybrid Search（混合检索）结合了：",
    options: ["多个模型的输出", "向量语义搜索和关键词全文搜索（BM25）的优势", "多个数据库的数据", "图像和文本搜索"],
    correctAnswer: 1,
    explanation: "混合检索结合了向量检索的语义理解和关键词检索的精确匹配，在大多数实际场景中效果优于单一方法。",
    difficulty: "hard",
    topics: ["混合检索", "RAG优化"]
  },
  {
    id: "mc_042",
    question: "RAG 系统中 'Reranker'（重排序模型）的作用是：",
    options: ["对文档进行分类", "对初步检索结果进行二次精排，提高最终传入 LLM 的上下文质量", "生成摘要", "压缩向量维度"],
    correctAnswer: 1,
    explanation: "初步检索（如向量搜索）速度快但精度有限，Reranker 对 top-K 结果进行精确的相关性重新排序，显著提升 RAG 质量。",
    difficulty: "hard",
    topics: ["Reranker", "RAG优化"]
  },
  {
    id: "mc_043",
    question: "以下哪个是 RAG 的主要缺点？",
    options: ["无法处理私有数据", "检索质量上限受限于知识库质量，且增加了系统复杂度和延迟", "不能减少幻觉", "只支持英文"],
    correctAnswer: 1,
    explanation: "RAG 的质量取决于知识库的质量和检索策略，同时引入了额外的延迟和工程复杂度。'garbage in, garbage out'。",
    difficulty: "medium",
    topics: ["RAG局限", "系统设计"]
  },
  {
    id: "mc_044",
    question: "在构建 RAG 系统时，'Query Expansion'（查询扩展）技术的目的是：",
    options: ["增加查询的 Token 数", "通过改写或扩展用户查询来提高召回率，捕获语义相似但措辞不同的内容", "减少数据库大小", "加快检索速度"],
    correctAnswer: 1,
    explanation: "用户查询往往简短，Query Expansion 用 LLM 生成多个语义等价的查询，扩大检索范围，提高相关文档的召回率。",
    difficulty: "hard",
    topics: ["RAG优化", "查询扩展"]
  },
  {
    id: "mc_045",
    question: "以下哪个向量数据库是目前最常用的开源方案？",
    options: ["MySQL", "Pinecone", "Chroma / Weaviate / Qdrant（均为常用开源方案）", "Redis"],
    correctAnswer: 2,
    explanation: "Chroma、Weaviate、Qdrant 等都是流行的开源向量数据库。Pinecone 是商业托管方案。传统数据库不原生支持向量检索。",
    difficulty: "easy",
    topics: ["向量数据库", "工具选型"]
  },

  // --- Agent架构 (10道) ---
  {
    id: "mc_046",
    question: "AI Agent 与普通 LLM 应用的核心区别是：",
    options: ["使用了更大的模型", "Agent 可以自主规划、调用工具、执行多步骤任务，具有更强的自主性", "Agent 不需要 Prompt", "Agent 速度更快"],
    correctAnswer: 1,
    explanation: "Agent 的核心特征是：感知环境、自主规划、调用工具（Tool Use）、迭代执行，而不是单次问答。",
    difficulty: "easy",
    topics: ["Agent", "基础概念"]
  },
  {
    id: "mc_047",
    question: "Multi-Agent 系统（多 Agent 协作）的主要优势是：",
    options: ["减少 API 调用次数", "分工协作、并行处理、相互检验，处理超出单 Agent 能力的复杂任务", "降低成本", "更简单的工程实现"],
    correctAnswer: 1,
    explanation: "多 Agent 系统通过角色分工（如规划者、执行者、评审者），可以处理更复杂的任务，并通过相互审查减少错误。",
    difficulty: "medium",
    topics: ["Multi-Agent", "系统设计"]
  },
  {
    id: "mc_048",
    question: "Agent 中的 'Memory'（记忆）通常分为哪几类？",
    options: ["短期记忆和长期记忆", "Working Memory（当前上下文）、Episodic Memory（历史交互）、Semantic Memory（知识库）", "只有一种统一的记忆", "RAM 和 ROM"],
    correctAnswer: 1,
    explanation: "Agent 记忆通常分为：当前对话上下文（Working Memory）、历史会话记录（Episodic）、领域知识库（Semantic），三者服务于不同需求。",
    difficulty: "medium",
    topics: ["Agent记忆", "架构设计"]
  },
  {
    id: "mc_049",
    question: "以下哪个框架最适合构建复杂的 Multi-Agent 工作流？",
    options: ["jQuery", "LangGraph / AutoGen / CrewAI", "React.js", "TensorFlow"],
    correctAnswer: 1,
    explanation: "LangGraph、AutoGen、CrewAI 等框架专门为 Multi-Agent 工作流设计，支持 Agent 间通信、状态管理、循环执行等特性。",
    difficulty: "easy",
    topics: ["Agent框架", "工具选型"]
  },
  {
    id: "mc_050",
    question: "Tool Calling（工具调用）在 Agent 中的作用是：",
    options: ["让模型调用其他 AI 模型", "让 LLM 能够使用外部工具（搜索、代码执行、API 调用等）扩展能力边界", "优化 Prompt 格式", "压缩模型大小"],
    correctAnswer: 1,
    explanation: "Tool Calling 是 Agent 的核心能力，让 LLM 能够访问实时信息、执行代码、调用第三方 API，突破纯语言模型的能力边界。",
    difficulty: "easy",
    topics: ["Tool Calling", "Agent能力"]
  },
  {
    id: "mc_051",
    question: "Agent 系统中 'Guardrails'（护栏）的作用是：",
    options: ["提高 Agent 运行速度", "对 Agent 的输入和输出进行安全检查，防止有害内容、越权操作等", "增加 Agent 的记忆容量", "优化 Token 使用"],
    correctAnswer: 1,
    explanation: "Guardrails 是 Agent 安全的关键，包括输入过滤、输出审查、权限控制、危险操作拦截等机制。",
    difficulty: "medium",
    topics: ["Agent安全", "Guardrails"]
  },
  {
    id: "mc_052",
    question: "以下哪个是 Agentic AI 产品设计中最难解决的问题？",
    options: ["界面设计", "可靠性和可预测性：Agent 行为难以稳定复现，错误可能级联放大", "用户注册流程", "颜色配色"],
    correctAnswer: 1,
    explanation: "Agent 系统的最大挑战是可靠性：多步骤任务中任意一步出错都可能导致最终失败，且错误难以预测和追溯。",
    difficulty: "medium",
    topics: ["Agent产品", "可靠性"]
  },
  {
    id: "mc_053",
    question: "Orchestrator-Worker 模式在 Multi-Agent 中指：",
    options: ["两个模型交替工作", "一个 Orchestrator Agent 负责任务规划和分配，多个 Worker Agent 负责执行具体子任务", "主从数据库架构", "前后端分离"],
    correctAnswer: 1,
    explanation: "Orchestrator-Worker 是常见的多 Agent 架构：Orchestrator 分解任务、分配工作、汇总结果；Worker 专注执行具体任务。",
    difficulty: "medium",
    topics: ["Multi-Agent架构", "Orchestrator"]
  },
  {
    id: "mc_054",
    question: "以下哪种方式最适合让 Agent 在执行高风险操作前获得人类确认？",
    options: ["完全自动执行，事后报告", "Human-in-the-loop：在关键决策点暂停，等待人类审批后继续", "发送邮件通知", "记录日志"],
    correctAnswer: 1,
    explanation: "Human-in-the-loop 是 Agent 安全的重要模式，在删除数据、发送邮件、执行支付等高风险操作前，让人类确认是最佳实践。",
    difficulty: "medium",
    topics: ["Human-in-the-loop", "Agent安全"]
  },
  {
    id: "mc_055",
    question: "评估 AI Agent 性能时，最重要的指标组合是：",
    options: ["响应速度和成本", "任务完成率（Task Completion Rate）、错误率、每次任务的成本和步骤数", "代码行数和注释质量", "用户界面评分"],
    correctAnswer: 1,
    explanation: "Agent 的核心指标是：能否完成任务（完成率）、出错频率（错误率）、资源消耗（成本/步骤数），这三者共同衡量 Agent 的实用性。",
    difficulty: "hard",
    topics: ["Agent评估", "指标体系"]
  },

  // --- AI产品设计 (15道) ---
  {
    id: "mc_056",
    question: "在设计 AI 产品时，'渐进式披露'（Progressive Disclosure）原则指的是：",
    options: ["逐步扩大用户数量", "先展示简单操作，根据用户需要逐步展示更复杂的功能，降低认知负担", "分批发布功能", "逐步提高定价"],
    correctAnswer: 1,
    explanation: "渐进式披露让新用户快速上手（只看基础功能），高级用户能发现深度功能，是 AI 产品降低学习曲线的重要设计原则。",
    difficulty: "medium",
    topics: ["产品设计", "UX原则"]
  },
  {
    id: "mc_057",
    question: "AI 产品中'可解释性'（Explainability）最重要的应用场景是：",
    options: ["娱乐内容生成", "医疗诊断、信贷审批等高风险决策场景，用户需要知道'为什么'", "背景音乐生成", "表情包制作"],
    correctAnswer: 1,
    explanation: "高风险决策（医疗、金融、法律）中，AI 的可解释性是必须的：监管要求、建立信任、方便人工审核纠错。",
    difficulty: "medium",
    topics: ["可解释性", "高风险场景"]
  },
  {
    id: "mc_058",
    question: "设计 AI 对话产品时，以下哪个是最重要的第一步？",
    options: ["选择最强的模型", "明确产品边界：这个 AI 能做什么、不能做什么", "设计 UI 界面", "申请 API 密钥"],
    correctAnswer: 1,
    explanation: "明确边界是 AI 产品设计的首要步骤，决定了 Prompt 的设计方向、安全策略和用户预期管理。边界模糊会导致各种问题。",
    difficulty: "medium",
    topics: ["产品设计", "边界定义"]
  },
  {
    id: "mc_059",
    question: "AI 产品的'冷启动问题'指的是：",
    options: ["服务器启动慢", "新产品没有用户行为数据，AI 个性化效果差，难以吸引首批用户", "模型加载时间长", "首次运行需要下载模型"],
    correctAnswer: 1,
    explanation: "AI 产品依赖用户数据才能做好个性化，但没有用户就没有数据，没有数据就难以提供好体验——这是 AI 产品的冷启动悖论。",
    difficulty: "medium",
    topics: ["冷启动", "产品策略"]
  },
  {
    id: "mc_060",
    question: "以下哪种 AI 产品的护城河（Moat）最强？",
    options: ["使用了最新的 GPT-4 API", "构建了专有数据飞轮：用户越多→数据越多→模型越好→用户越多", "拥有精美的 UI", "发布了白皮书"],
    correctAnswer: 1,
    explanation: "数据飞轮是 AI 产品最强的护城河：用户行为数据持续优化模型，形成竞争壁垒。单纯调用 API 没有护城河。",
    difficulty: "hard",
    topics: ["护城河", "竞争壁垒"]
  },
  {
    id: "mc_061",
    question: "在 AI 产品中处理用户隐私数据的最佳实践是：",
    options: ["收集所有数据以提升模型", "最小化数据收集、明确告知用途、提供数据删除选项、加密存储传输", "只要用户同意就可以随意使用", "数据存储在本地无需特殊处理"],
    correctAnswer: 1,
    explanation: "数据隐私最佳实践：最小必要原则、知情同意、用户控制权、数据安全。这既是监管要求也是建立用户信任的基础。",
    difficulty: "medium",
    topics: ["数据隐私", "最佳实践"]
  },
  {
    id: "mc_062",
    question: "AI 产品中'反馈回路'（Feedback Loop）设计的目的是：",
    options: ["让用户多访问", "收集用户对 AI 输出的满意度，持续改进模型和 Prompt", "增加广告点击率", "提高服务器利用率"],
    correctAnswer: 1,
    explanation: "反馈回路（如👍👎、重新生成、编辑输出）让产品团队了解 AI 哪里表现好、哪里需要改进，是持续优化的核心机制。",
    difficulty: "easy",
    topics: ["反馈机制", "产品优化"]
  },
  {
    id: "mc_063",
    question: "以下哪个指标最能衡量 AI 对话产品的核心价值？",
    options: ["DAU（日活用户数）", "任务完成率（用户通过 AI 成功解决问题的比例）", "页面停留时间", "消息发送量"],
    correctAnswer: 1,
    explanation: "AI 对话产品的核心价值是帮用户解决问题，任务完成率直接衡量了这一点。DAU、消息量是间接指标，可能被误导。",
    difficulty: "medium",
    topics: ["核心指标", "产品价值"]
  },
  {
    id: "mc_064",
    question: "流式输出（Streaming Output）在 AI 产品中的主要优势是：",
    options: ["减少 API 成本", "显著改善用户感知延迟，逐字显示让等待变得可见和可接受", "提高模型准确率", "减少服务器压力"],
    correctAnswer: 1,
    explanation: "流式输出将'等待3秒看到完整答案'变成'立即看到第一个字，持续生成'，大幅改善用户体验，即使总时间相同。",
    difficulty: "easy",
    topics: ["流式输出", "用户体验"]
  },
  {
    id: "mc_065",
    question: "在 AI 产品中，'Graceful Degradation'（优雅降级）意味着：",
    options: ["逐步降低产品价格", "当 AI 无法处理请求时，提供有意义的fallback（回退）方案，而非直接报错", "减少功能以简化产品", "降低模型质量以节省成本"],
    correctAnswer: 1,
    explanation: "AI 会失败，优雅降级确保即使 AI 出错，用户也能得到帮助（如转人工、给出替代建议），而非看到技术错误。",
    difficulty: "medium",
    topics: ["容错设计", "用户体验"]
  },
  {
    id: "mc_066",
    question: "AI 产品中'幻觉风险'对产品设计的影响主要体现在：",
    options: ["界面颜色选择", "需要设计验证机制、来源引用、人工审核流程，尤其在高风险场景", "定价策略", "服务器选择"],
    correctAnswer: 1,
    explanation: "幻觉风险要求产品层面的设计应对：附上参考来源、标注'AI可能出错'、高风险场景加入人工审核、提供反馈纠错机制。",
    difficulty: "medium",
    topics: ["幻觉风险", "产品设计"]
  },
  {
    id: "mc_067",
    question: "以下哪个是 AI 产品 PMF（产品市场契合度）的最强信号？",
    options: ["媒体曝光量多", "用户自发推荐并表示'离不开这个产品了'", "融资金额大", "注册用户数多"],
    correctAnswer: 1,
    explanation: "PMF 的最强信号是用户留存和口碑传播。用户说'如果你们关闭，我会非常失望'是 Sean Ellis 提出的经典 PMF 测试标准。",
    difficulty: "easy",
    topics: ["PMF", "产品增长"]
  },
  {
    id: "mc_068",
    question: "为什么 AI 产品的 A/B 测试比传统产品更复杂？",
    options: ["AI 产品没法做 A/B 测试", "AI 输出的随机性使得相同输入可能有不同输出，导致实验结果难以复现和解释", "A/B 测试成本更高", "AI 产品用户更少"],
    correctAnswer: 1,
    explanation: "AI 的非确定性输出使 A/B 测试结果充满噪声，需要更大的样本量、控制随机性（固定 seed）和更严格的实验设计。",
    difficulty: "hard",
    topics: ["A/B测试", "产品实验"]
  },
  {
    id: "mc_069",
    question: "在设计 AI 写作助手时，以下哪个功能最能提升用户留存？",
    options: ["更好看的字体", "个人风格学习：AI 逐渐学习用户写作风格，输出越来越符合个人偏好", "更多颜色主题", "更快的加载速度"],
    correctAnswer: 1,
    explanation: "个性化是 AI 产品留存的关键机制：用得越多，AI 越了解你，产品越难被替代。这就是数据飞轮在产品层面的体现。",
    difficulty: "medium",
    topics: ["个性化", "用户留存"]
  },
  {
    id: "mc_070",
    question: "以下哪种 AI 产品商业模式目前被验证最成熟？",
    options: ["免费但看广告", "SaaS 订阅制（按月/年付费获取 AI 能力）", "一次性买断", "用户越多，价格越高"],
    correctAnswer: 1,
    explanation: "SaaS 订阅制是当前 AI 产品最主流的商业模式（Cursor、ChatGPT Plus、GitHub Copilot 等），与 AI 能力持续更新的特点完美匹配。",
    difficulty: "easy",
    topics: ["商业模式", "变现策略"]
  },

  // --- 数据标注与评估 (10道) ---
  {
    id: "mc_071",
    question: "LLM 评估中，'LLM-as-a-Judge'（用大模型评判）的主要风险是：",
    options: ["评估成本高", "评判模型可能有偏见（如偏好自己的输出），且难以评估评判者自身的准确性", "速度慢", "不支持中文"],
    correctAnswer: 1,
    explanation: "LLM-as-a-Judge 存在'位置偏见'（更喜欢第一个选项）、'自我偏见'（评判同模型的输出更高）、'冗长偏见'等已知问题。",
    difficulty: "hard",
    topics: ["LLM评估", "评判偏见"]
  },
  {
    id: "mc_072",
    question: "BLEU 分数（用于评估机器翻译）主要衡量的是：",
    options: ["语义相似度", "候选译文与参考译文之间的 n-gram 重叠度", "流畅度", "情感一致性"],
    correctAnswer: 1,
    explanation: "BLEU 基于 n-gram 精确匹配计算翻译质量，简单高效但无法捕捉语义等价的不同表达，已逐渐被神经评估指标补充。",
    difficulty: "medium",
    topics: ["评估指标", "BLEU"]
  },
  {
    id: "mc_073",
    question: "在数据标注中，'标注一致性'（Inter-Annotator Agreement）低说明：",
    options: ["标注师工资太低", "标注任务定义不够清晰，或任务本身存在主观性，需要改进标注指南", "数据质量高", "模型训练完成"],
    correctAnswer: 1,
    explanation: "标注一致性低是危险信号：说明标注师对任务理解不一致，会引入噪声标签，影响模型训练质量。需要澄清定义、加强培训。",
    difficulty: "medium",
    topics: ["数据标注", "质量控制"]
  },
  {
    id: "mc_074",
    question: "以下哪个指标最适合评估 AI 客服机器人的性能？",
    options: ["模型参数量", "首次解决率（FCR）：不需要人工介入就解决问题的比例", "响应字数", "对话轮次"],
    correctAnswer: 1,
    explanation: "FCR（First Contact Resolution Rate）直接反映 AI 客服的自主解决能力，是替代人工客服最关键的业务指标。",
    difficulty: "easy",
    topics: ["AI客服", "评估指标"]
  },
  {
    id: "mc_075",
    question: "Golden Dataset（黄金数据集）在 LLM 评估中的作用是：",
    options: ["用来训练模型", "提供人工标注的高质量参考答案，作为自动评估的基准", "存储用户数据", "测试服务器性能"],
    correctAnswer: 1,
    explanation: "Golden Dataset 是精心策划的评估集，覆盖关键场景，有权威的参考答案，是衡量模型和 Prompt 改进效果的基准。",
    difficulty: "medium",
    topics: ["评估基准", "数据质量"]
  },
  {
    id: "mc_076",
    question: "以下哪种评估方法最适合评估开放式文本生成质量？",
    options: ["准确率（Accuracy）", "人类评估 + LLM-as-a-Judge 结合，从多维度（相关性、准确性、流畅度等）评分", "BLEU 单一指标", "字数统计"],
    correctAnswer: 1,
    explanation: "开放式生成没有唯一正确答案，需要从多维度评估。人类评估最准但贵，LLM-as-a-Judge 可扩展，两者结合最可靠。",
    difficulty: "hard",
    topics: ["评估方法", "开放式生成"]
  },
  {
    id: "mc_077",
    question: "在 AI 产品迭代中，'Evals First'（评估先行）原则指：",
    options: ["先评估竞品", "在修改 Prompt/模型前先建立评估体系，确保改进可量化、可回归", "先评估用户需求", "先评估市场规模"],
    correctAnswer: 1,
    explanation: "没有评估体系就迭代，等于'盲飞'。Evals First 要求先定义成功标准（评估集+指标），再做改进，确保每次迭代有据可依。",
    difficulty: "hard",
    topics: ["产品迭代", "评估先行"]
  },
  {
    id: "mc_078",
    question: "Recall 和 Precision 在 RAG 系统评估中分别衡量什么？",
    options: ["模型大小和速度", "Recall：相关文档被召回的比例；Precision：召回文档中实际相关的比例", "响应时间和成本", "用户满意度和留存率"],
    correctAnswer: 1,
    explanation: "RAG 的召回评估：Recall 衡量'有多少相关内容被找到'（覆盖率），Precision 衡量'找到的内容有多少是真正相关的'（精确度）。",
    difficulty: "medium",
    topics: ["RAG评估", "Recall/Precision"]
  },
  {
    id: "mc_079",
    question: "RLHF 数据标注中，'偏好对比标注'（Preference Comparison）相比'绝对评分'的优势是：",
    options: ["速度更快", "人类更擅长判断'A比B好'而非给出绝对分数，一致性更高", "成本更低", "不需要专业标注师"],
    correctAnswer: 1,
    explanation: "认知科学表明人类在相对比较上比绝对评分更一致（锚定效应）。RLHF 使用偏好对比正是基于此，提高了标注质量。",
    difficulty: "hard",
    topics: ["RLHF", "标注设计"]
  },
  {
    id: "mc_080",
    question: "以下哪个是'数据飞轮'成立的必要条件？",
    options: ["资金充足", "用户产生的数据能够直接或间接用于改进产品，形成正反馈循环", "团队规模大", "模型参数多"],
    correctAnswer: 1,
    explanation: "数据飞轮的核心是'数据→改进→更多用户→更多数据'的闭环。如果用户数据无法有效改进产品，飞轮就不成立。",
    difficulty: "medium",
    topics: ["数据飞轮", "竞争壁垒"]
  },

  // --- AI伦理与安全 (10道) ---
  {
    id: "mc_081",
    question: "AI 系统中的'偏见'（Bias）最常见的来源是：",
    options: ["模型参数设置不当", "训练数据中反映了历史社会偏见，模型学习并放大了这些偏见", "算法本身有道德观念", "工程师的主观意愿"],
    correctAnswer: 1,
    explanation: "AI 偏见主要来自训练数据。数据中的历史偏见（性别、种族歧视等）会被模型学习，并在预测中放大，造成系统性不公平。",
    difficulty: "easy",
    topics: ["AI偏见", "伦理"]
  },
  {
    id: "mc_082",
    question: "GDPR（欧盟通用数据保护条例）对 AI 产品的主要影响是：",
    options: ["要求使用特定编程语言", "限制个人数据收集、要求用户同意、赋予数据删除权（'被遗忘权'）", "禁止使用 AI", "要求开源代码"],
    correctAnswer: 1,
    explanation: "GDPR 对 AI 产品影响深远：用户有权了解数据如何被使用、要求删除个人数据，违规最高罚款 4% 年营收或 2000 万欧元。",
    difficulty: "medium",
    topics: ["GDPR", "数据监管"]
  },
  {
    id: "mc_083",
    question: "以下哪个行为违反了 AI 伦理中的'透明度'原则？",
    options: ["告诉用户他们在与 AI 对话", "让 AI 冒充真实人物与用户对话而不告知", "标注 AI 生成内容", "解释 AI 决策依据"],
    correctAnswer: 1,
    explanation: "透明度原则要求用户知道自己在与 AI 交互。AI 冒充真人是欺骗行为，违反了基本伦理准则，也是许多国家监管明确禁止的。",
    difficulty: "easy",
    topics: ["AI透明度", "伦理原则"]
  },
  {
    id: "mc_084",
    question: "深度伪造（Deepfake）技术带来的最主要伦理风险是：",
    options: ["计算成本高", "可被用于伪造他人言行，散布虚假信息，侵犯个人尊严和社会信任", "生成质量不够好", "需要大量存储空间"],
    correctAnswer: 1,
    explanation: "Deepfake 可以伪造政治人物言论、制作非自愿色情内容、实施诈骗等，对个人名誉和社会信任造成严重威胁。",
    difficulty: "easy",
    topics: ["Deepfake", "伦理风险"]
  },
  {
    id: "mc_085",
    question: "以下哪种做法体现了 AI 系统设计中的'人类监督'（Human Oversight）原则？",
    options: ["完全自动化，减少人工干预", "在高风险决策中保留人工审核环节，确保 AI 不会完全独立做出关键决定", "使用最强的模型", "不记录 AI 决策过程"],
    correctAnswer: 1,
    explanation: "Human Oversight 是 AI 安全的核心原则，尤其在医疗、法律、金融等高风险领域，人类必须保持对 AI 决策的最终控制权。",
    difficulty: "medium",
    topics: ["人类监督", "AI安全"]
  },
  {
    id: "mc_086",
    question: "AI 生成内容的版权归属问题，目前主流司法观点是：",
    options: ["版权归 AI 所有", "版权归使用 AI 的人所有", "纯 AI 生成内容通常不受版权保护，人类创作部分可受保护，仍在各国法律演进中", "版权归 AI 公司所有"],
    correctAnswer: 2,
    explanation: "目前美国、中国等主要司法管辖区的主流观点是：纯 AI 生成内容缺乏'人类创作'要素，版权保护存在争议，各国法律仍在完善。",
    difficulty: "hard",
    topics: ["AI版权", "法律问题"]
  },
  {
    id: "mc_087",
    question: "以下哪个是'AI 对齐'（AI Alignment）问题的核心挑战？",
    options: ["让 AI 运行更快", "确保 AI 系统的目标和行为与人类价值观和意图保持一致，防止目标偏离", "降低训练成本", "提高模型参数量"],
    correctAnswer: 1,
    explanation: "AI 对齐的核心是：如何确保越来越强大的 AI 系统按照人类真实意图行事，而不是在追求错误目标或出现不可预见的行为。",
    difficulty: "medium",
    topics: ["AI对齐", "AI安全"]
  },
  {
    id: "mc_088",
    question: "在企业使用 ChatGPT 处理内部数据时，最主要的安全风险是：",
    options: ["ChatGPT 响应太慢", "敏感数据（商业机密、用户隐私）可能被用于训练数据或泄露给第三方", "ChatGPT 不支持中文", "API 调用太贵"],
    correctAnswer: 1,
    explanation: "将内部敏感数据发送给第三方 AI 服务存在数据泄露风险。企业应评估数据分类，对高敏感数据使用本地部署方案或签署数据处理协议。",
    difficulty: "medium",
    topics: ["数据安全", "企业AI"]
  },
  {
    id: "mc_089",
    question: "以下哪个是负责任 AI（Responsible AI）实践的核心要素？",
    options: ["只关注商业收益", "公平性（Fairness）、可靠性（Reliability）、隐私（Privacy）、包容性（Inclusiveness）、透明度（Transparency）", "只关注技术先进性", "使用最新的模型"],
    correctAnswer: 1,
    explanation: "微软等机构提出的负责任 AI 框架包含多个维度：公平、可靠、隐私、包容、透明、责任，这些原则共同构成负责任 AI 的基础。",
    difficulty: "medium",
    topics: ["负责任AI", "伦理框架"]
  },
  {
    id: "mc_090",
    question: "AI 系统的'可问责性'（Accountability）要求：",
    options: ["AI 系统能自我问责", "明确 AI 系统决策的责任主体（开发者/运营者/用户），并建立追责机制", "所有决策都需要公开", "禁止使用黑盒模型"],
    correctAnswer: 1,
    explanation: "可问责性要求：当 AI 系统造成损害时，应能明确谁负责、如何补救。这涉及到责任链的设计，是 AI 治理的关键问题。",
    difficulty: "hard",
    topics: ["可问责性", "AI治理"]
  },

  // --- 竞品与市场 (10道) ---
  {
    id: "mc_091",
    question: "以下哪家公司发布了 Claude 系列大模型？",
    options: ["OpenAI", "Google", "Anthropic", "Meta"],
    correctAnswer: 2,
    explanation: "Claude 系列（Claude 3 Haiku/Sonnet/Opus 等）由 Anthropic 开发。OpenAI 开发 GPT 系列，Google 开发 Gemini，Meta 开发 Llama。",
    difficulty: "easy",
    topics: ["模型厂商", "竞品"]
  },
  {
    id: "mc_092",
    question: "LLaMA 模型与 GPT-4 的主要区别是：",
    options: ["LLaMA 只支持英文", "LLaMA 是开源模型，可以本地部署和微调；GPT-4 是闭源商业模型，只能通过 API 调用", "LLaMA 参数量更大", "LLaMA 不能做对话"],
    correctAnswer: 1,
    explanation: "Meta 的 LLaMA 系列是目前最有影响力的开源 LLM，允许研究和商业使用（有许可协议）；GPT-4 是 OpenAI 的闭源商业模型。",
    difficulty: "easy",
    topics: ["开源vs闭源", "竞品分析"]
  },
  {
    id: "mc_093",
    question: "以下哪个是 GitHub Copilot 的主要竞争对手？",
    options: ["Notion AI", "Cursor、Tabnine、Amazon CodeWhisperer", "Midjourney", "Stable Diffusion"],
    correctAnswer: 1,
    explanation: "AI 编程助手赛道竞争激烈：Cursor（基于 Claude/GPT）、Tabnine（支持多模型）、Amazon CodeWhisperer（AWS 集成）是 Copilot 的主要竞争者。",
    difficulty: "medium",
    topics: ["AI编程", "竞品格局"]
  },
  {
    id: "mc_094",
    question: "Midjourney、DALL-E、Stable Diffusion 三者的主要区别是：",
    options: ["只是名称不同", "Midjourney 是闭源订阅制（以质量著称），DALL-E 是 OpenAI 的商业 API，Stable Diffusion 是开源可本地部署", "都是同一家公司的产品", "只支持不同语言"],
    correctAnswer: 1,
    explanation: "三者代表了图像生成市场的不同商业模式：Midjourney（订阅质量优先）、DALL-E（API集成）、Stable Diffusion（开源生态），各有适用场景。",
    difficulty: "medium",
    topics: ["图像生成", "竞品对比"]
  },
  {
    id: "mc_095",
    question: "以下哪个正确描述了'模型即服务'（Model as a Service）商业模式？",
    options: ["买断模型软件", "按 API 调用次数或 Token 数量收费，无需管理底层基础设施", "免费使用所有功能", "按用户数量订阅"],
    correctAnswer: 1,
    explanation: "MaaS 模式（如 OpenAI API、Anthropic API）让开发者无需部署模型，按实际使用量付费（per token），降低了 AI 应用的开发门槛。",
    difficulty: "easy",
    topics: ["商业模式", "MaaS"]
  },
  {
    id: "mc_096",
    question: "以下哪家公司在企业 AI 助手市场占据最大优势？",
    options: ["Twitter", "Microsoft（凭借 Copilot 深度集成 Office 365 生态）", "Netflix", "Uber"],
    correctAnswer: 1,
    explanation: "Microsoft 将 AI Copilot 深度集成到 Word、Excel、Teams 等全球数亿用户使用的工具中，在企业 AI 助手市场占据显著优势。",
    difficulty: "easy",
    topics: ["企业AI", "市场格局"]
  },
  {
    id: "mc_097",
    question: "以下关于国内 AI 大模型竞争格局的描述，哪个最准确？",
    options: ["国内只有一家做大模型", "百度文心、阿里通义、腾讯混元、字节豆包等形成百模大战，头部效应逐渐显现", "国内大模型全部开源", "国内没有自研大模型"],
    correctAnswer: 1,
    explanation: "国内涌现出大量大模型（百模大战），但随着竞争深化，头部效应出现，有产品化能力和数据壁垒的厂商逐渐脱颖而出。",
    difficulty: "easy",
    topics: ["国内AI", "市场格局"]
  },
  {
    id: "mc_098",
    question: "Perplexity AI 与传统搜索引擎（Google）的核心差异是：",
    options: ["只是界面不同", "Perplexity 以对话形式直接给出综合答案并附来源，而非返回链接列表", "Perplexity 不能搜索实时内容", "两者完全相同"],
    correctAnswer: 1,
    explanation: "Perplexity 代表了'答案引擎'范式：直接给出综合性答案+引用来源，颠覆了传统搜索'返回链接，用户自己阅读'的模式。",
    difficulty: "medium",
    topics: ["搜索变革", "竞品分析"]
  },
  {
    id: "mc_099",
    question: "以下哪个是当前 AI 产业链中利润率最高的环节？",
    options: ["硬件制造（非芯片）", "AI芯片（以英伟达 GPU 为代表）", "数据标注服务", "AI 应用层"],
    correctAnswer: 1,
    explanation: "英伟达凭借 CUDA 生态壁垒和 H100/A100 等 AI 芯片，在 AI 算力需求爆发期获得了超高利润率（毛利率超过 70%）。",
    difficulty: "medium",
    topics: ["AI产业链", "利润分析"]
  },
  {
    id: "mc_100",
    question: "以下哪个趋势最能代表 2024-2025 年 AI 产品的主要方向？",
    options: ["AI 泡沫破裂，市场萎缩", "从'大模型能力展示'转向'垂直场景深耕'，AI Agent 和工作流自动化成为主战场", "所有 AI 公司合并为一家", "AI 完全取代人类工作"],
    correctAnswer: 1,
    explanation: "2024-2025 年 AI 产品趋势：通用大模型能力趋于饱和，差异化竞争转向垂直场景。Agent 自动化工作流成为最热门的产品方向。",
    difficulty: "medium",
    topics: ["产品趋势", "行业洞察"]
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
      "      "触发因素识别：什么事件与情绪低落/高涨相关",
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
