import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import {
  INITIAL_PRODUCTS,
  CATEGORIES,
  BRAND_DATA,
  STORE_INFO,
  FAQ_ITEMS,
  INITIAL_COUPONS,
  Product,
} from './src/data/sampleData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '64kb' }));

// Simple in-memory rate limiter per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 30;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  entry.count += 1;
  return true;
}

interface ChatHistoryTurn {
  role: 'user' | 'assistant';
  text: string;
}

interface RetrievalResult {
  matchedProducts: Product[];
  matchedCategories: string[];
  contextText: string;
}

function retrieveStoreContext(query: string, currentProductSlug?: string): RetrievalResult {
  const q = query.toLowerCase();

  // Check if user is asking about a specific current product or mentions a product name/brand
  let scoredProducts = INITIAL_PRODUCTS.map((p) => {
    let score = 0;
    const searchable = [
      p.title,
      p.shortTitle,
      p.brand,
      p.category,
      p.subcategory,
      p.shortDescription,
      p.description,
      ...p.skinTypes,
      ...p.concerns,
      ...p.ingredients,
      ...p.badges,
    ]
      .join(' ')
      .toLowerCase();

    if (currentProductSlug && p.slug === currentProductSlug) {
      score += 25;
    }

    // Exact brand or title match
    if (q.includes(p.brand.toLowerCase())) score += 15;
    if (q.includes(p.shortTitle.toLowerCase())) score += 20;
    if (q.includes(p.category.toLowerCase())) score += 10;
    if (q.includes(p.subcategory.toLowerCase())) score += 10;

    // Price filter detection ("under 1000", "under ₹1,000", "below 1000", "budget")
    const underMatch = q.match(/(?:under|below|less than)\s*₹?\s*([0-9,]+)/i);
    if (underMatch) {
      const maxPrice = parseInt(underMatch[1].replace(/,/g, ''), 10);
      if (!isNaN(maxPrice)) {
        if (p.price <= maxPrice) {
          score += 14;
        } else {
          score -= 20;
        }
      }
    }

    // Keyword matching
    const keywords = q
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2);

    for (const kw of keywords) {
      if (searchable.includes(kw)) score += 3;
      if (kw === 'moisturiser' || kw === 'moisturizer' || kw === 'cream' || kw === 'dry') {
        if (
          p.subcategory.toLowerCase().includes('moistur') ||
          p.title.toLowerCase().includes('cream') ||
          p.skinTypes.some((s) => s.toLowerCase().includes('dry'))
        ) {
          score += 8;
        }
      }
      if (kw === 'bestseller' || kw === 'bestsellers' || kw === 'popular' || kw === 'top') {
        if (p.isBestSeller) score += 7;
      }
      if (kw === 'routine' || kw === 'skincare' || kw === 'am' || kw === 'pm') {
        if (p.category === 'Skincare' || p.id === 'prod-combo-1') score += 6;
      }
      if (kw === 'hair' || kw === 'haircare' || kw === 'shampoo' || kw === 'frizz') {
        if (p.category === 'Haircare' || p.id === 'prod-combo-2') score += 10;
      }
      if (kw === 'combo' || kw === 'bundle' || kw === 'offer' || kw === 'offers') {
        if (p.isCombo || p.category === 'Combo Offers') score += 10;
      }
    }

    return { product: p, score };
  });

  scoredProducts.sort((a, b) => b.score - a.score);

  const topProducts = scoredProducts
    .filter((item) => item.score > 0)
    .slice(0, 6)
    .map((item) => item.product);

  const finalProducts =
    topProducts.length > 0
      ? topProducts
      : INITIAL_PRODUCTS.filter((p) => p.isBestSeller).slice(0, 4);

  const matchedCategories = Array.from(new Set(finalProducts.map((p) => p.category))).slice(0, 3);

  const catalogLines = INITIAL_PRODUCTS.map(
    (p) =>
      `- [ID: ${p.id}] "${p.title}" | Brand: ${p.brand} | Category: ${p.category} (${p.subcategory}) | Price: ₹${p.price} (MRP ₹${p.originalPrice}, ${p.discountPercent}% OFF) | Sizes: ${p.sizes.join(', ')} | Stock: ${p.stock > 0 ? `In Stock (${p.stock} units)` : 'Out of Stock'} | Skin/Hair Types: ${p.skinTypes.join(', ')} | Concerns: ${p.concerns.join(', ')} | Key Ingredients: ${p.ingredients.join(', ')} | How to Use: ${p.howToUse.join(' ')}`
  ).join('\n');

  const brandLines = BRAND_DATA.map((b) => `${b.name} (${b.tagline})`).join(', ');
  const couponLines = INITIAL_COUPONS.filter((c) => c.active)
    .map((c) => `${c.code}: ${c.description}`)
    .join(' | ');

  const contextText = `
VERIFIED STORE INFORMATION — DAZZLINGLOOKS.IN:
- Store Name: ${STORE_INFO.name} (${STORE_INFO.tagline})
- Physical Retail Store Location: ${STORE_INFO.retailStoreAddress}
- Store Timings: ${STORE_INFO.hours}
- Customer Support: Phone ${STORE_INFO.phone} | Email ${STORE_INFO.email} | WhatsApp QR available on website
- Shipping & Delivery Policy: ${STORE_INFO.shippingPolicy.summary} (${STORE_INFO.shippingPolicy.deliveryTimeline})
- Returns Policy: ${STORE_INFO.returnsPolicy.conditions} Non-returnable: ${STORE_INFO.returnsPolicy.nonReturnable}
- Authenticity Guarantee: ${STORE_INFO.authenticityGuarantee}
- Accepted Payment Methods: ${STORE_INFO.paymentMethods.join(', ')}
- Active Coupon Codes: ${couponLines}
- Featured Brands Carried: ${brandLines}

COMPLETE VERIFIED PRODUCT CATALOG (${INITIAL_PRODUCTS.length} PRODUCTS):
${catalogLines}
`.trim();

  return {
    matchedProducts: finalProducts,
    matchedCategories,
    contextText,
  };
}

function buildGroundedFallback(query: string, retrieval: RetrievalResult) {
  const q = query.toLowerCase();

  if (q.includes('where') && (q.includes('store') || q.includes('located') || q.includes('address') || q.includes('rajahmundry'))) {
    return {
      reply: `Our flagship **Dazzlinglooks.in Retail Store** is located at **${STORE_INFO.retailStoreAddress}**. We are open **${STORE_INFO.hours}**. You can visit us in person to explore authentic skincare, makeup, haircare, fragrances, and professional salon tools, or message us on WhatsApp for same-day local assistance.`,
      recommendedProductIds: ['prod-1', 'prod-2', 'prod-5'],
      suggestedCategories: ['Skincare', 'Makeup', 'Combo Offers'],
      followUpQuestions: [
        'Do you offer free delivery?',
        'Which skincare products are available?',
        'Show products under ₹1,000.',
      ],
    };
  }

  if (q.includes('free delivery') || q.includes('shipping') || q.includes('delivery')) {
    return {
      reply: `Yes! **Dazzlinglooks.in** offers **Free Delivery on orders of ₹2,500 and above** across Rajahmundry & Andhra Pradesh. For orders below ₹2,500, we charge a **Flat ₹99 Shipping fee**. Express 1–2 Day Delivery is also available at ₹99.`,
      recommendedProductIds: ['prod-combo-1', 'prod-1', 'prod-2'],
      suggestedCategories: ['Combo Offers', 'Skincare'],
      followUpQuestions: [
        'Where is the retail store located?',
        'Show products under ₹1,000.',
        'Which skincare products are available?',
      ],
    };
  }

  if (q.includes('under') && (q.includes('1000') || q.includes('1,000'))) {
    const under1000 = INITIAL_PRODUCTS.filter((p) => p.price <= 1000);
    return {
      reply: `Here are our verified **Dazzlinglooks.in products under ₹1,000**, all currently in stock:\n\n• **Cetaphil Gentle Skin Cleanser 500ml** — ₹899 (15% OFF, Dry/Sensitive Skin)\n• **Kay Beauty Matte Lipstick** — ₹799 (20% OFF, Long-Stay Matte)\n• **Minimalist 10% Niacinamide Serum 30ml** — ₹649 (7% OFF, Oily/Acne-Prone Skin)\n• **The Ordinary Hyaluronic Acid 2% + B5 30ml** — ₹999 (13% OFF, Plumping Hydration)\n• **Plum 3% Niacinamide & Rice Water Toner 200ml** — ₹550 (15% OFF)\n• **Mamaearth Vitamin C Face Wash 100ml** — ₹349 (12% OFF)\n• **RICA Avocado Butter Wax 400ml** — ₹950 (17% OFF)`,
      recommendedProductIds: under1000.slice(0, 4).map((p) => p.id),
      suggestedCategories: ['Skincare', 'Makeup', 'Personal Care'],
      followUpQuestions: [
        'Recommend a moisturiser for my skin type.',
        'What are the ingredients in Cetaphil Gentle Skin Cleanser?',
        'Suggest a simple AM/PM skincare routine.',
      ],
    };
  }

  if (q.includes('routine') || (q.includes('am') && q.includes('pm'))) {
    return {
      reply: `Here is a simple, dermatologist-backed **AM/PM Skincare Routine** using verified products available at Dazzlinglooks.in:\n\n**Morning (AM) Routine:**\n1. **Cleanse:** *Cetaphil Gentle Skin Cleanser 500ml* (₹899) — soap-free cleansing that protects your moisture barrier.\n2. **Tone & Prep:** *Plum 3% Niacinamide & Rice Water Toner 200ml* (₹550) — balances pH and refines pores.\n3. **Treat:** *Minimalist 10% Niacinamide Serum* (₹649, for oily/blemish-prone skin) or *The Ordinary Hyaluronic Acid 2% + B5* (₹999, for dehydrated skin).\n4. **Moisturise:** *CeraVe Moisturizing Cream 340g* (₹1,199) with 3 essential ceramides.\n\n**Evening (PM) Routine:**\n1. **Remove Makeup/SPF:** *Bioderma Sensibio H2O Micellar Water* (₹1,099) followed by *Cetaphil Gentle Skin Cleanser*.\n2. **Night Recovery:** *Estée Lauder Advanced Night Repair 50ml* (₹5,850) or *CeraVe Moisturizing Cream*.\n3. **Overnight Lip Care:** *Laneige Lip Sleeping Mask Berry 20g* (₹1,350).\n\n*Note: Always patch-test new skincare products. For persistent dermatological conditions, consult a certified dermatologist.*`,
      recommendedProductIds: ['prod-1', 'prod-9', 'prod-4', 'prod-2'],
      suggestedCategories: ['Skincare', 'Combo Offers'],
      followUpQuestions: [
        'Recommend a moisturiser for my skin type.',
        'Show products under ₹1,000.',
        'What are the ingredients in Cetaphil Gentle Skin Cleanser?',
      ],
    };
  }

  if (q.includes('moisturis') || q.includes('moisturiz') || q.includes('skin type')) {
    return {
      reply: `Based on our verified catalog, here are the best **moisturisers and hydrating formulas by skin type**:\n\n• **Dry to Very Dry & Sensitive Skin:** **CeraVe Moisturizing Cream 340g** (₹1,199) — formulated with 3 Essential Ceramides (NP, AP, EOP) and Hyaluronic Acid with 24-hour MVE hydration technology. You can also save 20% with our **Skincare Combo (Cetaphil + CeraVe)** at ₹1,899.\n• **Dehydrated / Combination / Oily Skin:** **The Ordinary Hyaluronic Acid 2% + B5 30ml** (₹999) — lightweight, oil-free water-based hydration with Pro-Vitamin B5.\n• **Dry & Chapped Lips:** **Laneige Lip Sleeping Mask Berry 20g** (₹1,350) — enriched with Berry Mix Complex, Shea Butter, and Coconut Oil.`,
      recommendedProductIds: ['prod-9', 'prod-combo-1', 'prod-11', 'prod-2'],
      suggestedCategories: ['Skincare', 'Combo Offers'],
      followUpQuestions: [
        'What are the ingredients in CeraVe Moisturizing Cream?',
        'Is Cetaphil Gentle Skin Cleanser currently in stock?',
        'Suggest a simple AM/PM skincare routine.',
      ],
    };
  }

  if (q.includes('haircare') || q.includes('shampoo') || q.includes('hair')) {
    return {
      reply: `Our bestselling **Haircare & Salon Styling** products currently in stock at Dazzlinglooks.in include:\n\n• **L'Oréal Professionnel Absolut Repair Gold Quinoa + Protein Shampoo 300ml** — ₹1,099 (15% OFF, repairs damaged & chemically treated hair)\n• **Haircare Combo (Shampoo + Conditioner + Hair Serum)** — ₹1,599 (Save 25% OFF MRP ₹2,099)\n• **IKONIC Professional Pro Titanium Shine Hair Straightener** — ₹3,499 (18% OFF, floating titanium plates 130°C–230°C)\n\nWe also stock **Schwarzkopf Professional** and **WishCare** at our store.`,
      recommendedProductIds: ['prod-6', 'prod-combo-2', 'prod-14'],
      suggestedCategories: ['Haircare', 'Salon Tools', 'Combo Offers'],
      followUpQuestions: [
        'Show products under ₹1,000.',
        'Do you offer free delivery?',
        'Where is the retail store located?',
      ],
    };
  }

  if (q.includes('ingredient')) {
    const target = retrieval.matchedProducts[0] || INITIAL_PRODUCTS[0];
    return {
      reply: `Here is the verified ingredient list for **${target.title}** (₹${target.price}, ${target.stock > 0 ? 'In Stock' : 'Out of Stock'}):\n\n**Key Ingredients:** ${target.ingredients.join(', ')}.\n\n**Key Benefits:**\n${target.keyBenefits.map((b) => `• ${b}`).join('\n')}\n\n*Cosmetic disclaimer: Please check individual ingredient sensitivities and patch-test before full application.*`,
      recommendedProductIds: [target.id, ...retrieval.matchedProducts.slice(1, 3).map((p) => p.id)],
      suggestedCategories: [target.category, 'Skincare'],
      followUpQuestions: [
        'Is this product currently in stock?',
        'Suggest a simple AM/PM skincare routine.',
        'Show products under ₹1,000.',
      ],
    };
  }

  if (q.includes('stock') || q.includes('available')) {
    const skincareProds = INITIAL_PRODUCTS.filter((p) => p.category === 'Skincare');
    return {
      reply: `All featured items in our **Dazzlinglooks.in** catalog are **100% authentic and currently in stock** for online delivery and in-store pickup at Thadithota, Rajahmundry:\n\n${skincareProds
        .slice(0, 6)
        .map(
          (p) =>
            `• **${p.title}** — **₹${p.price}** (${p.discountPercent}% OFF) · *In Stock (${p.stock} units)*`
        )
        .join('\n')}`,
      recommendedProductIds: retrieval.matchedProducts.slice(0, 4).map((p) => p.id),
      suggestedCategories: ['Skincare', 'Makeup', 'Haircare', 'Combo Offers'],
      followUpQuestions: [
        'Recommend a moisturiser for my skin type.',
        'Show products under ₹1,000.',
        'Do you offer free delivery?',
      ],
    };
  }

  return {
    reply: `Here are the top verified recommendations from **Dazzlinglooks.in** matching your query:\n\n${retrieval.matchedProducts
      .slice(0, 4)
      .map(
        (p) =>
          `• **${p.title}** (${p.brand}) — **₹${p.price}** *(MRP ₹${p.originalPrice}, ${p.discountPercent}% OFF)* · ${p.shortDescription}`
      )
      .join('\n')}\n\nEnjoy **Free Delivery on orders ₹2,500+** across Rajahmundry & Andhra Pradesh (or visit our store at Thadithota, Rajahmundry).`,
    recommendedProductIds: retrieval.matchedProducts.slice(0, 4).map((p) => p.id),
    suggestedCategories: retrieval.matchedCategories.length > 0 ? retrieval.matchedCategories : ['Skincare', 'Makeup'],
    followUpQuestions: [
      'Show products under ₹1,000.',
      'Recommend a moisturiser for my skin type.',
      'Do you offer free delivery?',
    ],
  };
}

app.post('/api/ai/chat', async (req, res) => {
  try {
    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      'unknown';

    if (!checkRateLimit(clientIp)) {
      res.status(429).json({
        error: 'Too many requests. Please wait a moment before sending another message.',
      });
      return;
    }

    const rawMessage = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
    const currentProductSlug =
      typeof req.body?.currentProductSlug === 'string' ? req.body.currentProductSlug.trim() : undefined;
    const rawHistory: ChatHistoryTurn[] = Array.isArray(req.body?.history)
      ? req.body.history.slice(-8)
      : [];

    if (!rawMessage) {
      res.status(400).json({ error: 'Please enter a question for Dazzling Beauty AI.' });
      return;
    }

    const sanitizedMessage = rawMessage.slice(0, 600);
    const retrieval = retrieveStoreContext(sanitizedMessage, currentProductSlug);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
      const fallback = buildGroundedFallback(sanitizedMessage, retrieval);
      const recommendedProducts = fallback.recommendedProductIds
        .map((id) => INITIAL_PRODUCTS.find((p) => p.id === id))
        .filter(Boolean);
      res.json({
        reply: fallback.reply,
        recommendedProducts,
        suggestedCategories: fallback.suggestedCategories,
        followUpQuestions: fallback.followUpQuestions,
        grounded: true,
      });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });

    const modelName = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

    const historyTranscript = rawHistory
      .map((turn) => `${turn.role === 'user' ? 'Customer' : 'Dazzling Beauty AI'}: ${String(turn.text).slice(0, 400)}`)
      .join('\n');

    const systemInstruction = `You are "Dazzling Beauty AI", the official personal beauty shopping assistant for Dazzlinglooks.in (Rajahmundry, Andhra Pradesh, India).

STRICT GROUNDING & ACCURACY RULES:
1. Answer ONLY using the VERIFIED STORE INFORMATION and COMPLETE VERIFIED PRODUCT CATALOG provided below.
2. NEVER invent or hallucinate products, prices, discounts, stock status, ingredients, clinical trials, certifications, or store policies.
3. If a customer asks about a product, brand, or detail that is NOT in the verified store data, politely state that this detail or product is not currently listed in the verified Dazzlinglooks.in catalog, and suggest the closest verified alternatives from the catalog.
4. Distinguish clearly between general cosmetic skincare tips and medical advice: never diagnose or claim to cure medical skin conditions (such as cystic acne, eczema, rosacea, or melasma); remind customers to patch-test and consult a dermatologist for medical concerns.
5. Keep your tone warm, refined, knowledgeable, and concise. Use ₹ (INR) for all prices.
6. Return valid JSON matching the requested schema. In "recommendedProductIds", include 1 to 4 exact product IDs (e.g. "prod-1", "prod-9") from the catalog that directly answer the customer's question.

${retrieval.contextText}`;

    const promptContent = `${
      historyTranscript ? `CONVERSATION SO FAR:\n${historyTranscript}\n\n` : ''
    }${
      currentProductSlug ? `CUSTOMER IS CURRENTLY VIEWING PRODUCT SLUG: ${currentProductSlug}\n` : ''
    }CUSTOMER QUESTION: ${sanitizedMessage}`;

    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: promptContent,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reply: {
                type: Type.STRING,
                description:
                  'Clear, helpful, grounded response using verified store products, prices in ₹, ingredients, stock status, and store policies.',
              },
              recommendedProductIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description:
                  'Up to 4 exact product IDs from the verified catalog (e.g., prod-1, prod-2, prod-9, prod-combo-1).',
              },
              suggestedCategories: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description:
                  '1 to 3 relevant category names from: Skincare, Makeup, Haircare, Fragrances, Salon Tools, Personal Care, Combo Offers.',
              },
              followUpQuestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '2 to 3 short follow-up questions the customer might ask next.',
              },
            },
            required: ['reply', 'recommendedProductIds', 'suggestedCategories', 'followUpQuestions'],
          },
        },
      });

      const rawJson = response.text;
      if (!rawJson) {
        throw new Error('Empty response from model');
      }
      const parsed = JSON.parse(rawJson);

      const validProducts = (
        Array.isArray(parsed.recommendedProductIds) ? parsed.recommendedProductIds : []
      )
        .map((id: string) => INITIAL_PRODUCTS.find((p) => p.id === id))
        .filter(Boolean);

      const finalProducts =
        validProducts.length > 0 ? validProducts : retrieval.matchedProducts.slice(0, 3);

      res.json({
        reply: parsed.reply || buildGroundedFallback(sanitizedMessage, retrieval).reply,
        recommendedProducts: finalProducts,
        suggestedCategories:
          Array.isArray(parsed.suggestedCategories) && parsed.suggestedCategories.length > 0
            ? parsed.suggestedCategories
            : retrieval.matchedCategories,
        followUpQuestions:
          Array.isArray(parsed.followUpQuestions) && parsed.followUpQuestions.length > 0
            ? parsed.followUpQuestions
            : [
                'Show products under ₹1,000.',
                'Recommend a moisturiser for my skin type.',
                'Do you offer free delivery?',
              ],
        grounded: true,
      });
    } catch (genaiError) {
      // Fallback to deterministic grounded RAG response if API key is invalid or quota exceeded
      const fallback = buildGroundedFallback(sanitizedMessage, retrieval);
      const recommendedProducts = fallback.recommendedProductIds
        .map((id) => INITIAL_PRODUCTS.find((p) => p.id === id))
        .filter(Boolean);

      res.json({
        reply: fallback.reply,
        recommendedProducts,
        suggestedCategories: fallback.suggestedCategories,
        followUpQuestions: fallback.followUpQuestions,
        grounded: true,
      });
    }
  } catch (err) {
    res.status(500).json({
      error: 'Unable to process your beauty question right now. Please try again.',
    });
  }
});

async function startServer() {
  const PORT = 3000;

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Dazzlinglooks.in server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
