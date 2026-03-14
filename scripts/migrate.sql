-- 确保 interview_sessions 表有所有必需字段
-- 在 Supabase SQL Editor 中运行此脚本

alter table interview_sessions
  add column if not exists candidate_name text,
  add column if not exists candidate_email text,
  add column if not exists exam_set jsonb,
  add column if not exists started_at timestamptz,
  add column if not exists updated_at timestamptz,
  add column if not exists status text default 'in_progress';

-- 如果表不存在则创建
create table if not exists interview_sessions (
  id bigserial primary key,
  session_id text unique not null,
  candidate_name text,
  candidate_email text,
  exam_set jsonb,
  part1_data jsonb,
  part2_data jsonb,
  part3_data jsonb,
  final_report jsonb,
  started_at timestamptz,
  updated_at timestamptz,
  status text default 'in_progress',
  created_at timestamptz default now()
);
