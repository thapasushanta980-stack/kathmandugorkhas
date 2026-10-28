"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fixtures } from "@/content";
import { nextFixture, whenLabel } from "@/lib/format";
import type { Fixture } from "@/lib/types";

/** Next confirmed fixture, resolved in the browser so it never goes stale after a build. */
export function MatchStrip({ initial }: { initial?: Fixture }) {
  const [next, setNext] = useState<Fixture | undefined>(initial);
  useEffect(() => setNext(nextFixture(fixtures)), []);

  return (
    <section id="next-match" className="matchstrip" aria-label="Next match">
      <div className="wrap matchstrip__inner">
        <p className="matchstrip__label">{next ? `Next match · ${next.label}` : "Match Centre"}</p>
        {next ? (
          <>
            <p className="matchstrip__teams">Kathmandu Gorkhas <span>v</span> {next.opponent}</p>
            <p className="matchstrip__when">{whenLabel(next)}<br />TU Ground, Kirtipur</p>
            <Link href={`/matches/${next.id}`} className="btn btn--sm">Match details</Link>
          </>
        ) : (
          <>
            <p className="matchstrip__teams">Fixtures to be announced</p>
            <span />
            <Link href="/matches" className="btn btn--sm">Results</Link>
          </>
        )}
      </div>
    </section>
  );
}
