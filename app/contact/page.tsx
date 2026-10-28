import type { Metadata } from "next";
import { PageHero, Statement } from "@/components/ui";
import { site, socialLinks } from "@/content";

export const metadata: Metadata = {
  title: "Contact",
  description: `Official channels and media or partnership enquiries for ${site.name}.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero kicker="Contact" title="Contact" lede="Official social channels, and media and partnership enquiries." />
      <section className="band band--paper">
        <div className="wrap split">
          <div style={{ display: "grid", gap: "var(--s-4)" }}>
            <h2 style={{ fontSize: "var(--t-lg)" }}>Follow the team</h2>
            {socialLinks.length ? (
              <ul className="spec-list">
                {socialLinks.map((s) => <li key={s.url}><strong>{s.label}</strong><a href={s.url} rel="noopener noreferrer" target="_blank">{s.url}</a></li>)}
              </ul>
            ) : (
              <Statement title="Channels being verified">
                The team&rsquo;s official social accounts will be linked here once they are confirmed through the franchise. Unverified accounts are not linked.
              </Statement>
            )}
          </div>
          <div style={{ display: "grid", gap: "var(--s-4)" }}>
            <h2 style={{ fontSize: "var(--t-lg)" }}>Media and partnerships</h2>
            {site.contactEmail ? (
              <p><a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a></p>
            ) : (
              <Statement title="Inbox to be confirmed">
                An official enquiries address will be published here. This site does not collect messages, so no form is shown.
              </Statement>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
