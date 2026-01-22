# AX9 Next.js Review

## Critical Issues (Ordered by Severity)

1) Wrong currency for Western market
Live pricing renders THB (homepage product card), which kills trust for US/EU buyers. Root is store currency, but it is surfaced via `formatPrice` in `lib/shopify/client.ts` and used in `components/product/ProductCard.tsx`.

2) Stale product/collection data
`shopifyFetch` defaults to `force-cache` with tags and no revalidation, so availability and price can be stale on PDP/PLP. References: `lib/shopify/client.ts`, `app/products/[handle]/page.tsx`, `app/collections/[handle]/page.tsx`, `app/page.tsx`.

3) PDP HTML rendering is broken
`descriptionHtml` is rendered as plain text, so HTML tags show. References: `components/product/ProductTabs.tsx`, `components/product/ProductInfo.tsx`.

4) Modal/drawer accessibility is non-compliant
No focus trap, no Escape-to-close, no dialog role or `aria-modal`. References: `components/layout/CartDrawer.tsx`, `components/product/SizeChart.tsx`.

5) Keyboard focus is effectively disabled
`outline-none` with no `focus-visible` styling; buttons lack visible focus cues. References: `styles/globals.css`, `components/ui/Input.tsx`, `components/ui/Button.tsx`.

6) Mobile hero is text-only
Hero image is hidden on mobile (`hidden lg:block`), so first view is generic text, not product visual. Reference: `app/page.tsx`.

## What Is Missing for Luxury-Grade

- Editorial visuals and narrative modules (lookbook, atelier, fabric origin).
- PDP storytelling: materials, fit notes, measurements, care, provenance above the fold.
- Trust layer: duties/taxes clarity, delivery window, returns visible near ATC.
- Distinct typographic system (display serif or refined grotesk pairing).

## Actionable Fixes (What/Where/Why)

- Render PDP HTML properly (use `dangerouslySetInnerHTML` or sanitized rich text). References: `components/product/ProductTabs.tsx`, `components/product/ProductInfo.tsx`. Why: raw HTML destroys perceived quality.
- Set product data freshness to `no-store` or short `revalidate` and use `revalidateTag`. References: `lib/shopify/client.ts`, `app/products/[handle]/page.tsx`, `app/collections/[handle]/page.tsx`. Why: prevent stale availability/pricing.
- Restore accessible focus (remove global outline suppression; add `focus-visible` rings). References: `styles/globals.css`, `components/ui/Input.tsx`, `components/ui/Button.tsx`. Why: WCAG compliance and keyboard usability.
- Make modal/drawer accessible (focus trap, Escape handling, dialog roles). References: `components/layout/CartDrawer.tsx`, `components/product/SizeChart.tsx`. Why: required for accessibility and polish.
- Add mobile hero imagery or reflow hero to include product image on small screens. Reference: `app/page.tsx`. Why: luxury needs immediate visual proof.

## Brand Alignment Notes (Western Luxury)

- Tone is value-framed ("No markup games") instead of luxury-framed; reads discount-adjacent. Reference: `app/page.tsx`.
- Visual hierarchy is flat; headings and body copy are too close in size/weight. References: `styles/globals.css`, `app/page.tsx`.
- Typography is generic (Inter everywhere) and undercuts MR PORTER/ATORIE aspiration. References: `styles/globals.css`, `tailwind.config.js`.

## Accessibility and Performance Risks

- Focus states missing; dialog semantics missing; no Escape handling. References: `styles/globals.css`, `components/layout/CartDrawer.tsx`, `components/product/SizeChart.tsx`.
- Render-blocking `@import` for Google Fonts; use `next/font` with preload. References: `styles/globals.css`, `app/layout.tsx`.
- No route-level `loading.tsx`/`error.tsx` for resilience. References: `components/ui/Skeleton.tsx`, `app/page.tsx`.

## Conversion Killers

- THB pricing for Western customers.
- Weak mobile hero (no product visual).
- PDP missing shipping/returns/duties at point of purchase.

## App Router / Layout / Tailwind Review

- App Router: correct choice; but missing `loading.tsx`/`error.tsx` lowers resilience.
- Layout/Routing: global layout is fine; `/pages/*` pathing is awkward for brand credibility and should be flattened.
- Tailwind/CSS: clean utility approach, but global `* { border-radius: 0 !important; }` is heavy-handed and font loading is suboptimal. Animations exist despite the "no animations" rule. References: `styles/globals.css`, `tailwind.config.js`.

## Minimal Praise

- Product imagery uses consistent 3:4 ratio and Next/Image sizing is correct. References: `components/product/ProductCard.tsx`, `components/product/ProductGallery.tsx`.
