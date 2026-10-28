import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { site } from "@/content";

export const metadata: Metadata = {
  title: "Terms",
  description: `Terms of use for the ${site.name} website.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <PageHero kicker="Legal" title="Terms" lede={`Last updated ${site.contentLastReviewed}.`} />
      <section className="band band--paper">
        <div className="wrap prose">
          <h2>Use of this site</h2>
          <p>
            This site is for information about {site.name}. You may browse and share links to it. Do not copy the
            crest, kit imagery or other team marks for commercial use.
          </p>
          <h2>Trademarks</h2>
          <p>
            The {site.name} name and crest, the {site.league} mark and any partner logos belong to their owners.
          </p>
          <h2>Accuracy</h2>
          <p>
            Fixtures, squad and partner information is published only after it is confirmed. Until then the site shows
            &ldquo;to be announced&rdquo;. Always check official league channels for match-day changes.
          </p>
          <h2>External links</h2>
          <p>Links to official shops, ticketing or social platforms are governed by those services&rsquo; own terms.</p>
          <p className="source">Concept terms. The franchise must review them before launch.</p>
        </div>
      </section>
    </>
  );
}
