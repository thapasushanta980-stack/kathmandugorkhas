import type { Metadata } from "next";
import Link from "next/link";
import { FixturesBrowser } from "@/components/Fixtures";
import { Arrow, PageHero, Source } from "@/components/ui";
import { currentSeason, fixtures, seasons, site } from "@/content";

export const metadata: Metadata = {
  title: "Matches",
  description: `${site.name} fixtures and results in the ${site.league}, with times in Nepal Time.`,
  alternates: { canonical: "/matches" },
};

export default function MatchesPage() {
  const current = fixtures.find((f) => f.season === currentSeason.id);
  const previous = fixtures.find((f) => f.season !== currentSeason.id);
  return (
    <>
      <PageHero kicker="Match Centre" title="Matches" lede={`${currentSeason.label}: ${currentSeason.dates}, all matches at ${currentSeason.venue}. Times are Nepal Time (NPT).`}>
        <p><Link href="/standings" className="text-link">Points table <Arrow /></Link></p>
      </PageHero>
      <section className="band band--tight">
        <div className="wrap" style={{ display: "grid", gap: "var(--s-6)" }}>
          <FixturesBrowser fixtures={fixtures} seasons={seasons} />
          <div style={{ display: "grid", gap: "var(--s-2)" }}>
            {current && <Source p={current.provenance} prefix="Season 3 fixtures" />}
            {previous && <Source p={previous.provenance} prefix="Season 2 results" />}
            <p className="source">Results are updated by hand after each match; this page is not a live feed. Playoff fixtures are added once confirmed. No ticketing link has been confirmed.</p>
          </div>
        </div>
      </section>
    </>
  );
}
