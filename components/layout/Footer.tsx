import Link from "next/link";

function InstagramIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--rule)", marginTop: "6rem", padding: "clamp(3.5rem, 7vw, 5rem) clamp(1.25rem, 4vw, 2.5rem) 2.5rem" }}>
      <div style={{ maxWidth: "1500px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "3rem 2rem", marginBottom: "3.5rem" }}>

          {/* Brand */}
          <div style={{ maxWidth: "280px" }}>
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1.5rem", fontWeight: 440, letterSpacing: "-0.01em", marginBottom: "0.65rem" }}>
              Vyoman
            </div>
            <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "var(--ink-2)" }}>
              Aerial photography of Luxembourg. Sky in Sanskrit.
            </p>
          </div>

          {/* Shop */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <span style={{ fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500, color: "var(--faint)", marginBottom: "0.15rem" }}>Shop</span>
            <Link href="/shop" style={{ fontSize: "0.875rem", color: "var(--ink-2)" }}>All prints</Link>
            <Link href="/shop#postcards" style={{ fontSize: "0.875rem", color: "var(--ink-2)" }}>Postcards</Link>
            <Link href="/shop#prints" style={{ fontSize: "0.875rem", color: "var(--ink-2)" }}>Framed prints & canvas</Link>
            <Link href="/shop#gifts" style={{ fontSize: "0.875rem", color: "var(--ink-2)" }}>Mugs & totes</Link>
            <Link href="/about" style={{ fontSize: "0.875rem", color: "var(--ink-2)" }}>About</Link>
          </div>

          {/* Contact */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <span style={{ fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500, color: "var(--faint)", marginBottom: "0.15rem" }}>Contact</span>
            <a href="https://www.instagram.com/vyoman.aerials" target="_blank" rel="noopener noreferrer"
              style={{ fontSize: "0.875rem", color: "var(--ink-2)", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
              <InstagramIcon size={13} /> @vyoman.aerials
            </a>
            <a href="mailto:sameerbh08@gmail.com" style={{ fontSize: "0.875rem", color: "var(--ink-2)" }}>sameerbh08@gmail.com</a>
            <a href="https://vyomanaerials.com" target="_blank" rel="noopener noreferrer"
              style={{ fontSize: "0.875rem", color: "var(--ink-2)" }}>vyomanaerials.com →</a>
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--rule-2)", paddingTop: "1.5rem", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "0.5rem" }}>
          <p style={{ fontSize: "0.75rem", color: "var(--faint)" }}>
            © {new Date().getFullYear()} Vyoman · Luxembourg
          </p>
          <p style={{ fontSize: "0.75rem", color: "var(--faint)" }}>
            All photographs © Vyoman. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
