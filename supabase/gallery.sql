-- swanni & bobo — gallery (사진 캘린더)
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 RUN 하세요.

-- 날짜별 캡션 (하루 한 줄)
create table if not exists public.gallery_days (
  day date primary key,
  caption text,
  created_by text,
  updated_at timestamptz not null default now()
);

-- 날짜별 사진 (Storage 의 파일 경로 저장)
create table if not exists public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  day date not null,
  path text not null,
  created_by text,
  created_at timestamptz not null default now()
);

create index if not exists gallery_photos_day_idx on public.gallery_photos (day);

-- RLS: 로그인한 우리 둘만 전체 접근
alter table public.gallery_days enable row level security;
alter table public.gallery_photos enable row level security;

drop policy if exists "days authed" on public.gallery_days;
create policy "days authed" on public.gallery_days
  for all to authenticated using (true) with check (true);

drop policy if exists "photos authed" on public.gallery_photos;
create policy "photos authed" on public.gallery_photos
  for all to authenticated using (true) with check (true);

-- 실시간 동기화
alter publication supabase_realtime add table public.gallery_days;
alter publication supabase_realtime add table public.gallery_photos;

-- Storage 버킷 (비공개)
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', false)
on conflict (id) do nothing;

-- Storage 정책: gallery 버킷은 로그인한 사용자만 읽기/올리기/지우기
drop policy if exists "gallery read" on storage.objects;
create policy "gallery read" on storage.objects
  for select to authenticated using (bucket_id = 'gallery');

drop policy if exists "gallery insert" on storage.objects;
create policy "gallery insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'gallery');

drop policy if exists "gallery update" on storage.objects;
create policy "gallery update" on storage.objects
  for update to authenticated using (bucket_id = 'gallery');

drop policy if exists "gallery delete" on storage.objects;
create policy "gallery delete" on storage.objects
  for delete to authenticated using (bucket_id = 'gallery');
