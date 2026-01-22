# AX9 Next.js - Progress Tracker

## Completed

### Setup (Session 1 - 2026-01-22)
- [x] Next.js 14 project with App Router
- [x] TypeScript configuration
- [x] Tailwind CSS with Axent design tokens
- [x] ESLint configuration
- [x] Environment variables setup

### Shopify Integration
- [x] Storefront API client (`lib/shopify/client.ts`)
- [x] GraphQL queries for products, collections, cart, customers (`lib/shopify/queries.ts`)
- [x] TypeScript types for Shopify data (`lib/shopify/types.ts`)
- [x] Connected to `nextjsax9.myshopify.com` store
- [x] Headless channel configured with Storefront API token

### Layout Components
- [x] Header with navigation, mobile menu, and cart button
- [x] Footer with links and newsletter
- [x] CartDrawer slide-out

### UI Components
- [x] Button (primary/secondary/ghost variants with loading state)
- [x] Input with label, error, hint states
- [x] Textarea component
- [x] Skeleton components for loading states

### Product Components
- [x] ProductCard with image, vendor, title, price
- [x] ProductGrid (2/3/4 column layouts)
- [x] ProductGallery with thumbnails
- [x] VariantSelector for size/color selection
- [x] SizeChart modal
- [x] AddToCart button
- [x] ProductTabs (Description, Materials, Care)
- [x] ProductInfo wrapper component

### Pages
- [x] Homepage (editorial hero, category nav, new arrivals, collections, newsletter)
- [x] Collection listing page (`/collections`)
- [x] Collection page with filters and sorting (`/collections/[handle]`)
- [x] Virtual collections (all, new-arrivals, outerwear, tops, bottoms)
- [x] Product page with gallery, info, related products
- [x] Cart page with quantity controls and improved empty state
- [x] Search page with popular searches and improved empty state
- [x] Account login page
- [x] Account register page
- [x] Account dashboard with orders
- [x] About page
- [x] Contact page with form
- [x] 404 Not Found page

### Static Pages (Session 2 - 2026-01-22)
- [x] Shipping information (`/pages/shipping`)
- [x] Returns & Exchanges (`/pages/returns`)
- [x] Size Guide (`/pages/sizing`)
- [x] Privacy Policy (`/pages/privacy`)
- [x] Terms of Service (`/pages/terms`)

### State Management
- [x] Zustand cart store with persist middleware
- [x] Cart operations (add, update, remove)

### Deployment (Session 1 - 2026-01-22)
- [x] GitHub repository created (vem54/ax9-nextjs)
- [x] Vercel deployment configured
- [x] Environment variables set in Vercel
- [x] Live at https://ax9-nextjs.vercel.app/

### Product Pipeline (Session 1 - 2026-01-22)
- [x] Copied pipeline from axent project
- [x] Configured for nextjsax9 store
- [x] Admin API OAuth client credentials flow working
- [x] Successfully imported test product (Striped Wool Knit Cardigan)
- [x] Product published to Headless sales channel
- [x] Product visible on live site

### Site Scaffolding Overhaul (Session 2 - 2026-01-22)
- [x] Fixed all broken routes (was 9 broken links)
- [x] Editorial homepage redesign with split hero
- [x] Mobile-first header with hamburger menu
- [x] Proper category navigation
- [x] Loading skeleton components
- [x] Better empty states throughout
- [x] Refined Button/Input components with transitions
- [x] Updated globals.css with utilities

## Pending

### Pipeline Improvements
- [ ] Auto-publish to Headless channel after product creation
- [ ] Auto-refresh Admin API token (expires every 24 hours)
- [ ] Batch import multiple products

### Frontend Enhancements
- [ ] Error boundaries
- [ ] Predictive search (as-you-type)
- [ ] Collection filtering by vendor/price
- [ ] Wishlist functionality
- [ ] Recently viewed products

### SEO & Performance
- [ ] robots.txt
- [ ] sitemap.xml
- [ ] Meta tags optimization
- [ ] Image optimization audit

### Testing
- [ ] Test all cart operations end-to-end
- [ ] Test checkout flow
- [ ] Test account login/register
- [ ] Mobile responsiveness audit

### Products
- [ ] Import more products from Taobao (10-15 for real catalog)
- [ ] Set up proper collections in Shopify

### Future
- [ ] Custom domain setup
- [ ] Product reviews integration
- [ ] Email signup integration (Klaviyo/Mailchimp)
- [ ] Analytics (GA4, Shopify analytics)

## Known Issues

1. **Admin API Token Expiry**: Tokens expire every 24 hours. Must refresh using client credentials grant before running pipeline.

2. **Product Publishing**: Products created via Admin API are not automatically visible on Storefront API. Must publish to "Nextjsax9 Headless" publication.

## Notes

- Cart uses localStorage for persistence via Zustand persist middleware
- Customer auth tokens stored in localStorage (should move to httpOnly cookies for production)
- Images require `cdn.shopify.com` in `next.config.js` remotePatterns
- Pipeline uses Taobao Global API (distributor.taobao.global), not regular taobao.com
- Virtual collections (all, new-arrivals, outerwear, tops, bottoms) work without Shopify collections
- Pipeline excluded from Next.js build via tsconfig.json
