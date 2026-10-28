"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { anthem } from "@/content";
import { ANTHEM_MODAL_EVENT } from "./AnthemModal";
import { loadYouTubeApi, watchUrl, YT_HOST, type YTPlayer } from "@/lib/youtube";

type State = "closed" | "loading" | "playing" | "paused" | "error";

/**
 * Site-wide Kathmandu Gorkhas anthem control. Silent by default; nothing loads
 * until the visitor presses it. Lives in the root layout, so it keeps playing
 * across page changes.
 *
 * - With an official audio file (`audioSrc`), it is audio-only: a compact bar, no video.
 * - Without one, it falls back to the team's YouTube upload, which YouTube's
 *   terms require to stay visible while it plays.
 */
export function SoundDock({ audioSrc }: { audioSrc?: string }) {
  return audioSrc ? <AudioDock src={audioSrc} /> : <YouTubeDock />;
}

/** Stops on Escape, and whenever the anthem dialog opens, so two audio sources never overlap. */
function useEscape(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onEscape();
    document.addEventListener("keydown", onKey);
    window.addEventListener(ANTHEM_MODAL_EVENT, onEscape);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener(ANTHEM_MODAL_EVENT, onEscape);
    };
  }, [active, onEscape]);
}

function Launcher({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="sound__launch" onClick={onClick} aria-label="Play the Kathmandu Gorkhas anthem">
      <SpeakerIcon off />
      <span>Sound off</span>
    </button>
  );
}

function Controls({ state, muted, onPlay, onMute, onStop }: { state: State; muted: boolean; onPlay: () => void; onMute: () => void; onStop: () => void }) {
  const busy = state === "loading" || state === "error";
  return (
    <div className="sound__controls">
      <button type="button" className="btn btn--line btn--sm" onClick={onPlay} disabled={busy}>{state === "playing" ? "Pause" : "Play"}</button>
      <button type="button" className="btn btn--line btn--sm" onClick={onMute} aria-pressed={muted} disabled={busy}>
        <SpeakerIcon off={muted} /> {muted ? "Unmute" : "Mute"}
      </button>
      <button type="button" className="sound__close" onClick={onStop} aria-label="Stop the anthem">×</button>
    </div>
  );
}

const statusText = (s: State) =>
  s === "error" ? "Couldn’t play" : s === "loading" ? "Loading" : s === "playing" ? "Now playing" : "Paused · press play";

/** Audio-only mode: plays the official anthem file. */
function AudioDock({ src }: { src: string }) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<State>("closed");
  const [muted, setMuted] = useState(false);

  const stop = useCallback(() => {
    const a = audio.current;
    if (a) { a.pause(); a.currentTime = 0; }
    setState("closed");
  }, []);
  useEscape(state !== "closed", stop);

  const start = () => {
    if (!audio.current) {
      const a = new Audio(src);
      a.loop = true;
      a.preload = "auto";
      a.addEventListener("playing", () => setState("playing"));
      a.addEventListener("pause", () => setState((s) => (s === "closed" ? s : "paused")));
      a.addEventListener("waiting", () => setState("loading"));
      a.addEventListener("error", () => setState("error"));
      audio.current = a;
    }
    setState("loading");
    audio.current.play().catch(() => setState("paused"));
  };

  useEffect(() => () => audio.current?.pause(), []);

  if (state === "closed") return <aside className="sound" aria-label="Anthem"><Launcher onClick={start} /></aside>;

  const a = audio.current;
  return (
    <aside className="sound" aria-label="Anthem">
      <div className="sound__bar">
        <span className="sound__eq" data-active={state === "playing" && !muted} aria-hidden="true"><i /><i /><i /></span>
        <div className="sound__meta">
          <p className="kicker" role="status">{statusText(state)}</p>
          <p className="sound__title">{anthem.title}</p>
        </div>
        <Controls
          state={state}
          muted={muted}
          onPlay={() => (state === "playing" ? a?.pause() : a?.play().catch(() => setState("paused")))}
          onMute={() => { if (a) { a.muted = !a.muted; setMuted(a.muted); } }}
          onStop={stop}
        />
      </div>
    </aside>
  );
}

/** Fallback until an audio file is supplied: the team's YouTube upload in a visible mini player. */
function YouTubeDock() {
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<YTPlayer | null>(null);
  const [state, setState] = useState<State>("closed");
  const [muted, setMuted] = useState(false);

  const stop = useCallback(() => {
    player.current?.destroy();
    player.current = null;
    setState("closed");
    setMuted(false);
  }, []);
  useEscape(state !== "closed", stop);
  useEffect(() => () => player.current?.destroy(), []);

  const start = async () => {
    setState("loading");
    try {
      const YT = await loadYouTubeApi();
      if (!host.current) return;
      const mount = document.createElement("div");
      host.current.replaceChildren(mount);
      player.current = new YT.Player(mount, {
        videoId: anthem.id,
        host: YT_HOST,
        width: "100%",
        height: "100%",
        playerVars: { autoplay: 1, playsinline: 1, rel: 0, modestbranding: 1, loop: 1, playlist: anthem.id },
        events: {
          // Ready means controllable: enable controls even if the browser blocks autoplay.
          onReady: (e) => { setState("paused"); setMuted(e.target.isMuted()); e.target.playVideo(); },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PLAYING) { setState("playing"); setMuted(e.target.isMuted()); }
            else if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED) setState("paused");
          },
          onError: () => setState("error"),
        },
      });
    } catch {
      setState("error");
    }
  };

  const open = state !== "closed";
  const p = player.current;

  return (
    <aside className="sound" aria-label="Anthem">
      {!open && <Launcher onClick={start} />}
      <div className="sound__panel" hidden={!open}>
        <div className="sound__meta">
          <p className="kicker" role="status">{statusText(state)}</p>
          <p className="sound__title">{anthem.title}</p>
        </div>
        <div className="sound__player" ref={host} />
        {state === "error" && (
          <p className="small">YouTube couldn&rsquo;t load. <a href={watchUrl(anthem.id)} rel="noopener noreferrer" target="_blank">Listen on YouTube</a>.</p>
        )}
        <Controls
          state={state}
          muted={muted}
          onPlay={() => (state === "playing" ? p?.pauseVideo() : p?.playVideo())}
          onMute={() => { if (!p) return; if (p.isMuted()) { p.unMute(); setMuted(false); } else { p.mute(); setMuted(true); } }}
          onStop={stop}
        />
      </div>
    </aside>
  );
}

function SpeakerIcon({ off }: { off?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5 6 9H2v6h4l5 4V5z" fill="currentColor" />
      {off ? <path d="m22 9-6 6M16 9l6 6" /> : <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" />}
    </svg>
  );
}
