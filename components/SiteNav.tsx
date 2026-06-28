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

  return (
    <header className="sticky top-0 z-30 mx-auto flex w-full max-w-3xl items-center justify-between px-5 py-4">
      <Link
        href="/"
        className="font-display text-2xl tracking-tight text-ink transition hover:opacity-70"
      >
        swanni <span className="text-ink-faint">&</span> bobo
      </Link>

      <nav className="flex items-center gap-1 rounded-full border border-white/60 bg-white/50 p-1 text-sm backdrop-blur-md">
        {SECTIONS.map((s) => {
          const active = pathname === s.path;
          return (
            <Link
              key={s.path}
              href={s.path}
              className={`rounded-full px-3 py-1.5 transition ${
                active
                  ? "bg-white text-ink shadow-sm"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {s.label}
            </Link>
          );
        })}
        <Link
          href="/done"
          className={`rounded-full px-3 py-1.5 transition ${
            pathname === "/done"
              ? "bg-white text-ink shadow-sm"
              : "text-ink-soft hover:text-ink"
          }`}
        >
          끝낸거
        </Link>
        <button
          onClick={signOut}
          className="ml-1 rounded-full px-3 py-1.5 text-ink-faint transition hover:text-ink"
          title="로그아웃"
        >
          ⏻
        </button>
      </nav>
    </header>
  );
}
