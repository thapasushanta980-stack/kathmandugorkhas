"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { primaryNav, secondaryNav } from "./nav";

const isCurrent = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  // Solid background once the page scrolls; height never changes, so nothing jitters.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="site-header" data-scrolled={scrolled} data-menu={open}>
      <div className="wrap site-header__inner">
        <Link href="/" className="brand" aria-label="Kathmandu Gorkhas home">
          <img src="/media/brand/crest.jpg" alt="" width={44} height={44} />
          <span className="brand__name">
            Kathmandu Gorkhas
            <small>Nepal Premier League</small>
          </span>
        </Link>

        <nav className="nav" aria-label="Primary">
          <ul>
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={isCurrent(pathname, item.href) ? "page" : undefined}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <Link href="/matches" className="btn btn--solid btn--sm">Match Centre</Link>
        </div>

        <button type="button" className="menu-toggle" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen((v) => !v)}>
          <span className="menu-toggle__bars" aria-hidden="true" />
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile">
          <ul className="mobile-nav__primary">
            {primaryNav.map((item, i) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={isCurrent(pathname, item.href) ? "page" : undefined}>
                  {item.label} <span aria-hidden="true">0{i + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mobile-nav__secondary">
            {secondaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={isCurrent(pathname, item.href) ? "page" : undefined}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
