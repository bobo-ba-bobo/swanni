"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SECTIONS } from "@/lib/types";

export default function SiteNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const links = [
    ...SECTIONS.map((s) => ({ path: s.path, label: s.label })),
    { path: "/gallery", label: "갤러리" },
    { path: "/done", label: "끝낸거" },
  ];

  return (
    <header className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-between gap-3 px-5 py-5">
      <Link
        href="/"
        className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-ink transition hover:text-flame"
      >
        swanni <span className="text-flame">×</span> bobo
      </Link>

      <nav className="flex items-center gap-1.5 font-mono text-sm">
        {links.map((l) => {
          const active = pathname === l.path;
          return (
            <Link
              key={l.path}
              href={l.path}
              className={`rounded-full border-2 px-3 py-1 transition ${
                active
                  ? "border-ink bg-ink text-bone-card"
                  : "border-transparent text-ink-soft hover:border-ink hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
        <button
          onClick={signOut}
          className="ml-1 rounded-full border-2 border-transparent px-2 py-1 text-ink-faint transition hover:border-ink hover:text-ink"
          title="로그아웃"
        >
          ⏻
        </button>
      </nav>
    </header>
  );
}
