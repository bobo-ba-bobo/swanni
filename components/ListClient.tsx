"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useDisplayName } from "@/lib/useUser";
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
    await supabase
      .from("items")
      .insert({ category, title: t, created_by: me });
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
      <form onSubmit={add} className="glass flex items-center gap-2 p-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-4 py-2.5 text-ink placeholder:text-ink-faint focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-2xl bg-gradient-to-r from-sky-dream to-lavender-dream px-5 py-2.5 text-sm text-ink shadow-sm transition hover:brightness-105"
        >
          추가
        </button>
      </form>

      {loading ? (
        <p className="py-10 text-center text-sm text-ink-faint">불러오는 중…</p>
      ) : (
        <ul className="space-y-2">
          {active.length === 0 && (
            <li className="py-10 text-center text-sm text-ink-faint">
              아직 아무것도 없어요. 첫 번째를 적어봐요 ✦
            </li>
          )}
          {active.map((item, i) => (
            <li
              key={item.id}
              style={{ animationDelay: `${i * 0.03}s` }}
              className="glass-soft group flex animate-fade-up items-center gap-3 px-4 py-3.5"
            >
              <button
                onClick={() => toggle(item)}
                className="grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-sky-dream text-transparent transition hover:bg-sky-mist"
                aria-label="완료 표시"
              >
                ✓
              </button>
              <span className="flex-1 text-ink">{item.title}</span>
              {item.created_by && (
                <span className="hidden text-xs text-ink-faint sm:inline">
                  {item.created_by}
                </span>
              )}
              <button
                onClick={() => remove(item)}
                className="text-ink-faint opacity-0 transition hover:text-rose-400 group-hover:opacity-100"
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
            className="text-sm text-ink-soft transition hover:text-ink"
          >
            끝낸거 {done.length}개 {showDone ? "숨기기 ▴" : "보기 ▾"}
          </button>
          {showDone && (
            <ul className="mt-3 space-y-2">
              {done.map((item) => (
                <li
                  key={item.id}
                  className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-ink-faint"
                >
                  <button
                    onClick={() => toggle(item)}
                    className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-r from-sky-dream to-lavender-dream text-ink"
                    aria-label="완료 취소"
                  >
                    ✓
                  </button>
                  <span className="flex-1 line-through">{item.title}</span>
                  <button
                    onClick={() => remove(item)}
                    className="opacity-0 transition hover:text-rose-400 group-hover:opacity-100"
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
