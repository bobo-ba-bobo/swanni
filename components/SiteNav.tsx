"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SECTIONS } from "@/lib/types";

const SVG = {
  // 버킷리스트 — 양동이
  bucket: (
    <>
      <path d="M5 8h14l-1.3 11.2a2 2 0 0 1-2 1.8H8.3a2 2 0 0 1-2-1.8L5 8Z" />
      <path d="M4 8h16" />
      <path d="M8.5 8a3.5 3.5 0 0 1 7 0" />
    </>
  ),
  // 먹킷리스트 — 닭다리
  meat: (
    <>
      <path d="M15.45 15.4c-2.13.65-4.3.32-5.7-1.1-2.29-2.27-1.76-6.5 1.17-9.42 2.93-2.93 7.15-3.46 9.43-1.18 1.41 1.41 1.74 3.57 1.1 5.71-1.4-.51-3.26-.02-4.64 1.36-1.38 1.38-1.87 3.23-1.36 4.63z" />
      <path d="m11.25 15.6-2.16 2.16a2.5 2.5 0 1 1-4.56 1.73 2.49 2.49 0 0 1-1.41-4.24 2.5 2.5 0 0 1 3.14-.32l2.16-2.16" />
    </>
  ),
  // 노트 — 줄노트
  note: (
    <>
      <rect width="16" height="18" x="4" y="3" rx="2" />
      <path d="M8 7h8" />
      <path d="M8 11h8" />
      <path d="M8 15h5" />
    </>
  ),
  // 끝낸거 — 도장
  stamp: (
    <>
      <path d="M5 22h14" />
      <path d="M19.27 13.73A2.5 2.5 0 0 0 17.5 13h-11A2.5 2.5 0 0 0 4 15.5V17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1.5c0-.66-.26-1.3-.73-1.77Z" />
      <path d="M14 13V8.5C14 7 15 7 15 5a3 3 0 0 0-3-3 3 3 0 0 0-3 3c0 2 1 2 1 3.5V13" />
    </>
  ),
  // 갤러리 — 사진
  photo: (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
    </>
  ),
} as const;

function Icon({ name }: { name: keyof typeof SVG }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      {SVG[name]}
    </svg>
  );
}

export default function SiteNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const iconFor: Record<string, keyof typeof SVG> = {
    "/do": "bucket",
    "/eat": "meat",
    "/notes": "note",
    "/done": "stamp",
    "/gallery": "photo",
  };

  const links = [
    ...SECTIONS.map((s) => ({ path: s.path, label: s.label })),
    { path: "/done", label: "끝낸거" },
    { path: "/gallery", label: "갤러리" },
  ];

  return (
    <header className="mx-auto flex w-full max-w-4xl items-center justify-between gap-3 px-5 py-5">
      <Link
        href="/"
        className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-ink transition hover:text-flame"
      >
        swanni <span className="text-flame">×</span> bobo
      </Link>

      <nav className="flex items-center gap-1 font-mono text-sm sm:gap-1.5">
        {links.map((l) => {
          const active = pathname === l.path;
          return (
            <Link
              key={l.path}
              href={l.path}
              title={l.label}
              aria-label={l.label}
              className={`grid h-10 w-10 place-items-center rounded-full border-2 transition sm:h-auto sm:w-auto sm:px-3 sm:py-1 ${
                active
                  ? "border-ink bg-ink text-bone-card"
                  : "border-transparent text-ink-soft hover:border-ink hover:text-ink"
              }`}
            >
              <span className="sm:hidden">
                <Icon name={iconFor[l.path]} />
              </span>
              <span className="hidden sm:inline">{l.label}</span>
            </Link>
          );
        })}
        <button
          onClick={signOut}
          title="로그아웃"
          aria-label="로그아웃"
          className="grid h-10 w-10 place-items-center rounded-full border-2 border-transparent text-ink-faint transition hover:border-ink hover:text-ink sm:h-auto sm:w-auto sm:px-2.5 sm:py-1"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
            <line x1="12" x2="12" y1="2" y2="12" />
          </svg>
        </button>
      </nav>
    </header>
  );
}
