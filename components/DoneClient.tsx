"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Item } from "@/lib/types";

const LABEL: Record<string, string> = { do: "버킷", eat: "먹킷" };

export default function DoneClient() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("items")
      .select("*")
      .eq("done", true)
      .in("category", ["do", "eat"])
      .order("updated_at", { ascending: false });
    setItems((data as Item[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const supabase = createClient();
    const channel = supabase
      .channel("items-done")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "items" },
        () => load()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  async function undo(item: Item) {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    const supabase = createClient();
    await supabase.from("items").update({ done: false }).eq("id", item.id);
  }

  if (loading)
    return (
      <p className="py-10 text-center font-mono text-sm text-ink-faint">
        loading…
      </p>
    );

  if (items.length === 0)
    return (
      <p className="py-10 text-center font-mono text-sm text-ink-faint">
        아직 주운 거 없음. 하나씩 ✓
      </p>
    );

  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li
          key={item.id}
          style={{ animationDelay: `${i * 0.025}s` }}
          className="card group flex animate-fade-up items-center gap-3 px-4 py-3.5"
        >
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 border-ink bg-flame text-bone-card">
            ✓
          </span>
          <span className="rounded-full border-2 border-ink px-2 py-0.5 font-mono text-xs text-ink">
            {LABEL[item.category] ?? item.category}
          </span>
          <span className="flex-1 text-ink">{item.title}</span>
          <button
            onClick={() => undo(item)}
            className="font-mono text-xs text-ink-faint opacity-0 transition hover:text-ink group-hover:opacity-100"
          >
            undo
          </button>
        </li>
      ))}
    </ul>
  );
}
