# swanni & bobo — 셋업 가이드

두 명(swanni & bobo)만 로그인해서 함께 쓰는 버킷리스트 / 먹킷리스트 / 노트 사이트.
스택: **Next.js 14 + Supabase(인증·DB·실시간) + Vercel(배포)**.

---

## 1. Supabase 프로젝트 만들기

1. https://supabase.com 가입 후 **New project** 생성 (무료 플랜).
2. 프로젝트가 생성되면 좌측 **SQL Editor** 로 이동.
3. 이 repo의 `supabase/schema.sql` 내용을 전부 붙여넣고 **RUN**.
   - `items` 테이블 + RLS 정책 + 실시간 publication 이 한 번에 세팅됩니다.
4. 갤러리(사진 캘린더)를 쓰려면 `supabase/gallery.sql` 도 같은 방식으로 붙여넣고 **RUN**.
   - `gallery_days` / `gallery_photos` 테이블 + RLS + `gallery` Storage 버킷(비공개) + 정책이 세팅됩니다.

## 2. 우리 둘 계정 만들기

1. 좌측 **Authentication > Users > Add user > Create new user**.
2. swanni 이메일 / 비밀번호 입력 → **Auto Confirm User 체크** → 생성.
3. bobo 도 같은 방식으로 한 번 더 생성. (총 2명)
   - 이메일 인증 메일을 안 받으려면 꼭 *Auto Confirm User* 를 체크하세요.
4. (선택) **Authentication > Providers > Email** 에서 *Enable Signups* 를 **꺼두면**
   외부인이 가입하는 걸 원천 차단할 수 있어요.

## 3. API 키 복사

**Project Settings > API** 에서 두 값을 복사:

- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 4. 로컬에서 실행하기

```bash
cp .env.local.example .env.local   # 그리고 위 두 값을 채워넣기
npm install
npm run dev
```

→ http://localhost:3000 접속, 만든 계정으로 로그인.

## 5. Vercel 배포

1. https://vercel.com 에 GitHub 로그인 → **Add New > Project** → `bobo-ba-bobo/swanni` import.
2. **Environment Variables** 에 위 두 값을 그대로 추가:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Deploy**. 이후 main 에 push 할 때마다 자동 배포됩니다.
4. (선택) **Settings > Domains** 에서 커스텀 도메인 연결.

---

## 구조

```
app/
  page.tsx        랜딩 (swanni & bobo)
  login/          로그인
  do/             버킷리스트
  eat/            먹킷리스트
  notes/          노트
  done/           끝낸거
components/        UI (리스트·노트·네비)
lib/supabase/      Supabase 클라이언트 + 미들웨어(로그인 보호)
supabase/schema.sql  DB 스키마
```

로그인 안 한 상태로 어떤 페이지든 들어가면 자동으로 `/login` 으로 보냅니다 (`middleware.ts`).
