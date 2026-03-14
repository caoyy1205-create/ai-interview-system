import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
if (_supabase) return _supabase;
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
_supabase = createClient(url, key);
return _supabase;
}

// 向后兼容：直接 import { supabase } 的地方继续可用
export const supabase = new Proxy({} as SupabaseClient, {
get(_target, prop) {
return (getSupabase() as any)[prop];
}
});
