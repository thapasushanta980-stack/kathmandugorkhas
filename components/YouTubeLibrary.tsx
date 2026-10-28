"use client";

import { useState } from "react";
import type { YouTubeCategory, YouTubeVideo } from "@/lib/types";
import { YouTubeEmbed } from "./YouTubeEmbed";

export function YouTubeLibrary({ videos }: { videos: YouTubeVideo[] }) {
  const categories = [...new Set(videos.map((v) => v.category))] as YouTubeCategory[];
  const [category, setCategory] = useState<YouTubeCategory | "All">("All");
  const visible = videos.filter((v) => category === "All" || v.category === category);

  return (
    <div>
      <div className="filters" role="group" aria-label="Video category">
        {(["All", ...categories] as const).map((c) => (
          <button key={c} type="button" className="btn btn--line btn--sm" aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>
      <p className="visually-hidden" aria-live="polite">{visible.length} videos shown</p>
      <ul className="yt-grid">
        {visible.map((v) => <li key={v.id}><YouTubeEmbed video={v} /></li>)}
      </ul>
    </div>
  );
}
