import type { Metadata } from "next";
import { StandingsTable } from "@/components/StandingsTable";
import { PageHero } from "@/components/ui";
import { seasons, site, standings } from "@/content";

export const metadata: Metadata = {
  title: "Standings",
  description: `${site.league} points table, with ${site.name}'s position, points and net run rate.`,
  alternates: { canonical: "/standings" },
};

export default function StandingsPage() {
  return (
    <>
      <PageHero kicker="Match Centre" title="Standings" lede="League tables with points and net run rate. Updated by hand after each matchday; not a live feed." />
      {standings.map((t, i) => (
        <section key={t.season} className={`band band--tight${i % 2 ? " band--paper" : ""}`} aria-labelledby={`table-${t.season}`}>
          <div className="wrap" style={{ display: "grid", gap: "var(--s-5)" }}>
            <div style={{ display: "grid", gap: "var(--s-2)" }}>
              <p className="kicker kicker--rule">{t.stage}</p>
              <h2 id={`table-${t.season}`} style={{ fontSize: "var(--t-xl)" }}>{seasons.find((s) => s.id === t.season)?.label ?? t.season}</h2>
            </div>
            <StandingsTable table={t} />
          </div>
        </section>
      ))}
    </>
  );
}
