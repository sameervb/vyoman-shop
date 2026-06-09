# Vyoman Shop — Technical Specification

**Project:** shop.vyomanaerials.com
**Version:** 1.0
**Status:** Pre-build · June 2026

---

## Stack

| Layer | Choice | Rationale |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | Consistent with vyomanaerials.com and portfolio site. Server components, server actions, built-in image optimisation. |
| **Language** | TypeScript | All other Sameer projects use TS. |
| **Styling** | Tailwind CSS v4 | Consistent with existing projects. |
| **Database** | Postgres via Neon (serverless) | Orders, catalog metadata. Neon's free tier is sufficient for V1 volume. Serverless means no infra to manage. |
| **ORM** | Drizzle ORM | Lightweight, TypeScript-first, works well with Neon serverless. |
| **Payments** | Stripe | Standard, excellent documentation, supports Apple/Google Pay, EUR native, webhooks for order status. |
| **Print-on-demand** | Gelato API | European fulfillment, REST API, Luxembourg-adjacent warehouses. |
| **Email** | Resend | Transactional emails. Simple API, good deliverability, generous free tier. |
| **Image hosting** | Cloudflare R2 | Store high-res print files (not served publicly). Store optimised web images (served via CDN). No egress fees. |
| **Image processing** | Sharp (Node.js) | Compositing personalised postcard backs at order time. |
| **Deployment** | Vercel | Consistent with existing sites. Auto-deploy on main push. |
| **DNS** | Cloudflare | shop.vyomanaerials.com CNAME to Vercel. |

---

## Project Structure

```
vyoman-shop/
├── src/
│   ├── app/                          Next.js App Router
│   │   ├── layout.tsx               Root layout (font, metadata, analytics)
│   │   ├── page.tsx                 Homepage
│   │   ├── shop/
│   │   │   └── page.tsx             Catalog page
│   │   ├── product/
│   │   │   └── [slug]/
│   │   │       └── page.tsx         Product detail page
│   │   ├── cart/
│   │   │   └── page.tsx             Cart page
│   │   ├── checkout/
│   │   │   └── page.tsx             Checkout page
│   │   ├── order-confirmed/
│   │   │   └── [orderId]/
│   │   │       └── page.tsx         Order confirmation page
│   │   ├── about/
│   │   │   └── page.tsx             About page
│   │   └── api/
│   │       ├── stripe/
│   │       │   └── webhook/         Stripe webhook handler
│   │       │       └── route.ts
│   │       ├── checkout/
│   │       │   └── route.ts         Create Stripe checkout session
│   │       ├── shipping-quote/
│   │       │   └── route.ts         Gelato shipping cost estimate
│   │       └── gelato/
│   │           └── webhook/         Gelato order status webhook
│   │               └── route.ts
│   ├── components/
│   │   ├── ui/                      Base UI components (Button, Badge, etc.)
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── shop/
│   │   │   ├── ProductCard.tsx      Grid card
│   │   │   ├── ProductGrid.tsx      Grid with filter
│   │   │   ├── ProductDetail.tsx    Detail page component
│   │   │   ├── FormatSelector.tsx   Radio group for product type
│   │   │   ├── FrameSelector.tsx    Frame option selector
│   │   │   ├── PersonaliseField.tsx Postcard message textarea
│   │   │   └── PriceDisplay.tsx     Dynamic price
│   │   ├── cart/
│   │   │   ├── CartDrawer.tsx       Mobile slide-in cart
│   │   │   ├── CartItem.tsx
│   │   │   └── CartSummary.tsx
│   │   └── checkout/
│   │       ├── CheckoutForm.tsx     Shipping address fields
│   │       └── StripeElements.tsx   Stripe card element wrapper
│   ├── lib/
│   │   ├── db/
│   │   │   ├── schema.ts            Drizzle schema
│   │   │   └── index.ts             DB connection
│   │   ├── gelato/
│   │   │   ├── client.ts            Gelato API wrapper
│   │   │   ├── products.ts          Product ID constants
│   │   │   └── postcard.ts          Postcard back image generation
│   │   ├── stripe/
│   │   │   └── client.ts            Stripe client + helpers
│   │   ├── resend/
│   │   │   └── emails.ts            Email templates + send functions
│   │   ├── r2/
│   │   │   └── client.ts            Cloudflare R2 client
│   │   └── catalog.ts               Static catalog (photos + product config)
│   ├── store/
│   │   └── cart.ts                  Zustand cart store (client-side)
│   └── types/
│       ├── catalog.ts               Photo, Product, Variant types
│       ├── cart.ts                  CartItem type
│       └── orders.ts                Order types
├── public/
│   └── images/
│       └── shop/                    Low-res display images (optimised for web)
│           ├── vianden-castle.jpg
│           ├── grund-blue-hour.jpg
│           └── ...
├── docs/
│   ├── VISION.md
│   ├── DESIGN.md
│   └── TECHNICAL_SPEC.md (this file)
├── drizzle/
│   └── migrations/                  DB migration files
├── .env.local                       Local secrets
├── .env.example                     Template (committed)
├── next.config.ts
├── tailwind.config.ts
├── drizzle.config.ts
└── package.json
```

---

## Data Models

### Database (Postgres / Drizzle)

```typescript
// schema.ts

// Orders table — one row per customer order
export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  stripePaymentIntentId: text('stripe_payment_intent_id').unique().notNull(),
  stripeCheckoutSessionId: text('stripe_checkout_session_id').unique(),
  gelatoOrderId: text('gelato_order_id').unique(),
  status: text('status', {
    enum: ['pending_payment', 'paid', 'submitted_to_gelato',
           'in_production', 'shipped', 'delivered', 'cancelled', 'refunded']
  }).default('pending_payment').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerName: text('customer_name').notNull(),
  shippingAddress: jsonb('shipping_address').notNull(), // AddressSchema
  subtotalCents: integer('subtotal_cents').notNull(),
  shippingCents: integer('shipping_cents').notNull(),
  totalCents: integer('total_cents').notNull(),
  currency: text('currency').default('EUR').notNull(),
  trackingNumber: text('tracking_number'),
  trackingUrl: text('tracking_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Order items — one row per product in the order
export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').references(() => orders.id).notNull(),
  photoSlug: text('photo_slug').notNull(),       // e.g. 'vianden-castle'
  productType: text('product_type').notNull(),    // e.g. 'postcard_a6' | 'print_a4_unframed'
  frameOption: text('frame_option'),              // null | 'black' | 'white'
  personalisation: text('personalisation'),       // postcard message (max 140 chars)
  gelatoProductId: text('gelato_product_id').notNull(),
  priceCents: integer('price_cents').notNull(),
  gelatoFileUrl: text('gelato_file_url'),        // URL of the print-ready file sent to Gelato
});
```

### Cart (client-side, Zustand — not persisted to DB)

```typescript
// types/cart.ts
export type CartItem = {
  id: string;                    // random uuid, client-generated
  photoSlug: string;
  photoTitle: string;
  photoDisplayUrl: string;       // web-optimised image URL
  productType: ProductType;
  frameOption?: FrameOption;
  personalisation?: string;      // postcard message
  priceCents: number;
};

// store/cart.ts
interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}
```

### Catalog (static, in code — no DB table)

The photo catalog is a static TypeScript object committed to the repo. It does not live in the database because:
- It changes infrequently (new photos are releases, not continuous updates)
- No need for a CMS for 8–20 items
- Type safety is useful for product configuration

```typescript
// lib/catalog.ts

export type ProductType =
  | 'postcard_a6'
  | 'print_a4_unframed'
  | 'print_a4_framed'
  | 'print_a3_unframed'
  | 'print_a3_framed'
  | 'sticker_pack';

export type FrameOption = 'black' | 'white';

export type Photo = {
  slug: string;
  title: string;
  location: string;
  description: string;          // 2–3 sentence Vyoman-voice description
  shotAt: string;               // e.g. "October 2026, 07:23, 80m altitude"
  displayImageUrl: string;      // web-optimised, served from R2 or /public
  printFileKey: string;         // R2 object key of the high-res print file
  aspectRatio: '3:2' | '2:3';  // determines orientation
  availableProducts: ProductType[];
  prices: Record<ProductType, number>; // price in cents
};

export const catalog: Photo[] = [
  {
    slug: 'vianden-castle-golden-hour',
    title: 'Vianden Castle',
    location: 'Vianden, Luxembourg',
    description: 'The old castle from the north ridge. Shot at 07:23 on a clear October morning as the first light crossed the valley. The forest below was still in shadow.',
    shotAt: 'October 2026 · 07:23 · 80m altitude',
    displayImageUrl: '/images/shop/vianden-castle.jpg',
    printFileKey: 'print-files/vianden-castle-300dpi.jpg',
    aspectRatio: '3:2',
    availableProducts: ['postcard_a6', 'print_a4_unframed', 'print_a4_framed', 'print_a3_unframed', 'print_a3_framed'],
    prices: {
      postcard_a6: 650,        // €6.50
      print_a4_unframed: 2200, // €22.00
      print_a4_framed: 5500,   // €55.00
      print_a3_unframed: 3500, // €35.00
      print_a3_framed: 7500,   // €75.00
      sticker_pack: 1200,      // €12.00
    },
  },
  // ... more photos
];
```

---

## API Routes

### `POST /api/checkout`

Called when the customer clicks "Pay" on the checkout page.

**Request body:**
```typescript
{
  items: Array<{
    photoSlug: string;
    productType: ProductType;
    frameOption?: FrameOption;
    personalisation?: string;
  }>;
  customerEmail: string;
  customerName: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
    country: string; // ISO 3166-1 alpha-2
  };
}
```

**Server actions:**
1. Validate all items against catalog (prices, availability)
2. Get Gelato shipping quote for the country + item list
3. Create an order record in DB with status `pending_payment`
4. Create a Stripe PaymentIntent with the total (subtotal + shipping)
5. Return `{ clientSecret, orderId }`

**Response:**
```typescript
{
  clientSecret: string; // Stripe PaymentIntent client secret
  orderId: string;      // UUID
  shippingCents: number;
  totalCents: number;
}
```

---

### `POST /api/stripe/webhook`

Stripe webhook — handles payment events.

**Events handled:**

`payment_intent.succeeded`:
1. Find order by `stripePaymentIntentId`
2. Update order status → `paid`
3. Trigger Gelato order placement (async — see below)
4. Send customer order confirmation email via Resend

`payment_intent.payment_failed`:
1. Update order status → `pending_payment` (customer can retry)

---

### `POST /api/shipping-quote`

Called client-side when the user selects their country in checkout.

**Request:** `{ country: string; items: CartItem[] }`

**Server action:**
1. Map cart items to Gelato product IDs
2. Call Gelato Quote API
3. Return shipping cost in cents

**Response:** `{ shippingCents: number; estimatedDays: number }`

---

### `POST /api/gelato/webhook`

Gelato webhook — handles fulfillment status events.

**Events handled:**

`order_status_updated`:
- Map Gelato status to internal status
- Update order in DB
- If `shipped`: send customer shipping notification email with tracking number/URL

---

## Gelato Integration

### Placing an order

```typescript
// lib/gelato/client.ts

const GELATO_API_BASE = 'https://order.gelatoapis.com';

export async function placeGelatoOrder(order: Order, items: OrderItem[]) {
  const gelatoItems = await Promise.all(items.map(async (item) => {
    // Generate print-ready files (front and back)
    const files = await getPrintFiles(item);

    return {
      itemReferenceId: item.id,
      productUid: item.gelatoProductId,
      files: files,  // [{ type: 'default', url: '...' }] for prints
                     // [{ type: 'front', url: '...' }, { type: 'back', url: '...' }] for postcards
      quantity: 1,
    };
  }));

  const response = await fetch(`${GELATO_API_BASE}/v3/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': process.env.GELATO_API_KEY!,
    },
    body: JSON.stringify({
      orderReferenceId: order.id,
      customerReferenceId: order.customerEmail,
      currency: 'EUR',
      items: gelatoItems,
      shipmentMethodUid: 'standard',
      shippingAddress: {
        firstName: order.customerName.split(' ')[0],
        lastName: order.customerName.split(' ').slice(1).join(' '),
        addressLine1: order.shippingAddress.line1,
        addressLine2: order.shippingAddress.line2,
        city: order.shippingAddress.city,
        postCode: order.shippingAddress.postalCode,
        country: order.shippingAddress.country,
        email: order.customerEmail,
      },
    }),
  });

  return response.json();
}
```

### Product UIDs (Gelato catalog IDs)

These must be verified against Gelato's live product catalog API before build.

```typescript
// lib/gelato/products.ts

export const GELATO_PRODUCT_UIDS: Record<ProductType, string> = {
  postcard_a6: 'cards_pf_a6_pt_350-gsm-gloss-coated_cl_4-4_hor',
  print_a4_unframed: 'poster_pf_a4_pt_170-gsm-enhanced-matte_cl_4-0',
  print_a4_framed: 'framed_poster_pf_a4_pt_170gsm_cl_4-0_fr_black',
  print_a3_unframed: 'poster_pf_a3_pt_170-gsm-enhanced-matte_cl_4-0',
  print_a3_framed: 'framed_poster_pf_a3_pt_170gsm_cl_4-0_fr_black',
  sticker_pack: 'sticker_pf_60x60_pt_gloss-uv_cl_4-0',
};

// Frame option variants — Gelato uses separate product UIDs per frame colour
export const GELATO_FRAMED_VARIANTS = {
  print_a4_framed: {
    black: 'framed_poster_pf_a4_pt_170gsm_cl_4-0_fr_black',
    white: 'framed_poster_pf_a4_pt_170gsm_cl_4-0_fr_white',
  },
  print_a3_framed: {
    black: 'framed_poster_pf_a3_pt_170gsm_cl_4-0_fr_black',
    white: 'framed_poster_pf_a3_pt_170gsm_cl_4-0_fr_white',
  },
};
```

### Postcard back generation

```typescript
// lib/gelato/postcard.ts

import sharp from 'sharp';

/**
 * Generate the postcard back image with personalisation text.
 * Returns a Buffer (PNG at 300 DPI, A6 = 1748 x 1240px landscape).
 */
export async function generatePostcardBack(
  message: string | undefined,
  photoTitle: string
): Promise<Buffer> {
  // Base template: static PNG in R2 or /public
  // Template has: Vyoman logo, stamp box, address box, photo title
  // Variable zone: left half, 800px wide, for the message text

  const templateBuffer = await getPostcardTemplate(); // fetch from R2 or filesystem

  if (!message) {
    return templateBuffer; // Plain postcard — no text compositing needed
  }

  // Render message text as SVG, composite onto template
  const svg = `
    <svg width="800" height="1240" xmlns="http://www.w3.org/2000/svg">
      <foreignObject width="800" height="1240">
        <div xmlns="http://www.w3.org/1999/xhtml"
             style="font-family: serif; font-size: 28px; padding: 60px;
                    color: #1a1a1a; line-height: 1.6; width: 680px;">
          ${escapeHtml(message)}
        </div>
      </foreignObject>
    </svg>
  `;

  return sharp(templateBuffer)
    .composite([{
      input: Buffer.from(svg),
      top: 0,
      left: 0,
    }])
    .png()
    .toBuffer();
}
```

The generated back PNG is uploaded to R2 (temporary, signed URL with 48-hour expiry), and that URL is passed to Gelato as the back-of-card file.

---

## Order Lifecycle

```
Customer adds items to cart
        ↓
Customer fills checkout (address, email)
        ↓
POST /api/shipping-quote → Gelato Quote API → return shipping cost
        ↓
POST /api/checkout:
  - Validate items
  - Create order in DB (status: pending_payment)
  - Create Stripe PaymentIntent
  - Return clientSecret to client
        ↓
Client: Stripe payment form collects card details
Client: stripe.confirmPayment() → Stripe processes card
        ↓
Stripe webhook: payment_intent.succeeded
  - Update order → status: paid
  - Generate print files (postcard backs via Sharp)
  - Upload files to R2
  - POST to Gelato API → place order
  - Update order → status: submitted_to_gelato, gelatoOrderId set
  - Send customer: order confirmation email (Resend)
        ↓
Gelato webhook: order_status_updated
  - status: in_production → update DB
  - status: shipped → update DB, trackingNumber, trackingUrl
  - Send customer: shipping notification email with tracking link (Resend)
        ↓
Package delivered (no webhook — Gelato marks delivered eventually)
```

---

## Email Templates (Resend)

### Order confirmation email

Subject: `Your Vyoman order #VY-{id} is confirmed`

```
[Vyoman logo]

Your order is confirmed.

Order #VY-{id}

[Item list with thumbnails]
Subtotal: €XX.XX
Shipping: €X.XX
Total: €XX.XX

Shipping to:
{customerName}
{address}

We'll email you when your order ships.
Usually 3–5 working days to Luxembourg, 5–7 days within the EU.

[Button: View the full collection →]

Vyoman · shop.vyomanaerials.com
```

### Shipping notification email

Subject: `Your Vyoman order is on its way`

```
[Vyoman logo]

Your order is on its way.

Order #VY-{id}

Tracking number: {trackingNumber}
[Button: Track your order →]

[Item list]

Vyoman · shop.vyomanaerials.com
```

---

## File Storage (Cloudflare R2)

Two buckets:

**`vyoman-shop-assets` (public read via CDN):**
- Web-optimised display images for the shop
- Path: `shop/{slug}/display.jpg` — 1200px wide, 85% quality JPEG
- Path: `shop/{slug}/thumb.jpg` — 400px wide thumbnail

**`vyoman-shop-print-files` (private — no public access):**
- High-resolution print source files
- Path: `print-files/{slug}-300dpi.jpg`
- Never exposed publicly — only referenced server-side when building Gelato orders

**Temporary postcard back files:**
- Path: `temp/postcard-backs/{orderId}-{itemId}-back.png`
- Uploaded at order placement time
- Gelato downloads them during production
- TTL: 48 hours (auto-delete)

---

## Environment Variables

```bash
# .env.local (never committed)

# Database
DATABASE_URL="postgresql://..."    # Neon serverless connection string

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."

# Gelato
GELATO_API_KEY="..."

# Resend
RESEND_API_KEY="..."
RESEND_FROM="shop@vyomanaerials.com"

# Cloudflare R2
R2_ACCOUNT_ID="..."
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."
R2_BUCKET_ASSETS="vyoman-shop-assets"
R2_BUCKET_PRINT_FILES="vyoman-shop-print-files"
R2_PUBLIC_URL="https://shop-assets.vyomanaerials.com"  # R2 custom domain

# App
NEXT_PUBLIC_BASE_URL="https://shop.vyomanaerials.com"
```

---

## MVP Scope

**In V1:**
- Static catalog (8 photos, committed to code)
- All product types: postcards, prints (framed/unframed), sticker packs
- Postcard personalisation (message on back)
- Stripe checkout (card, Apple Pay, Google Pay)
- Gelato fulfillment
- Order confirmation + shipping notification emails
- Mobile-responsive
- shop.vyomanaerials.com deployed on Vercel

**Not in V1:**
- Admin panel — use Gelato dashboard + Stripe dashboard + Neon console directly
- Order history / customer accounts
- Discount codes / promo codes
- Wholesale pricing
- Returns/refund flow (handled manually via email for V1 volume)
- Analytics (add Plausible in V2)
- B2B / bulk order form

---

## Deployment

**Vercel project:** `vyoman-shop`
- Branch `main` → production (shop.vyomanaerials.com)
- Branch `develop` → preview (shop-preview.vyomanaerials.com)
- Environment variables set in Vercel dashboard

**DNS (Cloudflare):**
- `shop.vyomanaerials.com` → CNAME → `cname.vercel-dns.com`
- `shop-assets.vyomanaerials.com` → CNAME → Cloudflare R2 custom domain

**Database (Neon):**
- Project: `vyoman-shop`
- Branch `main` → production connection string
- Run `drizzle-kit push` to apply migrations

**Gelato webhooks:** register at `https://shop.vyomanaerials.com/api/gelato/webhook`

**Stripe webhooks:** register at `https://shop.vyomanaerials.com/api/stripe/webhook`

---

## Luxembourg Business Registration Notes

Before accepting real payments, complete:
1. **Autorisation d'établissement** from Ministère des Classes Moyennes (guichet.lu — e-commerce/retail category)
2. **RCS registration** as travailleur indépendant
3. **Stripe business verification** — use Luxembourg business details
4. **VAT:** below €25,000/year threshold = franchise regime (no VAT charged, no quarterly filing). Keep an eye on this as revenue grows.

These are administrative prerequisites, not technical ones. The build can proceed in parallel.
