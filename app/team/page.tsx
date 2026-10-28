import type { Metadata } from "next";
import { Roster } from "@/components/Roster";
import { PageHero, Source } from "@/components/ui";
import { currentSeason, players, site, staff } from "@/content";

export const metadata: Metadata = {
  title: "Team",
  description: `The ${site.name} squad and management for ${currentSeason.label}.`,
  alternates: { canonical: "/team" },
};

export default function TeamPage() {
  return (
    <>
      <PageHero kicker={currentSeason.label} title="Team" lede={`${players.length} players. Roles are shown only where a source states them; profiles, numbers and portraits follow once the franchise supplies them.`} />
      <section className="band band--paper">
        <div className="wrap" style={{ display: "grid", gap: "var(--s-6)" }}>
          <Roster players={players} />
          <Source p={players[0].provenance} prefix="Squad source" />
        </div>
      </section>
      <section className="band band--tight" aria-labelledby="staff-title">
        <div className="wrap" style={{ display: "grid", gap: "var(--s-6)" }}>
          <div style={{ display: "grid", gap: "var(--s-3)" }}>
            <p className="kicker kicker--rule">Management</p>
            <h2 id="staff-title" style={{ fontSize: "var(--t-xl)" }}>Behind the team</h2>
          </div>
          <ul className="people">
            {staff.map((s) => (
              <li key={s.name}>
                <span className="kicker">{s.role}</span>
                <b>{s.name}</b>
                <Source p={s.provenance} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
