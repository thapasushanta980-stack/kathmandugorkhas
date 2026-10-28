import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { site } from "@/content";

export const metadata: Metadata = {
  title: "Privacy",
  description: `How the ${site.name} website handles your data.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero kicker="Legal" title="Privacy" lede={`Last updated ${site.contentLastReviewed}.`} />
      <section className="band band--paper">
        <div className="wrap prose">
          <h2>What this site collects</h2>
          <p>
            This website has no accounts, forms, analytics or advertising trackers, and it sets no cookies of its own.
          </p>
          <h2>Stored on your device</h2>
          <p>
            The jersey viewer saves one small setting in your browser&rsquo;s local storage, so the
            &ldquo;Drag to rotate&rdquo; hint is shown only once. It never leaves your device. Clearing your
            browser&rsquo;s site data removes it.
          </p>
          <h2>YouTube videos and the soundtrack</h2>
          <p>
            Videos and the soundtrack are embedded from YouTube in its privacy-enhanced mode (youtube-nocookie.com). Nothing is
            loaded from YouTube until you press play or turn the sound on. Once a video plays, YouTube&rsquo;s own privacy policy
            applies to that player.
          </p>
          <h2>Hosting</h2>
          <p>
            Like any website, the hosting provider may keep standard server logs, such as IP address and pages
            requested, for security and reliability.
          </p>
          <h2>Changes</h2>
          <p>
            If analytics, forms or a shop are added, this notice will be updated before they go live, along with
            cookie settings where needed.
          </p>
          <p className="source">Concept notice. The franchise must review it before launch.</p>
        </div>
      </section>
    </>
  );
}
