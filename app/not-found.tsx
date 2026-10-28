import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-hero" style={{ minHeight: "70svh", display: "grid", alignItems: "center" }}>
      <div className="wrap page-hero__inner">
        <p className="kicker kicker--rule">404</p>
        <h1>Page not found</h1>
        <p className="lede">That page doesn&rsquo;t exist, or it hasn&rsquo;t been published yet.</p>
        <div className="btn-row">
          <Link href="/" className="btn btn--solid">Back to home</Link>
          <Link href="/matches" className="btn btn--line">Match Centre</Link>
        </div>
      </div>
    </section>
  );
}
