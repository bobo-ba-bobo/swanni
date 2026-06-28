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
    <div className="min-h-dvh">
      <SiteNav />
      <div className="border-t-2 border-ink" />

      <main className="mx-auto w-full max-w-3xl px-5 pb-24">
        <div className="animate-fade-up py-10">
          <p className="tag mb-2">{sub}</p>
          <h1 className="font-display text-5xl tracking-tight text-ink sm:text-6xl">
            {title}
          </h1>
        </div>
        {children}
      </main>
    </div>
  );
}
