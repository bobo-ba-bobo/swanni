"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setError("로그인에 실패했어요. 이메일과 비밀번호를 확인해줘요.");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[12%] top-[18%] h-56 w-56 animate-float-slow rounded-full bg-sky-dream/40 blur-3xl" />
        <div className="absolute right-[14%] top-[30%] h-64 w-64 animate-float rounded-full bg-lavender-dream/40 blur-3xl" />
        <div className="absolute bottom-[12%] left-[40%] h-52 w-52 animate-float-slow rounded-full bg-peach-soft/50 blur-3xl" />
      </div>

      <div className="w-full max-w-sm animate-fade-up rounded-3xl border border-white/60 bg-white/55 p-8 shadow-dream backdrop-blur-xl">
        <div className="mb-7 text-center">
          <p className="font-display text-4xl tracking-tight text-ink">
            swanni <span className="text-ink-faint">&</span> bobo
          </p>
          <p className="mt-2 text-sm text-ink-soft">우리 둘만의 공간</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            required
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-ink outline-none transition focus:border-sky-dream focus:bg-white focus:shadow-glow"
          />
          <input
            type="password"
            required
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-ink outline-none transition focus:border-sky-dream focus:bg-white focus:shadow-glow"
          />

          {error && <p className="px-1 text-sm text-rose-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-sky-dream via-lavender-dream to-peach-soft py-3 font-medium text-ink shadow-dream transition hover:brightness-105 disabled:opacity-60"
          >
            {loading ? "들어가는 중…" : "로그인"}
          </button>
        </form>
      </div>
    </main>
  );
}
