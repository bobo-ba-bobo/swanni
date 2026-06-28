"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// 이메일(또는 예전에 저장된 prefix) → 표시 이름 매핑
const NAME_MAP: Record<string, string> = {
  "bosung.baik@gmail.com": "bobo",
  "bosung.baik": "bobo",
  "erinkim1st@gmail.com": "swanni",
  "erinkim1st": "swanni",
};

/** 저장된 값/이메일을 친근한 표시 이름으로 변환. */
export function toDisplayName(value: string | null | undefined): string {
  if (!value) return "";
  const key = value.toLowerCase();
  return NAME_MAP[key] ?? value.split("@")[0];
}

/** 로그인한 사용자의 표시 이름 (bobo / swanni). */
export function useDisplayName() {
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setName(toDisplayName(data.user?.email));
    });
  }, []);

  return name;
}
