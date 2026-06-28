-- swanni & bobo — database schema
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 RUN 하세요.

create extension if not exists "pgcrypto";

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('do', 'eat', 'note')),
  title text not null,
  body text,
  done boolean not null default false,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists items_category_idx on public.items (category);

-- Row Level Security: 로그인한 사용자(우리 둘)만 전체 접근 허용.
alter table public.items enable row level security;

drop policy if exists "authenticated full access" on public.items;
create policy "authenticated full access"
  on public.items
  for all
  to authenticated
  using (true)
  with check (true);

-- 실시간 동기화를 위해 publication 에 테이블 추가.
alter publication supabase_realtime add table public.items;
