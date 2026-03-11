export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">
          AI 产品经理面试系统
        </h1>
        <p className="text-gray-400">
          请在规定时间内完成系统给定的项目任务，并合理使用 AI 工具。
        </p>
        <a
          href="/exam"
          className="inline-block mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
        >
          开始面试
        </a>
      </div>
    </main>
  );
}
