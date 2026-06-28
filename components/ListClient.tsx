"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useDisplayName, toDisplayName } from "@/lib/useUser";
import type { Category, Item } from "@/lib/types";

export default function ListClient({
  category,
  placeholder,
}: {
  category: Exclude<Category, "note">;
  placeholder: string;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDone, setShowDone] = useState(false);
  const me = useDisplayName();

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("items")
      .select("*")
      .eq("category", category)
      .order("created_at", { ascending: true });
    setItems((data as Item[]) ?? []);
    setLoading(false);
  }, [category]);

  useEffect(() => {
    load();
    const supabase = createClient();
    const channel = supabase
      .channel(`items-${category}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "items" },
        () => load()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [category, load]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    setTitle("");
    const supabase = createClient();
    await supabase.from("items").insert({ category, title: t, created_by: me });
    load();
  }

  async function toggle(item: Item) {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, done: !i.done } : i))
    );
    const supabase = createClient();
    await supabase
      .from("items")
      .update({ done: !item.done, updated_at: new Date().toISOString() })
      .eq("id", item.id);
  }

  async function remove(item: Item) {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    const supabase = createClient();
    await supabase.from("items").delete().eq("id", item.id);
  }

  const active = items.filter((i) => !i.done);
  const done = items.filter((i) => i.done);

  return (
    <div className="space-y-6">
      <form onSubmit={add} className="card flex items-center gap-2 p-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-3 py-2.5 text-ink placeholder:text-ink-faint focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-xl border-2 border-ink bg-ink px-5 py-2.5 font-mono text-sm font-semibold uppercase tracking-wide text-bone-card transition hover:bg-mint"
        >
          add
        </button>
      </form>

      {loading ? (
        <p className="py-10 text-center font-mono text-sm text-ink-faint">
          loading…
        </p>
      ) : (
        <ul className="space-y-2.5">
          {active.length === 0 && (
            <li className="card p-8 text-center font-mono text-sm text-ink-faint">
              아직 비어있음. 첫 번째 욕심 적기 ↑
            </li>
          )}
          {active.map((item, i) => (
            <li
              key={item.id}
              style={{ animationDelay: `${i * 0.025}s` }}
              className="card group flex animate-fade-up items-center gap-3 px-4 py-3.5 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-hard-lg"
            >
              <button
                onClick={() => toggle(item)}
                className="grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 border-ink text-transparent transition hover:bg-mint/20"
                aria-label="done"
              >
                ✓
              </button>
              <span className="flex-1 text-ink">{item.title}</span>
              {item.created_by && (
                <span className="hidden font-mono text-xs text-ink-faint sm:inline">
                  {toDisplayName(item.created_by)}
                </span>
              )}
              <button
                onClick={() => remove(item)}
                className="font-mono text-ink-faint opacity-0 transition hover:text-mint group-hover:opacity-100"
                aria-label="삭제"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {done.length > 0 && (
        <div className="pt-2">
          <button
            onClick={() => setShowDone((s) => !s)}
            className="font-mono text-sm text-ink-soft transition hover:text-ink"
          >
            done {done.length} {showDone ? "▴" : "▾"}
          </button>
          {showDone && (
            <ul className="mt-3 space-y-2">
              {done.map((item) => (
                <li
                  key={item.id}
                  className="group flex items-center gap-3 rounded-xl border-2 border-ink/15 px-4 py-3 text-ink-faint"
                >
                  <button
                    onClick={() => toggle(item)}
                    className="grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 border-ink bg-mint text-bone-card"
                    aria-label="undo"
                  >
                    ✓
                  </button>
                  <span className="flex-1 line-through">{item.title}</span>
                  <button
                    onClick={() => remove(item)}
                    className="font-mono opacity-0 transition hover:text-mint group-hover:opacity-100"
                    aria-label="삭제"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
