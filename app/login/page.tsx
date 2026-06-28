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
      setError("로그인 실패. 이메일/비번 다시 확인.");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-6">
      <div className="w-full max-w-sm animate-fade-up">
        <div className="mb-8">
          <p className="tag mb-3">swanni × bobo — members only</p>
          <h1 className="font-display text-6xl leading-[0.85] tracking-tight text-ink">
            욕심
            <br />
            부리기
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-3 p-5">
          <input
            type="email"
            required
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border-2 border-ink bg-bone-soft px-4 py-3 font-mono text-sm text-ink outline-none transition placeholder:text-ink-faint focus:bg-bone-card focus:shadow-hard-mint"
          />
          <input
            type="password"
            required
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border-2 border-ink bg-bone-soft px-4 py-3 font-mono text-sm text-ink outline-none transition placeholder:text-ink-faint focus:bg-bone-card focus:shadow-hard-mint"
          />

          {error && (
            <p className="font-mono text-sm text-mint">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl border-2 border-ink bg-ink py-3 font-mono text-sm font-semibold uppercase tracking-widest text-bone-card transition hover:bg-mint hover:text-bone-card disabled:opacity-50"
          >
            {loading ? "..." : "enter"}
          </button>
        </form>
      </div>
    </main>
  );
}
