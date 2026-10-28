"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const CUTOUT = { large: "/media/brand/crest-cutout-720.webp", small: "/media/brand/crest-cutout-400.webp" };
const FALLBACK = "/media/brand/crest.jpg";

/** Physics, tuned by feel. Angles in degrees, time in ms. */
const IDLE_SPEED = 0.012; // ≈ 30 s per turn when nobody is touching it
const FRICTION = 0.94; // per 16 ms frame
const RESUME_AFTER = 3500;
const DRAG_GAIN = 0.55; // degrees per px of horizontal drag
const MAX_TILT = 10;

const norm = (deg: number) => ((deg % 360) + 360) % 360;
const label = (deg: number) => {
  const d = Math.round(norm(deg));
  if (d <= 15 || d >= 345) return "Front";
  if (d >= 165 && d <= 195) return "Back";
  return `${d} degrees`;
};

/**
 * A real 360° emblem: the supplied crest artwork (background removed, not
 * redrawn) on both faces of a CSS 3D badge with a layered gold rim. Drag or
 * fling it, use the arrow keys, or press Spin. Idles as a slow turntable.
 */
export function Emblem360({ paused, lowData }: { paused: boolean; lowData: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const state = useRef({ angle: -540, vel: 0, tiltX: 0, tiltTarget: 0, target: null as number | null, dragging: false, lastInput: 0, lastX: 0, lastT: 0, intro: true });
  const [reduced, setReduced] = useState(false);
  const [small, setSmall] = useState(false);
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(true);
  const [hinted, setHinted] = useState(false);

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(rm);
    setSmall(window.matchMedia("(max-width: 40rem)").matches);
    if (rm) { state.current.angle = 0; state.current.intro = false; }
    else state.current.target = 0; // intro: one and a half turns, landing on the front
  }, []);

  // The cut-out can fail before hydration attaches onError, so check once on mount too.
  useEffect(() => {
    const img = rootRef.current?.querySelector<HTMLImageElement>(".emblem__face--front img");
    if (img?.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /** Write the current pose straight to the DOM (no React render per frame). */
  const paint = useCallback(() => {
    const s = state.current;
    const body = bodyRef.current;
    const root = rootRef.current;
    if (!body || !root) return;
    const a = s.angle;
    body.style.transform = `rotateX(${s.tiltX.toFixed(2)}deg) rotateY(${a.toFixed(2)}deg)`;
    const rad = (a * Math.PI) / 180;
    root.style.setProperty("--facing", Math.abs(Math.cos(rad)).toFixed(3));
    root.style.setProperty("--sheen", `${(50 + Math.sin(rad) * 60).toFixed(1)}%`);
    const d = Math.round(norm(a));
    root.setAttribute("aria-valuenow", String(d));
    root.setAttribute("aria-valuetext", label(a));
    if (readoutRef.current) readoutRef.current.textContent = `${String(d).padStart(3, "0")}°`;
  }, []);

  // Animation loop: runs only while visible and not paused.
  useEffect(() => {
    paint();
    const motionAllowed = !paused && visible;
    if (!motionAllowed) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const s = state.current;
      const dt = Math.min(48, now - last);
      last = now;
      if (!s.dragging) {
        if (s.target !== null) {
          // Critically-damped ease toward a target angle (intro, Spin, Front/Back).
          const diff = s.target - s.angle;
          s.angle += diff * Math.min(1, dt * (s.intro ? 0.0032 : 0.006));
          if (Math.abs(diff) < 0.3) { s.angle = s.target; s.target = null; s.intro = false; s.lastInput = now; }
        } else if (Math.abs(s.vel) > 0.002) {
          s.angle += s.vel * dt;
          s.vel *= Math.pow(FRICTION, dt / 16);
        } else if (!reduced && now - s.lastInput > RESUME_AFTER) {
          s.vel = 0;
          s.angle += IDLE_SPEED * dt;
        }
      }
      s.tiltX += (s.tiltTarget - s.tiltX) * Math.min(1, dt * 0.01); // ease tilt toward pointer target
      paint();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, visible, reduced, paint]);

  // Pointer tilt on fine pointers (bounded); none under reduced motion.
  useEffect(() => {
    if (reduced || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      const ny = Math.max(-1, Math.min(1, (e.clientY / window.innerHeight - 0.5) * 2));
      state.current.tiltTarget = -ny * MAX_TILT;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  // Scroll adds a little turn as the hero leaves view (scroll-linked, never hijacked).
  useEffect(() => {
    if (reduced) return;
    let lastY = window.scrollY;
    const onScroll = () => {
      const s = state.current;
      if (!s.dragging && s.target === null) s.angle += (window.scrollY - lastY) * 0.25;
      lastY = window.scrollY;
      if (paused || !visible) paint();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced, paused, visible, paint]);

  const touch = () => { state.current.lastInput = performance.now(); state.current.intro = false; setHinted(true); };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const s = state.current;
    touch();
    s.dragging = true; s.target = null; s.vel = 0;
    s.lastX = e.clientX; s.lastT = performance.now();
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = state.current;
    if (!s.dragging) return;
    const now = performance.now();
    const dx = e.clientX - s.lastX;
    s.angle += dx * DRAG_GAIN;
    const dt = Math.max(1, now - s.lastT);
    s.vel = reduced ? 0 : (dx * DRAG_GAIN) / dt; // fling momentum
    s.lastX = e.clientX; s.lastT = now; s.lastInput = now;
    if (paused || !visible) paint();
  };
  const onPointerUp = () => {
    const s = state.current;
    s.dragging = false;
    s.vel = Math.max(-1.2, Math.min(1.2, s.vel));
    s.lastInput = performance.now();
  };

  /** Turn to the nearest angle equivalent to `deg`, going forward by `extra` turns. */
  const turnTo = (deg: number, extraTurns = 0) => {
    const s = state.current;
    touch();
    s.vel = 0;
    const base = s.angle - norm(s.angle) + deg;
    let t = base < s.angle - 180 ? base + 360 : base > s.angle + 180 ? base - 360 : base;
    t += extraTurns * 360;
    if (reduced || paused) { s.angle = t; s.target = null; paint(); } else s.target = t;
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const s = state.current;
    const step: Record<string, number> = { ArrowRight: 15, ArrowUp: 15, ArrowLeft: -15, ArrowDown: -15, PageUp: 90, PageDown: -90 };
    if (e.key in step) {
      e.preventDefault(); touch();
      s.vel = 0; s.target = null; s.angle += step[e.key];
      paint();
    } else if (e.key === "Home") { e.preventDefault(); turnTo(0); }
    else if (e.key === "End") { e.preventDefault(); turnTo(180); }
    else if (e.key === " " || e.key === "Enter") { e.preventDefault(); turnTo(0, 1); }
  };

  // Rim layers ≈1px apart so the edge reads solid when the badge is side-on.
  const layers = lowData || small ? 12 : 24;
  const img = failed ? FALLBACK : small ? CUTOUT.small : CUTOUT.large;
  const maskStyle = failed ? undefined : ({ "--cutout": `url(${img})` } as React.CSSProperties);

  return (
    <div className="emblem" data-paused={paused} style={maskStyle}>
      <div
        ref={rootRef}
        className="emblem__stage"
        role="slider"
        tabIndex={0}
        aria-label="Rotate the Kathmandu Gorkhas crest"
        aria-describedby="emblem-help"
        aria-valuemin={0}
        aria-valuemax={359}
        aria-valuenow={0}
        aria-valuetext="Front"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={() => turnTo(0, 1)}
        onKeyDown={onKeyDown}
      >
        <div className="emblem__float">
          <div ref={bodyRef} className="emblem__body" data-solid={!failed}>
            {!failed && Array.from({ length: layers }, (_, i) => {
              const t = i / (layers - 1);
              return <span key={i} className="emblem__rim" style={{ "--z": (t - 0.5).toFixed(3), "--shade": (0.55 + Math.sin(t * Math.PI) * 0.45).toFixed(3) } as React.CSSProperties} />;
            })}
            <div className="emblem__face emblem__face--front">
              <img src={img} alt="Kathmandu Gorkhas crest" width={720} height={724} draggable={false} fetchPriority="high" onError={() => setFailed(true)} />
              {!failed && <span className="emblem__sheen" />}
            </div>
            <div className="emblem__face emblem__face--back" aria-hidden="true">
              <img src={img} alt="" width={720} height={724} draggable={false} />
              {!failed && <span className="emblem__sheen" />}
            </div>
          </div>
        </div>
        <span className="emblem__shadow" aria-hidden="true" />
      </div>
      <p id="emblem-help" className="visually-hidden">
        Drag or swipe sideways to spin the crest. With keyboard focus, arrow keys turn it 15 degrees, Home shows the front, End shows the back, and Enter spins it once.
      </p>
      <div className="emblem__ui">
        <span ref={readoutRef} className="emblem__readout" aria-hidden="true">000°</span>
        <button type="button" className="emblem__btn" onClick={() => turnTo(0, 1)}>
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 3v6h-6" /></svg>
          Spin 360°
        </button>
        <button type="button" className="emblem__btn emblem__btn--wide" onClick={() => turnTo(0)}>Front</button>
        <button type="button" className="emblem__btn emblem__btn--wide" onClick={() => turnTo(180)}>Back</button>
        <span className="emblem__hint" data-hidden={hinted} aria-hidden="true">← Drag to spin →</span>
      </div>
    </div>
  );
}
