"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { dayOfMonth, fixtureStatus, monthShort, whenLabel, type FixtureStatus } from "@/lib/format";
import type { Fixture, Season } from "@/lib/types";

type StatusFilter = "all" | "upcoming" | "results";

function statusText(f: Fixture, s: FixtureStatus) {
  if (s === "result" && f.result) return f.result.summary;
  if (s === "awaiting-result") return "Result to be updated";
  return "Upcoming";
}

export function FixtureRow({ f, now }: { f: Fixture; now: number | null }) {
  // Before hydration, status is derived from data only (result present or not).
  const s: FixtureStatus = f.result ? "result" : now === null ? "upcoming" : fixtureStatus(f, now);
  return (
    <li className="fixture">
      <Link href={`/matches/${f.id}`}>
        <span className="fixture__date"><b>{dayOfMonth(f.date)}</b><span>{monthShort(f.date)}</span></span>
        <span style={{ display: "grid", gap: "var(--s-1)" }}>
          <span className="fixture__opp">v {f.opponent}</span>
          <span className="fixture__meta">{f.label} · {whenLabel(f)}</span>
        </span>
        <span className="fixture__status" data-outcome={f.result?.outcome}>{statusText(f, s)}</span>
      </Link>
    </li>
  );
}

export function FixturesBrowser({ fixtures, seasons }: { fixtures: Fixture[]; seasons: Season[] }) {
  const [season, setSeason] = useState(seasons.find((s) => s.current)?.id ?? seasons[0]?.id);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(Date.now()), []);

  const inSeason = fixtures.filter((f) => f.season === season);
  const visible = inSeason.filter((f) => {
    if (status === "all") return true;
    const s = f.result ? "result" : now === null ? "upcoming" : fixtureStatus(f, now);
    return status === "results" ? s !== "upcoming" : s === "upcoming";
  });

  return (
    <div>
      <div className="filters">
        <div className="filters__group" role="group" aria-label="Season">
          <span className="filters__label" aria-hidden="true">Season</span>
          {seasons.map((s) => (
            <button key={s.id} type="button" className="btn btn--line btn--sm" aria-pressed={season === s.id} onClick={() => setSeason(s.id)}>{s.label}</button>
          ))}
        </div>
        <div className="filters__group" role="group" aria-label="Status">
          <span className="filters__label" aria-hidden="true">Show</span>
          {(["all", "upcoming", "results"] as const).map((s) => (
            <button key={s} type="button" className="btn btn--line btn--sm" aria-pressed={status === s} onClick={() => setStatus(s)}>
              {s === "all" ? "All" : s === "upcoming" ? "Fixtures" : "Results"}
            </button>
          ))}
        </div>
      </div>
      <p className="visually-hidden" aria-live="polite">{visible.length} matches shown</p>
      {visible.length ? (
        <ul className="fixtures">{visible.map((f) => <FixtureRow key={f.id} f={f} now={now} />)}</ul>
      ) : (
        <p className="muted">No {status === "upcoming" ? "upcoming fixtures" : "results"} for this season yet.</p>
      )}
    </div>
  );
}
