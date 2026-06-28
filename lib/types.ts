export type Category = "do" | "eat" | "note";

export interface Item {
  id: string;
  category: Category;
  title: string;
  body: string | null;
  done: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export const SECTIONS: {
  key: Category;
  path: string;
  label: string;
  sub: string;
  emoji: string;
}[] = [
  { key: "do", path: "/do", label: "버킷리스트", sub: "to do", emoji: "✦" },
  { key: "eat", path: "/eat", label: "먹킷리스트", sub: "to eat", emoji: "❀" },
  { key: "note", path: "/notes", label: "노트", sub: "notes", emoji: "✎" },
];
