# Vyoman Shop — Design Document

**Project:** shop.vyomanaerials.com
**Version:** 1.0
**Status:** Pre-build · June 2026

---

## Brand Identity

### Voice
Understated. The photography leads; the copy does not oversell. No "stunning", no "breathtaking", no "incredible". Write as Vyoman does on the main site — authored, observational, confident without being loud.

Examples:
- ✓ "The Grund at blue hour. Shot 80 metres up on a still November evening."
- ✗ "Breathtaking aerial photography of stunning Luxembourg landmarks!"

### Visual Identity
- **Typography:** Geist (matches Vyoman site) or Inter as fallback. No display fonts.
- **Background:** `#0a0a0a` (near-black) — images pop against dark more than white
- **Surface:** `#141414`
- **Text primary:** `#f5f5f5`
- **Text secondary:** `#888888`
- **Accent:** `#d4a853` (warm gold — sky/sun at golden hour) for CTAs, hover states, price highlights
- **Border/divider:** `#2a2a2a`

### Logo usage
Vyoman wordmark (from existing brand assets). No shop-specific logo — "Vyoman Shop" as a text variant under the wordmark in secondary colour.

---

## Information Architecture

```
shop.vyomanaerials.com/
├── /                          Homepage — hero + featured products
├── /shop                      Full product catalog
├── /product/[slug]            Product detail page
├── /cart                      Cart
├── /checkout                  Checkout (name, address, message if postcard)
├── /order-confirmed/[id]      Order confirmation
├── /about                     About Vyoman Shop (brief, links to main site)
└── /[404]                     Not found
```

No login, no account creation. Guest checkout only. Email confirmation after order.

---

## Page-by-Page Design

---

### Homepage (`/`)

**Purpose:** Convert a first visitor into a browser. Show the photography. Give one clear action.

**Layout:**

```
┌─────────────────────────────────┐
│  VYOMAN          [Shop] [About] │  ← Minimal nav, dark
├─────────────────────────────────┤
│                                 │
│   [FULL-BLEED HERO IMAGE]       │  ← Best single photo, edge-to-edge
│                                 │     Autoplay between 3–4 hero shots
│   Luxembourg · From Above       │  ← Overlaid bottom-left, small caps
│                                 │
├─────────────────────────────────┤
│  Featured                       │  ← Section header
│                                 │
│  [Photo A]  [Photo B]  [Photo C]│  ← 3-column grid, 3:2 ratio
│  Vianden    Grund      Mullerthal│   Location name under each
│  from €6.50 from €22   from €6.50│   Price from cheapest available
│                                 │
│           [View all →]          │
├─────────────────────────────────┤
│  How it works                   │
│  ① Choose a photo               │
│  ② Pick your format             │
│  ③ Add a message (optional)     │
│  ④ We print and ship to you     │
├─────────────────────────────────┤
│  Vyoman · Sky in Sanskrit       │  ← Footer: minimal, link to main site
│  vyomanaerials.com              │
└─────────────────────────────────┘
```

**Hero image behaviour:**
- 3–4 images cycle automatically on a 6-second interval
- Fade transition (not slide)
- No carousel controls visible — seamless, cinematic
- Mobile: same image, portrait-cropped automatically

**Featured products:**
- 3 cards on desktop (2 on tablet, 1 per row on mobile)
- Hovering a card shows a very subtle image zoom (scale 1.03 over 300ms)
- Clicking goes to product detail

---

### Shop Page (`/shop`)

**Purpose:** Browse the full catalog. Filter by product type.

**Layout:**

```
┌─────────────────────────────────┐
│  VYOMAN          [Shop] [About] │
├─────────────────────────────────┤
│  Shop                           │
│  [All] [Postcards] [Prints] [Stickers] │  ← Filter tabs
├─────────────────────────────────┤
│  [Photo 1]  [Photo 2]  [Photo 3]│
│  [Photo 4]  [Photo 5]  [Photo 6]│
│  ...                            │
└─────────────────────────────────┘
```

**Grid:**
- 3 columns desktop, 2 tablet, 1 mobile
- Each card: full-bleed image (3:2), location name, price range
- No price until hover on desktop (keeps the grid clean)
- Cards do not have "Add to cart" on the grid — click goes to product detail

**Filters:**
- All / Postcards / Prints / Stickers
- Filter by product type, not by location (keep it simple)
- No price filter — range is narrow enough not to need it

---

### Product Detail Page (`/product/[slug]`)

**Purpose:** Show the image beautifully. Explain the product. Drive the purchase. Collect customisation if needed.

**Layout (desktop — 2 column):**

```
┌───────────────┬─────────────────┐
│               │ Vianden Castle  │
│               │ ─────────────── │
│  [LARGE IMAGE]│ The old castle  │
│               │ from the north  │
│   [thumb] [th]│ ridge. Shot at  │
│               │ 07:23 on a clear│
│               │ October morning.│
│               │                 │
│               │ Format          │
│               │ ○ Postcard (A6) │
│               │ ○ A4 Print      │
│               │ ○ A3 Print      │
│               │ ○ Sticker Pack  │
│               │                 │
│               │ [If Print]      │
│               │ Finish          │
│               │ ○ Unframed      │
│               │ ○ Framed (black)│
│               │ ○ Framed (white)│
│               │                 │
│               │ [If Postcard]   │
│               │ Personalise     │
│               │ ┌─────────────┐ │
│               │ │ Message for │ │
│               │ │ the back... │ │
│               │ └─────────────┘ │
│               │ 140 chars max   │
│               │                 │
│               │ €6.50           │
│               │ [Add to cart →] │
│               │                 │
│               │ Ships in 3–5    │
│               │ working days    │
└───────────────┴─────────────────┘
```

**Image panel (left):**
- Large format, 3:2 ratio, fills the column height
- Thumbnails below if multiple product mockups (postcard front/back, framed mockup, etc.)
- Click thumbnail to swap main image
- No zoom/lightbox — the product page is not a gallery

**Configuration panel (right):**
- Photo title (location name)
- 2–3 sentence description of the shot (written in Vyoman voice: where, when, how high)
- Format selector (radio buttons or segmented control)
- Conditional options based on format:
  - Postcard → personalisation textarea
  - Print → frame option
  - Sticker → quantity (1 pack = 5 stickers, always)
- Price updates dynamically as format/option changes
- "Add to cart" — primary CTA in accent gold
- Shipping time estimate (calculated from Gelato data: standard EU 3–5 days)

**Postcard personalisation field:**
- Textarea, 140 character max with live counter
- Placeholder: "A message for the back — or leave blank for a plain postcard"
- Below the field: small print preview showing where the message appears on the back
- If blank: card ships as a plain postcard (no message section printed)

**Mobile layout:**
- Single column, image on top, configuration below
- Sticky "Add to cart" bar at the bottom of the screen once the user scrolls past the main CTA

---

### Cart (`/cart`)

**Purpose:** Review items, confirm before checkout. Minimal friction.

**Layout:**
```
┌─────────────────────────────────┐
│ Your order (2 items)            │
│                                 │
│ [thumb] Vianden — A4 Unframed   │
│         €22.00            [×]   │
│                                 │
│ [thumb] Grund — Postcard        │
│         "Happy birthday Lena"   │
│         €6.50             [×]   │
│                                 │
│ ─────────────────────────────── │
│ Subtotal:           €28.50      │
│ Shipping:           calculated  │
│ at checkout                     │
│                                 │
│ [Proceed to checkout →]         │
└─────────────────────────────────┘
```

- No upsell, no "you might also like", no email capture gate
- Personalisation preview shown under postcard items (shows the message they entered)
- Remove button (×) per item
- Quantity change: not available — each item is a single product, not a quantity. If they want two postcards of the same image they add it twice (simpler implementation, and print-on-demand charges per unit anyway)

---

### Checkout (`/checkout`)

**Purpose:** Capture shipping address and payment. As few fields as possible.

**Fields:**
```
Contact
  Email address

Shipping address
  First name | Last name
  Address line 1
  Address line 2 (optional)
  City
  Postal code | Country

Payment
  [Stripe Elements — card / Apple Pay / Google Pay]

[ Pay €35.50 + shipping →]
```

**Shipping cost:**
- Calculated via Gelato's quote API when the country is entered
- Updates the total in real time once country is selected
- Luxembourg: ~€2.50 (standard post)
- EU: ~€5–8 depending on country and weight
- World: ~€10–15

**No account creation.** No "sign in to save your details." Guest checkout only. Email confirmation sent after order.

**Order summary sidebar (desktop):**
- Shows order items, subtotal, shipping, total
- Persists on right column while customer fills shipping on left

---

### Order Confirmation (`/order-confirmed/[orderId]`)

**Purpose:** Reassure the customer. Give them order reference.

```
✓ Order confirmed

Your order #VY-2847 is on its way to us.

Vianden Castle — A4 Print, Unframed
Grund — Postcard

We'll email you at hello@example.com when it ships.
Usually 3–5 working days to Luxembourg, 5–7 days within the EU.

[View the full collection →]
```

No fuss. No confetti animations. Clean.

---

## Product Configuration — How Options Work

Each photo in the catalog can be made available in any subset of product types. Not every photo needs to be available as every format. Curation is deliberate.

**Product types and their Gelato mappings:**

| Type | Gelato product | Notes |
|---|---|---|
| Postcard A6 | `postcard_a6_gl` (A6 glossy, 300gsm) | Custom message printed on back |
| A4 Print unframed | `poster_a4_170gsm` | Matt finish, 170gsm |
| A4 Print framed | Framed print via Gelato Frames API | Black or white frame, A4 |
| A3 Print unframed | `poster_a3_170gsm` | |
| A3 Print framed | Framed print, A3 | |
| Sticker Pack (5) | `sticker_die-cut` × 5 | Die-cut, outdoor durable vinyl |

**Photo requirements:**
- Minimum resolution for postcard: 1240 × 1748px at 300 DPI
- Minimum resolution for A4 print: 2480 × 3508px at 300 DPI
- Minimum resolution for A3 print: 3508 × 4961px at 300 DPI
- Source: 50MP still from Mini 5 Pro (8064 × 6048px) → more than enough for A3
- Video frame extracts (4K = 3840 × 2160) → sufficient for postcard and sticker only, not prints

**Rule:** Only 50MP still photos from the Mini 5 Pro are used as print source files. Video frame extracts may be used for the website display images only.

---

## Postcard Back Design

When a customer orders a postcard:

**If personalisation is blank:**
- Back: standard Vyoman branded postcard back (Vyoman logo top-left, photo title bottom-left, address box right, stamp box top-right)
- Looks like a standard tourism postcard

**If personalisation is filled:**
- Back: left half = customer's message in a clean serif font (Lora or similar) at 14pt
- Right half: address box (blank — customer fills by hand once received), stamp box, Vyoman logo small at bottom

**Postcard back template** is a static design file (PDF/PNG at 300 DPI) with variable text field. At order time, the message is composited into the template using a simple server-side image generation step (sharp + canvas, or Jimp) and the resulting file is sent to Gelato as the back-of-card artwork.

---

## Mobile Considerations

Mobile-first design. Key behaviours:

- Hero image on homepage: portrait crop (4:5) on mobile
- Product grid: single column on mobile (<640px)
- Product detail: image takes full viewport width, configuration scrolls below
- Sticky add-to-cart: once the primary CTA scrolls off screen, a fixed bar appears at the bottom of the viewport with the current price and "Add to cart"
- Checkout: full-width fields, keyboard types match (email keyboard for email, number for postal codes)
- Cart: drawer (slides in from right) rather than a separate page — faster on mobile

---

## Empty States and Edge Cases

**Out-of-stock photo:** Not applicable — print-on-demand, never out of stock.

**Gelato API failure:** If Gelato order placement fails, the customer's payment is not captured. Stripe holds the authorisation. An error page instructs the customer to email with their order reference, and the order is attempted again manually.

**Invalid postcard message:** Characters limit is enforced client-side (140 chars). No profanity filter in V1 — this is a low-volume shop where Sameer reviews Gelato orders in their dashboard anyway.

**Shipping to unsupported countries:** Gelato ships worldwide. If a country is not covered, the checkout disables the "Pay" button and shows "Shipping not available to this country."

---

## What This Shop Is Not

- Not a gallery. There is no zoom, no lightbox, no EXIF data display.
- Not a portfolio. This is not the Vyoman site. Links back to vyomanaerials.com but is separate.
- Not a subscription. One-time purchases only.
- Not personalised prints. Personalisation is postcard back only. No custom text on print faces, no name on artwork.
