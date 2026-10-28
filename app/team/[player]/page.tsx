import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow, Note, PageHero, Source } from "@/components/ui";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { players, seasons, site, squadVideoFor } from "@/content";

type Params = { params: Promise<{ player: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => players.map((p) => ({ player: p.slug }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { player: slug } = await params;
  const player = players.find((p) => p.slug === slug);
  if (!player) return {};
  return {
    title: player.name,
    description: `${player.name}, ${site.name} squad member.`,
    alternates: { canonical: `/team/${player.slug}` },
  };
}

export default async function PlayerPage({ params }: Params) {
  const { player: slug } = await params;
  const player = players.find((p) => p.slug === slug);
  if (!player) notFound();
  const index = players.indexOf(player);
  const next = players[(index + 1) % players.length];
  const video = squadVideoFor(player.slug);

  return (
    <>
      <PageHero kicker={player.tags.length ? player.tags.join(" · ") : "Squad"} title={player.name}>
        {player.shirtNumber !== undefined && <p className="lede">Shirt #{player.shirtNumber}</p>}
      </PageHero>
      <section className="band band--tight">
        <div className="wrap split">
          <div style={{ display: "grid", gap: "var(--s-5)" }}>
            {player.portrait && <img src={player.portrait.src} alt={player.portrait.alt} style={{ borderRadius: "var(--r-md)" }} />}
            {video && <YouTubeEmbed video={video} priority />}
            {player.biography && <p className="lede">{player.biography}</p>}
            {player.stats?.length ? (
              <dl className="stats">
                {player.stats.map((s) => <div key={s.label}><dt>{s.label} · {s.season}</dt><dd>{s.value}</dd></div>)}
              </dl>
            ) : (
              <p className="muted">Portrait, shirt number and statistics will be added once the franchise supplies approved data.</p>
            )}
            {player.nameNote && <p><Note>Name to confirm</Note> <span className="small muted">{player.nameNote}</span></p>}
          </div>
          <div style={{ display: "grid", gap: "var(--s-5)" }}>
            <ul className="spec-list">
              <li><strong>Seasons</strong><span>{player.seasons.map((id) => seasons.find((s) => s.id === id)?.label ?? id).join(", ")}</span></li>
              <li><strong>Role</strong><span>{player.tags.length ? player.tags.join(", ") : "Not stated by source"}</span></li>
            </ul>
            <Source p={player.provenance} />
            <div className="btn-row">
              <Link href="/team" className="btn btn--line btn--sm">Full squad</Link>
              <Link href={`/team/${next.slug}`} className="btn btn--line btn--sm">Next: {next.name} <Arrow /></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
