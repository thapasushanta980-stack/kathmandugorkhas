import { existsSync } from "node:fs";
import path from "node:path";
import type { Metadata, Viewport } from "next";
import { Anton, Inter } from "next/font/google";
import { RevealController } from "@/components/RevealController";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SoundDock } from "@/components/SoundDock";
import { ANTHEM_AUDIO_PATH, site } from "@/content";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.baseUrl),
  title: { default: `${site.name} | ${site.league}`, template: `%s | ${site.name}` },
  description: `Matches, squad, the 360° jersey and club news from ${site.name}, the Kathmandu Valley's ${site.league} franchise.`,
  icons: { icon: "/media/brand/crest.jpg" },
  openGraph: {
    type: "website",
    siteName: site.name,
    images: [{ url: "/media/brand/crest.jpg", width: 554, height: 554, alt: `${site.name} crest` }],
  },
  twitter: { card: "summary" },
  // Concept build: keep out of search indexes until the franchise approves launch.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#17131c", colorScheme: "dark" };

// Audio-only anthem once the official file is in public/; otherwise the YouTube fallback.
const anthemAudio = existsSync(path.join(process.cwd(), "public", ANTHEM_AUDIO_PATH)) ? ANTHEM_AUDIO_PATH : undefined;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${inter.variable}`}>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <SiteHeader />
        <main id="main" tabIndex={-1}>{children}</main>
        <SiteFooter />
        <SoundDock audioSrc={anthemAudio} />
        <RevealController />
      </body>
    </html>
  );
}
