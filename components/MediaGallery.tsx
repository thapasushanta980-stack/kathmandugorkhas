"use client";

import { useEffect, useRef, useState } from "react";
import type { MediaCategory, PhotoItem, VideoItem } from "@/lib/types";

type Item = { kind: "photo"; data: PhotoItem } | { kind: "video"; data: VideoItem };

const caption = (i: Item) => (i.kind === "photo" ? i.data.caption : i.data.title);

/**
 * Photo/video grid with category filter and an accessible lightbox
 * (native <dialog>: Escape closes, arrow keys step, focus is restored).
 */
export function MediaGallery({ photos = [], videos = [], layout = "grid" }: { photos?: PhotoItem[]; videos?: VideoItem[]; layout?: "grid" | "mosaic" }) {
  const items: Item[] = [...videos.map((data) => ({ kind: "video" as const, data })), ...photos.map((data) => ({ kind: "photo" as const, data }))];
  const categories = [...new Set(items.map((i) => i.data.category))] as MediaCategory[];
  const [category, setCategory] = useState<MediaCategory | "All">("All");
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const visible = items.filter((i) => category === "All" || i.data.category === category);
  const current = index === null ? null : visible[index];

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (index !== null && !d.open) d.showModal();
    if (index === null && d.open) d.close();
  }, [index]);

  const step = (delta: number) => setIndex((i) => (i === null ? i : (i + delta + visible.length) % visible.length));

  return (
    <>
      {categories.length > 1 && (
        <div className="filters" role="group" aria-label="Category">
          {(["All", ...categories] as const).map((c) => (
            <button key={c} type="button" className="btn btn--line btn--sm" aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>
      )}
      <ul className={layout === "mosaic" ? "mosaic" : "photo-grid"}>
        {visible.map((item, i) => (
          <li key={item.data.src}>
            <button type="button" className={`tile${item.kind === "video" ? " tile--video" : ""}`} onClick={() => setIndex(i)} aria-label={`${item.kind === "video" ? "Play video" : "Open photo"}: ${caption(item)}`}>
              {item.kind === "photo" ? (
                <img src={item.data.src} alt={item.data.alt} width={item.data.width} height={item.data.height} loading="lazy" />
              ) : (
                <>
                  <img src={item.data.poster} alt="" loading="lazy" />
                  <span className="tile__play" aria-hidden="true" />
                </>
              )}
              <span className="tile__cap">
                <span>{caption(item)}</span>
                {item.kind === "video" && <span>{item.data.duration}</span>}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label={current ? caption(current) : "Media viewer"}
        onClose={() => setIndex(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        onClick={(e) => e.target === e.currentTarget && setIndex(null)}
      >
        {current && (
          <div className="lightbox__body">
            {current.kind === "photo" ? (
              <img src={current.data.src} alt={current.data.alt} width={current.data.width} height={current.data.height} />
            ) : (
              <video src={current.data.src} poster={current.data.poster} controls muted playsInline autoPlay={false} />
            )}
            <div className="lightbox__bar">
              <div>
                <p>{caption(current)} <span className="muted small">({(index ?? 0) + 1} of {visible.length})</span></p>
                {current.kind === "video" && <p className="small muted">{current.data.description}</p>}
                {current.data.status === "awaiting-approval" && <span className="note">Awaiting franchise approval</span>}
              </div>
              <div className="btn-row">
                {visible.length > 1 && (
                  <>
                    <button type="button" className="btn btn--line btn--sm" onClick={() => step(-1)}>Previous</button>
                    <button type="button" className="btn btn--line btn--sm" onClick={() => step(1)}>Next</button>
                  </>
                )}
                <button type="button" className="btn btn--solid btn--sm" onClick={() => setIndex(null)} autoFocus>Close</button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
