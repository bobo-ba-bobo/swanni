import PageShell from "@/components/PageShell";
import ListClient from "@/components/ListClient";

export const metadata = { title: "버킷리스트" };
export const dynamic = "force-dynamic";

export default function DoPage() {
  return (
    <PageShell title="버킷리스트" sub="things to do">
      <ListClient category="do" placeholder="함께 하고 싶은 것을 적어요…" />
    </PageShell>
  );
}
