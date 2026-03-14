import { NextResponse } from "next/server";
import { rateLimiter } from "../../../lib/rate-limit";
import {
getRandomMultipleChoice,
getRandomEssayQuestions,
getRandomCollaborationTasks,
getRandomProjectTask,
} from "../../../lib/questionBank";

function randomId(prefix = "sess") {
return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export async function POST(req: Request) {
const ip =
req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
req.headers.get("x-real-ip") ||
"unknown";
const limited = rateLimiter.check(ip, 5, 60 * 60 * 1000);
if (limited) {
return NextResponse.json(
{ error: "Too many requests. Please try again later." },
{ status: 429 }
);
}

try {
const mcQuestions = getRandomMultipleChoice(8);
const essayQuestions = getRandomEssayQuestions(2);
const collaborationTasks = getRandomCollaborationTasks(2);
const projectTask = getRandomProjectTask(1);

const examSet = {
part1: {
type: "基础认知",
allowAI: false,
timeLimitMinutes: 30,
questions: [
...mcQuestions.map((q, idx) => ({
...q,
id: `mc_${idx}`,
type: "multipleChoice",
})),
...essayQuestions.map((q, idx) => ({
...q,
id: `essay_${idx}`,
type: "essay",
})),
],
},
part2: {
type: "AI协作能力",
allowAI: true,
timeLimitMinutes: 40,
tasks: collaborationTasks.map((t, idx) => ({
...t,
id: `collab_${idx}`,
})),
},
part3: {
type: "项目实战",
allowAI: true,
timeLimitMinutes: 90,
task: {
...projectTask,
id: "project_0",
},
},
};

const sessionId = randomId("session");
const startedAt = Date.now();

return NextResponse.json({
sessionId,
startedAt,
examSet,
task: projectTask,
});
} catch (error) {
console.error("Session start error:", error);
return NextResponse.json(
{ error: "Failed to start session" },
{ status: 500 }
);
}
}
