import PageShell from "@/components/PageShell";
import DoneClient from "@/components/DoneClient";

export const dynamic = "force-dynamic";

export default function DonePage() {
  return (
    <PageShell title="끝낸거" sub="we already did this">
      <DoneClient />
    </PageShell>
  );
}
