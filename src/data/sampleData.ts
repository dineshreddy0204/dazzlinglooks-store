export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  verified: boolean;
  title: string;
  comment: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  brand: string;
  category:
    | 'Skincare'
    | 'Makeup'
    | 'Haircare'
    | 'Fragrances'
    | 'Salon Tools'
    | 'Personal Care'
    | 'Combo Offers';
  subcategory: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  gallery: string[];
  sizes: string[];
  defaultSize: string;
  skinTypes: string[];
  concerns: string[];
  badges: string[];
  stock: number;
  sku: string;
  shortDescription: string;
  description: string;
  keyBenefits: string[];
  ingredients: string[];
  howToUse: string[];
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isDeal?: boolean;
  isCombo?: boolean;
  reviews: ProductReview[];
}

export interface CategoryInfo {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  badge?: string;
}

export interface BrandInfo {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  origin: string;
  description: string;
  logoUrl: string;
}

export interface CouponCode {
  id: string;
  code: string;
  discountType: 'Percentage' | 'Flat';
  discountValue: number;
  minOrder: number;
  description: string;
  active: boolean;
  usedCount: number;
}

export interface SampleOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  date: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Pending' | 'COD Pending';
  fulfilmentStatus: 'Delivered' | 'Shipped' | 'Processing';
  items: {
    productName: string;
    brand: string;
    size: string;
    qty: number;
    price: number;
  }[];
}

export const STORE_INFO = {
  name: 'Dazzlinglooks.in',
  tagline: 'Beauty Begins Here',
  subtitle: 'Your Complete Beauty Destination — Authentic Brands | Genuine Products | Real Results',
  retailStoreAddress: 'Thadithota, Rajahmundry, Andhra Pradesh - 533103',
  phone: '+91 90XXXXXXXX',
  email: 'support@dazzlinglooks.in',
  hours: 'Mon - Sat: 10AM - 8PM',
  shippingPolicy: {
    freeThreshold: 2500,
    standardFee: 99,
    expressFee: 99,
    regions: 'Across Rajahmundry & Andhra Pradesh (with pan-India courier support)',
    deliveryTimeline: '1–2 Days Express in Rajahmundry & AP; 3–5 Business Days Standard Delivery',
    summary:
      'Free Delivery on orders ₹2,500+ across Rajahmundry & Andhra Pradesh. Flat ₹99 Shipping on orders below ₹2,500. Express Delivery (1-2 Days) available for ₹99.',
  },
  returnsPolicy: {
    windowDays: 7,
    conditions:
      'Easy 7-day hassle-free returns or replacements for damaged, defective, wrong, or expired items delivered. Products must be unused, unsealed, and in original packaging with invoice and batch tags intact.',
    nonReturnable:
      'Opened lipsticks, used cosmetics, unsealed skincare serums, and personal grooming tools cannot be returned for hygiene reasons unless received damaged.',
  },
  authenticityGuarantee:
    '100% Authentic Products sourced directly from authorized brand distributors and official importers with batch code verification.',
  paymentMethods: [
    'UPI (Google Pay, PhonePe, Paytm)',
    'Credit / Debit Card (VISA, Mastercard, RuPay)',
    'Net Banking',
    'Cash on Delivery (COD)',
  ],
};

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'cat-1',
    name: 'Skincare',
    slug: 'skincare',
    description: 'Dermatologist-trusted cleansers, serums, moisturisers, toners, and sunscreens.',
    imageUrl: '/assets/v2/cat_skincare.png',
  },
  {
    id: 'cat-2',
    name: 'Makeup',
    slug: 'makeup',
    description: 'High-pigment lipsticks, studio compacts, foundations, and eye makeup.',
    imageUrl: '/assets/v2/cat_makeup.png',
  },
  {
    id: 'cat-3',
    name: 'Haircare',
    slug: 'haircare',
    description: 'Professional salon shampoos, masks, serums, and scalp treatments.',
    imageUrl: '/assets/v2/cat_haircare.png',
  },
  {
    id: 'cat-4',
    name: 'Fragrances',
    slug: 'fragrances',
    description: 'Luxury Eau de Toilette, Eau de Parfum, and signature body mists.',
    imageUrl: '/assets/v2/cat_fragrances.png',
  },
  {
    id: 'cat-5',
    name: 'Salon Tools',
    slug: 'salon-tools',
    description: 'Professional hair dryers, straighteners, curlers, and salon styling equipment.',
    imageUrl: '/assets/v2/cat_salontools.png',
  },
  {
    id: 'cat-6',
    name: 'Personal Care',
    slug: 'personal-care',
    description: 'Daily body lotions, waxing essentials, bath care, and hygiene staples.',
    imageUrl: '/assets/v2/cat_personalcare.png',
  },
  {
    id: 'cat-7',
    name: 'Combo Offers',
    slug: 'combo-offers',
    description: 'Value-packed skincare, haircare, and makeup routines at up to 30% OFF.',
    imageUrl: '/assets/v2/cat_combo.png',
  },
  {
    id: 'cat-8',
    name: 'New Arrivals',
    slug: 'new-arrivals',
    description: 'Newly launched global & Indian beauty favourites now in stock at Rajahmundry.',
    imageUrl: '/assets/v2/cat_newarrivals.png',
    badge: 'NEW',
  },
];

export const BRAND_DATA: BrandInfo[] = [
  {
    id: 'br-1',
    name: 'Beautybuzz',
    slug: 'beautybuzz',
    tagline: 'Professional Salon & Beauty Essentials',
    origin: 'India',
    description: 'Curated salon essentials and professional beauty care trusted by stylists.',
    logoUrl: '/assets/v2/brand_beautybuzz.png',
  },
  {
    id: 'br-2',
    name: 'IKONIC Professional',
    slug: 'ikonic-professional',
    tagline: 'For Salon-Like Results at Home',
    origin: 'India / Global',
    description: 'Leading professional hair styling tools including ceramic straighteners, blow dryers, and curlers.',
    logoUrl: '/assets/v2/brand_ikonic.png',
  },
  {
    id: 'br-3',
    name: 'Schwarzkopf Professional',
    slug: 'schwarzkopf',
    tagline: 'Professional Haircare Authority',
    origin: 'Germany',
    description: 'Salon-grade shampoos, Bonacure treatments, and OSiS+ styling innovations.',
    logoUrl: '/assets/v2/brand_schwarzkopf.png',
  },
  {
    id: 'br-4',
    name: 'JOVEES Herbal',
    slug: 'jovees-herbal',
    tagline: 'Ayurvedic & Herbal Skincare Science',
    origin: 'India',
    description: 'Natural botanical face washes, sunscreens, and herbal facial kits for Indian skin.',
    logoUrl: '/assets/v2/brand_jovees.png',
  },
  {
    id: 'br-5',
    name: 'Shahnaz Husain',
    slug: 'shahnaz-husain',
    tagline: 'Pioneering Ayurvedic Beauty Care',
    origin: 'India',
    description: 'Iconic gold facial kits, herbal cleansers, and botanical beauty formulations.',
    logoUrl: '/assets/v2/brand_shahnaz.png',
  },
  {
    id: 'br-6',
    name: 'RICA WAX',
    slug: 'rica-wax',
    tagline: 'Responsible Beauty & Liposoluble Wax',
    origin: 'Italy',
    description: 'Colophony-free Italian waxing solutions enriched with nourishing plant oils.',
    logoUrl: '/assets/v2/brand_ricawax.png',
  },
  {
    id: 'br-7',
    name: 'TWACHA',
    slug: 'twacha',
    tagline: 'Dermatological Skin & Hair Solutions',
    origin: 'India',
    description: 'Targeted clinical formulations crafted for barrier repair and clear skin.',
    logoUrl: '/assets/v2/brand_twacha.png',
  },
  {
    id: 'br-8',
    name: 'M.A.C',
    slug: 'mac',
    tagline: 'All Ages, All Races, All Genders',
    origin: 'USA / Canada',
    description: 'World-renowned studio makeup authority featuring Studio Fix compacts, foundations, and iconic lipsticks.',
    logoUrl: '/assets/v2/brand_mac.png',
  },
  {
    id: 'br-9',
    name: 'Forever52',
    slug: 'forever52',
    tagline: 'Daily Life Forever52 Professional Makeup',
    origin: 'UAE / India',
    description: 'High-coverage concealers, eyeshadow palettes, and long-wear bridal makeup.',
    logoUrl: '/assets/v2/brand_forever52.png',
  },
  {
    id: 'br-10',
    name: 'N+ Professional',
    slug: 'n-plus-professional',
    tagline: 'Advanced Salon Facial & Cleanup Care',
    origin: 'India',
    description: 'Brightening salon facials, detan packs, and professional skin treatments.',
    logoUrl: '/assets/v2/brand_nplus.png',
  },
  {
    id: 'br-11',
    name: 'Foxtale',
    slug: 'foxtale',
    tagline: 'Efficacy-First Skincare for Indian Skin',
    origin: 'India',
    description: 'High-performing vitamin C serums, hydrating cleansers, and barrier-loving sunscreens.',
    logoUrl: '/assets/v2/brand_foxtale.png',
  },
  {
    id: 'br-12',
    name: "Nature's Essence",
    slug: 'natures-essence',
    tagline: 'Nature-Powered Everyday Beauty',
    origin: 'India',
    description: 'Trusted detan packs, lacto tan clear, and glow facial kits.',
    logoUrl: '/assets/v2/brand_natures.png',
  },
  {
    id: 'br-13',
    name: 'Cetaphil',
    slug: 'cetaphil',
    tagline: 'Dermatologist Recommended Sensitive Skincare',
    origin: 'USA / Galderma',
    description: 'Clinically proven gentle cleansers and moisturisers for sensitive and dry skin.',
    logoUrl: '/assets/v2/brand_cetaphil.png',
  },
  {
    id: 'br-14',
    name: 'CeraVe',
    slug: 'cerave',
    tagline: 'Developed with Dermatologists — 3 Essential Ceramides',
    origin: 'USA',
    description: 'Barrier-restoring moisturising creams, foaming cleansers, and MVE hydration technology.',
    logoUrl: '/assets/v2/brand_cerave.png',
  },
  {
    id: 'br-15',
    name: 'WishCare',
    slug: 'wishcare',
    tagline: 'Clean, Science-Backed Hair & Skin Care',
    origin: 'India',
    description: 'Bestselling Hair Growth Serum Concentrate, niacinamide body lotions, and lip balms.',
    logoUrl: '/assets/v2/brand_wishcare.png',
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    slug: 'cetaphil-gentle-skin-cleanser-500ml',
    title: 'Cetaphil Gentle Skin Cleanser 500ml',
    shortTitle: 'Cetaphil Gentle Skin Cleanser 500ml',
    brand: 'Cetaphil',
    category: 'Skincare',
    subcategory: 'Cleansers',
    price: 899,
    originalPrice: 1050,
    discountPercent: 15,
    rating: 4.8,
    reviewCount: 152,
    imageUrl: '/assets/v2/prod_cetaphil.png',
    gallery: [
      '/assets/v2/prod_cetaphil.png',
      '/assets/v2/prod_cerave_cream.png',
      '/assets/v2/prod_bioderma.png',
    ],
    sizes: ['500ml', '250ml', '125ml'],
    defaultSize: '500ml',
    skinTypes: ['Dry', 'Normal', 'Sensitive', 'Combination'],
    concerns: ['Dryness', 'Sensitivity', 'Barrier Repair'],
    badges: ['15% OFF', 'BESTSELLER', '100% Authentic'],
    stock: 42,
    sku: 'DL-CET-500',
    shortDescription:
      'Mild, soap-free formula that cleanses without irritation. Clinically proven to hydrate while cleansing and protect the natural skin barrier.',
    description:
      'Cetaphil Gentle Skin Cleanser is a dermatologist-recommended, soap-free daily cleanser formulated for dry to normal, sensitive skin. Powered by a blend of Niacinamide (Vitamin B3), Panthenol (Pro-Vitamin B5), and hydrating Glycerin, it gently removes dirt, makeup, and impurities while preserving the natural skin moisture barrier.',
    keyBenefits: [
      'Clinically proven to hydrate continuously while cleansing without stripping skin oils',
      'Defends against 5 signs of skin sensitivity: dryness, irritation, roughness, tightness, and weakened barrier',
      'Soap-free, fragrance-free, paraben-free, and non-comedogenic (will not clog pores)',
      'Suitable for daily face and body cleansing across all ages',
    ],
    ingredients: [
      'Aqua (Purified Water)',
      'Glycerin',
      'Cetearyl Alcohol',
      'Panthenol (Pro-Vitamin B5)',
      'Niacinamide (Vitamin B3)',
      'Pantolactone',
      'Xanthan Gum',
      'Sodium Cocoyl Isethionate',
      'Sodium Benzoate',
      'Citric Acid',
    ],
    howToUse: [
      'With water: Apply cleanser to the skin and gently massage. Rinse thoroughly and pat dry.',
      'Without water: Apply a liberal amount of cleanser to the skin and massage gently. Remove excess with a soft cloth, leaving a thin transparent film on the skin.',
      'Follow with Cetaphil or CeraVe Moisturizing Cream for long-lasting hydration.',
    ],
    isBestSeller: true,
    isDeal: true,
    reviews: [
      {
        id: 'rev-1',
        author: 'Lakshmi Prasanna (Rajahmundry)',
        rating: 5,
        date: '14 Oct 2026',
        verified: true,
        title: 'Genuine 500ml pump bottle from Dazzlinglooks!',
        comment:
          'Picked this up from Dazzlinglooks.in and received same-day delivery in Thadithota. Completely authentic batch code and super soothing on my sensitive skin.',
      },
      {
        id: 'rev-2',
        author: 'Sravani K.',
        rating: 5,
        date: '02 Oct 2026',
        verified: true,
        title: 'Best daily cleanser recommended by my dermatologist',
        comment:
          'Never dries out my face even in AC rooms. The 500ml pack lasts almost 4 months.',
      },
    ],
  },
  {
    id: 'prod-2',
    slug: 'laneige-lip-sleeping-mask-20g',
    title: 'Laneige Lip Sleeping Mask Berry 20g',
    shortTitle: 'Laneige Lip Sleeping Mask 20g',
    brand: 'Laneige',
    category: 'Skincare',
    subcategory: 'Lip Care',
    price: 1350,
    originalPrice: 1500,
    discountPercent: 10,
    rating: 4.9,
    reviewCount: 98,
    imageUrl: '/assets/v2/prod_laneige.png',
    gallery: ['/assets/v2/prod_laneige.png', '/assets/v2/prod_cetaphil.png'],
    sizes: ['20g', '8g'],
    defaultSize: '20g',
    skinTypes: ['All Skin Types', 'Dry', 'Sensitive'],
    concerns: ['Dryness', 'Chapped Lips', 'Dullness'],
    badges: ['10% OFF', 'BESTSELLER'],
    stock: 28,
    sku: 'DL-LAN-20G',
    shortDescription:
      'Leave-on overnight lip mask powered by Berry Mix Complex, Vitamin C, and Coconut Oil for soft, supple lips by morning.',
    description:
      'Laneige Lip Sleeping Mask in Berry intensely nourishes and softens dry, flaky lips overnight. Featuring Berry Mix Complex rich in Vitamin C and antioxidants, plus Moisture Wrap technology with hyaluronic acid and minerals, it locks in hydration for 8 full hours.',
    keyBenefits: [
      'Melts away dead skin cells on lips overnight for smooth lipstick application',
      'Enriched with Berry Mix Complex, Vitamin C, Shea Butter, and Coconut Oil',
      'Includes hygienic silicone applicator wand in the 20g full-size jar',
    ],
    ingredients: [
      'Diisostearyl Malate',
      'Hydrogenated Polyisobutene',
      'Shea Butter (Butyrospermum Parkii)',
      'Cocos Nucifera (Coconut) Oil',
      'Ascorbic Acid (Vitamin C)',
      'Rubus Idaeus (Raspberry) Fruit Extract',
      'Sodium Hyaluronate',
    ],
    howToUse: [
      'Before going to bed, apply a generous layer across clean lips using the included spatula.',
      'Gently wipe off any excess the next morning with a tissue or cotton pad.',
    ],
    isBestSeller: true,
    isNewArrival: true,
    reviews: [
      {
        id: 'rev-3',
        author: 'Anusha Reddy',
        rating: 5,
        date: '11 Oct 2026',
        verified: true,
        title: 'Woke up with the softest lips!',
        comment: 'Original Korean import with sealed box and spatula. Smells divine.',
      },
    ],
  },
  {
    id: 'prod-3',
    slug: 'kay-beauty-matte-lipstick',
    title: 'Kay Beauty Matte Drama Long Stay Lipstick',
    shortTitle: 'Kay Beauty Matte Lipstick',
    brand: 'Kay Beauty',
    category: 'Makeup',
    subcategory: 'Lips',
    price: 799,
    originalPrice: 999,
    discountPercent: 20,
    rating: 4.7,
    reviewCount: 76,
    imageUrl: '/assets/v2/prod_kay_lipstick.png',
    gallery: ['/assets/v2/prod_kay_lipstick.png', '/assets/v2/prod_mac_compact.png'],
    sizes: ['4.2g - Debut', '4.2g - Red Carpet', '4.2g - Snapshot'],
    defaultSize: '4.2g - Debut',
    skinTypes: ['All Skin Types'],
    concerns: ['Long Wear', 'Hydration'],
    badges: ['20% OFF', 'BESTSELLER'],
    stock: 35,
    sku: 'DL-KAY-LIP',
    shortDescription:
      'High-impact plush matte lipstick infused with Grapeseed Oil and Red Raspberry for weightless 12-hour comfort.',
    description:
      'Kay Beauty Matte Drama Long Stay Lipstick delivers one-stroke intense matte payoff without drying or cracking lips. Enriched with skin-loving Grapeseed Oil and antioxidant-rich Red Raspberry extract, it flatters every Indian skin undertone.',
    keyBenefits: [
      'One-swipe rich pigment with a velvety, non-drying matte finish',
      'Enriched with Grapeseed Oil and Red Raspberry to keep lips nourished',
      'Transfer-resistant, smudge-proof wear for up to 12 hours',
    ],
    ingredients: [
      'Isononyl Isononanoate',
      'Silica',
      'Vitis Vinifera (Grape) Seed Oil',
      'Rubus Idaeus (Raspberry) Seed Oil',
      'Tocopheryl Acetate (Vitamin E)',
      'Iron Oxides (CI 77491, CI 77492)',
    ],
    howToUse: [
      'Start from the cupid’s bow and glide outward toward the corners of your lips.',
      'Fill in the bottom lip in one smooth stroke for full matte drama.',
    ],
    isBestSeller: true,
    isDeal: true,
    reviews: [],
  },
  {
    id: 'prod-4',
    slug: 'minimalist-10-niacinamide-serum',
    title: 'Minimalist 10% Niacinamide Face Serum with Matmarine + Zinc 30ml',
    shortTitle: 'Minimalist 10% Niacinamide Serum',
    brand: 'Minimalist',
    category: 'Skincare',
    subcategory: 'Serums',
    price: 649,
    originalPrice: 699,
    discountPercent: 7,
    rating: 4.6,
    reviewCount: 112,
    imageUrl: '/assets/v2/prod_minimalist_niacinamide.png',
    gallery: ['/assets/v2/prod_minimalist_niacinamide.png', '/assets/v2/prod_ordinary_ha.png'],
    sizes: ['30ml'],
    defaultSize: '30ml',
    skinTypes: ['Oily', 'Acne-Prone', 'Combination'],
    concerns: ['Acne Marks', 'Open Pores', 'Excess Oil', 'Blemishes'],
    badges: ['7% OFF', 'BESTSELLER'],
    stock: 50,
    sku: 'DL-MIN-NIA10',
    shortDescription:
      'Clarifying daily serum with pure 10% Vitamin B3 (Niacinamide), 1% Zinc PCA, and Biotech Matmarine to reduce blemishes and control sebum.',
    description:
      'Minimalist 10% Niacinamide Serum is formulated with ultra-pure Lonza Niacinamide, Zinc PCA, and fermented Matmarine to visibly reduce dark spots, acne marks, enlarged pores, and excess shine while strengthening the skin barrier.',
    keyBenefits: [
      'Reduces acne marks, blemishes, and post-inflammatory hyperpigmentation',
      'Regulates sebum production and minimizes the appearance of enlarged pores',
      'Fragrance-free, silicone-free, paraben-free, and non-comedogenic',
    ],
    ingredients: [
      'Aloe Barbadensis Leaf Juice',
      'Niacinamide (10%)',
      'Propanediol',
      'Pseudoalteromonas Ferment Extract (Matmarine)',
      'Zinc PCA (1%)',
      'Panthenol',
      'Sodium Hyaluronate',
    ],
    howToUse: [
      'Apply 2–3 drops on cleansed and toned face morning and evening.',
      'Pat gently until absorbed and follow with moisturiser and SPF 50 in the morning.',
    ],
    isBestSeller: true,
    reviews: [],
  },
  {
    id: 'prod-5',
    slug: 'mac-studio-fix-compact',
    title: 'M.A.C Studio Fix Powder Plus Foundation Compact',
    shortTitle: 'M.A.C Studio Fix Compact',
    brand: 'M.A.C',
    category: 'Makeup',
    subcategory: 'Face',
    price: 2950,
    originalPrice: 3300,
    discountPercent: 10,
    rating: 4.8,
    reviewCount: 64,
    imageUrl: '/assets/v2/prod_mac_compact.png',
    gallery: ['/assets/v2/prod_mac_compact.png', '/assets/v2/prod_kay_lipstick.png'],
    sizes: ['NC25', 'NC35', 'NC40', 'NC42'],
    defaultSize: 'NC40',
    skinTypes: ['All Skin Types', 'Oily', 'Combination', 'Normal'],
    concerns: ['Oil Control', 'Pore Blurring', 'Full Coverage'],
    badges: ['10% OFF', 'BESTSELLER'],
    stock: 19,
    sku: 'DL-MAC-SFP',
    shortDescription:
      'One-step powder and foundation that gives skin a smooth, flawless, all-matte finish with medium-to-full buildable coverage.',
    description:
      'M.A.C Studio Fix Powder Plus Foundation is the iconic 2-in-1 pressed powder and foundation trusted by makeup artists worldwide. It controls oil and shine for up to 12 hours while immediately blurring the look of pores without caking.',
    keyBenefits: [
      '12-hour oil and shine control with a photo-friendly matte finish',
      'Immediately reduces appearance of pores without settling into fine lines',
      'Available in bestselling Indian shades NC25, NC35, NC40, and NC42',
    ],
    ingredients: [
      'Talc',
      'Silica',
      'Isostearyl Palmitate',
      'Methicone',
      'Caprylyl Glycol',
      'Titanium Dioxide',
      'Iron Oxides',
    ],
    howToUse: [
      'Apply to well-moisturised and primed skin with a fluffy brush for sheer coverage or the included sponge applicator for fuller coverage.',
    ],
    isBestSeller: true,
    reviews: [],
  },
  {
    id: 'prod-6',
    slug: 'loreal-professional-shampoo',
    title: "L'Oréal Professionnel Absolut Repair Gold Quinoa + Protein Shampoo 300ml",
    shortTitle: "L'Oréal Professional Shampoo",
    brand: "L'Oréal Professionnel",
    category: 'Haircare',
    subcategory: 'Shampoo',
    price: 1099,
    originalPrice: 1299,
    discountPercent: 15,
    rating: 4.5,
    reviewCount: 83,
    imageUrl: '/assets/v2/prod_loreal_shampoo.png',
    gallery: ['/assets/v2/prod_loreal_shampoo.png'],
    sizes: ['300ml', '500ml'],
    defaultSize: '300ml',
    skinTypes: ['Dry Hair', 'Damaged Hair', 'Chemically Treated Hair'],
    concerns: ['Hair Damage', 'Frizz', 'Split Ends', 'Dryness'],
    badges: ['15% OFF', 'BESTSELLER'],
    stock: 31,
    sku: 'DL-LOR-ABS300',
    shortDescription:
      'Professional resurfacing salon shampoo powered by Gold Quinoa + Wheat Protein to reduce hair surface damage by 77%.',
    description:
      "L'Oréal Professionnel Serie Expert Absolut Repair Shampoo instantly restructures dry, damaged, and chemically treated hair. Infused with Gold Quinoa Bran Extract and Hydrolyzed Wheat Protein, it leaves hair 7x shinier with a lightweight touch.",
    keyBenefits: [
      'Reduces hair surface damage by 77% and adds 7x more shine',
      'Powered by Gold Quinoa + Wheat Protein for deep cortex nourishment',
      'Salon-trusted formula ideal for coloured, rebonded, or heat-styled hair',
    ],
    ingredients: [
      'Aqua / Water',
      'Sodium Laureth Sulfate',
      'Cocamidopropyl Betaine',
      'Chenopodium Quinoa Seed Extract (Gold Quinoa)',
      'Hydrolyzed Wheat Protein',
      'Hydrolyzed Corn Protein',
      'Hydrolyzed Soy Protein',
      'Salicylic Acid',
    ],
    howToUse: [
      'Distribute evenly on wet hair and emulsify into a rich lather.',
      'Rinse thoroughly and follow with Absolut Repair Hair Mask.',
    ],
    isBestSeller: true,
    reviews: [],
  },
  {
    id: 'prod-7',
    slug: 'estee-lauder-advanced-night-repair',
    title: 'Estée Lauder Advanced Night Repair Synchronized Multi-Recovery Complex 50ml',
    shortTitle: 'Estée Lauder Advanced Night Repair',
    brand: 'Estée Lauder',
    category: 'Skincare',
    subcategory: 'Luxury Serums',
    price: 5850,
    originalPrice: 6500,
    discountPercent: 10,
    rating: 4.9,
    reviewCount: 41,
    imageUrl: '/assets/v2/prod_esteelauder_anr.png',
    gallery: ['/assets/v2/prod_esteelauder_anr.png'],
    sizes: ['50ml', '30ml', '20ml'],
    defaultSize: '50ml',
    skinTypes: ['All Skin Types', 'Dry', 'Mature', 'Combination'],
    concerns: ['Fine Lines', 'Dullness', 'Loss of Firmness', 'Dehydration'],
    badges: ['10% OFF', 'BESTSELLER', 'LUXURY'],
    stock: 12,
    sku: 'DL-EL-ANR50',
    shortDescription:
      'Iconic 7-in-1 night recovery serum powered by patented Tripeptide-32 and Hyaluronic Acid for 72-hour hydration and youthful radiance.',
    description:
      'Estée Lauder Advanced Night Repair harnesses the restorative power of night to visibly reduce multiple signs of aging. Formulated with exclusive Night Peptide (Tripeptide-32), Bifida Ferment Lysate, and Hyaluronic Acid, it delivers 8-hour antioxidant protection and 72-hour hydration.',
    keyBenefits: [
      'Reduces the look of fine lines and wrinkles in just 3 weeks',
      '72-hour deep hydration with high-molecular Hyaluronic Acid',
      'Oil-free, dermatologist-tested, ophthalmologist-tested, and non-acnegenic',
    ],
    ingredients: [
      'Water / Aqua / Eau',
      'Bifida Ferment Lysate',
      'PEG-8',
      'Propanediol',
      'Bis-PEG-18 Methyl Ether Dimethyl Silane',
      'Tripeptide-32',
      'Sodium Hyaluronate',
      'Lactobacillus Ferment',
      'Cola Acuminata (Kola) Seed Extract',
      'Caffeine',
    ],
    howToUse: [
      'Apply one dropper full onto clean skin before your moisturiser, AM and PM.',
      'Smooth gently over face and throat using a heart-shaped massage motion.',
    ],
    isBestSeller: true,
    isNewArrival: true,
    reviews: [],
  },
  {
    id: 'prod-8',
    slug: 'versace-bright-crystal-edt',
    title: 'Versace Bright Crystal Eau De Toilette 90ml',
    shortTitle: 'Versace Bright Crystal EDT',
    brand: 'Versace',
    category: 'Fragrances',
    subcategory: 'Luxury Perfume',
    price: 4999,
    originalPrice: 5800,
    discountPercent: 14,
    rating: 4.8,
    reviewCount: 53,
    imageUrl: '/assets/v2/prod_versace_brightcrystal.png',
    gallery: ['/assets/v2/prod_versace_brightcrystal.png'],
    sizes: ['90ml', '50ml', '30ml'],
    defaultSize: '90ml',
    skinTypes: ['All Skin Types'],
    concerns: ['Long-Lasting Scent', 'Luxury Gifting'],
    badges: ['14% OFF', 'BESTSELLER', 'LUXURY'],
    stock: 15,
    sku: 'DL-VER-BC90',
    shortDescription:
      'Luminous floral-fruity fragrance blending chilled Yuzu, Pomegranate, Peony, Magnolia, Lotus Flower, and warm Amber-Musk.',
    description:
      'Versace Bright Crystal Eau de Toilette is a timeless, sensual floral-fruity fragrance crafted by Alberto Morillas. Opening with sparkling Yuzu and juicy Pomegranate, it blooms into a heart of Peony, Magnolia, and Lotus Flower over a base of Mahogany, Plant Amber, and Musk.',
    keyBenefits: [
      'Authentic imported Versace flacon with batch code & distributor seal',
      'Fresh, radiant floral-fruity notes ideal for Indian weather and festive occasions',
      'Top notes: Yuzu & Pomegranate | Heart: Peony, Magnolia, Lotus | Base: Amber & Musk',
    ],
    ingredients: [
      'Alcohol Denat. (SD Alcohol 39-C)',
      'Parfum (Fragrance)',
      'Aqua (Water)',
      'Hydroxycitronellal',
      'Ethylhexyl Methoxycinnamate',
      'Linalool',
      'Citronellol',
      'Limonene',
    ],
    howToUse: [
      'Spritz onto pulse points—wrists, neck, and behind ears—from a distance of 15cm.',
      'Avoid rubbing wrists together to preserve the top floral notes.',
    ],
    isBestSeller: true,
    reviews: [],
  },
  {
    id: 'prod-9',
    slug: 'cerave-moisturizing-cream-340g',
    title: 'CeraVe Moisturizing Cream for Dry to Very Dry Skin 340g',
    shortTitle: 'CeraVe Moisturizing Cream 340g',
    brand: 'CeraVe',
    category: 'Skincare',
    subcategory: 'Moisturisers',
    price: 1199,
    originalPrice: 1399,
    discountPercent: 15,
    rating: 4.9,
    reviewCount: 109,
    imageUrl: '/assets/v2/prod_cerave_cream.png',
    gallery: ['/assets/v2/prod_cerave_cream.png', '/assets/v2/prod_cetaphil.png'],
    sizes: ['340g', '177ml', '50ml'],
    defaultSize: '340g',
    skinTypes: ['Dry', 'Very Dry', 'Sensitive', 'Normal'],
    concerns: ['Dryness', 'Barrier Repair', 'Flakiness'],
    badges: ['15% OFF', 'DERM FAVOURITE'],
    stock: 27,
    sku: 'DL-CER-340G',
    shortDescription:
      'Rich, non-greasy barrier cream formulated with 3 Essential Ceramides (1, 3, 6-II) and Hyaluronic Acid with MVE 24-hour release technology.',
    description:
      'Developed with dermatologists, CeraVe Moisturizing Cream effectively hydrates dry to very dry skin and helps restore the protective skin barrier on the face and body. Featuring patented MVE Delivery Technology, it releases moisturising ingredients continuously for 24-hour hydration.',
    keyBenefits: [
      'Contains 3 Essential Ceramides (NP, AP, EOP) and Hyaluronic Acid',
      'MVE Technology encapsulates ceramides to ensure slow 24-hour hydration release',
      'Fragrance-free, non-comedogenic, hypoallergenic, and National Eczema Association accepted',
    ],
    ingredients: [
      'Aqua / Water',
      'Glycerin',
      'Cetearyl Alcohol',
      'Caprylic/Capric Triglyceride',
      'Cetyl Alcohol',
      'Ceramide NP (Ceramide 3)',
      'Ceramide AP (Ceramide 6-II)',
      'Ceramide EOP (Ceramide 1)',
      'Sodium Hyaluronate',
      'Cholesterol',
      'Phytosphingosine',
    ],
    howToUse: [
      'Apply liberally to face and body as often as needed, especially after bathing on slightly damp skin.',
    ],
    isNewArrival: true,
    reviews: [],
  },
  {
    id: 'prod-10',
    slug: 'mamaearth-vitamin-c-face-wash-100ml',
    title: 'Mamaearth Vitamin C Foaming Face Wash with Vitamin C & Turmeric 100ml',
    shortTitle: 'Mamaearth Vitamin C Face Wash 100ml',
    brand: 'Mamaearth',
    category: 'Skincare',
    subcategory: 'Cleansers',
    price: 349,
    originalPrice: 399,
    discountPercent: 12,
    rating: 4.5,
    reviewCount: 84,
    imageUrl: '/assets/v2/prod_mamaearth_facewash.png',
    gallery: ['/assets/v2/prod_mamaearth_facewash.png'],
    sizes: ['100ml', '150ml'],
    defaultSize: '100ml',
    skinTypes: ['All Skin Types', 'Dull Skin', 'Combination'],
    concerns: ['Dullness', 'Tan Removal', 'Uneven Tone'],
    badges: ['12% OFF', 'UNDER ₹500'],
    stock: 64,
    sku: 'DL-MAM-VITC100',
    shortDescription:
      'Brightening daily face wash enriched with Vitamin C, Turmeric, Cucumber, and Aloe Vera for radiant, refreshed skin.',
    description:
      'Mamaearth Vitamin C Face Wash combines the antioxidant power of Vitamin C and traditional Turmeric to fight free radical damage, remove everyday tan, and brighten dull skin without stripping natural moisture.',
    keyBenefits: [
      'Brightens skin tone and helps fade sun tan and dullness',
      'Made Safe Certified, sulfate-free, paraben-free, and dermatologically tested',
      'Budget-friendly everyday cleanser under ₹500',
    ],
    ingredients: [
      'Aqua',
      'Magnesium Ascorbyl Phosphate (Vitamin C)',
      'Curcuma Longa (Turmeric) Root Extract',
      'Aloe Barbadensis Leaf Extract',
      'Cucumis Sativus (Cucumber) Fruit Extract',
      'Glycerin',
    ],
    howToUse: [
      'Squeeze a coin-sized amount onto wet palms, massage gently over face in circular motions, and rinse with cool water.',
    ],
    isDeal: true,
    reviews: [],
  },
  {
    id: 'prod-11',
    slug: 'the-ordinary-hyaluronic-acid-30ml',
    title: 'The Ordinary Hyaluronic Acid 2% + B5 Hydrating Serum 30ml',
    shortTitle: 'The Ordinary Hyaluronic Acid 30ml',
    brand: 'The Ordinary',
    category: 'Skincare',
    subcategory: 'Serums',
    price: 999,
    originalPrice: 1150,
    discountPercent: 13,
    rating: 4.7,
    reviewCount: 73,
    imageUrl: '/assets/v2/prod_ordinary_ha.png',
    gallery: ['/assets/v2/prod_ordinary_ha.png'],
    sizes: ['30ml'],
    defaultSize: '30ml',
    skinTypes: ['All Skin Types', 'Dry', 'Dehydrated', 'Oily', 'Sensitive'],
    concerns: ['Dehydration', 'Fine Lines', 'Plumping'],
    badges: ['13% OFF', 'UNDER ₹1,000'],
    stock: 38,
    sku: 'DL-ORD-HA30',
    shortDescription:
      'Multi-depth hydration support formula with low-, medium-, and high-molecular-weight Hyaluronic Acid plus Pro-Vitamin B5 and Ceramides.',
    description:
      'The Ordinary Hyaluronic Acid 2% + B5 provides instant plumping hydration across multiple layers of the skin. Enhanced with Vitamin B5 and supporting ceramides, it locks in moisture for smoother, supple skin all day.',
    keyBenefits: [
      'Combines 5 forms of hyaluronic acid for multi-depth skin hydration',
      'Pro-Vitamin B5 boosts surface barrier repair and elasticity',
      'Lightweight, non-sticky water-based serum under ₹1,000',
    ],
    ingredients: [
      'Aqua (Water)',
      'Sodium Hyaluronate',
      'Sodium Hyaluronate Crosspolymer',
      'Panthenol (Pro-Vitamin B5)',
      'Phospholipids',
      'Sphingolipids (Ceramides)',
      'Pentylene Glycol',
    ],
    howToUse: [
      'Apply 2–3 drops to damp skin morning and evening before creams or oils.',
    ],
    isNewArrival: true,
    reviews: [],
  },
  {
    id: 'prod-12',
    slug: 'plum-niacinamide-toner-200ml',
    title: 'Plum 3% Niacinamide & Rice Water Alcohol-Free Face Toner 200ml',
    shortTitle: 'Plum Niacinamide Toner 200ml',
    brand: 'Plum',
    category: 'Skincare',
    subcategory: 'Toners',
    price: 550,
    originalPrice: 650,
    discountPercent: 15,
    rating: 4.6,
    reviewCount: 61,
    imageUrl: '/assets/v2/prod_plum_toner.png',
    gallery: ['/assets/v2/prod_plum_toner.png'],
    sizes: ['200ml', '150ml'],
    defaultSize: '200ml',
    skinTypes: ['Oily', 'Combination', 'Normal', 'Acne-Prone'],
    concerns: ['Open Pores', 'Blemishes', 'Uneven Texture'],
    badges: ['15% OFF', 'VEGAN'],
    stock: 46,
    sku: 'DL-PLM-TON200',
    shortDescription:
      'Alcohol-free brightening toner with 3% Niacinamide, Japanese Fermented Rice Water, and Oat Extract for glass-like, pore-refined skin.',
    description:
      'Plum 3% Niacinamide Face Toner with Rice Water tightens pores, smooths uneven skin texture, and balances skin pH after cleansing. 100% vegan and alcohol-free, it preps skin to absorb serums and moisturisers more effectively.',
    keyBenefits: [
      '3% Niacinamide + Fermented Rice Water brightens and refines pores',
      'Oat extract calms redness and irritation without stinging',
      '100% alcohol-free, fragrance-free, and cruelty-free',
    ],
    ingredients: [
      'Aqua',
      'Niacinamide (3%)',
      'Saccharomyces/Rice Ferment Filtrate',
      'Avena Sativa (Oat) Kernel Extract',
      'Glycerin',
      'Betaine',
    ],
    howToUse: [
      'Pour a few drops onto your palms or a cotton pad and dab gently over cleansed face and neck.',
    ],
    reviews: [],
  },
  {
    id: 'prod-13',
    slug: 'bioderma-sensibio-h2o-250ml',
    title: 'Bioderma Sensibio H2O Micellar Water Makeup Remover 250ml',
    shortTitle: 'Bioderma Sensibio H2O',
    brand: 'Bioderma',
    category: 'Skincare',
    subcategory: 'Cleansers',
    price: 1099,
    originalPrice: 1250,
    discountPercent: 12,
    rating: 4.9,
    reviewCount: 92,
    imageUrl: '/assets/v2/prod_bioderma.png',
    gallery: ['/assets/v2/prod_bioderma.png'],
    sizes: ['250ml', '100ml', '500ml'],
    defaultSize: '250ml',
    skinTypes: ['Sensitive', 'All Skin Types'],
    concerns: ['Makeup Removal', 'Sensitivity', 'Redness'],
    badges: ['12% OFF', 'FRENCH PHARMACY'],
    stock: 30,
    sku: 'DL-BIO-H2O250',
    shortDescription:
      'Original dermatological micellar water that removes 99% of makeup, fine pollution particles, and impurities while soothing sensitive skin.',
    description:
      'Bioderma Sensibio H2O is the iconic French pharmacy micellar water formulated at physiological pH 5.5. Its biomimetic micelles capture waterproof makeup and urban pollutants in a single swipe without rinsing or stinging eyes.',
    keyBenefits: [
      'Removes 99% of face & eye makeup and pollution particles effortlessly',
      'Preserves the skin’s natural microbiome with physiological pH',
      'Unfragranced, alcohol-free, paraben-free, and no-rinse formula',
    ],
    ingredients: [
      'Aqua / Water / Eau',
      'PEG-6 Caprylic/Capric Glycerides',
      'Fructooligosaccharides',
      'Mannitol',
      'Xylitol',
      'Rhamnose',
      'Cucumis Sativus (Cucumber) Fruit Extract',
      'Propylene Glycol',
      'Cetrimonium Bromide',
      'Disodium EDTA',
    ],
    howToUse: [
      'Soak a cotton pad with Sensibio H2O and gently cleanse face and eyes. No rinsing required.',
    ],
    reviews: [],
  },
  {
    id: 'prod-14',
    slug: 'ikonic-pro-titanium-shine-straightener',
    title: 'IKONIC Professional Pro Titanium Shine Hair Straightener',
    shortTitle: 'IKONIC Pro Titanium Straightener',
    brand: 'IKONIC Professional',
    category: 'Salon Tools',
    subcategory: 'Hair Straighteners',
    price: 3499,
    originalPrice: 4250,
    discountPercent: 18,
    rating: 4.8,
    reviewCount: 47,
    imageUrl: '/assets/v2/promo_salontools_right.png',
    gallery: ['/assets/v2/promo_salontools_right.png'],
    sizes: ['Standard - Rose Gold Black'],
    defaultSize: 'Standard - Rose Gold Black',
    skinTypes: ['All Hair Types', 'Frizzy Hair', 'Thick Hair'],
    concerns: ['Salon Styling', 'Frizz Control', 'Sleek Shine'],
    badges: ['18% OFF', 'SALON PRO'],
    stock: 16,
    sku: 'DL-IKO-PROTI',
    shortDescription:
      'Salon-grade titanium floating plates with instant heat recovery (130°C–230°C) for frizz-free straightening and curls at home.',
    description:
      'Engineered for professional stylists and home beauty enthusiasts alike, the IKONIC Pro Titanium Shine Hair Straightener features ultra-smooth floating titanium plates, digital temperature control up to 230°C, and a 360° tangle-free swivel cord.',
    keyBenefits: [
      'Floating titanium plates glide effortlessly without snagging or hair breakage',
      'Adjustable LED temperature settings from 130°C to 230°C for all Indian hair textures',
      '1-year official IKONIC India warranty supported at Dazzlinglooks Rajahmundry',
    ],
    ingredients: ['Titanium Floating Plates', 'PTC Ceramic Heater', '360° Swivel Cord'],
    howToUse: [
      'Apply heat protectant spray to dry hair, select your desired temperature, and glide slowly from roots to ends in 1-inch sections.',
    ],
    isNewArrival: true,
    reviews: [],
  },
  {
    id: 'prod-15',
    slug: 'rica-brazilian-avocado-liposoluble-wax-400ml',
    title: 'RICA Brazilian Wax with Avocado Butter for Sensitive Areas 400ml',
    shortTitle: 'RICA Avocado Butter Wax 400ml',
    brand: 'RICA WAX',
    category: 'Personal Care',
    subcategory: 'Waxing & Body Care',
    price: 950,
    originalPrice: 1150,
    discountPercent: 17,
    rating: 4.7,
    reviewCount: 58,
    imageUrl: '/assets/v2/cat_personalcare.png',
    gallery: ['/assets/v2/cat_personalcare.png'],
    sizes: ['400ml', '800ml'],
    defaultSize: '400ml',
    skinTypes: ['Sensitive', 'Dry', 'All Skin Types'],
    concerns: ['Smooth Hair Removal', 'Tan Removal', 'Ingrown Hair'],
    badges: ['17% OFF', 'ITALIAN FORMULA'],
    stock: 34,
    sku: 'DL-RIC-AVO400',
    shortDescription:
      'Colophony-free Italian liposoluble wax enriched with Avocado Butter and Milk Proteins for gentle, less-painful hair removal.',
    description:
      'RICA Avocado Butter Wax is made in Sicily, Italy with a patented colophony-free natural oil formula that grips hair firmly without sticking aggressively to skin—reducing redness, bumps, and post-wax irritation.',
    keyBenefits: [
      '100% Colophony-free formula prevents allergic redness on sensitive skin',
      'Enriched with nourishing Avocado Butter, Vitamins A, D, E, and Zinc Oxide',
      'Under ₹1,000 salon favourite in Rajahmundry',
    ],
    ingredients: [
      'Glyceryl Rosinate',
      'Vegetable Oil',
      'Persea Gratissima (Avocado) Oil',
      'Titanium Dioxide',
      'Zinc Oxide',
      'Beeswax (Cera Alba)',
    ],
    howToUse: [
      'Heat in a professional wax heater until creamy, test temperature on wrist, and apply thinly in the direction of hair growth.',
    ],
    reviews: [],
  },
  {
    id: 'prod-combo-1',
    slug: 'skincare-combo-cetaphil-cerave',
    title: 'Skincare Combo (Cleanser + Moisturizer + Serum Barrier Routine)',
    shortTitle: 'Skincare Combo',
    brand: 'Cetaphil',
    category: 'Combo Offers',
    subcategory: 'Skincare Kits',
    price: 1899,
    originalPrice: 2399,
    discountPercent: 20,
    rating: 4.9,
    reviewCount: 44,
    imageUrl: '/assets/v2/prod_combo_skincare.png',
    gallery: ['/assets/v2/prod_combo_skincare.png', '/assets/v2/prod_cetaphil.png', '/assets/v2/prod_cerave_cream.png'],
    sizes: ['Full Size Kit (500ml + 340g)'],
    defaultSize: 'Full Size Kit (500ml + 340g)',
    skinTypes: ['Dry', 'Sensitive', 'Normal', 'Combination'],
    concerns: ['Dryness', 'Barrier Repair', 'Daily Hydration'],
    badges: ['SAVE 20%', 'COMBO OFFER'],
    stock: 22,
    sku: 'DL-CMB-SKIN',
    shortDescription:
      'Complete dermatologist-recommended AM/PM barrier routine combining Cetaphil Gentle Skin Cleanser + CeraVe Moisturizing Cream.',
    description:
      'Save flat 20% with our #1 bestselling Skincare Combo at Dazzlinglooks.in. Pair the gentle, soap-free Cetaphil Gentle Skin Cleanser with ceramide-rich CeraVe Moisturizing Cream for soft, calm, deeply hydrated skin year-round.',
    keyBenefits: [
      'Save ₹500 (20% OFF) compared to buying individual products',
      '100% authentic dermatologist-recommended cleanser + barrier cream duo',
      'Ideal for sensitive, dry, and dehydrated skin types',
    ],
    ingredients: ['Niacinamide', 'Panthenol', 'Glycerin', 'Ceramides NP, AP, EOP', 'Hyaluronic Acid'],
    howToUse: [
      'Step 1: Cleanse face and neck with Cetaphil Gentle Skin Cleanser.',
      'Step 2: Lock in hydration immediately with CeraVe Moisturizing Cream.',
    ],
    isCombo: true,
    isDeal: true,
    reviews: [],
  },
  {
    id: 'prod-combo-2',
    slug: 'haircare-combo-salon-repair-kit',
    title: 'Haircare Combo (Shampoo + Conditioner + Hair Serum)',
    shortTitle: 'Haircare Combo',
    brand: "L'Oréal Professionnel",
    category: 'Combo Offers',
    subcategory: 'Haircare Kits',
    price: 1599,
    originalPrice: 2099,
    discountPercent: 25,
    rating: 4.8,
    reviewCount: 36,
    imageUrl: '/assets/v2/prod_combo_haircare.png',
    gallery: ['/assets/v2/prod_combo_haircare.png'],
    sizes: ['3-Piece Salon Kit'],
    defaultSize: '3-Piece Salon Kit',
    skinTypes: ['All Hair Types', 'Frizzy Hair', 'Damaged Hair'],
    concerns: ['Hair Fall', 'Frizz', 'Split Ends', 'Shine'],
    badges: ['SAVE 25%', 'COMBO OFFER'],
    stock: 18,
    sku: 'DL-CMB-HAIR',
    shortDescription:
      'Complete 3-step professional salon haircare bundle featuring repairing Shampoo + nourishing Mask/Conditioner + anti-frizz Hair Serum.',
    description:
      'Transform dry, frizzy hair at home with our curated Haircare Combo. Includes professional salon shampoo, deep conditioning treatment, and smoothing serum at 25% OFF.',
    keyBenefits: [
      'Save ₹500 (25% OFF) on a complete 3-step wash, condition, and shine routine',
      'Tames humidity frizz and restores mirror-like salon gloss',
    ],
    ingredients: ['Gold Quinoa', 'Hydrolyzed Wheat Protein', 'Argan Oil', 'Pro-Keratin'],
    howToUse: [
      'Shampoo wet hair, apply conditioner/mask to mid-lengths for 3 minutes, rinse, and finish with 2 drops of serum on towel-dried hair.',
    ],
    isCombo: true,
    isDeal: true,
    reviews: [],
  },
  {
    id: 'prod-combo-3',
    slug: 'makeup-combo-essentials-kit',
    title: 'Makeup Combo (Foundation + Lipstick + Compact)',
    shortTitle: 'Makeup Combo',
    brand: 'Kay Beauty',
    category: 'Combo Offers',
    subcategory: 'Makeup Kits',
    price: 1699,
    originalPrice: 2499,
    discountPercent: 30,
    rating: 4.8,
    reviewCount: 51,
    imageUrl: '/assets/v2/prod_combo_makeup.png',
    gallery: ['/assets/v2/prod_combo_makeup.png'],
    sizes: ['3-Piece Glam Kit'],
    defaultSize: '3-Piece Glam Kit',
    skinTypes: ['All Skin Types'],
    concerns: ['Bridal & Festive Glam', 'Long Wear', 'Flawless Base'],
    badges: ['SAVE 30%', 'COMBO OFFER'],
    stock: 25,
    sku: 'DL-CMB-MKP',
    shortDescription:
      'Flawless everyday and festive makeup trio featuring Foundation + Matte Lipstick + Setting Compact at flat 30% OFF.',
    description:
      'Get party-ready in minutes with our curated Makeup Combo. Combines a breathable liquid foundation, oil-control compact powder, and long-stay matte lipstick at our biggest 30% combo discount.',
    keyBenefits: [
      'Save ₹800 (30% OFF) on our most requested 3-piece makeup bundle',
      'Sweat-resistant, long-wear formulas suited for Indian climate',
    ],
    ingredients: ['Grapeseed Oil', 'Vitamin E', 'Hyaluronic Acid', 'Micro-fine Silica'],
    howToUse: [
      'Apply foundation evenly, set T-zone with compact powder, and finish with Matte Drama Lipstick.',
    ],
    isCombo: true,
    isDeal: true,
    reviews: [],
  },
];

export const INITIAL_COUPONS: CouponCode[] = [
  {
    id: 'coup-1',
    code: 'DAZZLE150',
    discountType: 'Flat',
    discountValue: 150,
    minOrder: 1500,
    description: 'Flat ₹150 OFF on orders above ₹1,500',
    active: true,
    usedCount: 184,
  },
  {
    id: 'coup-2',
    code: 'DAZZLE20',
    discountType: 'Percentage',
    discountValue: 20,
    minOrder: 1499,
    description: '20% OFF on Skincare & Makeup orders above ₹1,499',
    active: true,
    usedCount: 142,
  },
  {
    id: 'coup-3',
    code: 'FIRST10',
    discountType: 'Percentage',
    discountValue: 10,
    minOrder: 699,
    description: '10% OFF on your first order above ₹699',
    active: true,
    usedCount: 215,
  },
];

export const INITIAL_ORDERS: SampleOrder[] = [
  {
    id: 'ord-1',
    orderNumber: '#1024',
    customerName: 'P. Dinesh Kumar Reddy',
    customerEmail: 'dinesh.reddy@example.com',
    customerPhone: '+91 90000 12345',
    address: 'Thadithota, Rajahmundry, Andhra Pradesh - 533103',
    date: '15 Apr 2024',
    amount: 2198,
    paymentMethod: 'UPI (Google Pay, PhonePe, Paytm)',
    paymentStatus: 'Paid',
    fulfilmentStatus: 'Delivered',
    items: [
      {
        productName: 'Cetaphil Gentle Skin Cleanser 500ml',
        brand: 'Cetaphil',
        size: '500ml',
        qty: 1,
        price: 899,
      },
      {
        productName: "L'Oréal Professional Shampoo",
        brand: "L'Oréal Professionnel",
        size: '300ml',
        qty: 1,
        price: 1299,
      },
    ],
  },
  {
    id: 'ord-2',
    orderNumber: '#1019',
    customerName: 'P. Dinesh Kumar Reddy',
    customerEmail: 'dinesh.reddy@example.com',
    customerPhone: '+91 90000 12345',
    address: 'Thadithota, Rajahmundry, Andhra Pradesh - 533103',
    date: '02 Apr 2024',
    amount: 1450,
    paymentMethod: 'Credit / Debit Card',
    paymentStatus: 'Paid',
    fulfilmentStatus: 'Delivered',
    items: [
      {
        productName: 'Laneige Lip Sleeping Mask 20g',
        brand: 'Laneige',
        size: '20g',
        qty: 1,
        price: 1350,
      },
    ],
  },
];

export const FAQ_ITEMS = [
  {
    category: 'Authenticity & Products',
    question: 'Are all products on Dazzlinglooks.in 100% authentic?',
    answer:
      'Yes. Every product sold online at Dazzlinglooks.in and at our retail store in Thadithota, Rajahmundry is 100% genuine and sourced directly from authorized brands and official distributors with verifiable batch numbers.',
  },
  {
    category: 'Delivery & Shipping',
    question: 'What are the delivery charges and free shipping rules?',
    answer:
      'We offer Free Delivery on all orders of ₹2,500 and above across Rajahmundry & Andhra Pradesh. For orders below ₹2,500, a flat ₹99 shipping fee applies. Express 1–2 Day Delivery is also available at ₹99.',
  },
  {
    category: 'Retail Store',
    question: 'Where is the Dazzlinglooks.in physical store located?',
    answer:
      'Our flagship retail store is located at Thadithota, Rajahmundry, Andhra Pradesh - 533103. We are open Monday to Saturday from 10:00 AM to 8:00 PM. You can also scan our WhatsApp QR code to check in-store shade or stock availability.',
  },
  {
    category: 'Returns & Refunds',
    question: 'What is your return and replacement policy?',
    answer:
      'We provide a hassle-free 7-day return or replacement policy for any damaged, wrong, or defective item delivered. Please keep the original outer box, invoice, and batch seal intact when requesting a return.',
  },
  {
    category: 'Payments',
    question: 'Which payment methods do you accept?',
    answer:
      'We accept UPI (Google Pay, PhonePe, Paytm), Credit & Debit Cards (VISA, Mastercard, RuPay), Net Banking, and Cash on Delivery (COD).',
  },
];

export const AI_SUGGESTED_QUESTIONS = [
  'Which skincare products are available?',
  'Recommend a moisturiser for my skin type.',
  'Show products under ₹1,000.',
  'What are the ingredients in this product?',
  'Is this product currently in stock?',
  'Suggest a simple AM/PM skincare routine.',
  'Show bestsellers in haircare.',
  'Do you offer free delivery?',
  'Where is the retail store located?',
];
