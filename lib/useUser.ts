"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/** Returns a friendly display name for the signed-in user (email prefix). */
export function useDisplayName() {
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      const email = data.user?.email ?? "";
      setName(email.split("@")[0] || "us");
    });
  }, []);

  return name;
}
