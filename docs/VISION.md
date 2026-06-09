# Vyoman Shop — Vision Document

**Project:** shop.vyomanaerials.com
**Brand:** Vyoman · Sky in Sanskrit
**Owner:** Sameer Bhalerao
**Status:** Pre-build · June 2026

---

## The Problem

Luxembourg is one of the most photogenic countries in Europe and almost nobody knows it. Vianden Castle, the Grund gorge at golden hour, the Mullerthal's mossy rock formations, the Éislek Ardennes from 80 metres — these are extraordinary aerial perspectives that exist almost nowhere commercially. The postcard market here is two decades stale: the same five ground-level tourist board shots on glossy stock.

People who visit Luxembourg, live here, or left Luxembourg want to own a piece of it. They currently cannot buy something that looks like the country actually looks when seen properly.

---

## The Solution

A small, curated print shop built on Vyoman's aerial photography. Every product in the shop exists because Sameer flew it, composed it, and decided it was worth selling. No stock photography, no AI generation, no licensed imagery — just original aerial photography of Luxembourg and the places Vyoman has flown.

Products start from the accessible (a postcard for €6.50) and scale to the considered gift (an A3 framed print for €75). Postcards can be personalised — the customer adds a name and message that gets printed on the back before shipping. Prints are framed or unframed. Sticker packs are cheap enough to be impulse buys.

The backend is print-on-demand via Gelato. Sameer never touches the product. An order comes in, Stripe captures the payment, the order goes to Gelato's API, Gelato prints and ships from a European fulfillment centre. Margin is 65–80% on most products.

---

## Who Is This For

### Persona 1 — The Visitor
A tourist in Luxembourg for a long weekend. Has been to Vianden Castle, took photos on their phone, wants something to take home or send to family that looks better than what their phone captured. Budget: €5–15. Likely buys at the checkout moment — no deliberation. Postcard or sticker pack.

### Persona 2 — The Expat / Local
Someone who lives or has lived in Luxembourg and has emotional connection to specific places. Wants a print for their home or office. Bought once, may buy again for gifts. Budget: €20–75. More deliberate purchase — they know which location they want. Art print, likely framed.

### Persona 3 — The Gift Buyer
Someone outside Luxembourg (or inside) buying a considered gift for someone who has a connection to the country. Birthday, leaving present, housewarming. Wants something that feels personal. Budget: €15–60. Likely the customised postcard for lower spend, framed print for higher spend.

---

## What Makes This Different

**The photography is original and aerial.** A Vyoman shot of Vianden Castle from 60 metres at golden hour does not exist anywhere else for sale. This is not a print-on-demand dropship store reselling generic stock. Every image in the catalog was shot by Sameer on a DJI Mini 5 Pro, composed and graded by him, and belongs to Vyoman.

**It is curated, not a catalogue.** The shop starts with 8–12 hero images. Not every photo Sameer has taken — the ones that are genuinely extraordinary. This is intentional. A shop with 200 images is a gallery. A shop with 12 images is a collection.

**Personalisation without complexity.** The postcard customisation is one field: what do you want the back to say? No design tools, no canvas editor, no font choices. The customer types a message; we handle the rest. Simple enough to do on a phone.

---

## Business Model

**Revenue streams:**
- Product margin on each sale (65–80%)
- No subscription, no membership, no advertising

**Unit economics (approximate):**

| Product | Sell price | Gelato cost | Margin |
|---|---|---|---|
| A6 Postcard (custom message) | €6.50 | €1.20 | €5.30 (82%) |
| A4 Art Print, unframed | €22.00 | €4.50 | €17.50 (80%) |
| A4 Art Print, framed | €55.00 | €16.00 | €39.00 (71%) |
| A3 Art Print, unframed | €35.00 | €7.50 | €27.50 (79%) |
| A3 Art Print, framed | €75.00 | €22.00 | €53.00 (71%) |
| Sticker Pack (5 stickers) | €12.00 | €3.50 | €8.50 (71%) |

*Shipping charged to customer at Gelato's actual cost (passed through at cost, zero markup).*

**Revenue target (Year 1):** 20–30 orders per month = €400–900/month revenue, €300–700 margin. Modest but growing and passive. One post on LinkedIn or Instagram pointing to a new release drives 20–40 orders historically for comparable small print shops.

---

## Guiding Principles

1. **The photography is the product.** Every design and UX decision serves the image, not the other way around.
2. **Small and excellent beats large and mediocre.** 8 images done properly outperforms 80 images done quickly.
3. **No friction between wanting and buying.** The path from landing page to order confirmation should be under 3 minutes.
4. **Print-on-demand means zero inventory risk.** Never pre-print, never hold stock, never guess demand.
5. **Passive by design.** Once set up, the shop runs without Sameer's involvement per order. Time is better spent flying and shooting new content.

---

## Success Metrics

| Metric | 3-month target | 12-month target |
|---|---|---|
| Monthly orders | 10 | 30 |
| Monthly revenue | €200 | €700 |
| Conversion rate | 2% | 3% |
| Catalog size | 8 images | 20 images |
| Customer repeat rate | — | 15% |
| Average order value | €20 | €25 |

---

## Out of Scope (V1)

- Wholesale / bulk orders
- B2B (corporate gifts, hotel partnerships) — V2
- Physical stockists / consignment — V2
- Non-Luxembourg locations — V2 (once catalog depth justifies it)
- Gift wrapping or handwritten notes
- Subscription boxes
- NFTs
