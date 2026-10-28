import type { Metadata } from "next";
import { MediaGallery } from "@/components/MediaGallery";
import { PageHero } from "@/components/ui";
import { photos, site } from "@/content";

export const metadata: Metadata = {
  title: "Photos",
  description: `${site.name} photo gallery: kit, matchday, training, fans and community.`,
  alternates: { canonical: "/photos" },
};

export default function PhotosPage() {
  return (
    <>
      <PageHero kicker="Media room" title="Photos" lede="Matchday, training, fans, community and behind-the-scenes galleries will be added as approved photography arrives." />
      <section className="band band--tight">
        <div className="wrap" style={{ display: "grid", gap: "var(--s-5)" }}>
          <MediaGallery photos={photos} />
          <p className="source">Kit images are cropped from supplied screenshots of a retail listing and await franchise approval.</p>
        </div>
      </section>
    </>
  );
}
