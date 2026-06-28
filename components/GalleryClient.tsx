"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useDisplayName, toDisplayName } from "@/lib/useUser";

interface Photo {
  id: string;
  day: string;
  path: string;
  created_by: string | null;
  url?: string;
}

const MIN_YEAR = 2026;
const MIN_MONTH = 6; // 2026년 6월부터
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const BUCKET = "gallery";

const pad = (n: number) => String(n).padStart(2, "0");
const ymd = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`;

function initialMonth() {
  const n = new Date();
  let y = n.getFullYear();
  let m = n.getMonth() + 1;
  if (y < MIN_YEAR || (y === MIN_YEAR && m < MIN_MONTH)) {
    y = MIN_YEAR;
    m = MIN_MONTH;
  }
  return { y, m };
}

export default function GalleryClient({
  lockMonth = false,
}: {
  lockMonth?: boolean;
}) {
  const [year, setYear] = useState(() => initialMonth().y);
  const [month, setMonth] = useState(() => initialMonth().m);
  const [photosByDay, setPhotosByDay] = useState<Record<string, Photo[]>>({});
  const [captions, setCaptions] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const me = useDisplayName();

  const range = useMemo(() => {
    const last = new Date(year, month, 0).getDate();
    return { start: ymd(year, month, 1), end: ymd(year, month, last), last };
  }, [year, month]);

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const [{ data: photos }, { data: days }] = await Promise.all([
      supabase
        .from("gallery_photos")
        .select("*")
        .gte("day", range.start)
        .lte("day", range.end)
        .order("created_at", { ascending: true }),
      supabase
        .from("gallery_days")
        .select("*")
        .gte("day", range.start)
        .lte("day", range.end),
    ]);

    const list = (photos as Photo[]) ?? [];
    const paths = list.map((p) => p.path);
    const urlMap: Record<string, string> = {};
    if (paths.length) {
      const { data: signed } = await supabase.storage
        .from(BUCKET)
        .createSignedUrls(paths, 60 * 60);
      for (const s of signed ?? []) {
        if (s.path && s.signedUrl) urlMap[s.path] = s.signedUrl;
      }
    }

    const grouped: Record<string, Photo[]> = {};
    for (const p of list) {
      (grouped[p.day] ??= []).push({ ...p, url: urlMap[p.path] });
    }
    const caps: Record<string, string> = {};
    for (const d of days ?? []) caps[d.day] = d.caption ?? "";

    setPhotosByDay(grouped);
    setCaptions(caps);
    setLoading(false);
  }, [range.start, range.end]);

  useEffect(() => {
    load();
    const supabase = createClient();
    const channel = supabase
      .channel("gallery")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "gallery_photos" },
        () => load()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "gallery_days" },
        () => load()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  const atMin = year === MIN_YEAR && month === MIN_MONTH;
  function prev() {
    if (atMin) return;
    if (month === 1) {
      setYear((y) => y - 1);
      setMonth(12);
    } else setMonth((m) => m - 1);
  }
  function next() {
    if (month === 12) {
      setYear((y) => y + 1);
      setMonth(1);
    } else setMonth((m) => m + 1);
  }

  // calendar grid (leading blanks for first weekday)
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: range.last }, (_, i) => i + 1),
  ];

  const todayStr = (() => {
    const t = new Date();
    return ymd(t.getFullYear(), t.getMonth() + 1, t.getDate());
  })();

  return (
    <div>
      {/* month switcher */}
      {lockMonth ? (
        <p className="mb-4 font-display text-2xl text-ink">
          {year}.{pad(month)}
        </p>
      ) : (
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={prev}
            disabled={atMin}
            className="rounded-full border-2 border-ink px-3 py-1 font-mono text-sm transition hover:bg-ink hover:text-bone-card disabled:cursor-not-allowed disabled:opacity-25"
          >
            ←
          </button>
          <p className="font-display text-2xl text-ink">
            {year}.{pad(month)}
          </p>
          <button
            onClick={next}
            className="rounded-full border-2 border-ink px-3 py-1 font-mono text-sm transition hover:bg-ink hover:text-bone-card"
          >
            →
          </button>
        </div>
      )}

      <div className="mb-1 grid grid-cols-7 gap-1.5">
        {WEEKDAYS.map((w) => (
          <div key={w} className="tag py-1 text-center">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((d, i) => {
          if (d === null) return <div key={`b${i}`} />;
          const key = ymd(year, month, d);
          const photos = photosByDay[key] ?? [];
          const hasCaption = !!captions[key];
          const isToday = key === todayStr;
          return (
            <button
              key={key}
              onClick={() => setSelected(key)}
              className={`card flex aspect-square flex-col overflow-hidden p-1.5 text-left transition-all duration-150 hover:-translate-y-0.5 hover:shadow-hard-lg ${
                isToday ? "ring-2 ring-flame ring-offset-2 ring-offset-bone" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-ink-soft">{d}</span>
                {photos.length > 0 && (
                  <span className="rounded-full bg-flame px-1.5 font-mono text-[10px] text-bone-card">
                    {photos.length}
                  </span>
                )}
              </div>
              {photos.length > 0 ? (
                <div className="mt-1 flex flex-1 gap-0.5 overflow-hidden">
                  {photos.slice(0, 3).map((p) => (
                    <div
                      key={p.id}
                      className="flex-1 overflow-hidden rounded-sm bg-ink/5"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {p.url && (
                        <img
                          src={p.url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                hasCaption && (
                  <span className="mt-auto font-mono text-[10px] text-ink-faint">
                    ✎
                  </span>
                )
              )}
            </button>
          );
        })}
      </div>

      {loading && (
        <p className="mt-4 text-center font-mono text-sm text-ink-faint">
          loading…
        </p>
      )}

      {selected && (
        <DayModal
          day={selected}
          me={me}
          photos={photosByDay[selected] ?? []}
          caption={captions[selected] ?? ""}
          onClose={() => setSelected(null)}
          onChanged={load}
        />
      )}
    </div>
  );
}

function DayModal({
  day,
  me,
  photos,
  caption,
  onClose,
  onChanged,
}: {
  day: string;
  me: string;
  photos: Photo[];
  caption: string;
  onClose: () => void;
  onChanged: () => Promise<void> | void;
}) {
  const [text, setText] = useState(caption);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [y, m, d] = day.split("-").map(Number);
  const weekday = WEEKDAYS[new Date(y, m - 1, d).getDay()];

  async function saveCaption() {
    setSaving(true);
    const supabase = createClient();
    await supabase.from("gallery_days").upsert(
      { day, caption: text.trim() || null, created_by: me, updated_at: new Date().toISOString() },
      { onConflict: "day" }
    );
    setSaving(false);
    await onChanged();
  }

  async function upload(files: FileList | null) {
    if (!files || !files.length) return;
    setUploading(true);
    const supabase = createClient();
    for (const file of Array.from(files)) {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const path = `${day}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { contentType: file.type || undefined });
      if (!error) {
        await supabase
          .from("gallery_photos")
          .insert({ day, path, created_by: me });
      }
    }
    setUploading(false);
    await onChanged();
  }

  async function removePhoto(p: Photo) {
    const supabase = createClient();
    await supabase.storage.from(BUCKET).remove([p.path]);
    await supabase.from("gallery_photos").delete().eq("id", p.id);
    await onChanged();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
    >
      <div
        className="card my-auto w-full max-w-2xl animate-fade-up p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="tag">
              {y}.{pad(m)}.{pad(d)} · {weekday}
            </p>
            <h2 className="font-display text-3xl text-ink">
              {pad(m)}월 {d}일
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border-2 border-ink px-2.5 py-0.5 font-mono text-sm transition hover:bg-ink hover:text-bone-card"
          >
            ✕
          </button>
        </div>

        {/* caption */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={saveCaption}
          placeholder="이 날 뭐했지…"
          rows={2}
          className="w-full resize-none rounded-xl border-2 border-ink bg-bone-soft px-3 py-2 text-ink outline-none transition placeholder:text-ink-faint focus:bg-bone-card focus:shadow-hard-flame"
        />
        <p className="mb-4 mt-1 h-4 font-mono text-xs text-ink-faint">
          {saving ? "저장 중…" : ""}
        </p>

        {/* photos */}
        {photos.length > 0 && (
          <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {photos.map((p) => (
              <div
                key={p.id}
                className="group relative aspect-square overflow-hidden rounded-xl border-2 border-ink bg-ink/5"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {p.url && (
                  <img
                    src={p.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                )}
                <button
                  onClick={() => removePhoto(p)}
                  className="absolute right-1.5 top-1.5 rounded-full border-2 border-ink bg-bone-card px-1.5 font-mono text-xs opacity-0 transition group-hover:opacity-100"
                >
                  ✕
                </button>
                {p.created_by && (
                  <span className="absolute bottom-1 left-1 rounded-full bg-ink/70 px-1.5 font-mono text-[10px] text-bone-card">
                    {toDisplayName(p.created_by)}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* upload */}
        <label className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-ink/40 px-4 py-6 font-mono text-sm text-ink-soft transition hover:border-ink hover:text-ink">
          {uploading ? "올리는 중…" : "+ 사진 추가 (여러 장 가능)"}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={(e) => upload(e.target.files)}
          />
        </label>
      </div>
    </div>
  );
}
