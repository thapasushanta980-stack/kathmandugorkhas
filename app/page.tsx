import Link from "next/link";
import { existsSync } from "node:fs";
import path from "node:path";
import { Hero } from "@/components/Hero";
import { JerseyViewer } from "@/components/JerseyViewer";
import { MatchStrip } from "@/components/MatchStrip";
import { MediaGallery } from "@/components/MediaGallery";
import { StandingsTable } from "@/components/StandingsTable";
import { Topo } from "@/components/Topo";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { Arrow, Head, Note, Source } from "@/components/ui";
import { currentSeason, fixtures, kit, news, partners, players, site, standings, youtubeVideos } from "@/content";
import { formatDate, ordinal } from "@/lib/format";

const season2 = standings.find((s) => s.season === "2025")!;
const kgSeason2 = season2.rows.find((r) => r.team === site.name)!;
const kgSeason2Pos = season2.rows.indexOf(kgSeason2) + 1;
const season3 = standings.find((s) => s.season === currentSeason.id)!;
const eliminator = fixtures.find((f) => f.id === "2025-eliminator")!;

/**
 * Full-bleed hero footage slot. Drop a rights-cleared, franchise-supplied loop
 * at public/media/hero/hero-loop.mp4 (plus hero-poster.jpg) and rebuild; until
 * then the hero uses its abstract light field.
 */
const heroVideo = existsSync(path.join(process.cwd(), "public/media/hero/hero-loop.mp4"))
  ? { src: "/media/hero/hero-loop.mp4", poster: "/media/hero/hero-poster.jpg" }
  : undefined;

export default function HomePage() {
  const captain = players.find((p) => p.tags.includes("Captain"));
  const [first, ...rest] = (captain?.name ?? "").split(" ");

  return (
    <>
      <Hero videoSrc={heroVideo?.src} posterSrc={heroVideo?.poster} />

      <MatchStrip />

      {/* Jersey */}
      <section id="jersey" className="band band--teal" aria-labelledby="jersey-title">
        <div className="wrap jersey-zone">
          <JerseyViewer labelledBy="jersey-title" />
          <div style={{ display: "grid", gap: "var(--s-5)" }} data-reveal>
            <p className="kicker kicker--rule">The kit</p>
            <h2 id="jersey-title" style={{ fontSize: "var(--t-2xl)", lineHeight: 0.9 }}>Turn the jersey</h2>
            <p className="lede">Aqua body, purple collar, gold at the shoulders and cuffs, and guardian lions on the shoulders. Drag or swipe to see every side.</p>
            <Note>{kit.label} · {kit.seasonNote}</Note>
            <div className="btn-row">
              <Link href="/jersey" className="btn btn--ink">Jersey details <Arrow /></Link>
              <Link href="/shop" className="btn btn--line">Where to buy</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Squad */}
      <section className="band band--paper" aria-labelledby="squad-title">
        <div className="wrap">
          {captain && (
            <div className="captain" data-reveal>
              <div style={{ display: "grid", gap: "var(--s-4)" }}>
                <p className="kicker kicker--rule">Captain · {currentSeason.label}</p>
                <p className="captain__name" aria-label={captain.name}>{first}<span>{rest.join(" ")}</span></p>
              </div>
              <div style={{ display: "grid", gap: "var(--s-4)" }}>
                {captain.biography && <p className="lede">{captain.biography}</p>}
                <Link href={`/team/${captain.slug}`} className="text-link">Player profile <Arrow /></Link>
              </div>
            </div>
          )}
          <Head
            id="squad-title"
            kicker="Squad"
            title={`The ${players.length} for Season 3`}
            action={<Link href="/team" className="btn btn--line">Full squad <Arrow /></Link>}
          />
          <ol className="roster">
            {players.slice(0, 12).map((p, i) => (
              <li key={p.slug}>
                <Link href={`/team/${p.slug}`}>
                  <span className="roster__n">{String(i + 1).padStart(2, "0")}</span>
                  <span className="roster__name">{p.name}</span>
                  {p.tags.length > 0 && <span className="roster__tags">{p.tags.join(" · ")}</span>}
                </Link>
              </li>
            ))}
          </ol>
          <div style={{ marginTop: "var(--s-5)" }}><Source p={players[0].provenance} prefix="Squad source" /></div>
        </div>
      </section>

      {/* Story */}
      <section className="band band--purple" aria-labelledby="story-title" style={{ overflow: "hidden" }}>
        <Topo />
        <div className="wrap story">
          <img className="story__crest" src="/media/brand/crest.jpg" alt="Kathmandu Gorkhas crest" width={554} height={554} loading="lazy" data-reveal />
          <div>
            <p className="kicker kicker--rule" data-reveal>Club story</p>
            <h2 id="story-title" className="story__line" data-reveal style={{ marginTop: "var(--s-4)" }}>
              A crest drawn from <em>the Valley</em>
            </h2>
            <ol className="marks">
              <li data-reveal><div><h3>Temple skyline</h3><p>Tiered temple rooftops rise above the shield.</p></div></li>
              <li data-reveal><div><h3>Guardian lions</h3><p>Two gold lions flank the KG monogram at the heart of the crest.</p></div></li>
              <li data-reveal><div><h3>Crossed khukuris</h3><p>Two khukuris cross beneath the Gorkhas name.</p></div></li>
            </ol>
            <p style={{ marginTop: "var(--s-5)" }}><Link href="/club" className="text-link" style={{ color: "var(--kg-aqua)" }}>Read the club story <Arrow /></Link></p>
          </div>
        </div>
      </section>

      {/* Season pulse */}
      <section className="band band--ink" aria-labelledby="pulse-title">
        <div className="wrap">
          <Head id="pulse-title" kicker="Season pulse" title="Where the Gorkhas stand" action={<Link href="/standings" className="btn btn--line">Standings <Arrow /></Link>} />
          <div className="pulse">
            <div style={{ display: "grid", gap: "var(--s-4)" }}>
              <p className="kicker">Season 2 · 2025 in numbers</p>
              <dl className="stats">
                <div><dt>League finish</dt><dd>{ordinal(kgSeason2Pos)}</dd></div>
                <div><dt>Won of {kgSeason2.p}</dt><dd>{kgSeason2.w}</dd></div>
                <div><dt>Points</dt><dd>{kgSeason2.pts}</dd></div>
                <div><dt>Net run rate</dt><dd>{kgSeason2.nrr}</dd></div>
              </dl>
              <p className="muted">Out in the Eliminator: {eliminator.result!.summary.toLowerCase()} to {eliminator.opponent}, {formatDate(eliminator.date, "short")}.</p>
              <Source p={season2.provenance} />
            </div>
            <div style={{ display: "grid", gap: "var(--s-4)" }}>
              <p className="kicker">{currentSeason.label} · table</p>
              <StandingsTable table={season3} compact />
            </div>
          </div>
        </div>
      </section>

      {/* Latest stories */}
      <section className="band band--paper" aria-labelledby="latest-title">
        <div className="wrap">
          <Head id="latest-title" kicker="Latest" title="Stories" action={<Link href="/news" className="btn btn--line">All news <Arrow /></Link>} />
          <ul className="storylist">
            {news.slice(0, 4).map((n) => (
              <li key={n.slug}>
                <a href={n.url} rel="noopener noreferrer" target="_blank">
                  <span className="storylist__meta"><b>{n.kind}</b>{formatDate(n.publishedAt, "short")}</span>
                  <span><h3>{n.title}</h3><p>{n.summary}</p></span>
                  <span className="storylist__out">{n.outlet} ↗<span className="visually-hidden"> (opens in a new tab)</span></span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Media room */}
      <section className="band band--ink" aria-labelledby="media-title">
        <div className="wrap">
          <Head
            id="media-title"
            kicker="Media room"
            title="Watch the Gorkhas"
            lede="Official videos from the team's YouTube channel. Nothing plays until you press play."
            action={<div className="btn-row"><Link href="/videos" className="btn btn--line">All videos <Arrow /></Link><Link href="/photos" className="btn btn--line">Photos</Link></div>}
          />
          <div className="media-room">
            <YouTubeEmbed video={youtubeVideos[0]} />
            <ul className="media-room__side">
              {youtubeVideos.filter((v) => ["g5kxEbIV6fY", "EynZcQq7-_U"].includes(v.id)).map((v) => (
                <li key={v.id}><YouTubeEmbed video={v} /></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="band band--paper band--tight" aria-labelledby="partners-title">
        <div className="wrap">
          <Head id="partners-title" kicker="Official partners" title="Backing the Gorkhas" action={<Link href="/partners" className="btn btn--line">Partners <Arrow /></Link>} />
          <ul className="tiers">
            {partners.map((p) => (
              <li key={p.name} className="tier">
                <span className="tier__title">{p.title}</span>
                <span className="tier__name">{p.name}</span>
                <span className="tier__meta">{p.placement}</span>
              </li>
            ))}
          </ul>
          <p className="source" style={{ marginTop: "var(--s-4)" }}>Titles as announced in the press. Logo artwork is shown once approved files are supplied.</p>
        </div>
      </section>

      {/* Shop CTA */}
      <section className="band band--teal band--tight" aria-labelledby="shop-title">
        <div className="wrap cta">
          <div style={{ display: "grid", gap: "var(--s-3)" }}>
            <h2 id="shop-title">Wear the aqua</h2>
            <p className="lede">The official place to buy the jersey will be linked here once the franchise confirms it.</p>
          </div>
          <Link href="/shop" className="btn btn--ink">Shop status <Arrow /></Link>
        </div>
      </section>
    </>
  );
}
