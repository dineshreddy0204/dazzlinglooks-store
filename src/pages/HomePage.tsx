import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Truck,
  Store,
  Heart,
  ShieldCheck,
  RotateCcw,
  Headphones,
  MapPin,
  MessageCircle,
} from 'lucide-react';
import { CATEGORIES, BRAND_DATA } from '../data/sampleData';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { DazzlingBeautyAISection } from '../components/DazzlingBeautyAI';

const SectionHeading: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="text-center mb-6 sm:mb-8">
    <div className="inline-flex items-center justify-center gap-3 sm:gap-5">
      <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-r from-transparent via-[#C59B5F] to-[#9A7442]" />
      <span className="text-[#C59B5F] text-xs">✦</span>
      <h2 className="font-serif-editorial text-2xl sm:text-3xl md:text-[32px] font-bold text-[#141110] tracking-tight">
        {title}
      </h2>
      <span className="text-[#C59B5F] text-xs">✦</span>
      <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-l from-transparent via-[#C59B5F] to-[#9A7442]" />
    </div>
    {subtitle && (
      <p className="text-xs sm:text-sm text-[#6E5F55] mt-1.5 font-medium">{subtitle}</p>
    )}
  </div>
);

export const HomePage: React.FC = () => {
  const { products } = useStore();
  const [activeBestSellerTab, setActiveBestSellerTab] = useState<string>('All');

  const bestSellerTabs = [
    'All',
    'Skincare',
    'Makeup',
    'Haircare',
    'Fragrances',
    'Salon Tools',
    'Personal Care',
  ];

  const baseBestSellers = products.filter((p) => p.isBestSeller);
  const displayedBestSellers =
    activeBestSellerTab === 'All'
      ? baseBestSellers.slice(0, 8)
      : products.filter((p) => p.category === activeBestSellerTab).slice(0, 8);

  return (
    <div className="space-y-8 sm:space-y-12 pb-6">
      {/* 1. FULL-WIDTH HERO BANNER MATCHING REFERENCE IMAGE 1 */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#F9EDE8] via-[#FCE8EE] to-[#F7DFD4] border-b border-[#E8D5C8]">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[340px] sm:min-h-[410px] py-6 lg:py-0 gap-6">
            {/* Left Copy & 4 Floating Trust Cards */}
            <div className="lg:col-span-6 z-10 space-y-4 sm:space-y-5 py-2 sm:py-6">
              <div>
                <h1 className="font-serif-editorial text-3xl sm:text-4xl xl:text-[44px] font-bold text-[#141110] leading-[1.12]">
                  Your Complete
                </h1>
                <div className="font-script text-4xl sm:text-5xl xl:text-[56px] text-[#B9124B] leading-[1.08] mt-0.5">
                  Beauty Destination
                </div>
              </div>

              <p className="text-xs sm:text-sm md:text-[15px] font-semibold text-[#3C2E29] tracking-wide">
                Authentic Brands &nbsp;|&nbsp; Genuine Products &nbsp;|&nbsp; Real Results
              </p>

              <div className="pt-1">
                <Link
                  to="/category/skincare"
                  className="inline-flex items-center gap-2.5 bg-[#141110] hover:bg-[#E91E63] text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-7 py-3 rounded-full shadow-md transition"
                >
                  <span>SHOP NOW</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* 4 Glass Trust Badges Row inside Hero */}
              <div className="pt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                <div className="bg-white/85 backdrop-blur-xs border border-[#EBDAD1] rounded-xl px-3 py-2.5 flex items-center gap-2 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <div className="text-[11px] leading-tight font-semibold text-[#141110]">
                    100% Authentic
                    <span className="block font-normal text-[#6B5B52] text-[10px]">Products</span>
                  </div>
                </div>

                <div className="bg-white/85 backdrop-blur-xs border border-[#EBDAD1] rounded-xl px-3 py-2.5 flex items-center gap-2 shadow-2xs">
                  <Truck className="w-4 h-4 text-[#C59B5F] shrink-0" />
                  <div className="text-[11px] leading-tight font-semibold text-[#141110]">
                    Fast &amp; Safe
                    <span className="block font-normal text-[#6B5B52] text-[10px]">Delivery</span>
                  </div>
                </div>

                <div className="bg-white/85 backdrop-blur-xs border border-[#EBDAD1] rounded-xl px-3 py-2.5 flex items-center gap-2 shadow-2xs">
                  <Store className="w-4 h-4 text-[#E91E63] shrink-0" />
                  <div className="text-[11px] leading-tight font-semibold text-[#141110]">
                    Retail Store
                    <span className="block font-normal text-[#6B5B52] text-[10px]">Rajahmundry</span>
                  </div>
                </div>

                <div className="bg-white/85 backdrop-blur-xs border border-[#EBDAD1] rounded-xl px-3 py-2.5 flex items-center gap-2 shadow-2xs">
                  <Heart className="w-4 h-4 text-[#E91E63] fill-[#E91E63] shrink-0" />
                  <div className="text-[11px] leading-tight font-semibold text-[#141110]">
                    Care for
                    <span className="block font-normal text-[#6B5B52] text-[10px]">Every You</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Beauty Model & Luxury Product Podium Scene */}
            <div className="lg:col-span-6 flex items-center justify-center lg:justify-end">
              <div className="w-full max-w-[680px] rounded-2xl overflow-hidden">
                <img
                  src="/assets/v2/hero_right_scene.png"
                  alt="More Than Beauty A Brighter You — Authentic Beauty Products"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY (8 OVAL/ARCH CARDS) */}
      <section className="max-w-[1380px] mx-auto px-3 sm:px-6">
        <SectionHeading title="Shop by Category" />

        <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={cat.slug === 'combo-offers' ? '/offers' : `/category/${cat.slug}`}
              className="group flex flex-col items-center text-center"
            >
              <div className="relative w-full aspect-[1/1.22] rounded-t-full rounded-b-2xl overflow-hidden bg-white border-2 border-[#E6D6C3] group-hover:border-[#E91E63] shadow-xs transition-all">
                {cat.badge && (
                  <span className="absolute top-2 right-2 z-10 bg-[#E91E63] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-xs">
                    {cat.badge}
                  </span>
                )}
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className="mt-2 text-[11px] sm:text-xs font-bold text-[#141110] group-hover:text-[#E91E63] transition">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED BRANDS (15 BRAND CARDS IN 2 ROWS) */}
      <section className="max-w-[1380px] mx-auto px-3 sm:px-6">
        <SectionHeading
          title="Featured Brands"
          subtitle="Trusted & Popular Brands Available at Our Store"
        />

        {/* Row 1: 8 Brands, Row 2: 7 Brands on Desktop */}
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-2.5 sm:gap-3.5">
          {BRAND_DATA.map((brand) => (
            <Link
              key={brand.id}
              to={`/brands?brand=${encodeURIComponent(brand.name)}`}
              className="bg-white rounded-xl border border-[#EAE0D2] hover:border-[#C59B5F] p-2 sm:p-2.5 flex items-center justify-center h-16 sm:h-20 shadow-2xs hover:shadow-md transition group"
              title={brand.name}
            >
              <img
                src={brand.logoUrl}
                alt={brand.name}
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
              />
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/brands"
            className="inline-flex items-center gap-2 bg-[#141110] hover:bg-[#E91E63] text-white text-xs font-bold px-6 py-2.5 rounded-full transition shadow-xs"
          >
            <span>View All Brands</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 4. BEST SELLERS (FILTER TABS + 8 PRODUCT CARDS) */}
      <section className="max-w-[1380px] mx-auto px-3 sm:px-6">
        <SectionHeading title="Best Sellers" />

        {/* Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-6">
          {bestSellerTabs.map((tab) => {
            const active = activeBestSellerTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveBestSellerTab(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer border ${
                  active
                    ? 'bg-[#E91E63] text-white border-[#E91E63] shadow-xs'
                    : 'bg-white text-[#3A302B] border-[#E2D5C4] hover:border-[#E91E63]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* 4x2 Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          {displayedBestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-7 text-center">
          <Link
            to="/category/all"
            className="inline-flex items-center gap-2 bg-[#141110] hover:bg-[#E91E63] text-white text-xs font-bold px-7 py-2.5 rounded-full transition shadow-xs"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 5. THREE CAMPAIGN PROMOTIONAL BANNERS */}
      <section className="max-w-[1380px] mx-auto px-3 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {/* Banner 1: Skincare Essentials */}
          <div className="relative rounded-2xl overflow-hidden border border-[#E6D6C3] bg-gradient-to-r from-[#F9ECE4] to-[#F5DFD2] p-5 flex items-center justify-between min-h-[190px] shadow-xs">
            <div className="z-10 max-w-[56%] space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C583A]">
                Skincare Essentials
              </span>
              <h3 className="font-serif-editorial text-xl sm:text-2xl font-bold text-[#141110] leading-tight">
                Healthy Skin
                <span className="font-script text-2xl sm:text-3xl text-[#B9124B] block font-normal mt-0.5">
                  Happier You
                </span>
              </h3>
              <div className="pt-2">
                <Link
                  to="/category/skincare"
                  className="inline-block bg-[#141110] hover:bg-[#E91E63] text-white text-[11px] font-bold px-4 py-2 rounded-full transition"
                >
                  Shop Skincare
                </Link>
              </div>
            </div>
            <div className="w-[44%] h-36 flex items-center justify-end">
              <img
                src="/assets/v2/promo_skincare_right.png"
                alt="Skincare Essentials"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
          </div>

          {/* Banner 2: Premium Fragrances */}
          <div className="relative rounded-2xl overflow-hidden border border-[#E6D6C3] bg-gradient-to-r from-[#FCE8EE] to-[#F8D5E0] p-5 flex items-center justify-between min-h-[190px] shadow-xs">
            <div className="z-10 max-w-[56%] space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9E2A5B]">
                Premium Fragrances
              </span>
              <h3 className="font-serif-editorial text-xl sm:text-2xl font-bold text-[#141110] leading-tight">
                Scents That
                <span className="block text-[#B9124B]">Stay With You</span>
              </h3>
              <div className="pt-2">
                <Link
                  to="/category/fragrances"
                  className="inline-block bg-[#141110] hover:bg-[#E91E63] text-white text-[11px] font-bold px-4 py-2 rounded-full transition"
                >
                  Shop Perfumes
                </Link>
              </div>
            </div>
            <div className="w-[44%] h-36 flex items-center justify-end">
              <img
                src="/assets/v2/promo_fragrance_right.png"
                alt="Premium Fragrances"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
          </div>

          {/* Banner 3: Professional Salon Tools */}
          <div className="relative rounded-2xl overflow-hidden border border-[#C59B5F]/50 bg-gradient-to-r from-[#231D1B] to-[#3A2E29] text-white p-5 flex items-center justify-between min-h-[190px] shadow-xs">
            <div className="z-10 max-w-[56%] space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#F3D19C]">
                Professional Salon Tools
              </span>
              <h3 className="font-serif-editorial text-xl sm:text-2xl font-bold text-white leading-tight">
                For Salon Like
                <span className="block text-[#F3D19C]">Results at Home</span>
              </h3>
              <div className="pt-2">
                <Link
                  to="/category/salon-tools"
                  className="inline-block bg-[#141110] hover:bg-[#E91E63] border border-[#C59B5F]/60 text-white text-[11px] font-bold px-4 py-2 rounded-full transition"
                >
                  Explore Tools
                </Link>
              </div>
            </div>
            <div className="w-[44%] h-36 flex items-center justify-end">
              <img
                src="/assets/v2/promo_salontools_right.png"
                alt="Professional Salon Tools"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. BLUSH-PINK SERVICE & DELIVERY STRIP */}
      <section className="max-w-[1380px] mx-auto px-3 sm:px-6">
        <div className="rounded-2xl bg-[#FCE8EE] border border-[#F3C6D4] px-4 py-4 sm:py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 divide-y sm:divide-y-0 lg:divide-x divide-[#EAB8C8]">
          <div className="flex items-center gap-3 pt-2 sm:pt-0 lg:px-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#E91E63] shrink-0 shadow-2xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#141110]">
                Free Delivery on orders ₹2,500+
              </div>
              <div className="text-[11px] text-[#6B4C57]">
                Across Rajahmundry &amp; Andhra Pradesh
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 sm:pt-0 lg:px-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#C59B5F] shrink-0 shadow-2xs">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#141110]">Flat ₹99 Shipping</div>
              <div className="text-[11px] text-[#6B4C57]">on orders below ₹2,500</div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 sm:pt-0 lg:px-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#16A34A] shrink-0 shadow-2xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#141110]">Secure Payments</div>
              <div className="text-[11px] text-[#6B4C57]">UPI | Cards | Net Banking</div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 sm:pt-0 lg:px-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#E91E63] shrink-0 shadow-2xs">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#141110]">Easy Returns</div>
              <div className="text-[11px] text-[#6B4C57]">Hassle Free</div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 sm:pt-0 lg:px-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#141110] shrink-0 shadow-2xs">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#141110]">Customer Support</div>
              <div className="text-[11px] text-[#6B4C57]">We&apos;re Here to Help</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. RETAIL STORE, WHATSAPP QR & SOCIAL SECTION */}
      <section className="max-w-[1380px] mx-auto px-3 sm:px-6">
        <div className="rounded-2xl bg-white border border-[#E6DAC8] p-4 sm:p-6 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Retail Store Photo + Address */}
          <div className="lg:col-span-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 border-b lg:border-b-0 lg:border-r border-[#EFE6D8] pb-5 lg:pb-0 lg:pr-5">
            <div className="w-full sm:w-52 h-36 rounded-xl overflow-hidden border border-[#E5D7C3] shrink-0">
              <img
                src="/assets/v2/retail_store_photo.png"
                alt="Dazzlinglooks.in Retail Store Rajahmundry"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="font-serif-editorial text-xl font-bold text-[#141110]">
                Visit Our Retail Store
              </h3>
              <p className="text-xs text-[#5A4E46] flex items-start justify-center sm:justify-start gap-1.5 leading-relaxed">
                <MapPin className="w-4 h-4 text-[#E91E63] shrink-0 mt-0.5" />
                <span>at Thadithota, Rajahmundry, Andhra Pradesh - 533103</span>
              </p>
              <div className="pt-1">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-1.5 bg-[#E91E63] hover:bg-[#C2185B] text-white text-xs font-bold px-4 py-2 rounded-lg transition shadow-2xs"
                >
                  <span>Get Directions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Middle: Chat with Us on WhatsApp + Scan QR */}
          <div className="lg:col-span-3 flex items-center justify-center sm:justify-between gap-4 border-b lg:border-b-0 lg:border-r border-[#EFE6D8] pb-5 lg:pb-0 lg:pr-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </span>
                <h4 className="text-sm font-bold text-[#141110] leading-tight">
                  Chat with Us on WhatsApp
                </h4>
              </div>
              <p className="text-[11px] text-[#6E5F55]">
                For Order Help &amp; Product Enquiries
              </p>
            </div>

            <div className="text-center shrink-0">
              <div className="w-20 h-20 rounded-lg border border-[#E5D7C3] p-1 bg-white">
                <img
                  src="/assets/v2/whatsapp_qr.png"
                  alt="Scan WhatsApp QR"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[10px] font-bold text-[#141110] block mt-1">Scan QR</span>
            </div>
          </div>

          {/* Right: Follow Us Socials */}
          <div className="lg:col-span-3 text-center lg:text-left space-y-2.5">
            <h4 className="font-serif-editorial text-lg font-bold text-[#141110]">Follow Us</h4>
            <p className="text-xs text-[#6E5F55]">for Beauty Tips, Offers &amp; Updates</p>
            <div className="flex items-center justify-center lg:justify-start gap-2.5 pt-1">
              <Link
                to="/contact"
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center text-xs font-bold shadow-xs hover:scale-105 transition"
              >
                IG
              </Link>
              <Link
                to="/contact"
                className="w-9 h-9 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-xs font-bold shadow-xs hover:scale-105 transition"
              >
                f
              </Link>
              <Link
                to="/contact"
                className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center text-xs font-bold shadow-xs hover:scale-105 transition"
              >
                WA
              </Link>
              <Link
                to="/contact"
                className="w-9 h-9 rounded-full bg-[#FF0000] text-white flex items-center justify-center text-xs font-bold shadow-xs hover:scale-105 transition"
              >
                YT
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. DAZZLING BEAUTY AI ASSISTANT SECTION (ABOVE FOOTER) */}
      <DazzlingBeautyAISection />
    </div>
  );
};
