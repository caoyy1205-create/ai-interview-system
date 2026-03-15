import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function POST(request: Request) {
  try {
    const { sessionId, part, data } = await request.json();

    if (!sessionId || !part || !data) {
      return NextResponse.json(
        { error: "Missing required fields: sessionId, part, or data" },
        { status: 400 }
      );
    }

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

    // 写入 Supabase（失败不阻断流程，只记录日志）
    try {
      const { error: dbError } = await supabase
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
      if (dbError) {
        console.error("Supabase submit error:", JSON.stringify(dbError));
      }
    } catch (dbErr) {
      console.error("Supabase submit unexpected error:", dbErr);
    }

    // 无论 DB 是否成功，都返回成功让前端继续
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

export async function PUT(request: Request) {
  const adminToken = request.headers.get("x-admin-token");
  if (!adminToken || adminToken !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("interview_sessions")
    .select("session_id, candidate_name, candidate_email, status, started_at, updated_at, part1_data, part2_data, part3_data, final_report")
    .order("started_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({
    submissions: data || [],
    total: data?.length || 0,
  });
}
