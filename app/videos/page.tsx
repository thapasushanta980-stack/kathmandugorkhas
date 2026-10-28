import type { Metadata } from "next";
import { MediaGallery } from "@/components/MediaGallery";
import { PageHero } from "@/components/ui";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { YouTubeLibrary } from "@/components/YouTubeLibrary";
import { site, videos, youtubeVideos } from "@/content";

export const metadata: Metadata = {
  title: "Videos",
  description: `${site.name} video library: anthems, Know your squad, interviews and behind the scenes.`,
  alternates: { canonical: "/videos" },
};

export default function VideosPage() {
  const [featured, ...rest] = youtubeVideos;
  return (
    <>
      <PageHero kicker="Media room" title="Videos" lede="Official videos from the Kathmandu Gorkhas and Nepal Premier League YouTube channels. Nothing plays, and nothing loads from YouTube, until you press play." />

      <section className="band band--teal band--tight" aria-labelledby="featured-title">
        <div className="wrap feature-video">
          <YouTubeEmbed video={featured} priority />
          <div style={{ display: "grid", gap: "var(--s-4)" }}>
            <p className="kicker kicker--rule">Featured</p>
            <h2 id="featured-title" style={{ fontSize: "var(--t-xl)" }}>{featured.title}</h2>
            <p className="lede">The team anthem, from the official Kathmandu Gorkhas channel. You can also play it from the sound control in the corner of any page.</p>
          </div>
        </div>
      </section>

      <section className="band band--tight" aria-labelledby="library-title">
        <div className="wrap" style={{ display: "grid", gap: "var(--s-6)" }}>
          <h2 id="library-title" style={{ fontSize: "var(--t-xl)" }}>Library</h2>
          <YouTubeLibrary videos={rest} />
          <p className="source">Videos are embedded from their owners&rsquo; channels in YouTube&rsquo;s privacy-enhanced mode; titles are as published. Archive items predate the current name and season.</p>
        </div>
      </section>

      <section className="band band--paper band--tight" aria-labelledby="kit-video-title">
        <div className="wrap" style={{ display: "grid", gap: "var(--s-5)" }}>
          <h2 id="kit-video-title" style={{ fontSize: "var(--t-lg)" }}>Kit turntable</h2>
          <MediaGallery videos={videos} />
          <p className="source">Computer-generated footage supplied with the project; awaiting franchise approval.</p>
        </div>
      </section>
    </>
  );
}
