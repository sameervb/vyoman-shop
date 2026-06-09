"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/cart";
import CartDrawer from "@/components/cart/CartDrawer";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.itemCount());
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeLinkStyle = {
    color: "var(--ink)",
    borderBottom: "1px solid var(--ink)",
    paddingBottom: "3px",
  } as const;
  const quietLinkStyle = {
    color: "var(--ink-2)",
    borderBottom: "1px solid transparent",
    paddingBottom: "3px",
    transition: "color 0.2s",
  } as const;

  return (
    <>
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, height: "68px",
          background: scrolled ? "rgba(241,238,231,0.88)" : "var(--paper)",
          borderBottom: `1px solid ${scrolled ? "var(--rule)" : "var(--rule-2)"}`,
          backdropFilter: scrolled ? "saturate(140%) blur(14px)" : "none",
          WebkitBackdropFilter: scrolled ? "saturate(140%) blur(14px)" : "none",
          transition: "background 0.3s, border-color 0.3s",
        }}
      >
        <div style={{
          maxWidth: "1500px", margin: "0 auto",
          padding: "0 clamp(1.25rem, 4vw, 2.5rem)", height: "100%",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          {/* Wordmark */}
          <Link href="https://vyomanaerials.com" style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: "1.35rem", fontWeight: 440, letterSpacing: "-0.01em",
            color: "var(--ink)",
          }}>
            Vyoman
          </Link>

          {/* Nav */}
          <div style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
            {[
              { href: "/shop", label: "Shop" },
              { href: "/about", label: "About" },
              { href: "https://vyomanaerials.com", label: "Gallery", external: true },
            ].map(({ href, label, external }) => {
              const active = !external && (pathname === href || pathname.startsWith(href + "/") || (href === "/shop" && pathname.startsWith("/product")));
              return external ? (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                  style={{ ...quietLinkStyle, fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.005em", whiteSpace: "nowrap" }}>
                  {label}
                </a>
              ) : (
                <Link key={href} href={href}
                  style={{ ...(active ? activeLinkStyle : quietLinkStyle), fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.005em", whiteSpace: "nowrap" }}>
                  {label}
                </Link>
              );
            })}

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              style={{ position: "relative", display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", color: "var(--ink-2)", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--ink)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--ink-2)")}
              aria-label={`Cart, ${itemCount} items`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {itemCount > 0 && (
                <span style={{
                  background: "var(--ink)", color: "var(--paper)",
                  fontSize: "0.65rem", fontWeight: 600, borderRadius: "9999px",
                  width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1,
                }}>
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div style={{ height: "68px" }} />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
