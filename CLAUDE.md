# AX9 Next.js - Axent E-Commerce

## SESSION PROTOCOL (READ THIS FIRST)

### At Session Start
1. Read this file (`CLAUDE.md`) for project context
2. Read `PROGRESS.md` for current status and pending tasks
3. Read `SESSIONS.md` for recent session history
4. Check `pipeline/.env` for current API token status (tokens expire in 24 hours)

### At Session End
1. Update `PROGRESS.md` with completed/pending items
2. Append session summary to `SESSIONS.md` with date and accomplishments
3. Note any expiring tokens or credentials that need refresh
4. Commit changes if significant work was done

---

## What This Is

A headless Shopify storefront for Axent, a curated Chinese fashion e-commerce brand. Built with Next.js 14 (App Router), Tailwind CSS, and Shopify Storefront API.

**Live Site:** https://ax9-nextjs.vercel.app/
**GitHub:** https://github.com/vem54/ax9-nextjs
**Shopify Store:** nextjsax9.myshopify.com

## Quick Start

```bash
npm install
npm run dev
```

## Credentials & Tokens

### Storefront API (for frontend)
```
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=nextjsax9.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=450ff915ffc5cc7479ac851c94b96885
```

### Admin API (for pipeline - tokens expire in 24 hours)
```
SHOPIFY_CLIENT_ID=<see pipeline/.env>
SHOPIFY_CLIENT_SECRET=<see pipeline/.env>
```

To refresh Admin API token:
```bash
curl -X POST "https://nextjsax9.myshopify.com/admin/oauth/access_token" \
  -d "grant_type=client_credentials&client_id=<CLIENT_ID>&client_secret=<CLIENT_SECRET>"
```

## Project Structure

```
app/                    # Next.js App Router pages
├── layout.tsx          # Root layout with Header/Footer
├── page.tsx            # Homepage
├── collections/[handle]# Collection pages
├── products/[handle]   # Product pages
├── cart/               # Cart page
├── search/             # Search page
├── account/            # Customer account pages
├── about/              # About page
└── contact/            # Contact page

components/
├── layout/             # Header, Footer, CartDrawer
├── product/            # ProductCard, ProductGrid, ProductGallery, etc.
├── collection/         # CollectionFilters
├── search/             # SearchForm
└── ui/                 # Button, Input

lib/
├── shopify/            # Shopify API client, queries, types
├── store/              # Zustand cart store
└── utils.ts            # Utility functions

pipeline/               # Product import pipeline (Taobao → Shopify)
├── src/
│   ├── index.ts        # Main entry point
│   ├── config.ts       # Environment config
│   ├── services/       # Taobao, Shopify, Claude, PhotoRoom
│   ├── prompts/        # Claude AI prompts
│   └── types/          # TypeScript types
└── .env                # API keys (Taobao, Claude, PhotoRoom, Shopify)

styles/
└── globals.css         # Tailwind + custom styles
```

## Design System

- **Colors**: Black (#000), White (#FFF), Gray-100 (#F5F5F5), Gray-500 (#737373)
- **Typography**: Inter font, sizes 11-48px
- **Spacing**: 8px grid (4, 8, 16, 24, 32, 48, 64px)
- **No rounded corners, no shadows, no animations**
- **Product images**: 3:4 aspect ratio

## Key Files

- `lib/shopify/client.ts` - Shopify Storefront API fetch wrapper
- `lib/shopify/queries.ts` - GraphQL queries/mutations
- `lib/store/cart.ts` - Zustand cart state management
- `tailwind.config.js` - Design tokens
- `pipeline/src/index.ts` - Product import pipeline

## Product Pipeline

Import products from Taobao to Shopify:
```bash
cd pipeline
npm install
npx tsx src/index.ts --item <TAOBAO_ITEM_ID>
```

Pipeline steps:
1. Fetch product from Taobao Global API
2. Convert currency (CNY → USD with 2x markup)
3. Translate with Claude AI
4. Extract size chart from images
5. Remove backgrounds with PhotoRoom
6. Upload to Shopify with variants and metafields
7. Publish to Headless sales channel

**Important:** After creating products via Admin API, they must be published to the "Nextjsax9 Headless" publication to be visible on the storefront.

## Brand Voice

- Confident, minimal, editorial
- Product descriptions: 25-35 words max
- No emojis, no hype, no purple prose

## Metafields

Products use these metafields:
- `custom.size_chart` - JSON size chart data
- `custom.materials` - Materials text
- `custom.care_instructions` - Care text

## Commands

```bash
# Next.js app
npm run dev     # Start dev server (localhost:3000)
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Run ESLint

# Pipeline
cd pipeline
npx tsx src/index.ts --item <ID>    # Import single product
npx tsx src/index.ts --test         # Test API connections
```

## Deployment

- **Hosting:** Vercel (auto-deploys from GitHub main branch)
- **Environment Variables:** Set in Vercel dashboard
- **To deploy:** Push to `main` branch on GitHub

```bash
git add .
git commit -m "description"
git push origin main
```

## Deploy/Push Process (Vercel + GitHub)

1) Stage and commit all changes (`git add .`, `git commit -m "..."`).
2) Push to GitHub (`git push origin main`).
3) Deploy to Vercel with CLI:
   - Install once: `npm install -g vercel`
   - From repo root: `vercel --prod --yes`
   - If prompted, ensure project is linked; `.vercel` is created and `.env.local` may be updated.
4) If the build fails, fix the error, re-commit, re-push, and re-run `vercel --prod --yes`.
5) Verify deploy: check live URLs and confirm expected UI changes or data.
