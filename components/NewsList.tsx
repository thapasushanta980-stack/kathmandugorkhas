"use client";

import { useState } from "react";
import { formatDate } from "@/lib/format";
import type { NewsItem, NewsKind } from "@/lib/types";

export function NewsList({ items }: { items: NewsItem[] }) {
  const kinds = [...new Set(items.map((n) => n.kind))] as NewsKind[];
  const [kind, setKind] = useState<NewsKind | "All">("All");
  const visible = items.filter((n) => kind === "All" || n.kind === kind);

  return (
    <div>
      {kinds.length > 1 && (
        <div className="filters" role="group" aria-label="Category">
          {(["All", ...kinds] as const).map((k) => (
            <button key={k} type="button" className="btn btn--line btn--sm" aria-pressed={kind === k} onClick={() => setKind(k)}>{k}</button>
          ))}
        </div>
      )}
      <p className="visually-hidden" aria-live="polite">{visible.length} stories shown</p>
      <ul className="storylist">
        {visible.map((n) => (
          <li key={n.slug}>
            <a href={n.url} rel="noopener noreferrer" target="_blank">
              <span className="storylist__meta"><b>{n.kind}</b>{formatDate(n.publishedAt, "short")}</span>
              <span><h3>{n.title}</h3><p>{n.summary}</p></span>
              <span className="storylist__out">{n.outlet} ↗<span className="visually-hidden"> (opens in a new tab)</span></span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
