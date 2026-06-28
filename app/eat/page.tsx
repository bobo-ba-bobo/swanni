import PageShell from "@/components/PageShell";
import ListClient from "@/components/ListClient";

export const metadata = { title: "먹킷리스트" };
export const dynamic = "force-dynamic";

export default function EatPage() {
  return (
    <PageShell title="먹킷리스트" sub="things to eat">
      <ListClient category="eat" placeholder="같이 먹고 싶은 것을 적어요…" />
    </PageShell>
  );
}
