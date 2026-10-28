/**
 * Single source of truth for site content until a CMS is connected.
 *
 * Rules for editors:
 * - Add a record only with a real source. Never add sample data.
 * - Press/reference data keeps status "awaiting-approval" until the franchise signs it off.
 * - Times are Nepal Time (UTC+05:45).
 */
import type {
  Fixture,
  NewsItem,
  Partner,
  PhotoItem,
  Player,
  Product,
  Provenance,
  Season,
  SocialLink,
  StaffMember,
  Standings,
  VideoItem,
  YouTubeVideo,
} from "@/lib/types";

const CHECKED = "2026-10-28";
const VENUE = "Tribhuvan University International Cricket Ground, Kirtipur";

const src = {
  espn: { source: "ESPNcricinfo, NPL 2026-27 fixtures", url: "https://africa.espn.com/cricket/scores/series/23081/nepal-premier-league", verifiedAt: CHECKED, status: "awaiting-approval" },
  wiki26: { source: "Wikipedia, 2026 Nepal Premier League", url: "https://en.wikipedia.org/wiki/2026_Nepal_Premier_League", verifiedAt: CHECKED, status: "awaiting-approval" },
  wiki25: { source: "Wikipedia, 2025 Nepal Premier League", url: "https://en.wikipedia.org/wiki/2025_Nepal_Premier_League", verifiedAt: CHECKED, status: "awaiting-approval" },
  assets: { source: "Supplied project assets", verifiedAt: CHECKED, status: "awaiting-approval" },
} satisfies Record<string, Provenance>;

export const site = {
  name: "Kathmandu Gorkhas",
  league: "Nepal Premier League",
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** Published in the description of the team's official YouTube channel. */
  brandLine: { text: "Three Cities. One Soul. One Team. One Dream.", source: "Kathmandu Gorkhas YouTube channel", sourceUrl: "https://www.youtube.com/@KtmGorkhas" },
  officialShopUrl: null as string | null,
  contactEmail: null as string | null,
  contentLastReviewed: CHECKED,
};

export const seasons: Season[] = [
  { id: "2026", label: "Season 3 · 2026", dates: "26 Oct – 21 Nov 2026", venue: VENUE, current: true },
  { id: "2025", label: "Season 2 · 2025", dates: "17 Nov – 13 Dec 2025", venue: VENUE, current: false },
];
export const currentSeason = seasons.find((s) => s.current)!;

const ktmChannel = "https://www.youtube.com/@KtmGorkhas";
const nplChannel = "https://www.youtube.com/@OfficialNPLT20";

/** The YouTube channel describes itself as the "Official handle of Kathmandu Gorkhas". Other platforms are not yet verified. */
export const socialLinks: SocialLink[] = [
  { label: "YouTube", url: ktmChannel, provenance: { source: "Kathmandu Gorkhas YouTube channel description", url: ktmChannel, verifiedAt: CHECKED, status: "awaiting-approval" } },
];

const result = (outcome: "won" | "lost", summary: string, a: [string, string, string], b: [string, string, string]) => ({
  outcome,
  summary,
  innings: [
    { team: a[0], score: a[1], overs: a[2] },
    { team: b[0], score: b[1], overs: b[2] },
  ] as [{ team: string; score: string; overs: string }, { team: string; score: string; overs: string }],
});
const KG = "Kathmandu Gorkhas";

export const fixtures: Fixture[] = [
  // Season 3 · 2026 league stage
  { id: "2026-match-5", season: "2026", label: "Match 5", opponent: "Janakpur Bolts", venue: VENUE, date: "2026-10-29", time: "12:30", provenance: src.espn },
  { id: "2026-match-10", season: "2026", label: "Match 10", opponent: "Karnali Yaks", venue: VENUE, date: "2026-11-02", time: "12:30", provenance: src.espn },
  { id: "2026-match-15", season: "2026", label: "Match 15", opponent: "Biratnagar Kings", venue: VENUE, date: "2026-11-05", time: "16:30", dayNight: true, provenance: src.espn },
  { id: "2026-match-18", season: "2026", label: "Match 18", opponent: "Lumbini Lions", venue: VENUE, date: "2026-11-07", time: "16:30", dayNight: true, provenance: src.espn },
  { id: "2026-match-20", season: "2026", label: "Match 20", opponent: "Chitwan Rhinos", venue: VENUE, date: "2026-11-09", time: "16:30", dayNight: true, provenance: src.espn },
  { id: "2026-match-24", season: "2026", label: "Match 24", opponent: "Sudurpaschim Royals", venue: VENUE, date: "2026-11-13", time: "12:30", provenance: src.espn },
  { id: "2026-match-28", season: "2026", label: "Match 28", opponent: "Pokhara Avengers", venue: VENUE, date: "2026-11-15", time: "16:30", dayNight: true, provenance: src.espn },

  // Season 2 · 2025
  { id: "2025-janakpur-bolts", season: "2025", label: "League", opponent: "Janakpur Bolts", venue: VENUE, date: "2025-11-17", provenance: src.wiki25,
    result: result("won", "Won by 5 wickets", ["Janakpur Bolts", "130/6", "20"], [KG, "131/5", "18"]) },
  { id: "2025-sudurpaschim-royals", season: "2025", label: "League", opponent: "Sudurpaschim Royals", venue: VENUE, date: "2025-11-19", provenance: src.wiki25,
    result: result("lost", "Lost by 29 runs", ["Sudurpaschim Royals", "147", "20"], [KG, "118", "16.5"]) },
  { id: "2025-biratnagar-kings", season: "2025", label: "League", opponent: "Biratnagar Kings", venue: VENUE, date: "2025-11-22", provenance: src.wiki25,
    result: result("lost", "Lost by 5 wickets", [KG, "134/6", "20"], ["Biratnagar Kings", "135/5", "17.1"]) },
  { id: "2025-lumbini-lions", season: "2025", label: "League", opponent: "Lumbini Lions", venue: VENUE, date: "2025-11-25", provenance: src.wiki25,
    result: result("won", "Won by 22 runs", [KG, "157/8", "20"], ["Lumbini Lions", "135", "19.1"]) },
  { id: "2025-chitwan-rhinos", season: "2025", label: "League", opponent: "Chitwan Rhinos", venue: VENUE, date: "2025-11-28", provenance: src.wiki25,
    result: result("won", "Won by 53 runs", [KG, "142", "19.4"], ["Chitwan Rhinos", "89", "17.2"]) },
  { id: "2025-karnali-yaks", season: "2025", label: "League", opponent: "Karnali Yaks", venue: VENUE, date: "2025-11-30", provenance: src.wiki25,
    result: result("won", "Won by 5 wickets", ["Karnali Yaks", "149/7", "20"], [KG, "155/5", "18"]) },
  { id: "2025-pokhara-avengers", season: "2025", label: "League", opponent: "Pokhara Avengers", venue: VENUE, date: "2025-12-04", provenance: src.wiki25,
    result: result("won", "Won by 13 runs", [KG, "165/8", "20"], ["Pokhara Avengers", "152", "20"]) },
  { id: "2025-eliminator", season: "2025", label: "Eliminator", opponent: "Lumbini Lions", venue: VENUE, date: "2025-12-10", provenance: src.wiki25,
    result: result("lost", "Lost by 4 wickets", [KG, "111", "19.1"], ["Lumbini Lions", "112/6", "17.4"]) },
];

export const standings: Standings[] = [
  {
    season: "2026", stage: "League stage", updatedTo: "Matches played to 27 Oct 2026", provenance: src.wiki26,
    rows: [
      { team: "Lumbini Lions", p: 1, w: 1, l: 0, nr: 0, pts: 2, nrr: "+4.599" },
      { team: "Karnali Yaks", p: 1, w: 1, l: 0, nr: 0, pts: 2, nrr: "+0.950" },
      { team: "Chitwan Rhinos", p: 1, w: 1, l: 0, nr: 0, pts: 2, nrr: "+0.400" },
      { team: KG, p: 0, w: 0, l: 0, nr: 0, pts: 0, nrr: "0.000" },
      { team: "Pokhara Avengers", p: 0, w: 0, l: 0, nr: 0, pts: 0, nrr: "0.000" },
      { team: "Biratnagar Kings", p: 1, w: 0, l: 1, nr: 0, pts: 0, nrr: "−0.400" },
      { team: "Janakpur Bolts", p: 1, w: 0, l: 1, nr: 0, pts: 0, nrr: "−0.950" },
      { team: "Sudurpaschim Royals", p: 1, w: 0, l: 1, nr: 0, pts: 0, nrr: "−4.599" },
    ],
  },
  {
    season: "2025", stage: "Final league table", updatedTo: "End of league stage", provenance: src.wiki25,
    rows: [
      { team: "Sudurpaschim Royals", p: 7, w: 6, l: 1, nr: 0, pts: 12, nrr: "+0.832", note: "Runners-up" },
      { team: "Biratnagar Kings", p: 7, w: 5, l: 2, nr: 0, pts: 10, nrr: "+0.680" },
      { team: KG, p: 7, w: 5, l: 2, nr: 0, pts: 10, nrr: "+0.537", note: "Lost Eliminator" },
      { team: "Lumbini Lions", p: 7, w: 4, l: 3, nr: 0, pts: 8, nrr: "−0.394", note: "Champions" },
      { team: "Pokhara Avengers", p: 7, w: 3, l: 4, nr: 0, pts: 6, nrr: "−0.179" },
      { team: "Karnali Yaks", p: 7, w: 2, l: 5, nr: 0, pts: 4, nrr: "−0.356" },
      { team: "Chitwan Rhinos", p: 7, w: 2, l: 5, nr: 0, pts: 4, nrr: "−0.611" },
      { team: "Janakpur Bolts", p: 7, w: 1, l: 6, nr: 0, pts: 2, nrr: "−0.443" },
    ],
  },
];

const player = (name: string, tags: Player["tags"] = [], extra: Partial<Player> = {}): Player => ({
  slug: name.toLowerCase().replace(/\./g, "").replace(/\s+/g, "-"),
  name,
  tags,
  seasons: ["2026"],
  provenance: src.wiki26,
  ...extra,
});

/** Season 3 squad as listed by Wikipedia; retentions cross-checked with ekantipur (15 Jun 2026). */
export const players: Player[] = [
  player("Karan KC", ["Captain"], { seasons: ["2026", "2025"], biography: "Captained Kathmandu Gorkhas in Season 2 and was among the six players retained for Season 3." }),
  player("Mohammad Aadil Alam", [], { nameNote: "The team's own video uses \"Md. Aadil Alam\"; a translated ekantipur report says \"Mohammad Adil Ansari\"." }),
  player("Shahab Alam"),
  player("Sahan Arachchige"),
  player("K. S. Bharat", ["Wicketkeeper"]),
  player("Will Bosisto"),
  player("Sonu Devkota"),
  player("Ganesh Gautam", ["Local icon player"]),
  player("Sam Heazlett"),
  player("Prashiddha Jaishi", [], { nameNote: "Spelling as used by the team's own videos; Wikipedia writes \"Prashiddha Jaisi\"." }),
  player("Rashid Khan"),
  player("Suryanshu Koirala"),
  player("Dayanand Mandal"),
  player("Sahil Patel", ["Wicketkeeper"]),
  player("Smit Patel", ["Wicketkeeper"]),
  player("Krishna Poudel", [], { nameNote: "Spelling as used by the team's own video; Wikipedia writes \"Krishna Paudel\"." }),
  player("Dev Shah"),
  player("Bhim Sharki", [], { nameNote: "Spelling as used by the team's own video and Wikipedia; ekantipur writes \"Bhim Sarki\"." }),
  player("David Warner"),
  player("Santosh Yadav"),
];

export const staff: StaffMember[] = [
  { name: "Monty Desai", role: "Head coach", provenance: src.wiki26 },
  { name: "Sharad Vesawkar", role: "Cricket director", provenance: { source: "Kathmandu Post, 10 Sep 2026", url: "https://kathmandupost.com/cricket/2026/09/10/kathmandu-gorkhas-continue-partnership-with-shikhar-insurance", verifiedAt: CHECKED, status: "awaiting-approval" } },
  { name: "Anubhav Sirohiya", role: "Executive director", provenance: { source: "Kathmandu Post, 10 Sep 2026", url: "https://kathmandupost.com/cricket/2026/09/10/kathmandu-gorkhas-continue-partnership-with-shikhar-insurance", verifiedAt: CHECKED, status: "awaiting-approval" } },
];

const press = (outlet: string, url: string, publishedAt: string): Provenance => ({ source: `${outlet}, ${publishedAt}`, url, verifiedAt: CHECKED, status: "awaiting-approval" });

/** Press coverage, linked to the original outlet. Official club stories will sit alongside once a newsroom exists. */
export const news: NewsItem[] = [
  { slug: "kmc-education-partner", title: "KMC named education partner of Kathmandu Gorkhas", kind: "Partners", publishedAt: "2026-10-16", outlet: "ekantipur",
    summary: "KMC joins as education partner for the NPL, with its logo on both hands of the Gorkhas mascot.",
    url: "https://ekantipur.com/sports/2026/10/16/en/kmc-as-education-partner-of-kathmandu-gorkhas-25-11.html",
    provenance: press("ekantipur", "https://ekantipur.com/sports/2026/10/16/en/kmc-as-education-partner-of-kathmandu-gorkhas-25-11.html", "2026-10-16") },
  { slug: "shikhar-insurance-golden-partner", title: "Kathmandu Gorkhas continue partnership with Shikhar Insurance", kind: "Partners", publishedAt: "2026-09-10", outlet: "The Kathmandu Post",
    summary: "Shikhar Insurance returns for a third consecutive season as golden partner, with its logo on the back of the jersey.",
    url: "https://kathmandupost.com/cricket/2026/09/10/kathmandu-gorkhas-continue-partnership-with-shikhar-insurance",
    provenance: press("The Kathmandu Post", "https://kathmandupost.com/cricket/2026/09/10/kathmandu-gorkhas-continue-partnership-with-shikhar-insurance", "2026-09-10") },
  { slug: "xtreme-energy-agreement-2026", title: "Kathmandu Gorkhas and Extreme Energy Drinks sign agreement", kind: "Partners", publishedAt: "2026-07-05", outlet: "ekantipur",
    summary: "The Gorkhas and Extreme Energy Drinks sign an agreement ahead of the third edition of the NPL.",
    url: "https://ekantipur.com/sports/2026/07/05/en/kathmandu-gorkhas-and-extreme-energy-drinks-sign-agreement-07-01.html",
    provenance: press("ekantipur", "https://ekantipur.com/sports/2026/07/05/en/kathmandu-gorkhas-and-extreme-energy-drinks-sign-agreement-07-01.html", "2026-07-05") },
  { slug: "npl-season-3-retentions", title: "52 players retained by teams for NPL Season 3", kind: "Squad", publishedAt: "2026-06-20", outlet: "The Kathmandu Post",
    summary: "A league-wide round-up of the players each franchise kept ahead of Season 3.",
    url: "https://kathmandupost.com/sports/2026/06/20/52-players-retained-by-teams-for-npl-season-3",
    provenance: press("The Kathmandu Post", "https://kathmandupost.com/sports/2026/06/20/52-players-retained-by-teams-for-npl-season-3", "2026-06-20") },
  { slug: "six-retained-including-karan", title: "6 players from Kathmandu Gorkhas, including Karan, retained", kind: "Squad", publishedAt: "2026-06-15", outlet: "ekantipur",
    summary: "Karan KC, Bhim Sharki, Shahab Alam, Rashid Khan and Santosh Yadav are among the six players kept for Season 3.",
    url: "https://ekantipur.com/sports/2026/06/15/en/6-players-from-kathmandu-gorkhas-including-karan-retained-49-22.html",
    provenance: press("ekantipur", "https://ekantipur.com/sports/2026/06/15/en/6-players-from-kathmandu-gorkhas-including-karan-retained-49-22.html", "2026-06-15") },
];

/** Partnership titles exactly as announced. Logo artwork is not shown until approved files are supplied. */
export const partners: Partner[] = [
  { name: "Shikhar Insurance", title: "Golden partner", season: "2026", placement: "Back of the jersey",
    provenance: press("The Kathmandu Post", "https://kathmandupost.com/cricket/2026/09/10/kathmandu-gorkhas-continue-partnership-with-shikhar-insurance", "2026-09-10") },
  { name: "Xtreme Energy Drink", title: "Drink partner", season: "2026", placement: "Front of the fan edition jersey",
    provenance: press("ekantipur", "https://ekantipur.com/sports/2025/11/09/en/kathmandu-gorkhas-and-extreme-energy-drink-sign-agreement-54-31.html", "2025-11-09") },
  { name: "KMC", title: "Education partner", season: "2026", placement: "Mascot's hands",
    provenance: press("ekantipur", "https://ekantipur.com/sports/2026/10/16/en/kmc-as-education-partner-of-kathmandu-gorkhas-25-11.html", "2026-10-16") },
];

export const products: Product[] = [];

export const kit = {
  label: "Fan edition jersey",
  /** The supplied kit has no Shikhar Insurance mark on the back, so it may not be the Season 3 match kit. */
  seasonNote: "Season to be confirmed",
  frames: {
    count: 60,
    path: (i: number) => `/media/jersey/frames/f${String(i + 1).padStart(3, "0")}.jpg`,
    front: 0,
    back: 27,
  },
  poster: "/media/jersey/poster.jpg",
  turntable: "/media/video/jersey-turntable.mp4",
  images: {
    front: { src: "/media/jersey/front.jpg", alt: "Kathmandu Gorkhas fan edition jersey, front view", width: 652, height: 845 },
    back: { src: "/media/jersey/back.jpg", alt: "Kathmandu Gorkhas fan edition jersey, back view", width: 652, height: 858 },
    sides: { src: "/media/jersey/sides.jpg", alt: "Kathmandu Gorkhas fan edition jersey, left and right sleeve views", width: 652, height: 858 },
  },
  /** Only details visible in the supplied imagery. No fabric or performance claims. */
  details: [
    { title: "Crest", body: "The club crest sits on the left chest." },
    { title: "Collar", body: "Deep purple collar, matching the crest's shield." },
    { title: "Shoulders and cuffs", body: "Gold shoulder stripes and gold sleeve cuffs." },
    { title: "Guardian lions", body: "Tonal lion artwork across both shoulders, echoing the lions on the crest." },
    { title: "Devanagari script", body: "A vertical Devanagari script graphic runs down the lower front." },
    { title: "League mark", body: "The Nepal Premier League mark appears on the sleeve." },
  ],
};

export const photos: PhotoItem[] = [
  { ...kit.images.front, caption: "Fan edition jersey, front", category: "Kit", status: "awaiting-approval" },
  { ...kit.images.back, caption: "Fan edition jersey, back", category: "Kit", status: "awaiting-approval" },
  { ...kit.images.sides, caption: "Fan edition jersey, sleeves", category: "Kit", status: "awaiting-approval" },
];

export const videos: VideoItem[] = [
  { slug: "jersey-turntable", title: "The jersey, all the way round", src: kit.turntable, poster: kit.poster, duration: "0:10", category: "Kit",
    description: "A 360° turntable of the fan edition jersey. The footage is a computer-generated render.", status: "awaiting-approval" },
];

export const fixtureById = (id: string) => fixtures.find((f) => f.id === id);
export const isKG = (team: string) => team === KG;

const ktm = { channel: "Kathmandu Gorkhas" as const, channelUrl: ktmChannel };
const squad = (id: string, name: string): YouTubeVideo => ({
  id, title: `Know your squad: ${name}`, category: "Know your squad", playerSlug: players.find((p) => p.name === name)?.slug, ...ktm,
});

/** Official uploads, titles as published. Embedded via youtube-nocookie.com only after the visitor presses play. */
export const youtubeVideos: YouTubeVideo[] = [
  { id: "U7aRKGknRZ8", title: "Kathmandu Gorkhas Anthem – The Elements", category: "Anthem", ...ktm },
  { id: "-LRG342jBv4", title: "Jeet Ya Haar, Khel Ko Maidaan – NPL Official Anthem", category: "Anthem", channel: "Nepal Premier League", channelUrl: nplChannel },
  { id: "g5kxEbIV6fY", title: "Inside Kathmandu Gorkhas World: Shoot BTS", category: "Behind the scenes", ...ktm },
  { id: "OQ9AzerpPb4", title: "Phase 2 wrapped!", category: "Behind the scenes", ...ktm },
  { id: "mp8PSgZIMQ8", title: "Mr. Foxer Was NOT Invited to Media Day | Kathmandu Gorkhas BTS", category: "Behind the scenes", ...ktm },
  { id: "dmiWdc9CRSk", title: "Who is the Ambassador of Kathmandu Gorkhas?", category: "Behind the scenes", ...ktm },
  { id: "MbLv-2hVO5Q", title: "Foxer Asks Anything, Ep 01: Sharad Vesawkar, Director", category: "Interviews", ...ktm },
  { id: "LIRS6JaYb8w", title: "Foxer Asks Anything, Ep 02: Prashiddha Jaishi, youngest player of NPL Season 3", category: "Interviews", ...ktm },
  { id: "fx9r0UqoHUs", title: "Mr. Foxer Ep. 3 ft. Utsav Sapkota", category: "Interviews", ...ktm },
  squad("EynZcQq7-_U", "Karan KC"),
  squad("hPzNt_qlVzA", "Shahab Alam"),
  squad("pKcU7b5sJb8", "Rashid Khan"),
  squad("WtuvSHFJa8k", "Mohammad Aadil Alam"),
  squad("gWLt7yUCvHI", "Santosh Yadav"),
  squad("eZk5yyn6O90", "Bhim Sharki"),
  squad("StCgcaOynes", "Dayanand Mandal"),
  squad("ybKefOxEdwE", "Sonu Devkota"),
  squad("8JYCvXpePJE", "Prashiddha Jaishi"),
  squad("cixkxcQswIo", "Krishna Poudel"),
  squad("DXmR_sycUEo", "Suryanshu Koirala"),
  squad("rRYVUOAim0E", "Sahil Patel"),
  squad("dtA4KsbIqzc", "Dev Shah"),
  { id: "H2vtmSvQv2k", title: "Reliving NPL Season 1", category: "Archive", note: "Season 1", ...ktm },
  { id: "MRoiUfpvjQE", title: "Kathmandu Gurkhas Logo Reveal", category: "Archive", note: "Historical: earlier name and logo", ...ktm },
];

/** The anthem used by the site-wide sound control. */
export const anthem = youtubeVideos.find((v) => v.id === "U7aRKGknRZ8")!;
/** Drop the official anthem audio here (supplied by the franchise) to switch the sound control to audio-only. */
export const ANTHEM_AUDIO_PATH = "/media/audio/kathmandu-gorkhas-anthem.mp3";
export const squadVideoFor = (slug: string) => youtubeVideos.find((v) => v.playerSlug === slug);
