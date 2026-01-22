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
