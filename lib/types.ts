/**
 * Content data model. Mirrors the schemas a CMS (Sanity / Strapi) should use.
 * Every fact-bearing record carries provenance so editors and visitors can see
 * where it came from, when it was checked, and whether the franchise has signed it off.
 */

export type ApprovalStatus = "approved" | "awaiting-approval";

export interface Provenance {
  /** Human-readable source, e.g. "ESPNcricinfo fixtures". */
  source: string;
  url?: string;
  /** ISO date the record was last checked. */
  verifiedAt: string;
  /** "approved" only once the franchise has signed off. Press/reference data stays "awaiting-approval". */
  status: ApprovalStatus;
}

export interface Season {
  id: string; // "2026"
  label: string; // "Season 3 · 2026"
  dates: string;
  venue: string;
  current: boolean;
}

export interface SocialLink {
  label: "Instagram" | "Facebook" | "X" | "YouTube" | "TikTok";
  url: string;
  provenance: Provenance;
}

export interface Innings {
  team: string;
  score: string;
  overs: string;
}

export interface Fixture {
  id: string;
  season: string;
  label: string; // "Match 5", "Eliminator"
  opponent: string;
  venue: string;
  date: string; // YYYY-MM-DD, Nepal Time
  time?: string; // HH:mm, Nepal Time
  dayNight?: boolean;
  ticketUrl?: string;
  result?: {
    outcome: "won" | "lost" | "tied" | "no-result";
    summary: string; // "Won by 5 wickets"
    innings: [Innings, Innings]; // batting order
  };
  provenance: Provenance;
}

export interface StandingRow {
  team: string;
  p: number;
  w: number;
  l: number;
  nr: number;
  pts: number;
  nrr: string;
  note?: string;
}

export interface Standings {
  season: string;
  stage: string;
  updatedTo: string;
  rows: StandingRow[];
  provenance: Provenance;
}

export interface Player {
  slug: string;
  name: string;
  /** Only roles stated by a source. Leave empty rather than guess. */
  tags: ("Captain" | "Wicketkeeper" | "Local icon player")[];
  seasons: string[];
  shirtNumber?: number;
  portrait?: { src: string; alt: string };
  biography?: string;
  stats?: { label: string; value: string; season: string }[];
  nameNote?: string;
  provenance: Provenance;
}

export interface StaffMember {
  name: string;
  role: string;
  provenance: Provenance;
}

export type NewsKind = "Squad" | "Partners" | "Match report" | "Preview" | "Interview" | "Community" | "Announcement";

export interface NewsItem {
  slug: string;
  title: string;
  kind: NewsKind;
  publishedAt: string;
  summary: string;
  url: string;
  outlet: string;
  provenance: Provenance;
}

export interface Partner {
  name: string;
  title: string; // the partnership title as announced
  season: string;
  /** Approved logo artwork. Until supplied, partners render as wordmarks in text. */
  logo?: { src: string; width: number; height: number };
  placement?: string;
  url?: string;
  provenance: Provenance;
}

export interface Product {
  name: string;
  price: string;
  sizes: string[];
  inStock: boolean;
  image: { src: string; alt: string };
  checkoutUrl: string;
  provenance: Provenance;
}

export type MediaCategory = "Kit" | "Matchday" | "Training" | "Fans" | "Community" | "Behind the scenes";

export interface PhotoItem {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  category: MediaCategory;
  season?: string;
  status: ApprovalStatus;
}

export interface VideoItem {
  slug: string;
  title: string;
  src: string;
  poster: string;
  duration: string;
  category: MediaCategory;
  season?: string;
  description: string;
  status: ApprovalStatus;
}

export type YouTubeCategory = "Anthem" | "Know your squad" | "Interviews" | "Behind the scenes" | "Archive";

/** An official upload embedded from its owner's YouTube channel (never re-hosted). */
export interface YouTubeVideo {
  id: string;
  title: string;
  channel: "Kathmandu Gorkhas" | "Nepal Premier League";
  channelUrl: string;
  category: YouTubeCategory;
  /** Set for archive items that predate the current name or season. */
  note?: string;
  playerSlug?: string;
}
