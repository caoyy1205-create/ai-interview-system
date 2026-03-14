AI PM Interviewer (AI 产品经理面试系统)
这是一个基于 Next.js 14 开发的智能化产品经理面试系统。系统通过三个阶段（基础画像、逻辑测试、实战场景）收集候选人信息，并利用 DeepSeek-V3 模型进行多维度自动评分，结果实时持久化至 Supabase。

🚀 技术栈
框架: Next.js 14 (App Router)

数据库: Supabase (PostgreSQL)

AI 模型: DeepSeek-V3 (兼容 OpenAI SDK)

样式: Tailwind CSS

部署: Vercel

🛠️ 核心功能
多阶段面试流: 支持分步骤提交面试数据，防止数据丢失。

自动评分系统: 接入大模型，针对候选人的逻辑能力、技术理解、产品共感进行深度拆解。

数据持久化: 采用 Supabase 的 upsert 机制，确保同一 Session 的面试记录能够平滑更新。

响应式设计: 适配桌面端及移动端面试场景。

📦 环境配置
在根目录下创建 .env.local 文件，并填入以下必要参数：

📊 数据库表结构
请在 Supabase SQL Editor 中运行以下脚本以初始化表：