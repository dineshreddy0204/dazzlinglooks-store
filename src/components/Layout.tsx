import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  User,
  Heart,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  Truck,
  CheckCircle2,
  RotateCcw,
  Lock,
  MapPin,
  Phone,
  Mail,
  Clock,
  Home,
  Grid,
  Tag,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/sampleData';
import { DazzlingBeautyFloatingChat } from './DazzlingBeautyAI';
import { useVisibilityPause } from './LuxuryMotion';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useVisibilityPause();

  const { cartCount, wishlist, toastMessage } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartBadgePop, setCartBadgePop] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Passive scroll listener for subtle header elevation change
  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY > 18;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Micro-pop on cart badge when cartCount changes
  useEffect(() => {
    setCartBadgePop(true);
    const t = window.setTimeout(() => setCartBadgePop(false), 380);
    return () => window.clearTimeout(t);
  }, [cartCount]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShopDropdownOpen(false);
  }, [location.pathname, location.search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    } else {
      navigate('/category/skincare');
    }
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Shop All', path: '/category/all', hasDropdown: true },
    { label: 'Skincare', path: '/category/skincare' },
    { label: 'Makeup', path: '/category/makeup' },
    { label: 'Haircare', path: '/category/haircare' },
    { label: 'Fragrances', path: '/category/fragrances' },
    { label: 'Salon Tools', path: '/category/salon-tools' },
    { label: 'Personal Care', path: '/category/personal-care' },
    { label: 'Brands', path: '/brands' },
    { label: 'Combo Offers', path: '/offers' },
    { label: 'New Arrivals', path: '/category/new-arrivals' },
    { label: 'Deals', path: '/offers?tab=deals' },
  ];

  const isNavActive = (itemPath: string, label: string) => {
    if (itemPath === '/' && location.pathname === '/') return true;
    if (label === 'Deals' && location.search.includes('deals')) return true;
    if (
      label === 'Combo Offers' &&
      location.pathname === '/offers' &&
      !location.search.includes('deals')
    )
      return true;
    if (itemPath !== '/' && !itemPath.includes('?') && location.pathname === itemPath) return true;
    return false;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A1615] pb-16 md:pb-0">
      {/* Toast Notification with Smooth Slide-In */}
      {toastMessage && (
        <div className="lux-msg-enter fixed top-16 right-4 z-50 bg-[#141110] text-white px-4 py-2.5 rounded-xl shadow-xl border border-[#C59B5F] flex items-center gap-2 text-xs sm:text-sm">
          <Sparkles className="w-4 h-4 text-[#E91E63] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Top Black Announcement Bar */}
      <div className="bg-[#141110] text-[#F5EFE6] text-[11px] sm:text-xs py-2 px-3 border-b border-[#2C2522]">
        <div className="max-w-[1380px] mx-auto flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-1 text-center">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <Truck className="w-3.5 h-3.5 text-[#E91E63] shrink-0" />
            <span>Free Delivery on orders ₹2,500+ (Rajahmundry &amp; AP)</span>
          </span>
          <span className="hidden sm:inline text-[#5C5049]">|</span>
          <span className="inline-flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
            <span>100% Authentic Products</span>
          </span>
          <span className="hidden md:inline text-[#5C5049]">|</span>
          <span className="hidden md:inline-flex items-center gap-1.5 font-medium">
            <RotateCcw className="w-3.5 h-3.5 text-[#F3D19C] shrink-0" />
            <span>Easy Returns</span>
          </span>
          <span className="hidden lg:inline text-[#5C5049]">|</span>
          <span className="hidden lg:inline-flex items-center gap-1.5 font-medium">
            <Lock className="w-3.5 h-3.5 text-[#F3D19C] shrink-0" />
            <span>Secure Payments</span>
          </span>
        </div>
      </div>

      {/* 2. Main Header Row with Subtle Scroll Elevation */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF7F2]/96 backdrop-blur-md border-b border-[#DFD1BE] shadow-[0_8px_28px_rgba(20,17,16,0.06)]'
            : 'bg-[#FAF7F2]/95 backdrop-blur-xs border-b border-[#E6DAC8] shadow-[0_2px_10px_rgba(20,17,16,0.02)]'
        }`}
      >
        <div
          className={`max-w-[1380px] mx-auto px-3 sm:px-6 flex items-center justify-between gap-3 sm:gap-6 transition-all duration-300 ${
            isScrolled ? 'py-2 sm:py-2.5' : 'py-2.5 sm:py-3'
          }`}
        >
          {/* Mobile Hamburger + Logo */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg border border-[#E2D5C4] text-[#141110] hover:bg-[#F3ECE2] transition cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-[#C59B5F] shadow-sm bg-[#FAF7F2] shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.03]">
                <img
                  src="/assets/aistudio/file_0000000063108211bead702fb91a015a_ccc1a723.png"
                  alt="Dazzlinglooks.in — Beauty Begins Here"
                  className="w-full h-full object-cover scale-[1.06] group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="hidden sm:block">
                <span className="font-serif-editorial text-lg sm:text-xl font-bold text-[#141110] tracking-tight block leading-none">
                  Dazzling<span className="text-[#E91E63]">looks</span>.in
                </span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-[#9A7442] font-semibold block mt-1">
                  Beauty Begins Here
                </span>
              </div>
            </Link>
          </div>

          {/* Wide Rounded Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#7D6E63] absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for skincare, makeup, haircare, fragrances..."
                className="w-full bg-white border border-[#DFD2C0] focus:border-[#E91E63] focus:shadow-[0_0_0_3px_rgba(233,30,99,0.08)] rounded-full pl-10 pr-20 py-2 sm:py-2.5 text-xs sm:text-sm text-[#141110] placeholder-[#8A7B70] focus:outline-none shadow-2xs transition-all duration-200"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-16 text-xs text-[#8A7B70] hover:text-[#141110]"
                >
                  Clear
                </button>
              )}
              <button
                type="submit"
                className="lux-btn absolute right-1.5 bg-[#141110] hover:bg-[#E91E63] text-white text-[11px] font-semibold px-3.5 py-1.5 rounded-full cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>

          {/* Right Utility Icons: Account, Wishlist, Cart */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            <Link
              to="/account"
              className="flex items-center gap-1.5 text-[#141110] hover:text-[#E91E63] transition-colors text-xs sm:text-sm font-medium group"
            >
              <User className="w-5 h-5 stroke-[1.8] transition-transform duration-200 group-hover:-translate-y-0.5" />
              <span className="hidden md:inline">Account</span>
            </Link>

            <Link
              to="/wishlist"
              className="relative flex items-center gap-1.5 text-[#141110] hover:text-[#E91E63] transition-colors text-xs sm:text-sm font-medium group"
            >
              <div className="relative transition-transform duration-200 group-hover:-translate-y-0.5">
                <Heart className="w-5 h-5 stroke-[1.8]" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#FCE8EE] border border-[#E91E63] text-[#E91E63] text-[10px] font-bold flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </div>
              <span className="hidden md:inline">Wishlist</span>
            </Link>

            <Link
              to="/cart"
              className="relative flex items-center gap-1.5 text-[#141110] hover:text-[#E91E63] transition-colors text-xs sm:text-sm font-medium group"
            >
              <div className="relative transition-transform duration-200 group-hover:-translate-y-0.5">
                <ShoppingCart className="w-5 h-5 stroke-[1.8]" />
                <span
                  className={`absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-[#E91E63] text-white text-[10px] font-bold flex items-center justify-center shadow-2xs ${
                    cartBadgePop ? 'lux-heart-pop' : ''
                  }`}
                >
                  {cartCount}
                </span>
              </div>
              <span className="hidden md:inline">Cart</span>
            </Link>
          </div>
        </div>

        {/* 3. Desktop 12-Item Category Navigation Row */}
        <nav className="hidden lg:block border-t border-[#ECE2D4] bg-[#FAF7F2]">
          <div className="max-w-[1380px] mx-auto px-4 flex items-center justify-center gap-1 xl:gap-2 py-1.5">
            {navItems.map((item) => {
              const active = isNavActive(item.path, item.label);
              if (item.hasDropdown) {
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setShopDropdownOpen(true)}
                    onMouseLeave={() => setShopDropdownOpen(false)}
                  >
                    <Link
                      to={item.path}
                      className={`lux-nav-link inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs xl:text-[13px] font-medium ${
                        active
                          ? 'bg-[#FCE8EE] text-[#141110] font-semibold border-b-2 border-[#E91E63]'
                          : 'text-[#2B2421] hover:text-[#E91E63] hover:bg-[#F4EDE2]'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-250 ${
                          shopDropdownOpen ? 'rotate-180 text-[#E91E63]' : ''
                        }`}
                      />
                    </Link>

                    {shopDropdownOpen && (
                      <div className="lux-modal-enter absolute left-0 top-full pt-1 w-64 z-50">
                        <div className="bg-white rounded-xl border border-[#E5D7C3] shadow-xl p-2 grid grid-cols-1 gap-0.5">
                          {CATEGORIES.map((cat) => (
                            <Link
                              key={cat.id}
                              to={cat.slug === 'combo-offers' ? '/offers' : `/category/${cat.slug}`}
                              onClick={() => setShopDropdownOpen(false)}
                              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-[#231F1E] hover:bg-[#FCE8EE]/60 hover:text-[#E91E63] transition-all duration-200 hover:translate-x-0.5"
                            >
                              <span>{cat.name}</span>
                              {cat.badge && (
                                <span className="text-[9px] font-bold bg-[#E91E63] text-white px-1.5 py-0.5 rounded">
                                  {cat.badge}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`lux-nav-link px-3 py-1.5 rounded-md text-xs xl:text-[13px] font-medium whitespace-nowrap ${
                    active
                      ? 'bg-[#FCE8EE] text-[#141110] font-semibold border-b-2 border-[#E91E63]'
                      : 'text-[#2B2421] hover:text-[#E91E63] hover:bg-[#F4EDE2]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Mobile Drawer Navigation */}
        {mobileMenuOpen && (
          <div className="lux-modal-enter lg:hidden bg-white border-t border-[#E5D7C3] px-4 py-4 space-y-2 shadow-xl max-h-[75vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold border transition ${
                    isNavActive(item.path, item.label)
                      ? 'bg-[#FCE8EE] border-[#E91E63] text-[#E91E63]'
                      : 'bg-[#FAF7F2] border-[#E8DCCB] text-[#231F1E]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="pt-2 border-t border-[#EFE6D8] flex flex-wrap gap-3 text-xs text-[#6B5D53]">
              <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
                Our Story &amp; Store
              </Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                Contact Us
              </Link>
              <Link to="/shipping-policy" onClick={() => setMobileMenuOpen(false)}>
                Policies
              </Link>
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                Store Admin
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Page Content with Restrained Silk Route Transition */}
      <main key={location.pathname} className="flex-1 lux-page-enter">
        {children}
      </main>

      {/* 4. Dark Luxury Footer Matching Reference Image 1 */}
      <footer className="bg-[#121010] text-[#E6DDD2] border-t border-[#2D2623]">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 pb-8 border-b border-[#2B2420]">
            {/* Brand Column */}
            <div className="lg:col-span-4 space-y-4">
              <Link to="/" className="inline-flex items-center gap-3.5 group">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#C59B5F] bg-[#FAF7F2] shrink-0 shadow-md">
                  <img
                    src="/assets/aistudio/file_0000000063108211bead702fb91a015a_ccc1a723.png"
                    alt="Dazzlinglooks.in — Beauty Begins Here"
                    className="w-full h-full object-cover scale-[1.06] group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div>
                  <span className="font-serif-editorial text-xl font-bold text-white block">
                    Dazzling<span className="text-[#E91E63]">looks</span>.in
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-[#C59B5F] block">
                    Beauty Begins Here
                  </span>
                </div>
              </Link>
              <p className="text-xs sm:text-sm text-[#B8ACA0] leading-relaxed max-w-sm">
                Your One-Stop Beauty Store for Authentic Skincare, Makeup, Haircare, Fragrances &amp; More.
              </p>
              <div className="flex items-center gap-2.5 pt-1">
                <a
                  href="#social-instagram"
                  onClick={(e) => e.preventDefault()}
                  className="lux-btn w-8 h-8 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center text-xs font-bold shadow-xs"
                  aria-label="Instagram"
                >
                  IG
                </a>
                <a
                  href="#social-facebook"
                  onClick={(e) => e.preventDefault()}
                  className="lux-btn w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-xs font-bold shadow-xs"
                  aria-label="Facebook"
                >
                  f
                </a>
                <a
                  href="#social-whatsapp"
                  onClick={(e) => e.preventDefault()}
                  className="lux-btn w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center text-xs font-bold shadow-xs"
                  aria-label="WhatsApp"
                >
                  WA
                </a>
                <a
                  href="#social-youtube"
                  onClick={(e) => e.preventDefault()}
                  className="lux-btn w-8 h-8 rounded-full bg-[#FF0000] text-white flex items-center justify-center text-xs font-bold shadow-xs"
                  aria-label="YouTube"
                >
                  YT
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2 space-y-2.5">
              <h3 className="font-sans-clean text-sm font-bold text-white tracking-wide">
                Quick Links
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-[#B8ACA0]">
                <li>
                  <Link to="/" className="hover:text-[#F3D19C] transition">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/category/all" className="hover:text-[#F3D19C] transition">
                    Shop All
                  </Link>
                </li>
                <li>
                  <Link to="/brands" className="hover:text-[#F3D19C] transition">
                    Brands
                  </Link>
                </li>
                <li>
                  <Link to="/offers" className="hover:text-[#F3D19C] transition">
                    Combo Offers
                  </Link>
                </li>
                <li>
                  <Link to="/category/new-arrivals" className="hover:text-[#F3D19C] transition">
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-[#F3D19C] transition">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Help & Support */}
            <div className="lg:col-span-3 space-y-2.5">
              <h3 className="font-sans-clean text-sm font-bold text-white tracking-wide">
                Help &amp; Support
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-[#B8ACA0]">
                <li>
                  <Link to="/contact" className="hover:text-[#F3D19C] transition">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/shipping-policy" className="hover:text-[#F3D19C] transition">
                    Shipping &amp; Delivery
                  </Link>
                </li>
                <li>
                  <Link to="/returns-policy" className="hover:text-[#F3D19C] transition">
                    Returns &amp; Refunds
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-[#F3D19C] transition">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="hover:text-[#F3D19C] transition">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-[#F3D19C] transition">
                    Terms &amp; Conditions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Information & Payment Icons */}
            <div className="lg:col-span-3 space-y-3">
              <h3 className="font-sans-clean text-sm font-bold text-white tracking-wide">
                Contact Information
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#B8ACA0]">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#E91E63] shrink-0 mt-0.5" />
                  <span>Thadithota, Rajahmundry, Andhra Pradesh - 533103</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#E91E63] shrink-0" />
                  <span>+91 90XXXXXXXX</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#E91E63] shrink-0" />
                  <span>support@dazzlinglooks.in</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C59B5F] shrink-0" />
                  <span>Mon - Sat: 10AM - 8PM</span>
                </li>
              </ul>

              <div className="pt-2">
                <p className="text-xs font-semibold text-white mb-2">We Accept:</p>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded bg-white text-[#1A1F71] font-extrabold text-[11px] tracking-wider">
                    VISA
                  </span>
                  <span className="px-2.5 py-1 rounded bg-white text-[#EB001B] font-bold text-[11px]">
                    Mastercard
                  </span>
                  <span className="px-2.5 py-1 rounded bg-white text-[#097969] font-bold text-[11px]">
                    RuPay
                  </span>
                  <span className="px-2.5 py-1 rounded bg-white text-[#231F1E] font-extrabold text-[11px]">
                    UPI
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#8E8277]">
            <p>© 2024 Dazzlinglooks.in. All Rights Reserved.</p>
            <div className="flex items-center gap-4">
              <Link to="/about" className="hover:text-white transition">
                Retail Store: Thadithota, Rajahmundry
              </Link>
              <span>·</span>
              <Link to="/admin" className="hover:text-[#F3D19C] transition">
                Store Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom App Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-md border-t border-[#E5D7C3] px-2 py-1.5 flex items-center justify-around shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <Link
          to="/"
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium active:scale-95 transition-transform ${
            location.pathname === '/' ? 'text-[#E91E63] font-semibold' : 'text-[#5A4E46]'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </Link>
        <Link
          to="/category/skincare"
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium active:scale-95 transition-transform ${
            location.pathname.startsWith('/category')
              ? 'text-[#E91E63] font-semibold'
              : 'text-[#5A4E46]'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Shop</span>
        </Link>
        <Link
          to="/offers"
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium active:scale-95 transition-transform ${
            location.pathname === '/offers' ? 'text-[#E91E63] font-semibold' : 'text-[#5A4E46]'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Combos</span>
        </Link>
        <Link
          to="/wishlist"
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium active:scale-95 transition-transform ${
            location.pathname === '/wishlist' ? 'text-[#E91E63] font-semibold' : 'text-[#5A4E46]'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Wishlist</span>
        </Link>
        <Link
          to="/cart"
          className={`relative flex flex-col items-center gap-0.5 text-[10px] font-medium active:scale-95 transition-transform ${
            location.pathname === '/cart' ? 'text-[#E91E63] font-semibold' : 'text-[#5A4E46]'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span className="absolute -top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#E91E63] text-white text-[9px] font-bold flex items-center justify-center">
            {cartCount}
          </span>
          <span>Cart</span>
        </Link>
      </div>

      {/* Floating Dazzling Beauty AI Assistant across the storefront */}
      <DazzlingBeautyFloatingChat />
    </div>
  );
};
