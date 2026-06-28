import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import GalleryClient from "@/components/GalleryClient";
import Dday from "@/components/Dday";
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
    // env not set yet
  }
  return counts;
}

const MARQUEE = "욕심부리기 / WANT IT ALL / 죽기 전에 다 / GREEDY LIST / ";

export default async function Home() {
  const counts = await getCounts();

  return (
    <div className="min-h-dvh">
      <SiteNav />

      {/* marquee band */}
      <div className="overflow-hidden border-y-2 border-ink bg-flame py-2">
        <div className="flex w-max animate-marquee whitespace-nowrap font-mono text-sm font-medium uppercase tracking-widest text-bone-card">
          <span>{MARQUEE.repeat(6)}</span>
          <span>{MARQUEE.repeat(6)}</span>
        </div>
      </div>

      <main className="mx-auto w-full max-w-4xl px-5 pb-24">
        <section className="animate-fade-up pt-14 sm:pt-20">
          <Dday className="mb-5" />
          <p className="tag mb-5">우리가 욕심내는 것들 — swanni × bobo</p>
          <h1 className="font-display text-[20vw] leading-[0.82] tracking-tight text-ink sm:text-[150px]">
            욕심
            <br />
            부리기
          </h1>
          <p className="mt-7 max-w-md font-mono text-sm leading-relaxed text-ink-soft">
            하고 싶은 거, 먹고 싶은 거, 다 적어두고 하나씩 줍는다.
            <br />
            want it all — till grey and old.
          </p>
        </section>

        <section className="mt-16 grid gap-4 sm:grid-cols-3">
          {SECTIONS.map((s, i) => {
            const c = counts[s.key];
            return (
              <Link
                key={s.path}
                href={s.path}
                style={{ animationDelay: `${0.05 + i * 0.06}s` }}
                className="card group animate-fade-up p-5 transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-sm text-ink-faint">
                    0{i + 1}
                  </span>
                  <span className="font-mono text-lg text-ink transition group-hover:text-flame">
                    ↗
                  </span>
                </div>
                <p className="mt-8 font-display text-3xl text-ink">{s.label}</p>
                <p className="tag mt-1">{s.sub}</p>
                <p className="mt-5 font-mono text-sm text-ink-soft">
                  {s.key === "note"
                    ? `${c.total} notes`
                    : `${c.done} / ${c.total} done`}
                </p>
              </Link>
            );
          })}
        </section>

        <section className="mt-4">
          <Link
            href="/done"
            className="card flex items-center justify-between px-6 py-5 transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg"
          >
            <span className="font-display text-2xl text-ink">끝낸거</span>
            <span className="font-mono text-sm text-ink-soft">
              이미 주운 것들 →
            </span>
          </Link>
        </section>

        <section className="mt-14">
          <Link
            href="/gallery"
            className="group mb-4 flex items-baseline justify-between"
          >
            <span className="font-display text-3xl text-ink">갤러리</span>
            <span className="font-mono text-sm text-ink-soft transition group-hover:text-flame">
              달력 전체 보기 →
            </span>
          </Link>
          <GalleryClient lockMonth />
        </section>
      </main>
    </div>
  );
}
