"use client";

import Link from "next/link";
import { useState } from "react";
import type { Player } from "@/lib/types";

type Tag = Player["tags"][number];

/** Typographic squad list with a filter for the roles sources actually state. */
export function Roster({ players }: { players: Player[] }) {
  const tags = [...new Set(players.flatMap((p) => p.tags))] as Tag[];
  const [tag, setTag] = useState<Tag | "All">("All");
  const visible = players.filter((p) => tag === "All" || p.tags.includes(tag));

  return (
    <div>
      {tags.length > 0 && (
        <div className="filters" role="group" aria-label="Filter players">
          {(["All", ...tags] as const).map((t) => (
            <button key={t} type="button" className="btn btn--line btn--sm" aria-pressed={tag === t} onClick={() => setTag(t)}>
              {t === "Wicketkeeper" ? "Wicketkeepers" : t}
            </button>
          ))}
        </div>
      )}
      <p className="visually-hidden" aria-live="polite">{visible.length} players shown</p>
      <ol className="roster">
        {visible.map((p, i) => (
          <li key={p.slug}>
            <Link href={`/team/${p.slug}`}>
              <span className="roster__n">{String(i + 1).padStart(2, "0")}</span>
              <span className="roster__name">{p.name}</span>
              {p.tags.length > 0 && <span className="roster__tags">{p.tags.join(" · ")}</span>}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
