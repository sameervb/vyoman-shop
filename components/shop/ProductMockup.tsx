/**
 * ProductMockup — renders a photo in the context of its product type.
 * Used in the product grid (when a filter tab is active) and on the product
 * detail page gallery.
 *
 * Size: fills its parent container — wrap in a sized div.
 */

import type { ProductType } from "@/types/catalog";

interface Props {
  imageUrl: string;
  alt: string;
  productType: ProductType;
  /** "3:2" | "2:3" — original photo orientation. Default "3:2". */
  aspectRatio?: "3:2" | "2:3";
  /** Controls overall container height. "card" = compact grid card, "full" = detail page. */
  size?: "card" | "full";
}

// ── Scene wrapper ──────────────────────────────────────────────────────────────
// A "wall / tabletop" neutral background for all non-canvas mockups.
const scene = (children: React.ReactNode, bg = "#D9D4CC") => (
  <div style={{
    width: "100%", height: "100%",
    background: bg,
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "8%",
    boxSizing: "border-box",
  }}>
    {children}
  </div>
);

// ── Photo img helper ───────────────────────────────────────────────────────────
const Img = ({ src, alt, style }: { src: string; alt: string; style?: React.CSSProperties }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src={src}
    alt={alt}
    style={{ display: "block", width: "100%", ...style }}
  />
);

// ── Postcard ──────────────────────────────────────────────────────────────────
function PostcardMockup({ imageUrl, alt }: { imageUrl: string; alt: string }) {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "#E8E3DA",
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: "4%", padding: "6% 5%",
      boxSizing: "border-box",
    }}>
      {/* Front */}
      <div style={{
        flex: "0 0 54%",
        background: "white",
        padding: "4px",
        boxShadow: "1px 3px 10px rgba(22,21,15,0.16), 0 1px 3px rgba(22,21,15,0.08)",
        transform: "rotate(-1.5deg)",
        flexShrink: 0,
      }}>
        <Img src={imageUrl} alt={alt} style={{ aspectRatio: "3/2", objectFit: "cover" }} />
      </div>

      {/* Back */}
      <div style={{
        flex: "0 0 38%",
        background: "white",
        aspectRatio: "3/2",
        padding: "5%",
        boxShadow: "1px 3px 10px rgba(22,21,15,0.12)",
        transform: "rotate(0.8deg)",
        display: "flex", flexDirection: "column",
        boxSizing: "border-box",
        flexShrink: 0,
      }}>
        {/* Top row: brand + stamp */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6%" }}>
          <span style={{ fontSize: "0.4rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#97917F", fontWeight: 600 }}>
            Vyoman
          </span>
          {/* Stamp box */}
          <div style={{ width: "20%", aspectRatio: "4/5", border: "1px solid #D8D2C4" }} />
        </div>
        {/* Vertical divider + address lines */}
        <div style={{ flex: 1, display: "flex", gap: "8%" }}>
          <div style={{ width: "1px", background: "#D8D2C4", flexShrink: 0 }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: "16%" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ height: "1px", background: "#E7E2D6" }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Matte Poster ─────────────────────────────────────────────────────────────
function PosterMockup({ imageUrl, alt, aspectRatio }: { imageUrl: string; alt: string; aspectRatio: "3:2" | "2:3" }) {
  const isPortrait = aspectRatio === "2:3";
  return scene(
    <div style={{
      background: "white",
      padding: isPortrait ? "8% 8% 14%" : "10% 10% 16%",
      boxShadow: "0 4px 24px rgba(22,21,15,0.22), 0 1px 6px rgba(22,21,15,0.1)",
      width: isPortrait ? "52%" : "72%",
    }}>
      <Img src={imageUrl} alt={alt} style={{ aspectRatio: isPortrait ? "2/3" : "3/2", objectFit: "cover" }} />
    </div>
  );
}

// ── Framed Print ─────────────────────────────────────────────────────────────
function FramedMockup({ imageUrl, alt }: { imageUrl: string; alt: string }) {
  return scene(
    <div style={{
      background: "#16150F", // dark wood frame
      padding: "5%",
      boxShadow: "0 4px 24px rgba(22,21,15,0.28)",
      width: "66%",
    }}>
      {/* Mat */}
      <div style={{ background: "white", padding: "7%" }}>
        <Img src={imageUrl} alt={alt} style={{ aspectRatio: "3/4", objectFit: "cover" }} />
      </div>
    </div>
  );
}

// ── Canvas ───────────────────────────────────────────────────────────────────
function CanvasMockup({ imageUrl, alt, aspectRatio }: { imageUrl: string; alt: string; aspectRatio: "3:2" | "2:3" }) {
  const isPortrait = aspectRatio === "2:3";
  return scene(
    <div style={{
      width: isPortrait ? "52%" : "74%",
      // Gallery wrap depth shadows
      boxShadow: "-4px 4px 0 #B0A89E, -8px 8px 0 #A09890, 2px 0 16px rgba(22,21,15,0.25)",
      position: "relative",
    }}>
      <Img src={imageUrl} alt={alt} style={{ aspectRatio: isPortrait ? "2/3" : "3/2", objectFit: "cover" }} />
      {/* Simulated left wrap edge */}
      <div style={{
        position: "absolute", left: "-4px", top: 0, width: "4px", height: "100%",
        background: "linear-gradient(to right, #9A9289, #B5ADA4)",
      }} />
    </div>
  );
}

// ── Mug ──────────────────────────────────────────────────────────────────────
function MugMockup({ imageUrl, alt }: { imageUrl: string; alt: string }) {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "#E0DBD4",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{ position: "relative", width: "52%" }}>
        {/* Body */}
        <div style={{
          background: "white",
          border: "1.5px solid #D0CAC0",
          borderRadius: "3px 3px 6px 6px",
          overflow: "hidden",
          boxShadow: "0 3px 16px rgba(22,21,15,0.14)",
        }}>
          {/* Top rim */}
          <div style={{ height: "7%", minHeight: "8px", background: "white", borderBottom: "1.5px solid #E8E2D8" }} />
          {/* Photo band */}
          <Img src={imageUrl} alt={alt} style={{ height: "80px", objectFit: "cover" }} />
          {/* Bottom base */}
          <div style={{ height: "10%", minHeight: "10px", background: "#F4F1EC", borderTop: "1.5px solid #E8E2D8" }} />
        </div>
        {/* Handle */}
        <div style={{
          position: "absolute", right: "-18%", top: "20%",
          width: "18%", height: "54%",
          border: "3px solid #D0CAC0",
          borderLeft: "none",
          borderRadius: "0 12px 12px 0",
          background: "transparent",
        }} />
        {/* Top ellipse */}
        <div style={{
          position: "absolute", top: "-4px", left: "5%", right: "5%",
          height: "10px",
          background: "#F8F5F0",
          border: "1.5px solid #D0CAC0",
          borderRadius: "50%",
        }} />
      </div>
    </div>
  );
}

// ── Tote Bag ─────────────────────────────────────────────────────────────────
function ToteMockup({ imageUrl, alt }: { imageUrl: string; alt: string }) {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "#DDD8CF",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{ position: "relative", width: "56%" }}>
        {/* Handles */}
        <div style={{ display: "flex", justifyContent: "space-around", paddingBottom: "0" }}>
          {[0, 1].map((i) => (
            <div key={i} style={{
              width: "22%", height: "22px",
              border: "3px solid #B8B09E",
              borderBottom: "none",
              borderRadius: "8px 8px 0 0",
              marginBottom: "-1px",
            }} />
          ))}
        </div>
        {/* Bag body */}
        <div style={{
          background: "#EDE8DF",
          border: "1.5px solid #C4BBAA",
          borderRadius: "2px 2px 8px 8px",
          padding: "8%",
          boxShadow: "0 3px 14px rgba(22,21,15,0.12)",
        }}>
          <Img src={imageUrl} alt={alt} style={{ aspectRatio: "1/1", objectFit: "cover", borderRadius: "1px" }} />
        </div>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function ProductMockup({ imageUrl, alt, productType, aspectRatio = "3:2" }: Props) {
  switch (productType) {
    case "postcard_a6":
      return <PostcardMockup imageUrl={imageUrl} alt={alt} />;
    case "matte_poster":
      return <PosterMockup imageUrl={imageUrl} alt={alt} aspectRatio={aspectRatio} />;
    case "framed_print":
      return <FramedMockup imageUrl={imageUrl} alt={alt} />;
    case "canvas":
      return <CanvasMockup imageUrl={imageUrl} alt={alt} aspectRatio={aspectRatio} />;
    case "mug":
      return <MugMockup imageUrl={imageUrl} alt={alt} />;
    case "tote_bag":
      return <ToteMockup imageUrl={imageUrl} alt={alt} />;
    default:
      return null;
  }
}
