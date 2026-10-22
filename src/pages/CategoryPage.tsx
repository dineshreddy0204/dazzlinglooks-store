import React, { useState, useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ChevronRight, SlidersHorizontal, Star, Grid, List, RotateCcw } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/sampleData';
import { ProductCard } from '../components/ProductCard';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const { products } = useStore();

  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(6500);
  const [selectedSkinType, setSelectedSkinType] = useState<string>('All');
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('popularity');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const currentCategoryInfo = CATEGORIES.find((c) => c.slug === slug);

  const pageTitle = queryParam
    ? `Search Results for "${queryParam}"`
    : slug === 'all'
    ? 'All Beauty Products'
    : slug === 'new-arrivals'
    ? 'New Arrivals'
    : currentCategoryInfo?.name || 'Skincare';

  const pageSubtitle = queryParam
    ? `Showing verified Dazzlinglooks.in products matching "${queryParam}"`
    : currentCategoryInfo?.description ||
      'Explore our range of genuine skincare & beauty products for every skin type';

  const subcategoriesList = [
    'Cleansers',
    'Moisturisers',
    'Serums',
    'Toners',
    'Lip Care',
    'Luxury Perfume',
  ];

  const brandsList = [
    'Cetaphil',
    'CeraVe',
    'Minimalist',
    'The Ordinary',
    'Plum',
    'Mamaearth',
    'Laneige',
    'Kay Beauty',
    'M.A.C',
    "L'Oréal Professionnel",
    'Estée Lauder',
    'Versace',
    'Bioderma',
    'IKONIC Professional',
    'RICA WAX',
  ];

  const skinTypesList = ['All', 'Normal', 'Oily', 'Dry', 'Combination', 'Sensitive'];

  const toggleSubcategory = (sub: string) => {
    setSelectedSubcategories((prev) =>
      prev.includes(sub) ? prev.filter((item) => item !== sub) : [...prev, sub]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((item) => item !== brand) : [...prev, brand]
    );
  };

  const resetFilters = () => {
    setSelectedSubcategories([]);
    setSelectedBrands([]);
    setMaxPrice(6500);
    setSelectedSkinType('All');
    setMinRating(0);
    setSortBy('popularity');
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (queryParam) {
          const q = queryParam.toLowerCase();
          const haystack = `${p.title} ${p.brand} ${p.category} ${p.subcategory} ${p.concerns.join(' ')} ${p.ingredients.join(' ')}`.toLowerCase();
          if (!haystack.includes(q)) return false;
        } else if (slug && slug !== 'all') {
          if (slug === 'new-arrivals') {
            if (!p.isNewArrival && !p.isBestSeller) return false;
          } else if (slug === 'combo-offers') {
            if (!p.isCombo && p.category !== 'Combo Offers') return false;
          } else {
            const slugToCat: Record<string, string> = {
              skincare: 'Skincare',
              makeup: 'Makeup',
              haircare: 'Haircare',
              fragrances: 'Fragrances',
              'salon-tools': 'Salon Tools',
              'personal-care': 'Personal Care',
            };
            const targetCat = slugToCat[slug];
            if (targetCat && p.category !== targetCat) return false;
          }
        }

        if (
          selectedSubcategories.length > 0 &&
          !selectedSubcategories.includes(p.subcategory)
        ) {
          return false;
        }

        if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
          return false;
        }

        if (p.price > maxPrice) return false;

        if (
          selectedSkinType !== 'All' &&
          !p.skinTypes.some((st) => st.toLowerCase().includes(selectedSkinType.toLowerCase()))
        ) {
          return false;
        }

        if (minRating > 0 && p.rating < minRating) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return b.reviewCount - a.reviewCount;
      });
  }, [
    products,
    slug,
    queryParam,
    selectedSubcategories,
    selectedBrands,
    maxPrice,
    selectedSkinType,
    minRating,
    sortBy,
  ]);

  return (
    <div className="max-w-[1380px] mx-auto px-3 sm:px-6 py-5 sm:py-7">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[#7A6B61] mb-4">
        <Link to="/" className="hover:text-[#E91E63]">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-[#141110]">{pageTitle}</span>
      </nav>

      {/* Top Category Banner Matching Panel 2 Reference */}
      <div className="rounded-2xl overflow-hidden border border-[#E6D6C3] bg-gradient-to-r from-[#FAF0E6] via-[#FCE8EE] to-[#F7DFD4] p-5 sm:p-7 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="space-y-1.5 text-center sm:text-left">
          <h1 className="font-serif-editorial text-2xl sm:text-4xl font-bold text-[#141110]">
            {pageTitle}
          </h1>
          <p className="text-xs sm:text-sm text-[#5A4E46] max-w-xl">{pageSubtitle}</p>
        </div>
        <div className="w-48 sm:w-64 h-28 sm:h-32 rounded-xl overflow-hidden shrink-0">
          <img
            src="/assets/v2/promo_skincare_right.png"
            alt={pageTitle}
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="inline-flex items-center gap-2 bg-white border border-[#E2D5C4] px-4 py-2 rounded-xl text-xs font-bold text-[#141110]"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#E91E63]" />
          <span>{mobileFiltersOpen ? 'Hide Filters' : 'Filter Products'}</span>
        </button>
        <span className="text-xs text-[#6E5F55] font-medium">
          Showing {filteredProducts.length} Products
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar Filters (Panel 2 Reference) */}
        <aside
          className={`lg:col-span-3 ${
            mobileFiltersOpen ? 'block' : 'hidden lg:block'
          } bg-white rounded-2xl border border-[#EAE0D2] p-4 sm:p-5 h-fit space-y-5 shadow-2xs`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#EFE6D8]">
            <h2 className="font-serif-editorial text-lg font-bold text-[#141110]">Filter By</h2>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#E91E63] hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Subcategory Filter */}
          <div className="space-y-2 pb-4 border-b border-[#EFE6D8]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#141110]">Category</h3>
            <div className="space-y-1.5">
              {subcategoriesList.map((sub) => (
                <label
                  key={sub}
                  className="flex items-center gap-2 text-xs text-[#4A3E37] cursor-pointer hover:text-[#E91E63]"
                >
                  <input
                    type="checkbox"
                    checked={selectedSubcategories.includes(sub)}
                    onChange={() => toggleSubcategory(sub)}
                    className="rounded border-[#D8C7B4] text-[#E91E63] focus:ring-[#E91E63]"
                  />
                  <span>{sub}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2 pb-4 border-b border-[#EFE6D8]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#141110]">Brand</h3>
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {brandsList.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-2 text-xs text-[#4A3E37] cursor-pointer hover:text-[#E91E63]"
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="rounded border-[#D8C7B4] text-[#E91E63] focus:ring-[#E91E63]"
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Slider */}
          <div className="space-y-2 pb-4 border-b border-[#EFE6D8]">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#141110]">Price</h3>
              <span className="text-xs font-bold text-[#E91E63]">
                Up to ₹{maxPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min={100}
              max={6500}
              step={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full luxury-range"
            />
            <div className="flex items-center justify-between text-[11px] text-[#7A6B61]">
              <span>₹100</span>
              <span>₹6,500</span>
            </div>
          </div>

          {/* Skin Type Filter */}
          <div className="space-y-2 pb-4 border-b border-[#EFE6D8]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#141110]">
              Skin Type
            </h3>
            <div className="space-y-1.5">
              {skinTypesList.map((st) => (
                <label
                  key={st}
                  className="flex items-center gap-2 text-xs text-[#4A3E37] cursor-pointer hover:text-[#E91E63]"
                >
                  <input
                    type="radio"
                    name="skinType"
                    checked={selectedSkinType === st}
                    onChange={() => setSelectedSkinType(st)}
                    className="text-[#E91E63] focus:ring-[#E91E63]"
                  />
                  <span>{st}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Customer Rating */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#141110]">Rating</h3>
            <div className="space-y-1.5">
              {[4, 3].map((stars) => (
                <button
                  key={stars}
                  type="button"
                  onClick={() => setMinRating(minRating === stars ? 0 : stars)}
                  className={`w-full flex items-center gap-1.5 text-xs py-1 px-2 rounded-lg transition cursor-pointer ${
                    minRating === stars ? 'bg-[#FCE8EE] font-bold text-[#E91E63]' : 'text-[#4A3E37]'
                  }`}
                >
                  <div className="flex items-center text-[#F59E0B]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < stars ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-[#E5D7C3]'
                        }`}
                      />
                    ))}
                  </div>
                  <span>&amp; above</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileFiltersOpen(false)}
            className="w-full py-2.5 px-4 rounded-xl bg-[#E91E63] hover:bg-[#C2185B] text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            Apply Filters
          </button>
        </aside>

        {/* Right Product Listing Grid */}
        <div className="lg:col-span-9 space-y-5">
          {/* Top Sort & Count Bar */}
          <div className="bg-white rounded-xl border border-[#EAE0D2] px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            <p className="text-xs sm:text-sm text-[#4A3E37] font-medium">
              Showing <strong className="text-[#141110]">1–{filteredProducts.length}</strong> of{' '}
              <strong className="text-[#141110]">{filteredProducts.length}</strong> Products
            </p>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#7A6B61]">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#FAF7F2] border border-[#DFD2C0] rounded-lg px-3 py-1.5 text-xs font-semibold text-[#141110] focus:outline-none focus:border-[#E91E63]"
                >
                  <option value="popularity">Popularity</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                </select>
              </div>

              <div className="hidden sm:flex items-center gap-1 border border-[#E5D7C3] rounded-lg p-1 bg-[#FAF7F2]">
                <span className="p-1 rounded bg-white text-[#E91E63] shadow-2xs">
                  <Grid className="w-3.5 h-3.5" />
                </span>
                <span className="p-1 rounded text-[#8C7B70]">
                  <List className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#EAE0D2] p-10 text-center space-y-3">
              <p className="font-serif-editorial text-xl font-bold text-[#141110]">
                No matching beauty products found
              </p>
              <p className="text-xs text-[#6E5F55]">
                Try clearing a filter or adjusting your price slider.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="inline-block bg-[#E91E63] text-white text-xs font-bold px-5 py-2.5 rounded-full"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} variant="pink-cta" />
              ))}
            </div>
          )}

          {/* Pagination Row Matching Panel 2 */}
          <div className="pt-4 flex items-center justify-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#E91E63] text-white text-xs font-bold flex items-center justify-center shadow-2xs">
              1
            </span>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-8 h-8 rounded-lg bg-white border border-[#E2D5C4] text-xs font-semibold text-[#141110] hover:border-[#E91E63]"
            >
              2
            </button>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-8 h-8 rounded-lg bg-white border border-[#E2D5C4] text-xs font-semibold text-[#141110] hover:border-[#E91E63]"
            >
              3
            </button>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-3 h-8 rounded-lg bg-white border border-[#E2D5C4] text-xs font-semibold text-[#141110] hover:border-[#E91E63]"
            >
              Next &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
