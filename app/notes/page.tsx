import PageShell from "@/components/PageShell";
import NotesClient from "@/components/NotesClient";

export const dynamic = "force-dynamic";

export default function NotesPage() {
  return (
    <PageShell title="노트" sub="our notes">
      <NotesClient />
    </PageShell>
  );
}
