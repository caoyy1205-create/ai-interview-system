import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function POST(request: Request) {
try {
const { sessionId, part, data } = await request.json();

// 基础校验
if (!sessionId || !part || !data) {
return NextResponse.json(
{ error: "Missing required fields: sessionId, part, or data" },
{ status: 400 }
);
}

// 映射 part 到数据库字段名
const columnMap: Record<string, string> = {
part1: "part1_data",
part2: "part2_data",
part3: "part3_data",
};

const columnName = columnMap[part];
if (!columnName) {
return NextResponse.json(
{ error: "Invalid part identifier" },
{ status: 400 }
);
}

// 执行数据库更新
const { error } = await supabase
.from("interview_sessions")
.upsert(
{
session_id: sessionId,
[columnName]: data,
updated_at: new Date().toISOString(),
status: part === "part3" ? "completed" : "in_progress",
},
{ onConflict: "session_id" }
);

if (error) {
console.error("Supabase error:", error);
return NextResponse.json(
{ error: "Database update failed", details: error.message },
{ status: 500 }
);
}

return NextResponse.json({
success: true,
message: `${part} data submitted successfully`,
});
} catch (error: any) {
console.error("Submit API error:", error);
return NextResponse.json(
{ error: "Internal server error", details: error?.message },
{ status: 500 }
);
}
}