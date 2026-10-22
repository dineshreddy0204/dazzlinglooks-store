import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  User,
  Package,
  Heart,
  MapPin,
  Settings,
  LogOut,
  Search,
  ShoppingCart,
  ArrowRight,
  CheckCircle2,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  Truck,
  RotateCcw,
  ShieldCheck,
  FileText,
  HelpCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BRAND_DATA, FAQ_ITEMS } from '../data/sampleData';
import { ProductCard } from '../components/ProductCard';

// ============================================================================
// PANEL 6: MY ACCOUNT PAGE (/account)
// ============================================================================
export const AccountPage: React.FC = () => {
  const { orders, wishlist, products, addToCart, showToast } = useStore();
  const [activeSection, setActiveSection] = useState<
    'dashboard' | 'orders' | 'wishlist' | 'addresses' | 'details'
  >('dashboard');

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: User },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'details', label: 'Account Details', icon: Settings },
  ];

  return (
    <div className="max-w-[1380px] mx-auto px-3 sm:px-6 py-6 sm:py-9">
      <h1 className="font-serif-editorial text-2xl sm:text-4xl font-bold text-[#141110] mb-6">
        My Account
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Sidebar Matching Panel 6 */}
        <aside className="lg:col-span-3 bg-white rounded-2xl border border-[#EAE0D2] p-5 space-y-5 h-fit shadow-2xs">
          <div className="flex items-center gap-3 pb-4 border-b border-[#EFE6D8]">
            <div className="w-12 h-12 rounded-full bg-[#FCE8EE] border border-[#E91E63]/30 text-[#E91E63] flex items-center justify-center font-serif-editorial text-xl font-bold shrink-0">
              DK
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-[#141110] truncate">Dinesh Kumar Reddy</h2>
              <p className="text-[11px] text-[#7A6B61] truncate">dinesh.reddy@example.com</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                    active
                      ? 'bg-[#E91E63] text-white shadow-2xs'
                      : 'text-[#3A302B] hover:bg-[#FAF7F2] hover:text-[#E91E63]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => showToast('Logged out of demo session')}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-[#7A6B61] hover:bg-[#FCE8EE]/40 hover:text-[#E91E63] transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Right Main Content Matching Panel 6 */}
        <div className="lg:col-span-9 space-y-6">
          <div className="bg-white rounded-2xl border border-[#EAE0D2] p-5 sm:p-7 space-y-6 shadow-2xs">
            <h2 className="font-serif-editorial text-2xl font-bold text-[#141110]">
              Welcome, Dinesh!
            </h2>

            {/* Recent Orders Table */}
            <div className="space-y-3">
              <h3 className="font-serif-editorial text-lg font-bold text-[#141110]">
                Recent Orders
              </h3>
              <div className="overflow-x-auto rounded-xl border border-[#EAE0D2]">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#FAF7F2] text-[#5A4E46] border-b border-[#EAE0D2]">
                      <th className="py-3 px-4 font-bold">Order ID</th>
                      <th className="py-3 px-4 font-bold">Date</th>
                      <th className="py-3 px-4 font-bold">Status</th>
                      <th className="py-3 px-4 font-bold">Total</th>
                      <th className="py-3 px-4 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFE6D8]">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#FAF7F2]/60">
                        <td className="py-3.5 px-4 font-bold text-[#141110]">{ord.orderNumber}</td>
                        <td className="py-3.5 px-4 text-[#5A4E46]">{ord.date}</td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#DCFCE7] text-[#16A34A]">
                            {ord.fulfilmentStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-[#141110]">
                          ₹{ord.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              showToast(
                                `Order ${ord.orderNumber}: ${ord.items
                                  .map((i) => i.productName)
                                  .join(', ')}`
                              )
                            }
                            className="bg-[#E91E63] hover:bg-[#C2185B] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition cursor-pointer"
                          >
                            View Order
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom 2 Columns: Saved Addresses & Wishlist Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {/* Saved Addresses */}
              <div className="rounded-xl border border-[#EAE0D2] bg-[#FAF7F2] p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif-editorial text-lg font-bold text-[#141110]">
                    Saved Addresses
                  </h3>
                  <button
                    type="button"
                    onClick={() => showToast('Address editor opened')}
                    className="text-xs font-bold text-[#5A4E46] hover:text-[#E91E63] border border-[#DFD2C0] bg-white px-2.5 py-1 rounded-md"
                  >
                    Edit
                  </button>
                </div>
                <div className="space-y-1 text-xs text-[#3A302B]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#141110]">P. Dinesh Kumar Reddy</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FCE8EE] text-[#E91E63]">
                      Home
                    </span>
                  </div>
                  <p>Thadithota, Rajahmundry,</p>
                  <p>Andhra Pradesh - 533103</p>
                  <p className="text-[#6E5F55] pt-1">Phone: +91 90XXXXXXXX</p>
                </div>
              </div>

              {/* Wishlist Preview */}
              <div className="rounded-xl border border-[#EAE0D2] bg-[#FAF7F2] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif-editorial text-lg font-bold text-[#141110]">
                    Wishlist
                  </h3>
                  <Link to="/wishlist" className="text-xs font-bold text-[#E91E63] hover:underline">
                    View All
                  </Link>
                </div>

                <div className="space-y-2.5">
                  {wishlistedProducts.slice(0, 2).map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-white rounded-xl border border-[#EAE0D2] p-2.5 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={prod.imageUrl}
                          alt={prod.shortTitle}
                          className="w-11 h-11 object-contain rounded bg-[#FAF7F2] p-1 shrink-0"
                        />
                        <div className="min-w-0">
                          <Link
                            to={`/product/${prod.slug}`}
                            className="text-xs font-bold text-[#141110] hover:text-[#E91E63] truncate block"
                          >
                            {prod.shortTitle}
                          </Link>
                          <span className="text-xs font-extrabold text-[#141110]">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => addToCart(prod.id, prod.defaultSize, 1)}
                        className="bg-[#141110] hover:bg-[#E91E63] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shrink-0 transition cursor-pointer"
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// WISHLIST PAGE (/wishlist)
// ============================================================================
export const WishlistPage: React.FC = () => {
  const { wishlist, products } = useStore();
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-[1380px] mx-auto px-3 sm:px-6 py-6 sm:py-9 space-y-6">
      <div>
        <h1 className="font-serif-editorial text-2xl sm:text-4xl font-bold text-[#141110]">
          My Wishlist ({wishlistedProducts.length})
        </h1>
        <p className="text-xs sm:text-sm text-[#6E5F55] mt-1">
          Save your favourite skincare, makeup, haircare &amp; fragrances for quick checkout.
        </p>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#EAE0D2] p-10 text-center space-y-3">
          <p className="font-serif-editorial text-xl font-bold text-[#141110]">
            Your wishlist is currently empty
          </p>
          <Link
            to="/category/skincare"
            className="inline-block bg-[#E91E63] text-white text-xs font-bold px-6 py-2.5 rounded-full"
          >
            Explore Skincare &amp; Beauty
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          {wishlistedProducts.map((product) => (
            <ProductCard key={product.id} product={product} variant="pink-cta" />
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// PANEL 7: BRANDS PAGE (/brands)
// ============================================================================
export const BrandsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedBrandParam = searchParams.get('brand') || '';
  const [brandSearch, setBrandSearch] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('All');
  const { products } = useStore();

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const filteredBrands = BRAND_DATA.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(brandSearch.toLowerCase()) ||
      b.tagline.toLowerCase().includes(brandSearch.toLowerCase());
    const matchesLetter =
      selectedLetter === 'All' || b.name.toUpperCase().startsWith(selectedLetter);
    return matchesSearch && matchesLetter;
  });

  const brandProducts = selectedBrandParam
    ? products.filter((p) => p.brand.toLowerCase() === selectedBrandParam.toLowerCase())
    : [];

  return (
    <div className="max-w-[1380px] mx-auto px-3 sm:px-6 py-6 sm:py-9 space-y-7">
      {/* Top Banner Matching Panel 7 */}
      <div className="rounded-2xl overflow-hidden border border-[#E6D6C3] bg-gradient-to-r from-[#FAF0E6] via-[#FCE8EE] to-[#F7DFD4] p-5 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-5 shadow-2xs">
        <div className="space-y-1.5 text-center md:text-left">
          <h1 className="font-serif-editorial text-2xl sm:text-4xl font-bold text-[#141110]">
            Top Brands
          </h1>
          <p className="text-xs sm:text-sm text-[#5A4E46]">
            Shop 100% Authentic Products from Leading Beauty Brands
          </p>
        </div>
        <div className="w-full md:w-80 h-28 sm:h-32 rounded-xl overflow-hidden shrink-0">
          <img
            src="/assets/v2/banner_top_brands.png"
            alt="Top Brands at Dazzlinglooks.in"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      </div>

      {/* Search Brands + A-Z Filter Bar */}
      <div className="bg-white rounded-2xl border border-[#EAE0D2] p-4 sm:p-5 space-y-4 shadow-2xs">
        <div className="relative max-w-md mx-auto">
          <Search className="w-4 h-4 text-[#8C7B70] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={brandSearch}
            onChange={(e) => setBrandSearch(e.target.value)}
            placeholder="Search brands..."
            className="w-full bg-[#FAF7F2] border border-[#DFD2C0] rounded-full pl-10 pr-4 py-2 text-xs sm:text-sm focus:outline-none focus:border-[#E91E63]"
          />
        </div>

        <div className="flex items-center justify-center flex-wrap gap-1 sm:gap-1.5">
          <button
            type="button"
            onClick={() => {
              setSelectedLetter('All');
              setSearchParams({});
            }}
            className={`px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
              selectedLetter === 'All'
                ? 'bg-[#E91E63] text-white'
                : 'bg-[#FAF7F2] text-[#4A3E37] hover:bg-[#FCE8EE]'
            }`}
          >
            All
          </button>
          {alphabet.map((letter) => (
            <button
              key={letter}
              type="button"
              onClick={() => setSelectedLetter(letter)}
              className={`w-7 h-7 rounded-md text-xs font-bold transition cursor-pointer ${
                selectedLetter === letter
                  ? 'bg-[#E91E63] text-white'
                  : 'bg-[#FAF7F2] text-[#4A3E37] hover:bg-[#FCE8EE]'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* 15 Brand Logo Cards Grid Matching Panel 7 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-4">
        {filteredBrands.map((brand) => {
          const isSelected = selectedBrandParam.toLowerCase() === brand.name.toLowerCase();
          return (
            <button
              key={brand.id}
              type="button"
              onClick={() =>
                setSearchParams(isSelected ? {} : { brand: brand.name })
              }
              className={`bg-white rounded-2xl border p-4 flex flex-col items-center justify-between gap-3 transition cursor-pointer shadow-2xs hover:shadow-md ${
                isSelected ? 'border-2 border-[#E91E63] bg-[#FCE8EE]/20' : 'border-[#EAE0D2]'
              }`}
            >
              <div className="h-16 w-full flex items-center justify-center">
                <img
                  src={brand.logoUrl}
                  alt={brand.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="text-center">
                <div className="text-xs font-bold text-[#141110]">{brand.name}</div>
                <div className="text-[10px] text-[#7A6B61] line-clamp-1">{brand.tagline}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Brand Products Showcase */}
      {selectedBrandParam && (
        <div className="pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-editorial text-2xl font-bold text-[#141110]">
              Products by {selectedBrandParam}
            </h2>
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className="text-xs font-bold text-[#E91E63] hover:underline"
            >
              Show All Brands
            </button>
          </div>
          {brandProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {brandProducts.map((p) => (
                <ProductCard key={p.id} product={p} variant="pink-cta" />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#EAE0D2] p-6 text-center text-xs text-[#5A4E46]">
              Full range of <strong>{selectedBrandParam}</strong> is available at our Thadithota, Rajahmundry retail store. Browse our online bestsellers below:
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// PANEL 8: OFFERS & COMBO PAGE (/offers)
// ============================================================================
export const OffersPage: React.FC = () => {
  const { products, addToCart } = useStore();
  const comboProducts = products.filter((p) => p.isCombo);
  const dealProducts = products.filter((p) => !p.isCombo && p.discountPercent >= 12);

  return (
    <div className="max-w-[1380px] mx-auto px-3 sm:px-6 py-6 sm:py-9 space-y-9">
      {/* Top Banner Matching Panel 8 */}
      <div className="rounded-2xl overflow-hidden border border-[#E6D6C3] bg-gradient-to-r from-[#FAF0E6] via-[#FCE8EE] to-[#F7DFD4] p-5 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-5 shadow-2xs">
        <div className="space-y-1.5 text-center md:text-left">
          <h1 className="font-serif-editorial text-2xl sm:text-4xl font-bold text-[#141110]">
            Special Offers &amp; Beauty Combos
          </h1>
          <p className="text-xs sm:text-sm text-[#5A4E46]">
            Save More with Curated Beauty Bundles &amp; Exclusive Deals
          </p>
        </div>
        <div className="w-full md:w-80 h-32 rounded-xl overflow-hidden shrink-0">
          <img
            src="/assets/v2/banner_beauty_combos.png"
            alt="Special Offers & Beauty Combos"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      </div>

      {/* Combo Packs Section Matching Panel 8 */}
      <section className="space-y-5">
        <div className="text-center">
          <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#141110]">
            Combo Packs
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {comboProducts.map((combo) => (
            <div
              key={combo.id}
              className="bg-white rounded-2xl border border-[#EAE0D2] overflow-hidden shadow-xs hover:shadow-md transition flex flex-col"
            >
              <div className="relative aspect-[16/11] bg-gradient-to-b from-[#FFFDF9] to-[#FAF3E8] p-4 flex items-center justify-center">
                <span className="absolute top-3 left-3 bg-[#E91E63] text-white text-[11px] font-extrabold px-2.5 py-1 rounded-md shadow-2xs">
                  SAVE {combo.discountPercent}%
                </span>
                <img
                  src={combo.imageUrl}
                  alt={combo.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <Link
                    to={`/product/${combo.slug}`}
                    className="font-serif-editorial text-xl font-bold text-[#141110] hover:text-[#E91E63]"
                  >
                    {combo.shortTitle}
                  </Link>
                  <p className="text-xs text-[#6E5F55] mt-1">{combo.shortDescription}</p>
                  <div className="mt-3 flex items-baseline gap-2.5">
                    <span className="text-xl font-extrabold text-[#141110]">
                      ₹{combo.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-[#9A8B7E] line-through">
                      ₹{combo.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => addToCart(combo.id, combo.defaultSize, 1)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#E91E63] hover:bg-[#C2185B] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Limited Time Deals Banner Matching Panel 8 */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#141110]">
            Limited Time Deals
          </h2>
        </div>

        <div className="rounded-2xl overflow-hidden border border-[#E6D6C3] bg-gradient-to-r from-[#FCE8EE] via-[#FAF0E6] to-[#F7DFD4] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-3 text-center md:text-left">
            <span className="inline-block bg-[#E91E63] text-white text-xs font-extrabold px-3 py-1 rounded-full">
              EXCLUSIVE OFFERS
            </span>
            <h3 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#141110]">
              Up to 30% OFF on Best Selling Beauty Products
            </h3>
            <p className="text-xs sm:text-sm text-[#5A4E46]">
              Use coupon code <strong>DAZZLE150</strong> for flat ₹150 OFF on orders above ₹1,500.
            </p>
            <div className="pt-1">
              <Link
                to="/category/all"
                className="inline-flex items-center gap-2 bg-[#141110] hover:bg-[#E91E63] text-white text-xs font-bold px-6 py-3 rounded-full transition"
              >
                <span>Shop Deals</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="w-full md:w-80 h-36 rounded-xl overflow-hidden shrink-0">
            <img
              src="/assets/v2/banner_exclusive_offers.png"
              alt="Up to 30% OFF Exclusive Offers"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          {dealProducts.slice(0, 4).map((prod) => (
            <ProductCard key={prod.id} product={prod} variant="pink-cta" />
          ))}
        </div>
      </section>
    </div>
  );
};

// ============================================================================
// PANEL 9: ABOUT & RETAIL STORE PAGE (/about)
// ============================================================================
export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-[1380px] mx-auto px-3 sm:px-6 py-6 sm:py-9 space-y-9">
      {/* Top Banner Matching Panel 9 */}
      <div className="rounded-2xl overflow-hidden border border-[#E6D6C3] bg-gradient-to-r from-[#FAF0E6] via-[#FCE8EE] to-[#F7DFD4] p-5 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-5 shadow-2xs">
        <div className="space-y-1.5 text-center md:text-left">
          <h1 className="font-serif-editorial text-2xl sm:text-4xl font-bold text-[#141110]">
            Our Story
          </h1>
          <p className="text-xs sm:text-sm text-[#5A4E46]">
            Bringing Authentic Beauty Closer to You
          </p>
        </div>
        <div className="w-full md:w-80 h-32 rounded-xl overflow-hidden shrink-0">
          <img
            src="/assets/v2/banner_our_story.png"
            alt="Our Story — Dazzlinglooks.in"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      </div>

      {/* Welcome to Dazzlinglooks.in */}
      <div className="bg-white rounded-2xl border border-[#EAE0D2] p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-7 items-center shadow-2xs">
        <div className="lg:col-span-5 rounded-xl overflow-hidden border border-[#E5D7C3]">
          <img
            src="/assets/v2/retail_store_photo.png"
            alt="Dazzlinglooks.in Storefront"
            className="w-full h-64 sm:h-72 object-cover"
          />
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-3.5">
            <img
              src="/assets/aistudio/file_0000000063108211bead702fb91a015a_ccc1a723.png"
              alt="Dazzlinglooks.in Official Emblem"
              className="w-16 h-16 rounded-full object-cover border-2 border-[#C59B5F] shadow-sm shrink-0"
            />
            <div>
              <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#141110]">
                Welcome to Dazzlinglooks.in
              </h2>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#9A7442]">
                Beauty Begins Here
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[#4A3E37] leading-relaxed">
            Dazzlinglooks.in is your trusted beauty destination in <strong>Rajahmundry, Andhra Pradesh</strong>, offering a wide range of authentic skincare, makeup, haircare, fragrances, salon tools, and personal care products from top national and international brands.
          </p>

          <ul className="space-y-2.5 pt-1 text-xs sm:text-sm font-semibold text-[#141110]">
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span>100% Genuine &amp; Authentic Products</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span>Wide Range of Top National &amp; International Brands</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span>Affordable Prices &amp; Great Combo Deals</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span>Dedicated Customer Support</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Visit Our Retail Store Card Matching Panel 9 */}
      <div className="bg-white rounded-2xl border border-[#EAE0D2] p-5 sm:p-8 space-y-5 shadow-2xs">
        <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#141110] text-center">
          Visit Our Retail Store
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 rounded-xl overflow-hidden border border-[#E5D7C3]">
            <img
              src="/assets/v2/retail_store_photo.png"
              alt="Dazzlinglooks.in Retail Store in Thadithota, Rajahmundry"
              className="w-full h-56 object-cover"
            />
          </div>

          <div className="md:col-span-7 space-y-3">
            <h3 className="font-serif-editorial text-xl sm:text-2xl font-bold text-[#141110]">
              Dazzlinglooks.in Store
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-[#4A3E37]">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E91E63] shrink-0 mt-0.5" />
                <span>Thadithota, Rajahmundry, Andhra Pradesh - 533103</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E91E63] shrink-0" />
                <span>Phone: +91 90XXXXXXXX</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C59B5F] shrink-0" />
                <span>Open: Mon - Sat: 10:00 AM - 8:00 PM</span>
              </p>
            </div>
            <div className="pt-2">
              <a
                href="https://maps.google.com/?q=Thadithota+Rajahmundry+Andhra+Pradesh+533103"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#E91E63] hover:bg-[#C2185B] text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl transition shadow-2xs"
              >
                <span>Get Directions</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// PANEL 10: CONTACT US & FAQ PREVIEW PAGE (/contact)
// ============================================================================
export const ContactPage: React.FC = () => {
  const { showToast } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Thank you ${name}! Our Rajahmundry support team will reply shortly.`);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="max-w-[1380px] mx-auto px-3 sm:px-6 py-6 sm:py-9 space-y-9">
      <div className="text-center space-y-1.5">
        <h1 className="font-serif-editorial text-2xl sm:text-4xl font-bold text-[#141110]">
          Contact Us
        </h1>
        <p className="text-xs sm:text-sm text-[#5A4E46]">
          We&apos;re Here to Help! Reach Out to Us Anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Card: Get in Touch + WhatsApp QR */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#EAE0D2] p-5 sm:p-7 space-y-5 shadow-2xs">
          <h2 className="font-serif-editorial text-xl sm:text-2xl font-bold text-[#141110]">
            Get in Touch
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-[#4A3E37]">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#FCE8EE] text-[#E91E63] flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-[#141110]">Store Address</div>
                <p>Thadithota, Rajahmundry, Andhra Pradesh - 533103</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#FCE8EE] text-[#E91E63] flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-[#141110]">Phone</div>
                <p>+91 90XXXXXXXX</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#FCE8EE] text-[#E91E63] flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-[#141110]">Email</div>
                <p>support@dazzlinglooks.in</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#FAF3E8] text-[#C59B5F] flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-[#141110]">Store Hours</div>
                <p>Mon - Sat: 10:00 AM - 8:00 PM</p>
              </div>
            </div>
          </div>

          {/* WhatsApp QR Box */}
          <div className="pt-3 border-t border-[#EFE6D8] flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#25D366] text-white flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#141110]">
                  Chat with Us on WhatsApp
                </span>
              </div>
              <p className="text-[11px] text-[#6E5F55]">
                Scan QR for fast order &amp; product support
              </p>
            </div>
            <div className="text-center shrink-0">
              <div className="w-20 h-20 rounded-xl border border-[#E5D7C3] p-1 bg-white">
                <img
                  src="/assets/v2/whatsapp_qr.png"
                  alt="WhatsApp QR"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[10px] font-bold text-[#141110] block mt-0.5">Scan QR</span>
            </div>
          </div>
        </div>

        {/* Right Card: Send Us a Message */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#EAE0D2] p-5 sm:p-7 space-y-5 shadow-2xs">
          <h2 className="font-serif-editorial text-xl sm:text-2xl font-bold text-[#141110]">
            Send Us a Message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                required
                className="w-full bg-[#FAF7F2] border border-[#DFD2C0] rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-[#E91E63]"
              />
            </div>
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
                required
                className="w-full bg-[#FAF7F2] border border-[#DFD2C0] rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-[#E91E63]"
              />
            </div>
            <div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                required
                className="w-full bg-[#FAF7F2] border border-[#DFD2C0] rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-[#E91E63]"
              />
            </div>
            <div>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message"
                required
                className="w-full bg-[#FAF7F2] border border-[#DFD2C0] rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-[#E91E63]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-[#E91E63] hover:bg-[#C2185B] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>

      {/* Frequently Asked Questions Preview Matching Panel 10 */}
      <div className="bg-white rounded-2xl border border-[#EAE0D2] p-5 sm:p-7 space-y-5 shadow-2xs">
        <h2 className="font-serif-editorial text-xl sm:text-2xl font-bold text-[#141110] text-center">
          Frequently Asked Questions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FAQ_ITEMS.slice(0, 4).map((faq, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE0D2] space-y-1.5"
            >
              <h3 className="text-xs sm:text-sm font-bold text-[#141110]">Q: {faq.question}</h3>
              <p className="text-xs text-[#5A4E46] leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="text-center pt-1">
          <Link
            to="/faq"
            className="inline-flex items-center gap-2 bg-[#141110] hover:bg-[#E91E63] text-white text-xs font-bold px-6 py-2.5 rounded-full transition"
          >
            <span>View All FAQs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// PANEL 11: POLICIES & INFORMATION PAGE (/shipping-policy, /returns-policy, /privacy-policy, /terms, /faq)
// ============================================================================
export const PolicyPage: React.FC<{
  type: 'shipping' | 'returns' | 'privacy' | 'terms' | 'faq';
}> = ({ type }) => {
  const [activeTab, setActiveTab] = useState(type);

  React.useEffect(() => {
    setActiveTab(type);
  }, [type]);

  const policyTabs = [
    { id: 'shipping', label: 'Shipping & Delivery', path: '/shipping-policy', icon: Truck },
    { id: 'returns', label: 'Returns & Refunds', path: '/returns-policy', icon: RotateCcw },
    { id: 'privacy', label: 'Privacy Policy', path: '/privacy-policy', icon: ShieldCheck },
    { id: 'terms', label: 'Terms & Conditions', path: '/terms', icon: FileText },
    { id: 'faq', label: 'FAQs', path: '/faq', icon: HelpCircle },
  ];

  return (
    <div className="max-w-[1380px] mx-auto px-3 sm:px-6 py-6 sm:py-9">
      <h1 className="font-serif-editorial text-2xl sm:text-4xl font-bold text-[#141110] mb-6">
        Policies &amp; Information
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Sidebar Tabs Matching Panel 11 */}
        <aside className="lg:col-span-3 bg-white rounded-2xl border border-[#EAE0D2] p-4 space-y-1.5 h-fit shadow-2xs">
          {policyTabs.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <Link
                key={t.id}
                to={t.path}
                onClick={() => setActiveTab(t.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition ${
                  active
                    ? 'bg-[#E91E63] text-white shadow-2xs'
                    : 'text-[#3A302B] hover:bg-[#FAF7F2] hover:text-[#E91E63]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{t.label}</span>
              </Link>
            );
          })}
        </aside>

        {/* Right Policy Content Matching Panel 11 */}
        <div className="lg:col-span-9 space-y-5">
          {/* Shipping & Delivery Block */}
          <div
            className={`bg-white rounded-2xl border p-5 sm:p-7 space-y-3 shadow-2xs ${
              activeTab === 'shipping' ? 'border-[#E91E63]' : 'border-[#EAE0D2]'
            }`}
          >
            <h2 className="font-serif-editorial text-xl sm:text-2xl font-bold text-[#141110]">
              Shipping &amp; Delivery
            </h2>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#3A302B]">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <span>
                  <strong>Free Delivery on orders ₹2,500+</strong> across Rajahmundry &amp; Andhra Pradesh.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <span>
                  <strong>Flat ₹99 Shipping</strong> on orders below ₹2,500.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <span>
                  Orders are processed within 24–48 hours and delivered within 2–5 business days (1–2 days Express in Rajahmundry).
                </span>
              </li>
            </ul>
          </div>

          {/* Returns & Refunds Block */}
          <div
            className={`bg-white rounded-2xl border p-5 sm:p-7 space-y-3 shadow-2xs ${
              activeTab === 'returns' ? 'border-[#E91E63]' : 'border-[#EAE0D2]'
            }`}
          >
            <h2 className="font-serif-editorial text-xl sm:text-2xl font-bold text-[#141110]">
              Returns &amp; Refunds
            </h2>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#3A302B]">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <span>
                  Easy 7-day returns on damaged, defective, or wrong products delivered.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <span>
                  Products must be unused, unsealed, and in original packaging with invoice tags intact.
                </span>
              </li>
            </ul>
          </div>

          {/* Privacy Policy Block */}
          <div
            className={`bg-white rounded-2xl border p-5 sm:p-7 space-y-3 shadow-2xs ${
              activeTab === 'privacy' ? 'border-[#E91E63]' : 'border-[#EAE0D2]'
            }`}
          >
            <h2 className="font-serif-editorial text-xl sm:text-2xl font-bold text-[#141110]">
              Privacy Policy
            </h2>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#3A302B]">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <span>
                  We respect your privacy and protect your personal information with industry-standard encryption.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <span>
                  Customer details are used solely for order fulfillment and customer support and are never shared with third-party marketers.
                </span>
              </li>
            </ul>
          </div>

          {/* Terms & Conditions Block */}
          <div
            className={`bg-white rounded-2xl border p-5 sm:p-7 space-y-3 shadow-2xs ${
              activeTab === 'terms' ? 'border-[#E91E63]' : 'border-[#EAE0D2]'
            }`}
          >
            <h2 className="font-serif-editorial text-xl sm:text-2xl font-bold text-[#141110]">
              Terms &amp; Conditions
            </h2>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#3A302B]">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <span>
                  All products listed on Dazzlinglooks.in are 100% authentic and subject to stock availability.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <span>
                  Prices and combo offers are subject to change without prior notice. Always perform a patch test before using new cosmetic or skincare products.
                </span>
              </li>
            </ul>
          </div>

          {/* FAQs Block */}
          <div
            className={`bg-white rounded-2xl border p-5 sm:p-7 space-y-4 shadow-2xs ${
              activeTab === 'faq' ? 'border-[#E91E63]' : 'border-[#EAE0D2]'
            }`}
          >
            <h2 className="font-serif-editorial text-xl sm:text-2xl font-bold text-[#141110]">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {FAQ_ITEMS.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE0D2] space-y-1"
                >
                  <div className="text-xs sm:text-sm font-bold text-[#141110]">
                    {item.question}
                  </div>
                  <p className="text-xs text-[#5A4E46] leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FAQPage: React.FC = () => <PolicyPage type="faq" />;
