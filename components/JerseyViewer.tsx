"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { kit } from "@/content";

type Status = "idle" | "loading" | "ready" | "error";

const { count: FRAME_COUNT, front: FRONT, back: BACK } = kit.frames;
const PLAY_FPS = 12;
const LOAD_TIMEOUT_MS = 20000;
const HINT_KEY = "kg-viewer-hint-seen";

const wrap = (i: number) => ((i % FRAME_COUNT) + FRAME_COUNT) % FRAME_COUNT;
const degreesOf = (i: number) => Math.round((i / FRAME_COUNT) * 360);
const describe = (i: number) => (i === FRONT ? "Front" : i === BACK ? "Back" : `${degreesOf(i)} degrees`);

function readHintSeen() {
  try { return window.localStorage.getItem(HINT_KEY) === "1"; } catch { return false; }
}
function writeHintSeen() {
  try { window.localStorage.setItem(HINT_KEY, "1"); } catch { /* storage unavailable */ }
}

function Dial({ deg }: { deg: number }) {
  const r = 15;
  const a = ((deg - 90) * Math.PI) / 180;
  return (
    <svg className="viewer__dial" viewBox="0 0 36 36" aria-hidden="true">
      <circle cx="18" cy="18" r={r} fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
      <circle cx={18 + r * Math.cos(a)} cy={18 + r * Math.sin(a)} r="3" fill="currentColor" />
    </svg>
  );
}

/**
 * 360° video viewer: a frame sequence extracted from the supplied turntable
 * footage, scrubbed by drag, swipe or keyboard. It is not a 3D model.
 */
export function JerseyViewer({ labelledBy, showDetailsToggle = true }: { labelledBy?: string; showDetailsToggle?: boolean }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const drag = useRef<{ x: number; start: number; id: number } | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [loaded, setLoaded] = useState(0);
  const [frame, setFrame] = useState(FRONT);
  const [playing, setPlaying] = useState(false);
  const [inView, setInView] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const uid = useId();

  // Poster first; fetch the frame sequence only when the viewer nears the viewport.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const near = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setStatus((s) => (s === "idle" ? "loading" : s));
        near.disconnect();
      }
    }, { rootMargin: "400px 0px" });
    const visible = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    near.observe(el);
    visible.observe(el);
    return () => { near.disconnect(); visible.disconnect(); };
  }, [attempt]);

  useEffect(() => {
    if (status !== "loading") return;
    let done = 0;
    let failed = false;
    const timeout = window.setTimeout(() => { failed = true; setStatus("error"); }, LOAD_TIMEOUT_MS);
    framesRef.current = Array.from({ length: FRAME_COUNT }, (_, i) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (failed) return;
        done += 1;
        setLoaded(done);
        if (done === FRAME_COUNT) {
          window.clearTimeout(timeout);
          setStatus("ready");
          setPlaying(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
          setShowHint(!readHintSeen());
        }
      };
      img.onerror = () => {
        if (failed) return;
        failed = true;
        window.clearTimeout(timeout);
        setStatus("error");
      };
      img.src = kit.frames.path(i);
      return img;
    });
    return () => window.clearTimeout(timeout);
  }, [status]);

  // Slow auto-turn until the visitor takes over; never runs offscreen.
  useEffect(() => {
    if (status !== "ready" || !playing || !inView) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      if (now - last >= 1000 / PLAY_FPS) {
        last = now;
        setFrame((f) => wrap(f + 1));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [status, playing, inView]);

  const takeControl = useCallback(() => {
    setPlaying(false);
    if (showHint) { setShowHint(false); writeHintSeen(); }
  }, [showHint]);

  const goTo = (i: number) => { takeControl(); setFrame(wrap(i)); };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (status !== "ready" || (e.pointerType === "mouse" && e.button !== 0)) return;
    takeControl();
    drag.current = { x: e.clientX, start: frame, id: e.pointerId };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    // One full turn per ~1.2 stage widths of horizontal travel.
    const pxPerFrame = (e.currentTarget.clientWidth * 1.2) / FRAME_COUNT;
    setFrame(wrap(d.start + Math.round((e.clientX - d.x) / pxPerFrame)));
  };
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (drag.current?.id !== e.pointerId) return;
    drag.current = null;
    setDragging(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (status !== "ready") return;
    const step: Record<string, number> = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 5, PageDown: -5 };
    if (e.key in step) { e.preventDefault(); goTo(frame + step[e.key]); }
    else if (e.key === "Home") { e.preventDefault(); goTo(FRONT); }
    else if (e.key === "End") { e.preventDefault(); goTo(BACK); }
  };

  if (status === "error") {
    return (
      <div className="viewer" role="region" aria-labelledby={labelledBy}>
        <p className="small" role="alert">The 360° view couldn&rsquo;t load, so the front and back images are shown instead.</p>
        <div className="viewer__fallback-images">
          <img {...kit.images.front} loading="lazy" />
          <img {...kit.images.back} loading="lazy" />
        </div>
        <div className="viewer__controls">
          <button type="button" className="btn btn--line btn--sm" onClick={() => { setLoaded(0); setStatus("idle"); setAttempt((a) => a + 1); }}>
            Try the 360° view again
          </button>
        </div>
      </div>
    );
  }

  const ready = status === "ready";
  const deg = degreesOf(frame);

  return (
    <div className="viewer">
      <div
        ref={stageRef}
        className="viewer__stage"
        data-dragging={dragging}
        tabIndex={ready ? 0 : -1}
        role="slider"
        aria-label="Rotate the jersey"
        aria-describedby={`${uid}-help`}
        aria-valuemin={0}
        aria-valuemax={359}
        aria-valuenow={deg}
        aria-valuetext={describe(frame)}
        aria-disabled={!ready}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
      >
        <img src={ready ? kit.frames.path(frame) : kit.poster} alt={`Kathmandu Gorkhas jersey, ${describe(frame).toLowerCase()} view`} width={640} height={640} draggable={false} />
        {ready && <span className="viewer__angle" aria-hidden="true">{String(deg).padStart(3, "0")}°</span>}
        {ready && <Dial deg={deg} />}
        {status === "loading" && (
          <span className="viewer__chip" role="status">
            Loading 360° view
            <span className="viewer__bar" aria-hidden="true"><span style={{ width: `${(loaded / FRAME_COUNT) * 100}%` }} /></span>
          </span>
        )}
        {ready && showHint && <span className="viewer__chip" aria-hidden="true">← Drag to rotate →</span>}
      </div>

      <p id={`${uid}-help`} className="visually-hidden">
        Drag or swipe sideways to rotate. With keyboard focus, use the arrow keys; Home shows the front and End shows the back.
      </p>

      <div className="viewer__controls" role="group" aria-label="Jersey view controls">
        <button type="button" className="btn btn--line btn--sm" disabled={!ready} aria-pressed={ready && frame === FRONT} onClick={() => goTo(FRONT)}>Front</button>
        <button type="button" className="btn btn--line btn--sm" disabled={!ready} aria-pressed={ready && frame === BACK} onClick={() => goTo(BACK)}>Back</button>
        <button type="button" className="btn btn--line btn--sm" disabled={!ready} onClick={() => setPlaying((p) => !p)}>{playing ? "Pause" : "Play"}</button>
        <button type="button" className="btn btn--line btn--sm" disabled={!ready} onClick={() => goTo(FRONT)}>Reset</button>
        {showDetailsToggle && (
          <button type="button" className="btn btn--line btn--sm" aria-expanded={showDetails} aria-controls={`${uid}-details`} onClick={() => setShowDetails((v) => !v)}>
            Details
          </button>
        )}
      </div>

      <p className="small muted">360° video viewer built from turntable footage. It is not a 3D model.</p>

      {showDetailsToggle && (
        <ul id={`${uid}-details`} className="spec-list" hidden={!showDetails}>
          {kit.details.map((d) => <li key={d.title}><strong>{d.title}</strong><span>{d.body}</span></li>)}
        </ul>
      )}
    </div>
  );
}
