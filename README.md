# Kathmandu Gorkhas: website concept

A content-rich, motion-led franchise site for Kathmandu Gorkhas (Nepal Premier League), built with Next.js 15, React 19 and TypeScript.
**This is a concept build, not an official franchise site.** Indexing is off (`robots` disallow + `noindex`) until the franchise approves launch.

## Run, build, deploy

```bash
npm install
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
npm run typecheck
```

| Env var | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production origin, used for canonical URLs, the sitemap and Open Graph. Defaults to `http://localhost:3000`. |

Deploy to any Next.js host (Vercel, Netlify, or Node behind a CDN). All 54 pages are prerendered at build time. Media is in `public/media` (about 2.5 MB). Move it to object storage or a CDN when real photography and video arrive. Rebuild after editing content.

---

## 1. Audit (28 Oct 2026)

### Supplied assets

| File (`source-assets/`) | Specs / quality | Used as | Rights / approval |
|---|---|---|---|
| `images.jpg` | Crest, 554×554 JPG, teal background, not transparent | Header, hero, story, footer, favicon, OG image. Never altered. | Awaiting a high-res transparent master |
| `WhatsApp … 11.56.49 PM (1).jpeg` | 720×1600 phone screenshot of a HamroBazaar "Fan Edition" listing (front) | Cropped to the product → `media/jersey/front.jpg` (652×845) | Third-party listing; needs approval |
| `WhatsApp … 11.56.48 PM.jpeg` | Same listing, back view | → `back.jpg` | Same |
| `WhatsApp … 11.56.49 PM.jpeg` | Same listing, both sleeves | → `sides.jpg` | Same |
| `gemini_generated_video_088c4bbb.mp4` | 1280×720, 24 fps, 10 s, AAC audio. AI-generated turntable: stable camera, centred garment, **seamless loop** (frame 0 ≈ frame 240), back view at about 45% | 60-frame scrub sequence (640², 1.1 MB), muted square loop for hero and video library (588 KB), poster. Audio stripped. | AI render; needs approval |
| `gemini_generated_video_e9e86daa.mp4` | 1280×720, 10 s. AI 3D crest spin | **Not used.** It re-renders the crest in gold and shows a blank back, which breaks the "never redraw / animate beyond recognition" rule. | Rejected |

**Seek behaviour:** the source MP4 has sparse keyframes, so direct `currentTime` scrubbing would stutter on mobile Safari. A pre-extracted frame sequence gives instant, reliable scrubbing.

### Official sources

- **Official YouTube channels found:** [@KtmGorkhas](https://www.youtube.com/@KtmGorkhas) describes itself as the "Official handle of Kathmandu Gorkhas", and its description carries the brand line "Three cities. One Soul. One Team. One Dream." [@OfficialNPLT20](https://www.youtube.com/@OfficialNPLT20) is the league's official channel. Neither shows a verified badge.
- **Team website / Instagram: not found.** No official team site or verified Instagram turned up, and the YouTube channel lists no other links. The NPL site (npl-t20.com) is a JavaScript app that couldn't be read. Only the YouTube channel is linked as a social account.
- **Verified from public sources**. Each record in `content/index.ts` carries its source URL and check date:

| Fact | Source |
|---|---|
| Season 3: 26 Oct – 21 Nov 2026, 8 teams, all at TU International Cricket Ground, Kirtipur | Wikipedia (2026 NPL) |
| KG's 7 Season 3 league fixtures with times (NPT), starting 29 Oct v Janakpur Bolts | ESPNcricinfo, cross-checked with Wikipedia |
| Squad of 20, captain Karan KC, wicketkeepers, local icon player; head coach Monty Desai | Wikipedia; retentions cross-checked with ekantipur (15 Jun 2026) |
| Season 2: 5W 2L, 3rd on 10 pts (NRR +0.537); lost Eliminator to Lumbini Lions; all 8 scores | Wikipedia (2025 NPL) |
| Shikhar Insurance, "golden partner", logo on jersey back, 3rd season | The Kathmandu Post, 10 Sep 2026 |
| Xtreme Energy Drink, "drink partner" (2025); new agreement before Season 3 (title not stated) | ekantipur, 9 Nov 2025 and 5 Jul 2026 |
| KMC, education partner (logo on mascot's hands) | ekantipur, 16 Oct 2026 |
| Executive director Anubhav Sirohiya; cricket director Sharad Vesawkar | The Kathmandu Post, 10 Sep 2026 |

**KKR.in** was studied for information architecture only: fixtures, standings, news/videos/photos, players, stats and tiered partners. No layout, copy, palette or assets were reused.

---

## 2. Art direction: "The Valley in Motion"

- **Rhythm:** sections alternate surfaces so no two neighbours match: ink hero, then aqua match strip, teal jersey zone, paper squad, purple story, ink season pulse, paper stories, ink media, paper partners, teal shop band, purple footer.
- **Hero, "The Valley Awakens"** (`components/Hero.tsx`, `CrestScrub.tsx`, `AnthemModal.tsx`):
  - **Background:** there's no rights-cleared team or matchday footage, so the hero uses an *abstract light field*: three slowly sweeping floodlight beams, drifting teal haze and soft bokeh over the purple/teal base, with a grade on the left for text contrast. No footage is presented as the team. **Footage slot:** put a franchise-supplied loop at `public/media/hero/hero-loop.mp4` (+ `hero-poster.jpg`) and rebuild. It then plays full-bleed, muted, inline and looping, and pauses offscreen, when hidden, under reduced motion or with data saver on.
  - **Crest: a real 360° emblem** (`components/Emblem360.tsx`): the supplied crest artwork has its teal background removed by flood-filling from the edges up to the crest's own white outline. Nothing is redrawn. It's exported as `crest-cutout-720/400.webp`. That cut-out forms both faces of a CSS 3D badge (the back face is turned so it reads correctly, not mirrored) and is stacked as 24 gold rim layers (12 on mobile), about 1px apart, so the edge stays solid side-on. A light sheen follows the angle, and the ground shadow narrows when the badge is edge-on.
    - **Interaction:** an intro spin of 1.5 turns lands on the front. A slow 30s/turn turntable starts 3.5s after the last input. Drag or fling (with momentum and friction, `touch-action: pan-y`), double-click, or use the buttons: **Spin 360°**, **Front**, **Back**. Keys: arrows turn 15°, PageUp/PageDown turn 90°, Home is front, End is back, Enter spins. Fine pointers get a vertical tilt of up to ±10°, and scrolling adds a little turn. It's a `role="slider"` with a live angle readout.
    - **Performance:** pose updates go straight to the DOM via rAF (no React render per frame), and the loop runs only while visible and not paused. Data saver and mobile use fewer rim layers and the 400px cut-out.
    - **Fallbacks:** reduced motion means no intro, turntable, tilt or momentum (the buttons jump instantly). If the cut-out fails, the original flat crest shows with no rim.
  - **Copy:** "Nepal Premier League · Season 3 · 2026" / "The Valley plays as one." / the brand line (sourced from the official YouTube channel) / Explore the Gorkhas, Match Centre / Experience the anthem.
  - **Anthem:** "Experience the anthem" opens a native `<dialog>` with the team's official upload (@KtmGorkhas, "Kathmandu Gorkhas Anthem – The Elements") via youtube-nocookie. The iframe only loads when the dialog opens and unloads when it closes. Escape closes it, focus returns to the button, and the corner sound control stops so two audio sources never overlap. The 2024 "H R S stha" upload and the 2026 Xtreme sponsor anthem were **not** used, because neither is verified as the team's.
  - **Controls:** Pause/Play motion (remembered for the session) freezes the light field, crest float and footage. Motion also stops offscreen and when the tab is hidden.
  - **Fallbacks:** reduced motion shows a static crest with no scrub, tilt or animated light. Data saver skips the frame sequence. If frames fail, the original flat crest appears.
- **Layouts beyond cards:** typographic roster, numbered crest "marks", a stats strip, ruled story lists, tier rows and a media mosaic. Radii are 3–6px. There are no pill badges; anything awaiting approval gets a small gold-square **note**.
- **Type:** Anton for display (OFL, web use permitted) and Inter for body/UI (OFL), both self-hosted via `next/font`. There is no Nepali copy yet. If added, use Mukta or Noto Sans Devanagari for glyph support.

### Tokens (`app/globals.css`)

Colours are the prompt's working samples: purple `#481651`, teal `#187872`, aqua `#29CACD`, gold `#E7A65A`, ink `#17131D`, paper `#F4F7F7`. Type scale, spacing, radii, shadow, motion durations and the header height are tokens too. No other file defines colours.

Contrast checked: white on teal 5.3:1, ink on aqua 8.3:1, aqua on purple 6.9:1, teal on paper 4.9:1, gold on ink 8.9:1. All pass AA for body text.

### Motion system

| Level | Where | Notes |
|---|---|---|
| A: signature | Hero headline line-reveal, crest light pass, jersey turntable + light sweep, 360° viewer | Plays once, no intro gate. Pointer parallax (≤14px) on fine pointers only. |
| B: editorial | One-time fade-up on section heads, story marks and squad feature | Content is visible without JS. |
| C: micro | Button, arrow, roster-row and tile hover/press | 160ms |

There's no scroll hijacking, no autoplay sound and no flashing. Ambient video pauses offscreen. `prefers-reduced-motion` removes every animation, swaps the hero video for its poster, and stops the viewer auto-turn.

---

## 3. Routes

| Route | Content |
|---|---|
| `/` | Hero, next-match strip, 360° jersey zone, captain + squad, crest story, season pulse (S2 numbers + S3 table), stories, media room, partners, shop CTA |
| `/matches` | Season (S3/S2) and status (All/Fixtures/Results) filters |
| `/matches/[id]` | 15 match pages: date/venue/stage, innings scores for results, honest preview state for upcoming |
| `/standings` | S3 table (to 27 Oct) and S2 final table, with NRR and source |
| `/team`, `/team/[player]` | Typographic roster with role filter (only source-stated roles), management, 20 player pages with name-conflict notes |
| `/jersey` | Viewer, kit story (visible details only), stills, shop status |
| `/news` | Press coverage with category filter, linking out to the original outlets |
| `/videos`, `/photos` | Filterable galleries with a `<dialog>` lightbox; `/gallery` redirects (308) to `/photos` |
| `/club`, `/partners`, `/shop`, `/contact`, `/privacy`, `/terms` | Honest states where data is missing; no fake forms or checkout |

## 4. Jersey viewer (`components/JerseyViewer.tsx`)

Labelled on screen as a **360° video viewer, not a 3D model**. Three.js isn't included because no GLB/GLTF exists; add it as an isolated, dynamically imported component only once an approved model does.

- Poster first. Frames load within 400px of the viewport, with a progress bar and a 20s timeout.
- Drag (mouse) or swipe (touch) with `touch-action: pan-y`, so vertical scrolling is never trapped. It's a focusable `role="slider"`: arrow keys and PageUp/PageDown step, Home is the front, End is the back.
- Front / Back / Play–Pause / Reset / Details controls, an angle readout and dial, and a "Drag to rotate" hint shown once (localStorage, try/catch).
- If any frame fails or loading times out, it falls back to the front and back stills with a retry button. If the hero video fails, the hero shows the poster.

## 5. Official video and soundtrack

- **24 official videos** are embedded from their owners' channels and never downloaded or re-hosted. Each one's embed permission was confirmed via YouTube oEmbed. They include the team anthem, the NPL Official Anthem, 13 "Know your squad" episodes (each also shown on its player's page), interviews, behind-the-scenes and archive videos. The archive items are labelled as predating the current name.
- **Click-to-load:** a thumbnail shows until the visitor presses play. Embeds use `youtube-nocookie.com`, and the QA run confirmed zero YouTube player requests before a click.
- **Anthem sound control** (`components/SoundDock.tsx`, bottom-right on every page) plays **only the Kathmandu Gorkhas anthem**. It's off by default, and nothing loads until it's pressed. It has Play/Pause, **Mute/Unmute** (`aria-pressed`), and Stop (the × button or Escape). It loops, and it keeps playing across page navigation because it lives in the root layout.
  - **Audio-only mode (no video):** put the official anthem file, supplied by the franchise, at `public/media/audio/kathmandu-gorkhas-anthem.mp3` and rebuild. The layout detects the file and shows a compact audio bar with a small level meter. This mode is tested and works; it makes zero YouTube requests.
  - **Until that file exists:** it falls back to the team's YouTube upload in a small player. YouTube's terms require that player to stay visible, so audio-only playback isn't possible from YouTube. The audio has not been downloaded from YouTube, because that would break YouTube's terms and the team's copyright.

## 6. Data model / CMS plan

`lib/types.ts` defines Season, Fixture (with innings), Standings, Player, StaffMember, NewsItem, Partner, Product, PhotoItem, VideoItem and SocialLink. Each fact-bearing record carries `provenance { source, url, verifiedAt, status }`, and `status` stays `awaiting-approval` until the franchise signs off. These map one-to-one to Sanity or Strapi schemas.

Suggested roles: Editor (draft), Approver (publish), Admin. Fixtures and results need one named owner: an official NPL feed if one is offered, otherwise a documented manual update after each match. The site says plainly that tables are updated by hand, not live.

**Editing now:** change `content/index.ts`, then rebuild. Empty collections (products, social links) render honest states automatically.

## 7. QA (headless Chrome + puppeteer, 28 Oct 2026)

- [x] 18 representative routes return 200 with no horizontal overflow at 390px, one `h1` each, and no unlabelled images
- [x] 41 internal links checked, 0 broken; `/gallery` → `/photos` (308); unknown player/match → 404
- [x] Filters: season (8 S2 results), status, wicketkeepers (3), news category
- [x] Match strip resolves the next fixture in the browser (currently v Janakpur Bolts, 29 Oct)
- [x] Viewer: Back/Home/ArrowRight/drag all change rotation; frame-failure fallback shown
- [x] Video lightbox opens muted and paused; Escape closes; header gains its background on scroll
- [x] Reduced motion: no hero video, no reveal transforms. Hero video failure falls back to the poster.
- [x] Sound control: 0 YouTube requests before a click, nocookie host, player ≥200px tall, Mute/Unmute toggles, track switch, survives navigation, Escape stops it
- [x] Zero console errors; desktop (1440) and mobile (390) screenshots reviewed and issues fixed
- [ ] **Not yet done:** real iOS Safari and Android Chrome devices, tablet, screen readers (VoiceOver/TalkBack), Lighthouse on throttled 4G, a no-JS pass

## 8. Approvals checklist (franchise)

1. [ ] **Brand guide** and high-res transparent crest, to replace the sampled tokens and the 554px JPG
2. [ ] **Current kit:** the supplied images are a third-party "Fan Edition" listing, and the 360° footage is AI-generated. Shikhar Insurance's back-of-jersey mark is **missing** from the supplied back view. The video shows a polo collar, while the front still shows a crew neck. Supply the approved Season 3 kit imagery or turntable.
3. [ ] **Squad:** confirm all 20 names and roles. Spellings now follow the team's own videos (Bhim Sharki, Md. Aadil Alam, Prashiddha Jaishi, Krishna Poudel), and each player page notes the variants. Supply portraits, shirt numbers, biographies and stats.
4. [ ] **Fixtures/results owner** and update cadence; playoff fixtures; official ticketing link
5. [ ] **Partners:** confirm the tier hierarchy and the exact sponsor name spelling ("Xtreme" on the kit vs "Extreme" in the press); supply logo files and clear-space rules; confirm KMC's full name
6. [ ] **Social accounts:** confirm @KtmGorkhas as official and supply Instagram, Facebook and TikTok handles; set up a media/partnership inbox
6b. [ ] **Anthem audio file** (MP3, cleared for web use) for audio-only playback.
6c. [ ] **Video use:** confirm the team is happy for its YouTube videos and anthem to be embedded, and that the NPL anthem embed is acceptable to the league
7. [ ] **Official shop** URL (none is linked; the HamroBazaar listing is not treated as official)
8a. [ ] **Hero copy:** "The Valley plays as one." is proposed creative copy and needs tone approval.
8b0. [ ] **Hero footage:** a rights-cleared 8–15s anthem/matchday loop for the full-bleed hero background, and ideally an approved transparent crest (PNG/SVG).
8b. [ ] **Crest cut-out and 360° emblem:** the background was removed from the supplied JPEG. Approve the 360° emblem treatment, or supply an official transparent crest (SVG/PNG) to replace the cut-out.
8c. [ ] **Team photo:** an authorised Season III squad/action photo (landscape, high-res, current kit) to lead the hero.
8. [ ] **Copy:** the brand line is now sourced from the official YouTube channel. The crest symbolism (three cities' landmarks) is still marked as awaiting approval.
9. [ ] Rights to all photography and video; legal review of the privacy and terms pages
10. [ ] Launch decision: switch off `noindex`/robots disallow and set `NEXT_PUBLIC_SITE_URL`
