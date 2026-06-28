import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import { createClient } from "@/lib/supabase/server";
import { SECTIONS, type Category } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getCounts() {
  const counts: Record<Category, { total: number; done: number }> = {
    do: { total: 0, done: 0 },
    eat: { total: 0, done: 0 },
    note: { total: 0, done: 0 },
  };

  try {
    const supabase = createClient();
    const { data } = await supabase.from("items").select("category, done");
    for (const row of data ?? []) {
      const c = row.category as Category;
      if (!counts[c]) continue;
      counts[c].total += 1;
      if (row.done) counts[c].done += 1;
    }
  } catch {
    // env not set yet — show zeros
  }
  return counts;
}

export default async function Home() {
  const counts = await getCounts();

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[8%] top-[12%] h-72 w-72 animate-float-slow rounded-full bg-sky-dream/35 blur-3xl" />
        <div className="absolute right-[10%] top-[22%] h-80 w-80 animate-float rounded-full bg-lavender-dream/35 blur-3xl" />
        <div className="absolute bottom-[8%] left-[35%] h-72 w-72 animate-float-slow rounded-full bg-peach-soft/45 blur-3xl" />
      </div>

      <SiteNav />

      <main className="mx-auto w-full max-w-3xl px-5 pb-24">
        <section className="animate-fade-up py-16 text-center sm:py-24">
          <p className="mb-4 text-sm tracking-[0.3em] text-ink-faint">
            OUR LITTLE FOREVER
          </p>
          <h1 className="font-display text-6xl leading-none tracking-tight text-ink sm:text-8xl">
            swanni
            <span className="mx-3 align-middle text-4xl text-ink-faint sm:text-6xl">
              &
            </span>
            bobo
          </h1>
          <p className="mx-auto mt-6 max-w-md text-ink-soft">
            우리가 함께 하고 싶은 모든 것.
            <br />
            to finish all of them till grey and old.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {SECTIONS.map((s, i) => {
            const c = counts[s.key];
            return (
              <Link
                key={s.path}
                href={s.path}
                style={{ animationDelay: `${0.1 + i * 0.08}s` }}
                className="glass group animate-fade-up p-6 transition hover:-translate-y-1 hover:shadow-glow"
              >
                <div className="mb-6 text-2xl text-ink-faint transition group-hover:text-ink">
                  {s.emoji}
                </div>
                <p className="font-display text-3xl text-ink">{s.label}</p>
                <p className="text-xs uppercase tracking-widest text-ink-faint">
                  {s.sub}
                </p>
                <p className="mt-6 text-sm text-ink-soft">
                  {s.key === "note"
                    ? `${c.total}개의 노트`
                    : `${c.done} / ${c.total} 완료`}
                </p>
              </Link>
            );
          })}
        </section>

        <section className="mt-4">
          <Link
            href="/done"
            className="glass-soft flex items-center justify-between px-6 py-5 transition hover:bg-white/60"
          >
            <span className="font-display text-2xl text-ink">끝낸거 ✿</span>
            <span className="text-sm text-ink-soft">
              우리가 이미 이뤄낸 것들 →
            </span>
          </Link>
        </section>
      </main>
    </div>
  );
}
