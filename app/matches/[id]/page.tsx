import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow, PageHero, Source, Statement } from "@/components/ui";
import { fixtureById, fixtures, isKG, seasons, site } from "@/content";
import { whenLabel } from "@/lib/format";

type Params = { params: Promise<{ id: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => fixtures.map((f) => ({ id: f.id }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const f = fixtureById((await params).id);
  if (!f) return {};
  return {
    title: `${site.name} v ${f.opponent}, ${f.label}`,
    description: `${f.label}, ${whenLabel(f)} at ${f.venue}.${f.result ? ` ${f.result.summary}.` : ""}`,
    alternates: { canonical: `/matches/${f.id}` },
  };
}

export default async function MatchPage({ params }: Params) {
  const f = fixtureById((await params).id);
  if (!f) notFound();
  const season = seasons.find((s) => s.id === f.season);

  return (
    <>
      <PageHero kicker={`${season?.label ?? f.season} · ${f.label}`} title={`v ${f.opponent}`} lede={`${whenLabel(f)}. ${f.venue}.`} />
      <section className="band band--tight">
        <div className="wrap split">
          <div>
            {f.result ? (
              <div>
                <p className="kicker kicker--rule" style={{ marginBottom: "var(--s-4)" }}>Result</p>
                <p style={{ fontSize: "var(--t-xl)", fontFamily: "var(--font-display)", textTransform: "uppercase", lineHeight: 1 }}>{f.result.summary}</p>
                <div style={{ marginTop: "var(--s-5)" }}>
                  {f.result.innings.map((inn) => (
                    <div key={inn.team} className="scorecard__row">
                      <span className="scorecard__team" style={isKG(inn.team) ? { color: "var(--kg-aqua)" } : undefined}>{inn.team}</span>
                      <span className="scorecard__score">{inn.score}<small>{inn.overs} ov</small></span>
                    </div>
                  ))}
                </div>
                <p className="source" style={{ marginTop: "var(--s-3)" }}>Innings in batting order. A full batting and bowling scorecard is shown once an official scorecard feed is connected.</p>
              </div>
            ) : (
              <Statement title="Match preview">
                Team news, the result and the scorecard will be added here after the match, once confirmed by an official source.
              </Statement>
            )}
          </div>
          <div style={{ display: "grid", gap: "var(--s-5)" }}>
            <ul className="spec-list">
              <li><strong>Date</strong><span>{whenLabel(f)}</span></li>
              <li><strong>Venue</strong><span>{f.venue}</span></li>
              <li><strong>Stage</strong><span>{f.label}</span></li>
              <li><strong>Tickets</strong><span>{f.ticketUrl ? <a href={f.ticketUrl} rel="noopener noreferrer" target="_blank">Official ticketing</a> : "No official ticketing link confirmed"}</span></li>
            </ul>
            <Source p={f.provenance} />
            <p><Link href="/matches" className="text-link">All matches <Arrow /></Link></p>
          </div>
        </div>
      </section>
    </>
  );
}
