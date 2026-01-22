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
