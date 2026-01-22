/**
 * AI Prompts for the Pipeline
 *
 * All prompts are designed to return structured JSON.
 */

export const TRANSLATE_PROMPT = `You are a translator for Axent.store, a curated fashion platform bringing Chinese brands to Western consumers.

Translate and structure this product data from Chinese to English.

## INPUT DATA

Title: {{TITLE}}
Description: {{DESCRIPTION}}
Shop/Brand Name: {{SHOP_NAME}}
SKU Data:
{{SKUS}}

## STANDARD COLORS (map to these)
{{STANDARD_COLORS}}

## INSTRUCTIONS

1. Translate the title - remove any brand names, keep it descriptive
2. Translate the vendor/brand name to English (or romanize if it's a proper name)
3. Determine the product type/category (e.g., "Jacket", "T-Shirt", "Pants")
4. Determine target gender: Male, Female, or Unisex
5. For each SKU variant:
   - Translate size to standard: XXXS, XXS, XS, S, M, L, XL, XXL, XXXL, or specific measurements
   - Translate color to English
   - Map color to the closest standard color from the list

## SIZE TRANSLATIONS
- 均码 = One Size
- 加大 = Plus Size
- Numbers like 170/88A = use the first number as reference for S/M/L

## OUTPUT FORMAT (JSON only)

{
  "title": "Translated product title without brand",
  "description": "Brief English description",
  "vendor": "Brand Name in English",
  "product_type": "Category like Jacket, Pants, etc",
  "gender": "Male" | "Female" | "Unisex",
  "color_translations": [
    {
      "original": "灰-现货",
      "english": "Gray",
      "color_standardized": "Gray"
    }
  ]
}

Important: The color_translations array should map EACH unique color from the COLOR TRANSLATIONS NEEDED section below. Strip ordering/shipping info like "现货", "预售", "48小时内发货" etc from color names.

Return ONLY valid JSON, no other text.`;


export const CLASSIFY_IMAGE_PROMPT = `Analyze this product image and classify it.

## CLASSIFICATION OPTIONS

- "delete" - Image should NOT be used. Reasons:
  - Size chart or measurement diagram
  - Pure text or watermark-heavy
  - Model card or lookbook page (not actual product)
  - Blurry or low quality
  - Irrelevant (not the product)

- "remove" - Good product image but needs background removal:
  - Product on colored/patterned background
  - Product in lifestyle setting
  - Product with distracting background

- "fine" - Ready to use as-is:
  - Product on white or clean background
  - Clean product shot
  - No background removal needed

## OUTPUT FORMAT (JSON only)

{
  "classification": "delete" | "remove" | "fine",
  "reason": "Brief explanation"
}

Return ONLY valid JSON, no other text.`;


export const DESCRIBE_PRODUCT_PROMPT = `You are a copywriter for Axent.store. Write product descriptions that are factual first, stylish second.

## PRODUCT DATA

Title: {{TITLE}}
Brand: {{VENDOR}}
Category: {{PRODUCT_TYPE}}
Gender: {{GENDER}}
Colors: {{COLORS}}
Sizes: {{SIZES}}

## VERIFIED PRODUCT DETAILS

Materials: {{MATERIALS}}
Care: {{CARE_INSTRUCTIONS}}

## BRAND CONTEXT

{{BRAND_CONTEXT}}

## COPY STRUCTURE (20-35 words total)

**One paragraph. Facts with personality.**
- Lead with BRAND NAME + product type + key material
- Add 2-3 specific construction details (collar, closure, pockets, length)
- Use materials from VERIFIED section—never guess fabric content

**Fit line.**
- Format: "Fit: [Relaxed/Slim/Oversized/True to size] — [actionable tip]"

## EXAMPLES OF GOOD COPY

Example 1 (puffer jacket):
"Y Official's oversized puffer in 90% white duck down. Stand collar, batwing sleeves, cropped length. Fit: Oversized — size down for structured proportions."

Example 2 (knit cardigan):
"Flowery Bubble's relaxed cardigan in alpaca-blend knit. Ribbed collar, button-front closure, dropped shoulders. Fit: Relaxed — true to size for intended drape."

Example 3 (trousers):
"Oude Waag's pleated trousers in wool-blend suiting. High rise, tapered leg, side pockets. Fit: Relaxed through hip — size down for slimmer silhouette."

## WHAT TO AVOID
- Poetry and metaphors ("wearable armor", "spatial geometry", "blur the line")
- Design-school language ("exercise in", "exploration of", "redefines")
- Vague evocative fluff that says nothing concrete
- Words: timeless, elevate, stunning, perfect, essential, effortless
- More than 35 words in the description

## TITLE RULES
1. No brand name
2. Under 50 characters
3. Format: [Adjective] [Material/Style] [Product Type]
4. Examples: "Cropped Duck Down Puffer", "Ribbed Alpaca Cardigan", "Pleated Wool Trousers"

## OUTPUT FORMAT (JSON only)

{
  "title": "Cropped Duck Down Puffer",
  "description": "<p>{{VENDOR}}'s oversized puffer in 90% white duck down. Stand collar, batwing sleeves, cropped length.</p><p>Fit: Oversized — size down for structured proportions.</p>"
}

Return ONLY valid JSON.`;


export const EXTRACT_SIZE_CHART_PROMPT = `Analyze these product images from a Chinese fashion listing. Find and extract size chart information.

## YOUR TASK

1. Determine the product TYPE from the images (tops, bottoms, outerwear, dresses, shoes, accessories)
2. Identify which image(s) contain size chart data (measurements table, model info, fit guide)
3. Extract ALL measurements into structured data
4. Extract model information if present
5. Note any fit recommendations

## PRODUCT TYPE CLASSIFICATION

- "tops" = t-shirts, shirts, blouses, sweaters, cardigans, tank tops
- "bottoms" = pants, jeans, shorts, skirts
- "outerwear" = jackets, coats, blazers, vests
- "dresses" = dresses, jumpsuits, rompers
- "shoes" = sneakers, boots, heels, sandals, loafers
- "accessories" = bags, hats, scarves, belts, jewelry

## COMMON CHINESE TERMS

Measurements (tops/outerwear):
- 衣长 / 全长 = Length
- 胸围 = Chest/Bust
- 肩宽 = Shoulder width
- 袖长 = Sleeve length

Measurements (bottoms):
- 腰围 = Waist
- 臀围 = Hip
- 裤长 = Pants length
- 大腿围 = Thigh
- 内长 = Inseam

Measurements (dresses):
- 胸围 = Bust
- 腰围 = Waist
- 臀围 = Hip
- 裙长 / 衣长 = Length

Measurements (shoes):
- 脚长 = Foot length
- 欧码 / EU = EU size
- 美码 / US = US size
- 英码 / UK = UK size

Model info:
- 身高 = Height
- 体重 = Weight
- 三围 = Measurements (bust/waist/hip)
- 试穿 = Try-on / Size worn

Sizes:
- 均码 = One Size
- 模特码 = Model's size

## OUTPUT FORMAT (JSON only)

{
  "found_size_chart": true,
  "type": "tops",
  "measurements": [
    {
      "size": "S",
      "length": 59,
      "chest": 110,
      "shoulder": 58,
      "sleeve": 47
    },
    {
      "size": "M",
      "length": 61,
      "chest": 114,
      "shoulder": 59,
      "sleeve": 48
    }
  ],
  "model_info": {
    "height_cm": 172,
    "weight_kg": 48,
    "bust_cm": 75,
    "waist_cm": 58,
    "hip_cm": 88,
    "size_worn": "M"
  },
  "fit_notes": "Relaxed fit. Size down for a more fitted look.",
  "materials": "70% Alpaca, 30% Wool",
  "care_instructions": "Hand wash cold, lay flat to dry",
  "source_image_index": 0
}

## MEASUREMENT FIELDS BY TYPE

- tops/outerwear: length, chest, shoulder, sleeve
- bottoms: waist, hip, inseam, length
- dresses: bust, waist, hip, length
- shoes: eu_size, us_size, uk_size, foot_length_cm (use these field names)

Notes:
- All measurements in cm (except shoe sizes)
- "type" is REQUIRED - infer from the product images even if no size chart found
- If a measurement field is not found, omit it (don't include null)
- If no size chart found, return {"found_size_chart": false, "type": "tops"}

Return ONLY valid JSON, no other text.`;


export const METAFIELDS_PROMPT = `Given this product data, extract standardized metadata.

Colors in product: {{COLORS}}

## STANDARD COLORS (map each color to ONE of these)
Black, White, Blue, Navy, Red, Green, Yellow, Orange, Pink, Purple, Brown, Beige, Gray, Gold, Silver, Bronze, Rose Gold, Multicolor, Clear

## OUTPUT FORMAT (JSON only)

{
  "colors": ["Blue", "Black"],
  "gender": "Male" | "Female" | "Unisex"
}

Return ONLY valid JSON, no other text.`;
