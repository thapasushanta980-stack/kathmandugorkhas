"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content";
import { AnthemModal } from "./AnthemModal";
import { Emblem360 } from "./Emblem360";

const PAUSE_KEY = "kg-hero-motion-paused";

/** Soft stadium bokeh: [left %, top %, size]. */
const BOKEH: [number, number, string][] = [
  [52, 14, "0.9rem"], [61, 7, "0.5rem"], [69, 18, "1.3rem"], [80, 10, "0.7rem"], [88, 20, "1rem"], [57, 28, "0.45rem"], [94, 6, "0.6rem"], [74, 30, "0.55rem"],
];

/**
 * "The Valley Awakens" hero. Background is an abstract light field (no footage
 * presented as the team) unless the franchise supplies a rights-cleared loop,
 * which then plays full-bleed, muted and inline.
 */
export function Hero({ videoSrc, posterSrc }: { videoSrc?: string; posterSrc?: string }) {
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [lowData, setLowData] = useState(false);
  const [offscreen, setOffscreen] = useState(false);

  useEffect(() => {
    try { setPaused(window.sessionStorage.getItem(PAUSE_KEY) === "1"); } catch { /* storage unavailable */ }
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    setLowData(Boolean(conn?.saveData));
  }, []);

  // Stop ambient motion when the hero is offscreen or the tab is hidden.
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOffscreen(!e.isIntersecting));
    io.observe(el);
    const onVis = () => setOffscreen(document.hidden || el.getBoundingClientRect().bottom < 0);
    document.addEventListener("visibilitychange", onVis);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  const still = paused || offscreen;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (still || lowData || window.matchMedia("(prefers-reduced-motion: reduce)").matches) v.pause();
    else v.play().catch(() => { /* autoplay blocked: poster stays */ });
  }, [still, lowData]);

  const togglePause = () => {
    setPaused((p) => {
      try { window.sessionStorage.setItem(PAUSE_KEY, p ? "0" : "1"); } catch { /* storage unavailable */ }
      return !p;
    });
  };

  return (
    <section ref={heroRef} className="hero" aria-labelledby="hero-title" data-still={still}>
      <div className="hero__bg" aria-hidden="true">
        {videoSrc ? (
          <video ref={videoRef} className="hero__video" src={videoSrc} poster={posterSrc} muted loop playsInline preload="metadata" />
        ) : (
          <div className="hero__field">
            <span className="hero__beam hero__beam--1" />
            <span className="hero__beam hero__beam--2" />
            <span className="hero__beam hero__beam--3" />
            <span className="hero__haze" />
            <span className="hero__bokeh">
              {BOKEH.map(([left, top, size]) => (
                <span key={`${left}-${top}`} style={{ left: `${left}%`, top: `${top}%`, width: size, height: size }} />
              ))}
            </span>
          </div>
        )}
        <span className="hero__grade" />
      </div>

      <div className="wrap hero__grid">
        <div className="hero__copy">
          <p className="hero__meta">
            <span>{site.league}</span>
            <span>Season 3</span>
            <span>2026</span>
          </p>
          <h1 id="hero-title" className="hero__title">
            <span className="visually-hidden">{site.name}: </span>
            <span className="hero__headline">
              <span className="line"><span>The Valley</span></span>
              <span className="line"><span>plays as one.</span></span>
            </span>
          </h1>
          <p className="hero__lede">{site.brandLine.text}</p>
          <div className="btn-row">
            <Link href="/team" className="btn btn--solid">Explore the Gorkhas <span className="arrow" aria-hidden="true">→</span></Link>
            <Link href="/matches" className="btn btn--line">Match Centre</Link>
          </div>
          <AnthemModal />
        </div>
        <Emblem360 paused={still} lowData={lowData} />
      </div>

      <div className="hero__foot wrap">
        <button type="button" className="hero__pause" onClick={togglePause} aria-pressed={paused}>
          <span className="hero__pause-icon" data-paused={paused} aria-hidden="true" />
          {paused ? "Play motion" : "Pause motion"}
        </button>
        <a className="hero__cue" href="#next-match">Scroll</a>
      </div>
    </section>
  );
}
