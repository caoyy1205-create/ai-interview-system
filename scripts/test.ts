/**
 * AI Interview System - Automated Test Suite
 * Run with: npx tsx scripts/test.ts
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

let passCount = 0;
let failCount = 0;

function pass(description: string, actual?: any) {
  passCount++;
  const val = actual !== undefined ? ` (actual: ${JSON.stringify(actual)})` : "";
  console.log(`✅ ${description}${val}`);
}

function fail(description: string, actual?: any) {
  failCount++;
  const val = actual !== undefined ? ` (actual: ${JSON.stringify(actual)})` : "";
  console.log(`❌ ${description}${val}`);
}

async function fetchJSON(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  const text = await res.text();
  let json: any;
  try {
    json = JSON.parse(text);
  } catch {
    json = { _raw: text };
  }
  return { status: res.status, ok: res.ok, json };
}

// ---------------------------------------------------------------------------
// T1: Basic happy-path flows
// ---------------------------------------------------------------------------
async function testT1() {
  console.log("\n--- T1: Basic happy-path flows ---");

  // T1-1: POST /api/session/start → sessionId + task
  let sessionId = "";
  let task: any = null;
  {
    const { status, ok, json } = await fetchJSON(`${BASE_URL}/api/session/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    if (ok && json.sessionId && json.task) {
      pass("POST /api/session/start → returns sessionId and task", {
        sessionId: json.sessionId,
        taskId: json.task?.id,
      });
      sessionId = json.sessionId;
      task = json.task;
    } else {
      fail("POST /api/session/start → returns sessionId and task", {
        status,
        json,
      });
    }
  }

  // T1-2: POST /api/chat (with message and task info)
  {
    const body: any = {
      message: "Please briefly explain what this task requires.",
      sessionId,
      taskId: task?.id,
    };
    if (task) {
      body.task = {
        title: task.title,
        background: task.background,
        requirements: task.requirements,
      };
    }

    const { status, ok, json } = await fetchJSON(`${BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (ok && json.reply && typeof json.reply === "string" && json.reply.length > 0) {
      pass("POST /api/chat (with task info) → returns reply", {
        replyLength: json.reply.length,
      });
    } else {
      fail("POST /api/chat (with task info) → returns reply", { status, json });
    }
  }

  // T1-3: POST /api/submit (complete fields) → ok: true
  {
    const { status, ok, json } = await fetchJSON(`${BASE_URL}/api/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        taskId: task?.id || "task-ai-interview-mvp-01",
        repoUrl: "https://github.com/test/test-repo",
        notes: "Test submission with complete fields.",
      }),
    });

    if (ok && json.ok === true) {
      pass("POST /api/submit (complete fields) → returns ok:true", {
        ok: json.ok,
      });
    } else {
      fail("POST /api/submit (complete fields) → returns ok:true", {
        status,
        json,
      });
    }
  }
}

// ---------------------------------------------------------------------------
// T2: Validation / 400 errors
// ---------------------------------------------------------------------------
async function testT2() {
  console.log("\n--- T2: Validation errors ---");

  // T2-1: POST /api/submit without repoUrl → 400
  {
    const { status, json } = await fetchJSON(`${BASE_URL}/api/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "test_session_123",
        taskId: "task-ai-interview-mvp-01",
        // repoUrl intentionally omitted
        notes: "Test without repoUrl",
      }),
    });

    if (status === 400) {
      pass("POST /api/submit without repoUrl → 400", { status });
    } else {
      fail("POST /api/submit without repoUrl → 400", { status, json });
    }
  }

  // T2-2: POST /api/submit without sessionId → 400
  {
    const { status, json } = await fetchJSON(`${BASE_URL}/api/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // sessionId intentionally omitted
        taskId: "task-ai-interview-mvp-01",
        repoUrl: "https://github.com/test/test-repo",
        notes: "Test without sessionId",
      }),
    });

    if (status === 400) {
      pass("POST /api/submit without sessionId → 400", { status });
    } else {
      fail("POST /api/submit without sessionId → 400", { status, json });
    }
  }
}

// ---------------------------------------------------------------------------
// T4: Score ordering (bad < medium < good)
// ---------------------------------------------------------------------------
async function testT4() {
  console.log("\n--- T4: Score ordering (bad < medium < good) ---");

  const taskTitle = "构建 AI 面试系统 MVP";
  const rubric = [
    { dimension: "AI协作成熟度", weight: 25, whatGoodLooksLike: "多轮优化、批判性思考、非盲目复制" },
    { dimension: "产品思维", weight: 25, whatGoodLooksLike: "识别核心目标、边界条件、MVP意识" },
    { dimension: "工程意识", weight: 25, whatGoodLooksLike: "结构清晰、错误处理、模块化" },
    { dimension: "表达能力", weight: 25, whatGoodLooksLike: "清晰、诚实、逻辑连贯" },
  ];

  const answers = [
    {
      label: "差",
      notes: "我就随便写了一下，没有认真想，也没怎么用AI，直接提交了。",
      conversation: "user: 帮我写代码\nassistant: 好的，这是代码",
      aiCount: 1,
    },
    {
      label: "中",
      notes: "我拆解了需求，用AI辅助生成了部分代码，但没有做完整的错误处理，时间不够。取舍：先完成核心功能再优化。",
      conversation:
        "user: 帮我拆解这个任务\nassistant: 可以分为几个步骤...\nuser: 如何处理边界情况\nassistant: 建议添加验证...",
      aiCount: 5,
    },
    {
      label: "好",
      notes: "我系统性地拆解了需求，识别了三个核心风险：1.session管理、2.AI输出质量、3.评估偏差。我通过多轮prompt迭代优化了评估模块，并对AI输出进行了验证和修正。未完成项：实时协作功能，原因是时间有限，但已在README中说明了迭代路径。",
      conversation:
        "user: 请帮我分析这个系统的核心风险\nassistant: 主要风险包括...\nuser: 对于第二个风险，有什么具体的缓解方案\nassistant: 可以通过...\nuser: 这个方案有什么缺陷\nassistant: 缺陷在于...\nuser: 修改prompt让它更精确\nassistant: 修改后的prompt是...",
      aiCount: 12,
    },
  ];

  const scores: number[] = [];

  for (const answer of answers) {
    try {
      const { ok, json } = await fetchJSON(`${BASE_URL}/api/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskTitle,
          rubric,
          notes: answer.notes,
          aiCount: answer.aiCount,
          conversation: answer.conversation,
        }),
      });

      if (!ok) {
        fail(`T4: evaluate for "${answer.label}" answer → API returned error`, json);
        scores.push(-1);
        continue;
      }

      let text = json.raw || "";
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(text);
      scores.push(parsed.totalScore);
      console.log(`  ${answer.label}答案得分：${parsed.totalScore}`);
    } catch (e: any) {
      fail(`T4: evaluate for "${answer.label}" → exception`, e.message);
      scores.push(-1);
    }
  }

  const [scoreA, scoreB, scoreC] = scores;
  if (scoreA >= 0 && scoreB >= 0 && scoreC >= 0) {
    if (scoreA < scoreB && scoreB < scoreC) {
      pass(`T4: Score ordering correct: 差(${scoreA}) < 中(${scoreB}) < 好(${scoreC})`);
    } else {
      fail(`T4: Score ordering NOT correct: 差(${scoreA}), 中(${scoreB}), 好(${scoreC}) — expected A<B<C`);
    }
  } else {
    fail("T4: Could not compare scores due to errors above");
  }
}

// ---------------------------------------------------------------------------
// T5: Consistency (std dev < 10 for medium answer, 3 runs)
// ---------------------------------------------------------------------------
async function testT5() {
  console.log("\n--- T5: Score consistency (std dev < 10) ---");

  const taskTitle = "构建 AI 面试系统 MVP";
  const rubric = [
    { dimension: "AI协作成熟度", weight: 25, whatGoodLooksLike: "多轮优化、批判性思考、非盲目复制" },
    { dimension: "产品思维", weight: 25, whatGoodLooksLike: "识别核心目标、边界条件、MVP意识" },
    { dimension: "工程意识", weight: 25, whatGoodLooksLike: "结构清晰、错误处理、模块化" },
    { dimension: "表达能力", weight: 25, whatGoodLooksLike: "清晰、诚实、逻辑连贯" },
  ];

  const mediumAnswer = {
    notes: "我拆解了需求，用AI辅助生成了部分代码，但没有做完整的错误处理，时间不够。取舍：先完成核心功能再优化。",
    conversation:
      "user: 帮我拆解这个任务\nassistant: 可以分为几个步骤...\nuser: 如何处理边界情况\nassistant: 建议添加验证...",
    aiCount: 5,
  };

  const scores: number[] = [];

  for (let i = 0; i < 3; i++) {
    try {
      const { ok, json } = await fetchJSON(`${BASE_URL}/api/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskTitle,
          rubric,
          notes: mediumAnswer.notes,
          aiCount: mediumAnswer.aiCount,
          conversation: mediumAnswer.conversation,
        }),
      });

      if (!ok) {
        fail(`T5: run ${i + 1} → API error`, json);
        continue;
      }

      let text = json.raw || "";
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(text);
      scores.push(parsed.totalScore);
      console.log(`  Run ${i + 1} score: ${parsed.totalScore}`);
    } catch (e: any) {
      fail(`T5: run ${i + 1} → exception`, e.message);
    }
  }

  if (scores.length === 3) {
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);
    if (stdDev < 10) {
      pass(`T5: Std dev ${stdDev.toFixed(2)} < 10 for 3 runs of medium answer`, { scores, stdDev });
    } else {
      fail(`T5: Std dev ${stdDev.toFixed(2)} >= 10 (too inconsistent)`, { scores, stdDev });
    }
  } else {
    fail(`T5: Only ${scores.length}/3 runs succeeded`);
  }
}

// ---------------------------------------------------------------------------
// T7: Empty notes + empty conversation → score < 40 AND evidence contains 不足/无法
// ---------------------------------------------------------------------------
async function testT7() {
  console.log("\n--- T7: Empty notes + empty conversation → low score ---");

  const taskTitle = "构建 AI 面试系统 MVP";
  const rubric = [
    { dimension: "AI协作成熟度", weight: 25, whatGoodLooksLike: "多轮优化、批判性思考、非盲目复制" },
    { dimension: "产品思维", weight: 25, whatGoodLooksLike: "识别核心目标、边界条件、MVP意识" },
    { dimension: "工程意识", weight: 25, whatGoodLooksLike: "结构清晰、错误处理、模块化" },
    { dimension: "表达能力", weight: 25, whatGoodLooksLike: "清晰、诚实、逻辑连贯" },
  ];

  try {
    const { ok, json } = await fetchJSON(`${BASE_URL}/api/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskTitle,
        rubric,
        notes: "",       // empty notes
        aiCount: 0,
        conversation: "", // empty conversation
      }),
    });

    if (!ok) {
      fail("T7: evaluate with empty inputs → API error", json);
      return;
    }

    let text = json.raw || "";
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(text);

    const score = parsed.totalScore;
    const allText = JSON.stringify(parsed);
    const hasKeywords = allText.includes("不足") || allText.includes("无法") || allText.includes("insufficient") || allText.includes("no information");

    console.log(`  Score: ${score}, has insufficient keywords: ${hasKeywords}`);

    if (score < 40) {
      pass(`T7: totalScore ${score} < 40 for empty inputs`);
    } else {
      fail(`T7: totalScore ${score} >= 40 for empty inputs (expected low score)`, { score });
    }

    if (hasKeywords) {
      pass("T7: evidence contains 不足/无法 keywords");
    } else {
      fail("T7: evidence does NOT contain 不足/无法 keywords", { snippet: allText.slice(0, 200) });
    }
  } catch (e: any) {
    fail("T7: exception", e.message);
  }
}

// ---------------------------------------------------------------------------
// Main runner
// ---------------------------------------------------------------------------
async function main() {
  console.log(`\n🧪 AI Interview System - Automated Tests`);
  console.log(`   BASE_URL: ${BASE_URL}`);
  console.log(`   Time: ${new Date().toISOString()}\n`);

  await testT1();
  await testT2();
  await testT4();
  await testT5();
  await testT7();

  console.log(`\n${"─".repeat(40)}`);
  console.log(`PASS:${passCount} FAIL:${failCount}`);
  if (failCount > 0) {
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("Unexpected error:", e);
  process.exit(1);
});
