"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Adds a one-time fade-up to elements marked `data-reveal`. Content stays visible without JS. */
export function RevealController() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    // Elements already in view are revealed immediately so nothing flashes.
    targets.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-visible");
      else observer.observe(el);
    });
    document.documentElement.classList.add("reveal-ready");
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
