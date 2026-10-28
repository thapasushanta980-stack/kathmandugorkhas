import type { Metadata } from "next";
import Link from "next/link";
import { Topo } from "@/components/Topo";
import { Arrow, Note, PageHero, Source } from "@/components/ui";
import { seasons, site, staff, standings } from "@/content";
import { ordinal } from "@/lib/format";

export const metadata: Metadata = {
  title: "Club story",
  description: `The identity, history and Valley roots of ${site.name}.`,
  alternates: { canonical: "/club" },
};

export default function ClubPage() {
  const s2 = standings.find((t) => t.season === "2025")!;
  const pos = s2.rows.findIndex((r) => r.team === site.name) + 1;
  const ed = staff.find((s) => s.role === "Executive director");
  return (
    <>
      <PageHero kicker="Club" title="Club story" lede="A franchise for the Kathmandu Valley, under a crest drawn from its skyline." />

      <section className="band band--purple" style={{ overflow: "hidden" }}>
        <Topo />
        <div className="wrap story">
          <img className="story__crest" src="/media/brand/crest.jpg" alt="Kathmandu Gorkhas crest" width={554} height={554} />
          <div className="prose">
            <h2 style={{ marginTop: 0 }}>Reading the crest</h2>
            <p>A purple shield edged in gold carries the team name. Tiered temple rooftops rise above it, two gold lions guard the KG monogram, and two khukuris cross at its foot.</p>
            <p>Public coverage of the identity describes the crest as drawing on landmarks from the Valley&rsquo;s three cities: Kathmandu, Lalitpur (Patan) and Bhaktapur.</p>
            <p><Note /></p>
          </div>
        </div>
      </section>

      <section className="band band--paper">
        <div className="wrap split">
          <div className="prose">
            <p className="kicker kicker--rule">History</p>
            <h2 style={{ marginTop: 0 }}>Three seasons in the NPL</h2>
            <p>The team played its first season under the spelling &ldquo;Kathmandu Gurkhas&rdquo; and now plays as {site.name}, with the new name and crest introduced ahead of Season 2.</p>
            <p>In {seasons[1].label} the Gorkhas won five of seven league matches to finish {ordinal(pos)}, then went out in the Eliminator. Season 3 is played entirely at Kirtipur, {seasons[0].dates}.</p>
            {ed && <p>{ed.name} is the franchise&rsquo;s executive director.</p>}
            <p><Link href="/standings" className="text-link">Season tables <Arrow /></Link></p>
          </div>
          <div className="prose">
            <p className="kicker kicker--rule">Brand line</p>
            <p className="story__line" style={{ fontSize: "var(--t-lg)" }}>{site.brandLine.text}</p>
            <p className="source">As published on the <a href={site.brandLine.sourceUrl} rel="noopener noreferrer" target="_blank">{site.brandLine.source}</a>.</p>
            <p className="kicker kicker--rule" style={{ marginTop: "var(--s-6)" }}>Community</p>
            <p>Community programmes and fan stories will be featured here as the franchise shares them.</p>
          </div>
        </div>
        <div className="wrap" style={{ marginTop: "var(--s-6)" }}>
          <Source p={s2.provenance} prefix="Season record" />
        </div>
      </section>
    </>
  );
}
