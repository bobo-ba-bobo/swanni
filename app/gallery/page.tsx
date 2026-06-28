import PageShell from "@/components/PageShell";
import GalleryClient from "@/components/GalleryClient";

export const dynamic = "force-dynamic";

export default function GalleryPage() {
  return (
    <PageShell title="갤러리" sub="our days">
      <GalleryClient />
    </PageShell>
  );
}
