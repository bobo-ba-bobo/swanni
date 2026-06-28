"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useDisplayName } from "@/lib/useUser";
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
      <form onSubmit={add} className="glass space-y-2 p-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          className="w-full bg-transparent px-2 py-1.5 font-display text-2xl text-ink placeholder:text-ink-faint focus:outline-none"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="여기에 우리 이야기를 적어요…"
          rows={3}
          className="w-full resize-none bg-transparent px-2 py-1.5 text-ink placeholder:text-ink-faint focus:outline-none"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-2xl bg-gradient-to-r from-lavender-dream to-peach-soft px-5 py-2.5 text-sm text-ink shadow-sm transition hover:brightness-105"
          >
            남기기
          </button>
        </div>
      </form>

      {loading ? (
        <p className="py-10 text-center text-sm text-ink-faint">불러오는 중…</p>
      ) : items.length === 0 ? (
        <p className="py-10 text-center text-sm text-ink-faint">
          아직 노트가 없어요 ✎
        </p>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2">
          {items.map((item, i) => (
            <article
              key={item.id}
              style={{ animationDelay: `${i * 0.04}s` }}
              className="glass group mb-4 inline-block w-full animate-fade-up break-inside-avoid p-5"
            >
              <div className="mb-1 flex items-start justify-between gap-2">
                <h3 className="font-display text-2xl text-ink">{item.title}</h3>
                <button
                  onClick={() => remove(item)}
                  className="text-ink-faint opacity-0 transition hover:text-rose-400 group-hover:opacity-100"
                  aria-label="삭제"
                >
                  ✕
                </button>
              </div>
              {item.body && (
                <p className="whitespace-pre-wrap text-ink-soft">{item.body}</p>
              )}
              {item.created_by && (
                <p className="mt-3 text-xs text-ink-faint">— {item.created_by}</p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
