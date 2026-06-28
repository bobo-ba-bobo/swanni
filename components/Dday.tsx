"use client";

import { useEffect, useState } from "react";

// 첫날 (D+1)
const START = new Date(2026, 5, 21); // 2026-06-21 (월은 0부터)

function diffDays() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.floor((today.getTime() - START.getTime()) / 86_400_000) + 1;
}

export default function Dday({ className = "" }: { className?: string }) {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    setDays(diffDays());
  }, []);

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border-2 border-ink bg-bone-card px-3 py-1 font-mono text-sm text-ink shadow-hard ${className}`}
    >
      <span className="h-2 w-2 rounded-full bg-flame" />
      <span className="font-semibold">
        D+{days ?? "—"}
      </span>
      <span className="text-ink-faint">since 2026.06.21</span>
    </span>
  );
}
