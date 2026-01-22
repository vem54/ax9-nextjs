/**
 * Axent Pipeline Type Definitions
 */

// ============================================
// TAOBAO TYPES (Raw data from API)
// ============================================

export interface TaobaoProduct {
  item_id: string;
  title: string;                    // Chinese
  description: string;              // Chinese HTML
  description_images: string[];     // Image URLs extracted from description HTML
  price: number;                    // CNY
  images: string[];                 // URLs
  skus: TaobaoSku[];
  shop_name: string;                // Chinese
  category?: string;
  category_path?: string;           // e.g., "女装/女士精品->毛衣"
}

export interface TaobaoSku {
  sku_id: string;
  price: number;                    // CNY
  stock: number;
  properties: {
    color: string;                  // Chinese
    size: string;                   // Chinese
  };
  image?: string;
}

// ============================================
// TRANSLATED/PROCESSED TYPES
// ============================================

export interface TranslatedProduct {
  title: string;                    // English, clean
  description: string;              // English
  vendor: string;                   // Brand name
  product_type: string;             // Category
  gender: 'Male' | 'Female' | 'Unisex';
  variants: TranslatedVariant[];
  original: TaobaoProduct;          // Keep reference
}

export interface TranslatedVariant {
  sku_id: string;
  size: string;                     // Standardized: XS, S, M, L, XL, etc.
  color: string;                    // English
  color_standardized: string;       // From standard color set
  price_cny: number;
  price_usd: number;
  stock: number;
  image?: string;
}

// ============================================
// SIZE CHART TYPES
// ============================================

export type SizeChartType = 'tops' | 'bottoms' | 'outerwear' | 'dresses' | 'shoes' | 'accessories';

export interface SizeChartMeasurement {
  size: string;                       // S, M, L, XL, etc. (or EU 40, US 7, etc. for shoes)
  // Common measurements (all in cm unless noted)
  length?: number;
  chest?: number;
  shoulder?: number;
  sleeve?: number;
  waist?: number;
  hip?: number;
  inseam?: number;
  bust?: number;
  // Shoe-specific
  eu_size?: number;
  us_size?: number;
  uk_size?: number;
  foot_length_cm?: number;
}

export interface ModelInfo {
  height_cm?: number;
  weight_kg?: number;
  bust_cm?: number;
  waist_cm?: number;
  hip_cm?: number;
  size_worn?: string;
}

export interface SizeChart {
  type: SizeChartType;                // Product type for frontend layout
  measurements: SizeChartMeasurement[];
  model_info?: ModelInfo;
  fit_notes?: string;                 // e.g., "Relaxed fit, size down for fitted look"
  source_image_url?: string;          // The image we extracted this from
}

// ============================================
// IMAGE PROCESSING TYPES
// ============================================

export type ImageClassification = 'delete' | 'remove' | 'fine';

export interface ClassifiedImage {
  url: string;
  classification: ImageClassification;
  reason?: string;
}

export interface ProcessedImage {
  original_url: string;
  processed_url: string;
  position: number;
  variant_colors?: string[];        // Which color variants this image belongs to
}

// ============================================
// FINAL PRODUCT (Ready for Shopify)
// ============================================

export interface FinalProduct {
  title: string;                    // Under 60 chars, no brand
  body_html: string;                // Structured HTML description
  vendor: string;
  product_type: string;
  tags: string[];
  variants: FinalVariant[];
  images: FinalImage[];
  metafields: {
    gender: string;
    colors: string[];
    size_chart?: SizeChart;
    materials?: string;               // e.g., "70% Alpaca, 30% Wool"
    care_instructions?: string;       // e.g., "Hand wash cold, lay flat to dry"
  };
}

export interface FinalVariant {
  option1: string;                  // Size
  option2: string;                  // Color
  price: string;                    // USD, string for Shopify
  sku: string;
  inventory_quantity: number;
  inventory_management: 'shopify';
}

export interface FinalImage {
  src: string;
  position: number;
  variant_colors?: string[];        // Colors this image belongs to (mapped to variant IDs in Shopify)
}

// ============================================
// SHOPIFY RESPONSE TYPES
// ============================================

export interface ShopifyProduct {
  id: number;
  admin_graphql_api_id: string;
  title: string;
  variants: ShopifyVariant[];
  images: ShopifyImage[];
}

export interface ShopifyVariant {
  id: number;
  product_id: number;
  title: string;
  option1: string;
  option2: string;
  price: string;
  sku: string;
}

export interface ShopifyImage {
  id: number;
  product_id: number;
  position: number;
  src: string;
  variant_ids: number[];
}

// ============================================
// PIPELINE TYPES
// ============================================

export interface PipelineResult {
  success: boolean;
  taobao_item_id: string;
  shopify_product_id?: number;
  shopify_url?: string;
  error?: string;
  processing_time_ms: number;
}

export interface QueueItem {
  item_id: string;
  shop_name?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  shopify_id?: number;
  error?: string;
}

// ============================================
// CONFIG TYPES
// ============================================

export interface Config {
  taobao: {
    appKey: string;
    appSecret: string;
    accessToken: string;
  };
  claude: {
    apiKey: string;
  };
  photoroom: {
    apiKey: string;
  };
  shopify: {
    store: string;
    accessToken: string;
  };
  markup: number;                   // Price multiplier (e.g., 2.0 for 2x)
}

// ============================================
// STANDARD COLOR SET
// ============================================

export const STANDARD_COLORS = [
  'Black',
  'White',
  'Blue',
  'Navy',
  'Red',
  'Green',
  'Yellow',
  'Orange',
  'Pink',
  'Purple',
  'Brown',
  'Beige',
  'Gray',
  'Gold',
  'Silver',
  'Bronze',
  'Rose Gold',
  'Multicolor',
  'Clear',
] as const;

export type StandardColor = typeof STANDARD_COLORS[number];
