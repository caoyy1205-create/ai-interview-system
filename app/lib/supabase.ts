import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// console.log("=== Supabase 调试信息 ===");
// console.log("URL 检查:", supabaseUrl ? "已读到" : "未读到");
// console.log("Key 前缀:", supabaseAnonKey ? supabaseAnonKey.substring(0, 10) + "..." : "未读到");
// console.log("========================");

export const supabase = createClient(supabaseUrl, supabaseAnonKey);