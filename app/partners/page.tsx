import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Source } from "@/components/ui";
import { currentSeason, partners, site } from "@/content";

export const metadata: Metadata = {
  title: "Partners",
  description: `${site.name} partners and sponsors for ${currentSeason.label}.`,
  alternates: { canonical: "/partners" },
};

export default function PartnersPage() {
  return (
    <>
      <PageHero kicker={currentSeason.label} title="Partners" lede="The organisations backing the Gorkhas, listed with their partnership titles as announced." />
      <section className="band band--paper">
        <div className="wrap" style={{ display: "grid", gap: "var(--s-6)" }}>
          <ul className="tiers">
            {partners.map((p) => (
              <li key={p.name} className="tier">
                <span className="tier__title">{p.title}</span>
                <span style={{ display: "grid", gap: "var(--s-2)" }}>
                  {p.logo ? (
                    <img src={p.logo.src} alt={p.name} width={p.logo.width} height={p.logo.height} style={{ height: "3.5rem", width: "auto" }} />
                  ) : (
                    <span className="tier__name">{p.name}</span>
                  )}
                  <Source p={p.provenance} />
                </span>
                <span className="tier__meta">{p.placement}</span>
              </li>
            ))}
          </ul>
          <div className="prose">
            <p className="muted">
              Partner names appear as text until approved logo artwork is supplied. Logos will then be shown in their original colours and proportions,
              with their required clear space. Tier order follows the franchise&rsquo;s confirmed hierarchy once provided.
            </p>
            <p>Partnership enquiries: see <Link href="/contact">contact</Link>.</p>
          </div>
        </div>
      </section>
    </>
  );
}
