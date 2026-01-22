# AX9 Next.js - Axent E-Commerce

## What This Is

A headless Shopify storefront for Axent, a curated Chinese fashion e-commerce brand. Built with Next.js 14 (App Router), Tailwind CSS, and Shopify Storefront API.

## Quick Start

```bash
npm install
npm run dev
```

Update `.env.local` with your Shopify credentials:
```
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token
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
npm run dev     # Start dev server
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Run ESLint
```
