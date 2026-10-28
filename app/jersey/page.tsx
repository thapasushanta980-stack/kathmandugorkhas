import type { Metadata } from "next";
import Link from "next/link";
import { JerseyViewer } from "@/components/JerseyViewer";
import { MediaGallery } from "@/components/MediaGallery";
import { Arrow, Note, PageHero } from "@/components/ui";
import { kit, partners, photos, site } from "@/content";

export const metadata: Metadata = {
  title: "Jersey",
  description: `Turn the ${site.name} jersey through 360° and see the front, back and sleeve details.`,
  alternates: { canonical: "/jersey" },
};

export default function JerseyPage() {
  const backPartner = partners.find((p) => p.placement === "Back of the jersey");
  return (
    <>
      <PageHero kicker="The kit" title="Jersey" lede="Drag, swipe or use the arrow keys to turn the jersey through 360°.">
        <Note>{kit.label} · {kit.seasonNote}</Note>
      </PageHero>

      <section className="band band--teal" aria-labelledby="viewer-title">
        <div className="wrap jersey-zone">
          <div>
            <h2 id="viewer-title" className="visually-hidden">360° jersey viewer</h2>
            <JerseyViewer labelledBy="viewer-title" showDetailsToggle={false} />
          </div>
          <div style={{ display: "grid", gap: "var(--s-5)" }}>
            <p className="kicker kicker--rule">Kit story</p>
            <h2 style={{ fontSize: "var(--t-xl)" }}>Colours from the crest</h2>
            <p className="lede">The jersey carries the crest&rsquo;s palette onto the field: an aqua body, a deep purple collar, and gold at the shoulders and cuffs.</p>
            <ul className="spec-list">
              {kit.details.map((d) => <li key={d.title}><strong>{d.title}</strong><span>{d.body}</span></li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="band band--ink" aria-labelledby="views-title">
        <div className="wrap" style={{ display: "grid", gap: "var(--s-6)" }}>
          <div style={{ display: "grid", gap: "var(--s-3)" }}>
            <p className="kicker kicker--rule">Still views</p>
            <h2 id="views-title" style={{ fontSize: "var(--t-xl)" }}>Front, back and sleeves</h2>
          </div>
          <MediaGallery photos={photos.filter((p) => p.category === "Kit")} />
          {backPartner && (
            <p className="source">
              Season 3 reporting places the {backPartner.name} mark on the back of the jersey. It does not appear on the supplied back
              view, so this imagery may be a different edition. Awaiting franchise confirmation.
            </p>
          )}
        </div>
      </section>

      <section className="band band--paper band--tight" aria-labelledby="buy-title">
        <div className="wrap cta">
          <div style={{ display: "grid", gap: "var(--s-3)" }}>
            <h2 id="buy-title">Get the jersey</h2>
            <p className="lede">
              {site.officialShopUrl ? "Available from the official shop." : "The official place to buy it will be linked here once the franchise confirms it. Prices, sizes and stock are not listed until then."}
            </p>
          </div>
          {site.officialShopUrl ? (
            <a className="btn btn--ink" href={site.officialShopUrl} rel="noopener noreferrer" target="_blank">Official shop <Arrow /></a>
          ) : (
            <Link href="/shop" className="btn btn--ink">Shop status <Arrow /></Link>
          )}
        </div>
      </section>
    </>
  );
}
