import type { Metadata } from "next";
import { NewsList } from "@/components/NewsList";
import { PageHero } from "@/components/ui";
import { news, site } from "@/content";

export const metadata: Metadata = {
  title: "News",
  description: `${site.name} news: squad, partners, match reports and interviews.`,
  alternates: { canonical: "/news" },
};

export default function NewsPage() {
  return (
    <>
      <PageHero kicker="Latest" title="News" lede="Coverage of the Gorkhas, linked to the original outlets. Official club announcements, match previews, reports and interviews will appear here as the newsroom publishes them." />
      <section className="band band--paper band--tight">
        <div className="wrap" style={{ display: "grid", gap: "var(--s-5)" }}>
          <NewsList items={news} />
          <p className="source">Summaries are written for this site; follow the link for the full story. Headlines are the outlets&rsquo; own.</p>
        </div>
      </section>
    </>
  );
}
