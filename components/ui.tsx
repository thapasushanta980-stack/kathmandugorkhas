import Link from "next/link";
import type { ReactNode } from "react";
import type { Provenance } from "@/lib/types";
import { Topo } from "./Topo";

export function PageHero({ title, kicker, lede, children }: { title: string; kicker: string; lede?: string; children?: ReactNode }) {
  return (
    <section className="page-hero">
      <Topo />
      <div className="wrap page-hero__inner">
        <p className="crumb"><Link href="/">Home</Link> <span aria-hidden="true">/</span> {title}</p>
        <p className="kicker kicker--rule">{kicker}</p>
        <h1>{title}</h1>
        {lede && <p className="lede">{lede}</p>}
        {children}
      </div>
    </section>
  );
}

export function Head({ kicker, title, lede, action, id }: { kicker: string; title: string; lede?: string; action?: ReactNode; id?: string }) {
  return (
    <div className={`head${action ? " head--split" : ""}`} data-reveal>
      <div style={{ display: "grid", gap: "var(--s-4)" }}>
        <p className="kicker kicker--rule">{kicker}</p>
        <h2 id={id}>{title}</h2>
        {lede && <p className="lede">{lede}</p>}
      </div>
      {action}
    </div>
  );
}

/** Honest empty state: a plain statement, not a placeholder card. */
export function Statement({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="statement" role="status">
      <h3>{title}</h3>
      <p>{children}</p>
      {action}
    </div>
  );
}

export function Note({ children = "Awaiting confirmation" }: { children?: ReactNode }) {
  return <span className="note">{children}</span>;
}

export function Source({ p, prefix = "Source" }: { p: Provenance; prefix?: string }) {
  return (
    <p className="source">
      {prefix}:{" "}
      {p.url ? <a href={p.url} rel="noopener noreferrer" target="_blank">{p.source}</a> : p.source}
      {" · checked "}{p.verifiedAt}
      {p.status === "awaiting-approval" && " · awaiting franchise confirmation"}
    </p>
  );
}

export const Arrow = () => <span className="arrow" aria-hidden="true">→</span>;
