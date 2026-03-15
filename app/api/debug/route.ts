import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "(not set)";
  const keyLen = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "").length;
  const adminToken = process.env.ADMIN_TOKEN || "(not set)";

  // 测试 Supabase 连接
  let dbTest: any = null;
  try {
    const { data, error } = await supabase
      .from("interview_sessions")
      .select("session_id")
      .limit(1);
    dbTest = error ? { error: error.message, code: error.code, hint: error.hint } : { ok: true, rows: data?.length };
  } catch (e: any) {
    dbTest = { exception: e?.message };
  }

  return NextResponse.json({
    supabaseUrl: url.substring(0, 30) + "...",
    supabaseKeyLength: keyLen,
    adminToken: adminToken === "(not set)" ? "(not set)" : adminToken.substring(0, 3) + "***",
    dbTest,
  });
}
