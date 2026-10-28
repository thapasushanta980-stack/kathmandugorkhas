import type { Metadata } from "next";
import Link from "next/link";
import { Arrow, PageHero, Statement } from "@/components/ui";
import { products, site } from "@/content";

export const metadata: Metadata = {
  title: "Shop",
  description: `Official ${site.name} merchandise.`,
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return (
    <>
      <PageHero kicker="Merchandise" title="Shop" lede="Official jerseys and merchandise." />
      <section className="band band--paper">
        <div className="wrap">
          {products.length ? (
            <ul className="tiers">
              {products.map((p) => (
                <li key={p.name} className="tier">
                  <span className="tier__name">{p.name}</span>
                  <span className="tier__meta">{p.price} · {p.sizes.join(", ")} · {p.inStock ? "In stock" : "Out of stock"}</span>
                  <a className="btn btn--ink btn--sm" href={p.checkoutUrl} rel="noopener noreferrer" target="_blank">Buy from the official shop</a>
                </li>
              ))}
            </ul>
          ) : site.officialShopUrl ? (
            <a className="btn btn--ink" href={site.officialShopUrl} rel="noopener noreferrer" target="_blank">Go to the official shop <Arrow /></a>
          ) : (
            <Statement title="Official shop coming soon" action={<Link href="/jersey" className="text-link">See the jersey <Arrow /></Link>}>
              No official store has been confirmed yet, so no prices, sizes or stock are listed and nothing can be bought on this site. Once the
              franchise confirms its store, this page will link straight to it.
            </Statement>
          )}
        </div>
      </section>
    </>
  );
}
