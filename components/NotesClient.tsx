"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useDisplayName, toDisplayName } from "@/lib/useUser";
import type { Item } from "@/lib/types";

export default function NotesClient() {
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const me = useDisplayName();

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("items")
      .select("*")
      .eq("category", "note")
      .order("created_at", { ascending: false });
    setItems((data as Item[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const supabase = createClient();
    const channel = supabase
      .channel("items-note")
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

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t && !body.trim()) return;
    setTitle("");
    setBody("");
    const supabase = createClient();
    await supabase.from("items").insert({
      category: "note",
      title: t || "무제",
      body: body.trim() || null,
      created_by: me,
    });
    load();
  }

  async function remove(item: Item) {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    const supabase = createClient();
    await supabase.from("items").delete().eq("id", item.id);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={add} className="card space-y-2 p-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          className="w-full bg-transparent px-2 py-1.5 font-display text-2xl text-ink placeholder:text-ink-faint focus:outline-none"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="아무 말이나…"
          rows={3}
          className="w-full resize-none bg-transparent px-2 py-1.5 text-ink placeholder:text-ink-faint focus:outline-none"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-xl border-2 border-ink bg-ink px-5 py-2.5 font-mono text-sm font-semibold uppercase tracking-wide text-bone-card transition hover:bg-mint"
          >
            post
          </button>
        </div>
      </form>

      {loading ? (
        <p className="py-10 text-center font-mono text-sm text-ink-faint">
          loading…
        </p>
      ) : items.length === 0 ? (
        <p className="py-10 text-center font-mono text-sm text-ink-faint">
          노트 없음
        </p>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2">
          {items.map((item, i) => (
            <article
              key={item.id}
              style={{ animationDelay: `${i * 0.035}s` }}
              className="card group mb-4 inline-block w-full animate-fade-up break-inside-avoid p-5"
            >
              <div className="mb-1 flex items-start justify-between gap-2">
                <h3 className="font-display text-2xl text-ink">{item.title}</h3>
                <button
                  onClick={() => remove(item)}
                  className="font-mono text-ink-faint opacity-0 transition hover:text-mint group-hover:opacity-100"
                  aria-label="삭제"
                >
                  ✕
                </button>
              </div>
              {item.body && (
                <p className="whitespace-pre-wrap text-ink-soft">{item.body}</p>
              )}
              {item.created_by && (
                <p className="mt-3 font-mono text-xs text-ink-faint">
                  — {toDisplayName(item.created_by)}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
