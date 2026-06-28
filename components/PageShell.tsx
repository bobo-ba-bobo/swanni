import SiteNav from "@/components/SiteNav";

export default function PageShell({
  title,
  sub,
  children,
}: {
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[6%] top-[14%] h-64 w-64 animate-float-slow rounded-full bg-sky-dream/30 blur-3xl" />
        <div className="absolute right-[8%] top-[40%] h-72 w-72 animate-float rounded-full bg-lavender-dream/30 blur-3xl" />
        <div className="absolute bottom-[10%] left-[30%] h-64 w-64 animate-float-slow rounded-full bg-peach-soft/40 blur-3xl" />
      </div>

      <SiteNav />

      <main className="mx-auto w-full max-w-3xl px-5 pb-24">
        <div className="animate-fade-up py-10 text-center">
          <h1 className="font-display text-5xl tracking-tight text-ink sm:text-6xl">
            {title}
          </h1>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-ink-faint">
            {sub}
          </p>
        </div>
        {children}
      </main>
    </div>
  );
}
