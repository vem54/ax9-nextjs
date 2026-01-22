# AX9 Next.js - Session History

## Session 1 - 2026-01-22

### Summary
Built complete Next.js headless Shopify storefront from scratch, deployed to Vercel, and imported first test product.

### Accomplishments

**Project Setup**
- Created Next.js 14 project with App Router, TypeScript, Tailwind CSS
- Configured design system matching Axent brand (Mr Porter/SSENSE inspired)
- Set up ESLint and project structure

**Shopify Integration**
- Created new Shopify store: `nextjsax9.myshopify.com`
- Set up Headless channel for Storefront API access
- Built GraphQL client with all product, collection, cart, and customer queries
- Fixed fragment duplication issues in GraphQL queries

**Components Built**
- Layout: Header, Footer, CartDrawer
- Product: ProductCard, ProductGrid, ProductGallery, VariantSelector, SizeChart, AddToCart, ProductTabs
- UI: Button, Input
- Collection: CollectionFilters
- Search: SearchForm

**Pages Built**
- Homepage with hero, collections grid, new arrivals
- Collection page with filters and sorting
- Product page with gallery, variant selector, size chart, related products
- Cart page with quantity controls
- Search page
- Account pages (login, register, dashboard)
- About and Contact pages
- 404 page

**Deployment**
- Initialized git repository
- Pushed to GitHub (vem54/ax9-nextjs)
- Deployed to Vercel: https://ax9-nextjs.vercel.app/
- Configured environment variables

**Product Pipeline**
- Copied Taobao→Shopify pipeline from axent project
- Configured for new store with OAuth client credentials
- Learned new Shopify Dev Dashboard (Jan 2026) uses client credentials grant instead of static tokens
- Successfully imported test product: "Striped Wool Knit Cardigan" (ID: 8744720564276)
- Published product to Headless sales channel
- Product now visible on live site

### Technical Discoveries

1. **Shopify Jan 2026 Changes**: Legacy custom apps deprecated. Must use Dev Dashboard with OAuth client credentials flow. Tokens expire in 24 hours.

2. **Admin API Token Refresh**:
   ```bash
   curl -X POST "https://nextjsax9.myshopify.com/admin/oauth/access_token" \
     -d "grant_type=client_credentials&client_id=XXX&client_secret=XXX"
   ```

3. **Product Publishing**: Products created via Admin API need to be explicitly published to the Headless publication to be visible via Storefront API.

4. **Headless Publication ID**: `gid://shopify/Publication/177086529588`

### Credentials Created
- Storefront API token: (see `.env.local`)
- Admin API client ID/secret: (see `pipeline/.env`)
- Admin API scopes: `write_products`, `write_inventory`, `write_publications`

### Files Modified
- All project files (new project)
- `CLAUDE.md` - Added session protocol
- `PROGRESS.md` - Updated with completed items
- `SESSIONS.md` - Created (this file)

### Next Session Priorities
1. Auto-publish products to Headless channel after creation
2. Import more products from Taobao
3. Test cart and checkout flow
4. Add loading states

---

## Session 2 - 2026-01-22

### Summary
Complete site scaffolding overhaul - fixed all 9 broken routes, redesigned homepage with editorial hero, added static pages, refined UI components.

### Accomplishments

**Phase 1: Fixed All Broken Routes**
- Created `/collections` listing page
- Added virtual collections system (all, new-arrivals, outerwear, tops, bottoms) that work without Shopify collections
- Created 5 static pages: shipping, returns, sizing, privacy, terms
- All 9 previously broken footer/header links now work

**Phase 2: Design System Refinements**
- Refined Button component with ghost variant, loading spinner, fullWidth prop
- Refined Input component with hint prop, added Textarea export
- Created Skeleton components for loading states (ProductCardSkeleton, ProductGridSkeleton, etc.)
- Updated globals.css with transitions, scrollbar-hide, link utilities

**Phase 3: Homepage Overhaul**
- Editorial split hero with featured product image on right
- Category navigation bar below hero
- Better collections grid with fallback for empty state
- Polished newsletter section with privacy link

**Phase 4: Component Polish**
- Header with proper hamburger menu for mobile
- All footer links now route to real pages
- Improved empty states (cart, search, collections)
- Better 404 page with two CTAs

**Phase 5: Verification**
- Built project successfully (17 routes)
- Pushed to GitHub, deployed to Vercel
- Verified all routes work on live site

### Technical Decisions

1. **Virtual Collections**: Instead of creating Shopify collections for category pages, implemented virtual collections in code. The `/collections/[handle]` route checks for known handles (all, new-arrivals, outerwear, tops, bottoms) and fetches products directly from Storefront API, filtering by productType where needed.

2. **Pipeline Exclusion**: Added `pipeline` to tsconfig.json exclude array to prevent build errors from pipeline's TypeScript code.

3. **Autonomous Protocol**: Updated global CLAUDE.md with new rules for autonomous execution and self-verification.

### Files Modified
- `app/page.tsx` - Editorial homepage redesign
- `app/cart/page.tsx` - Better empty state
- `app/search/page.tsx` - Popular searches, better empty state
- `app/not-found.tsx` - Two CTAs
- `app/collections/page.tsx` - NEW: Collections listing
- `app/collections/[handle]/page.tsx` - Virtual collections support
- `app/pages/shipping/page.tsx` - NEW
- `app/pages/returns/page.tsx` - NEW
- `app/pages/sizing/page.tsx` - NEW
- `app/pages/privacy/page.tsx` - NEW
- `app/pages/terms/page.tsx` - NEW
- `components/layout/Header.tsx` - Mobile menu
- `components/layout/Footer.tsx` - Corrected links
- `components/ui/Button.tsx` - Ghost variant, loading spinner
- `components/ui/Input.tsx` - Textarea, hints
- `components/ui/Skeleton.tsx` - NEW
- `styles/globals.css` - Utilities, transitions
- `tsconfig.json` - Exclude pipeline

### Next Session Priorities
1. Import more products from Taobao (10-15 for real catalog)
2. Create actual Shopify collections for better organization
3. Test cart and checkout flow end-to-end
4. Mobile responsiveness audit
5. Error boundaries

---

## Session 3 - 2026-01-22

### Summary
Delivered a blunt design/UX and frontend code quality review of the live site and Next.js codebase.

### Accomplishments
- Reviewed live site fundamentals for luxury alignment and conversion risks
- Audited App Router structure, Tailwind/CSS architecture, and core components
- Flagged accessibility/performance risks and missing luxury-grade elements

### Technical Discoveries
- None (review-only session)

### Files Modified
- `PROGRESS.md`
- `SESSIONS.md`

### Next Session Priorities
- Apply review fixes in UI/UX and component architecture

---

## Session 4 - 2026-01-22

### Summary
Validated the review for accuracy and reissued the final review.

### Accomplishments
- Re-checked live HTML and code references for review claims
- Confirmed issues and clarified animation rule conflict
- Stored review in REVIEW.md

### Technical Discoveries
- None (review-only session)

### Files Modified
- `PROGRESS.md`
- `SESSIONS.md`

### Next Session Priorities
- Apply review fixes in UI/UX and component architecture

---

## Session 5 - 2026-01-22

### Summary
Implemented critical fixes for currency context, cache freshness, PDP rendering, accessibility, and mobile hero imagery.

### Accomplishments
- Added Shopify country context variables across product and cart queries to enforce USD
- Added revalidation to reduce stale product and collection data
- Rendered PDP HTML safely for description content
- Implemented focus-visible styles and accessible dialog behavior
- Added mobile hero image block for visual first impression

### Technical Discoveries
- None

### Files Modified
- `lib/shopify/client.ts`
- `lib/shopify/queries.ts`
- `lib/store/cart.ts`
- `app/page.tsx`
- `app/products/[handle]/page.tsx`
- `app/collections/[handle]/page.tsx`
- `app/search/page.tsx`
- `components/product/ProductTabs.tsx`
- `components/layout/CartDrawer.tsx`
- `components/product/SizeChart.tsx`
- `components/ui/Button.tsx`
- `components/ui/Input.tsx`
- `styles/globals.css`
- `PROGRESS.md`
- `SESSIONS.md`

### Next Session Priorities
- Verify Shopify market settings for USD on live site
- Add route-level `loading.tsx`/`error.tsx` and tighten PDP trust content

---

## Session 6 - 2026-01-22

### Summary
Batch imported 14 Y OFFICIAL products, set up brand context system, and fixed Storefront API visibility issue.

### Accomplishments

**Product Import**
- Discovered Products.xlsx with 4,763 Taobao Item IDs (from Axent Shopify)
- Created batch-import.ts script for importing products by brand
- Imported 14 Y OFFICIAL products (sequential + parallel testing)
- Tested parallel imports: 3-5 concurrent is optimal, 10+ causes rate limiting

**Pipeline Fixes**
- Fixed protocol-relative URLs in taobao.ts (description images starting with `//`)
- Created publish-products.js to publish products to Headless channel via GraphQL

**Brand Context System**
- Created pipeline/brands/ folder
- Added y-official.md brand context file
- Copied flowery-bubble.md from axent project

**Cleanup**
- Deleted duplicate "Deconstructed Cotton Bomber Jacket" product

### Technical Discoveries

1. **Storefront API Visibility**: Products created via Admin API are NOT automatically visible via Storefront API. Must publish to Headless publication using GraphQL `publishablePublish` mutation.

2. **Rate Limits**: Running 10+ parallel imports causes ~40% failure rate. 3-5 concurrent is optimal.

3. **Products.xlsx Source**: Contains all Taobao Item IDs from Axent's existing catalog, mapped by brand/shop name.

### Files Modified
- `pipeline/batch-import.ts` - NEW
- `pipeline/publish-products.js` - NEW
- `pipeline/src/services/taobao.ts` - Fixed protocol-relative URLs
- `pipeline/brands/y-official.md` - NEW
- `pipeline/brands/flowery-bubble.md` - Copied from axent
- `PROGRESS.md`
- `SESSIONS.md`

### Next Session Priorities
1. Import more brands
2. Create brand context files before each import
3. Set up Shopify collections for brands

---

## Session 7 - 2026-01-22

### Summary
Improved performance and resiliency with next/font and app-level loading/error boundaries.

### Accomplishments
- Removed render-blocking font import and added Inter via next/font
- Added app-level `loading.tsx` and `error.tsx`

### Technical Discoveries
- None

### Files Modified
- `styles/globals.css`
- `app/layout.tsx`
- `app/loading.tsx`
- `app/error.tsx`
- `PROGRESS.md`
- `SESSIONS.md`

### Next Session Priorities
- Verify Shopify market settings for USD on live site
- Add PDP trust modules (shipping/returns/duties) near ATC

---

## Session 8 - 2026-01-22

### Summary
Added PDP trust module content aligned to axent.store policy messaging.

### Accomplishments
- Added shipping/returns/duties trust block near ATC on PDP

### Technical Discoveries
- Pulled shipping policy messaging from axent.store og:description

### Files Modified
- `components/product/ProductInfo.tsx`
- `PROGRESS.md`
- `SESSIONS.md`

### Next Session Priorities
- Verify Shopify market settings for USD on live site
- Tighten PDP hierarchy and typography rhythm

---

## Session 9 - 2026-01-22

### Summary
Refined PDP hierarchy and typography rhythm with richer content styling.

### Accomplishments
- Reworked PDP vendor/title/price hierarchy for stronger visual rhythm
- Added rich text styling for product description HTML
- Strengthened PDP trust module hierarchy

### Technical Discoveries
- None

### Files Modified
- `components/product/ProductInfo.tsx`
- `components/product/ProductTabs.tsx`
- `styles/globals.css`
- `PROGRESS.md`
- `SESSIONS.md`

### Next Session Priorities
- Verify Shopify market settings for USD on live site
- Tune PDP spacing/CTA alignment after design pass

---

## Session 10 - 2026-01-22

### Summary
Added PDP fit/sizing and composition/care blocks to improve purchase confidence.

### Accomplishments
- Added Fit and Sizing block with size guide and model info
- Added Composition and Care block using product metafields

### Technical Discoveries
- None

### Files Modified
- `components/product/ProductInfo.tsx`
- `PROGRESS.md`
- `SESSIONS.md`

### Next Session Priorities
- Verify Shopify market settings for USD on live site
- Run a PDP visual QA pass for spacing and CTA alignment

---

## Session 11 - 2026-01-22

### Summary
Verified live site currency and noted pending USD deployment.

### Accomplishments
- Checked live homepage and confirmed prices still render in THB

### Technical Discoveries
- Live site still serving old build; USD verification requires deploy

### Files Modified
- `PROGRESS.md`
- `SESSIONS.md`

### Next Session Priorities
- Deploy changes and re-check USD pricing on live site

---

*Template for future sessions:*

## Session N - YYYY-MM-DD

### Summary
[One-line summary]

### Accomplishments
- [Bullet points]

### Technical Discoveries
- [Any learnings]

### Files Modified
- [List of files]

### Next Session Priorities
- [What to work on next]
