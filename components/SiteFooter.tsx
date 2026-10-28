import Link from "next/link";
import { partners, site, socialLinks } from "@/content";
import { legalNav, primaryNav, secondaryNav } from "./nav";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="site-footer__top">
          <div>
            <Link href="/" className="brand">
              <img src="/media/brand/crest.jpg" alt="" width={44} height={44} />
              <span className="brand__name">{site.name}<small>{site.league}</small></span>
            </Link>
            <p className="site-footer__big" aria-hidden="true">Kathmandu<span>Gorkhas</span></p>
          </div>
          <div>
            <h2>Match Centre</h2>
            <ul>{primaryNav.map((i) => <li key={i.href}><Link href={i.href}>{i.label}</Link></li>)}</ul>
          </div>
          <div>
            <h2>Club</h2>
            <ul>{secondaryNav.map((i) => <li key={i.href}><Link href={i.href}>{i.label}</Link></li>)}</ul>
          </div>
          <div>
            <h2>Follow</h2>
            {socialLinks.length ? (
              <ul>{socialLinks.map((s) => <li key={s.url}><a href={s.url} rel="noopener noreferrer" target="_blank">{s.label}</a></li>)}</ul>
            ) : (
              <p className="muted small">Official social channels will be linked once they are verified with the franchise.</p>
            )}
          </div>
        </div>

        {partners.length > 0 && (
          <div className="site-footer__partners">
            <h2>Partners · Season 3</h2>
            <ul>
              {partners.map((p) => (
                <li key={p.name}>{p.name}<small>{p.title}</small></li>
              ))}
            </ul>
          </div>
        )}

        <div className="site-footer__legal">
          <p>© {new Date().getFullYear()} {site.name}. Concept build, not an official franchise website.</p>
          <nav aria-label="Legal">{legalNav.map((i) => <Link key={i.href} href={i.href}>{i.label}</Link>)}</nav>
        </div>
      </div>
    </footer>
  );
}
