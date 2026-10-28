"use client";

import { useState } from "react";
import { thumb, watchUrl, YT_HOST } from "@/lib/youtube";
import type { YouTubeVideo } from "@/lib/types";

/**
 * Click-to-load YouTube embed. Shows the thumbnail until the visitor presses
 * play, so nothing from YouTube loads (and no sound plays) before that.
 */
export function YouTubeEmbed({ video, priority = false }: { video: YouTubeVideo; priority?: boolean }) {
  const [active, setActive] = useState(false);

  return (
    <figure className="yt">
      <div className="yt__frame">
        {active ? (
          <iframe
            src={`${YT_HOST}/embed/${video.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button type="button" className="yt__poster" onClick={() => setActive(true)} aria-label={`Play video: ${video.title}`}>
            <img src={thumb(video.id)} alt="" loading={priority ? "eager" : "lazy"} width={480} height={360} />
            <span className="tile__play" aria-hidden="true" />
          </button>
        )}
      </div>
      <figcaption className="yt__cap">
        <span className="yt__kind">{video.category}{video.note ? ` · ${video.note}` : ""}</span>
        <span className="yt__title">{video.title}</span>
        <span className="source">
          <a href={video.channelUrl} rel="noopener noreferrer" target="_blank">{video.channel}</a> on{" "}
          <a href={watchUrl(video.id)} rel="noopener noreferrer" target="_blank">YouTube</a>
        </span>
      </figcaption>
    </figure>
  );
}
