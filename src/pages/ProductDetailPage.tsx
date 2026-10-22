import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Star,
  Heart,
  ShoppingCart,
  CheckCircle2,
  Truck,
  RotateCcw,
  MapPin,
  Minus,
  Plus,
  Check,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { LuxuryReveal } from '../components/LuxuryMotion';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, wishlist } = useStore();

  const product = products.find((p) => p.slug === slug) || products[0];
  const [selectedSize, setSelectedSize] = useState<string>(product.defaultSize);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImage, setActiveImage] = useState<string>(product.imageUrl);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'howToUse' | 'reviews'>(
    'description'
  );
  const [pincode, setPincode] = useState('533103');
  const [pincodeStatus, setPincodeStatus] = useState(
    'Rajahmundry, AP — Free Express Delivery available by Tomorrow!'
  );
  const [addedConfirm, setAddedConfirm] = useState(false);
  const [heartPop, setHeartPop] = useState(false);

  React.useEffect(() => {
    setSelectedSize(product.defaultSize);
    setActiveImage(product.imageUrl);
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  const isWishlisted = wishlist.includes(product.id);
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.isBestSeller))
    .slice(0, 4);

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.startsWith('533') || pincode.startsWith('5')) {
      setPincodeStatus(`Pincode ${pincode} (Andhra Pradesh) — Express 1–2 Day Delivery Available!`);
    } else if (pincode.length === 6) {
      setPincodeStatus(`Pincode ${pincode} — Standard Courier Delivery in 3–5 Business Days.`);
    } else {
      setPincodeStatus('Please enter a valid 6-digit Indian pincode.');
    }
  };

  const handleAddToCart = () => {
    addToCart(product.id, selectedSize, quantity);
    setAddedConfirm(true);
    window.setTimeout(() => setAddedConfirm(false), 1200);
  };

  const handleToggleWishlist = () => {
    setHeartPop(true);
    toggleWishlist(product.id);
    window.setTimeout(() => setHeartPop(false), 400);
  };

  return (
    <div className="max-w-[1380px] mx-auto px-3 sm:px-6 py-5 sm:py-8 space-y-10">
      {/* Breadcrumb Matching Panel 3 */}
      <nav className="flex items-center flex-wrap gap-1.5 text-xs text-[#7A6B61]">
        <Link to="/" className="hover:text-[#E91E63] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          to={`/category/${product.category.toLowerCase().replace(/\s+/g, '-')}`}
          className="hover:text-[#E91E63] transition-colors"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-[#141110]">{product.title}</span>
      </nav>

      {/* Main Product Showcase Card */}
      <LuxuryReveal>
        <div className="bg-white rounded-2xl border border-[#EAE0D2] p-4 sm:p-8 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Product Image + Thumbnail Strip */}
          <div className="lg:col-span-5 space-y-4">
            <div className="group aspect-square rounded-2xl bg-gradient-to-b from-[#FFFDF9] to-[#FAF5ED] border border-[#EFE6D8] p-6 flex items-center justify-center overflow-hidden">
              <img
                src={activeImage}
                alt={product.title}
                className="w-full h-full object-contain transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              />
            </div>

            <div className="flex items-center justify-center gap-3">
              {(product.gallery.length > 0 ? product.gallery : [product.imageUrl]).map(
                (imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(imgUrl)}
                    className={`lux-btn w-16 h-16 sm:w-20 sm:h-20 rounded-xl border p-1.5 bg-[#FAF7F2] cursor-pointer ${
                      activeImage === imgUrl
                        ? 'border-[#E91E63] ring-2 ring-[#FCE8EE]'
                        : 'border-[#E2D5C4] hover:border-[#C59B5F]'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.shortTitle} view ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                )
              )}
            </div>
          </div>

          {/* Right: Product Info, Size Selector, Pink Add to Cart & Buy Now */}
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs font-semibold text-[#7A6B61]">
              Brand:{' '}
              <Link
                to={`/brands?brand=${encodeURIComponent(product.brand)}`}
                className="text-[#E91E63] hover:underline font-bold"
              >
                {product.brand}
              </Link>
            </div>

            <h1 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#141110] leading-snug">
              {product.title}
            </h1>

            {/* Rating & Stock Status */}
            <div className="flex items-center flex-wrap gap-3">
              <div className="flex items-center gap-1">
                <div className="flex items-center text-[#F59E0B]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(product.rating)
                          ? 'fill-[#F59E0B] text-[#F59E0B]'
                          : 'text-[#E5D7C3]'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-[#5A4E46] ml-1">
                  ({product.reviewCount} Reviews)
                </span>
              </div>
              <span className="text-[#D8C7B4]">|</span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#16A34A] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" /> In Stock
              </span>
            </div>

            {/* Price Block */}
            <div className="pt-1 pb-3 border-b border-[#EFE6D8]">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#141110]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-base text-[#9A8B7E] line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {product.discountPercent > 0 && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#FCE8EE] text-[#E91E63]">
                    {product.discountPercent}% OFF
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#7A6B61] mt-1">Inclusive of all taxes</p>
            </div>

            <p className="text-xs sm:text-sm text-[#4A3E37] leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Size Selector */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-bold text-[#141110]">Size:</label>
              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`lux-btn px-4 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-[#E91E63] text-white border-[#E91E63] shadow-2xs'
                        : 'bg-[#FAF7F2] text-[#231F1E] border-[#DFD2C0] hover:border-[#E91E63]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Add to Cart (Pink) + Buy Now (Black) + Wishlist */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div className="flex items-center border border-[#DFD2C0] rounded-xl bg-[#FAF7F2]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2.5 text-[#141110] hover:text-[#E91E63] cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs sm:text-sm font-bold text-[#141110]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2.5 text-[#141110] hover:text-[#E91E63] cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className={`lux-btn flex-1 min-w-[160px] py-3 px-6 rounded-xl text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                  addedConfirm
                    ? 'lux-cart-pop bg-[#16A34A]'
                    : 'bg-[#E91E63] hover:bg-[#C2185B]'
                }`}
              >
                {addedConfirm ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  addToCart(product.id, selectedSize, quantity);
                  navigate('/checkout');
                }}
                className="lux-btn py-3 px-6 rounded-xl bg-[#141110] hover:bg-[#322B28] text-white text-xs sm:text-sm font-bold cursor-pointer"
              >
                Buy Now
              </button>

              <button
                type="button"
                onClick={handleToggleWishlist}
                className={`lux-btn p-3 rounded-xl border border-[#DFD2C0] hover:border-[#E91E63] bg-white text-[#141110] cursor-pointer ${
                  heartPop ? 'lux-heart-pop' : ''
                }`}
                aria-label="Save to Wishlist"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isWishlisted ? 'fill-[#E91E63] text-[#E91E63]' : 'text-[#5A4E46]'
                  }`}
                />
              </button>
            </div>

            {/* 3 Trust Badges Row */}
            <div className="pt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="flex items-center gap-2 bg-[#FAF7F2] border border-[#EAE0D2] rounded-xl px-3 py-2 text-xs font-semibold text-[#141110]">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                <span>100% Authentic Product</span>
              </div>
              <div className="flex items-center gap-2 bg-[#FAF7F2] border border-[#EAE0D2] rounded-xl px-3 py-2 text-xs font-semibold text-[#141110]">
                <Truck className="w-4 h-4 text-[#E91E63] shrink-0" />
                <span>Free Delivery on ₹2,500+</span>
              </div>
              <div className="flex items-center gap-2 bg-[#FAF7F2] border border-[#EAE0D2] rounded-xl px-3 py-2 text-xs font-semibold text-[#141110]">
                <RotateCcw className="w-4 h-4 text-[#C59B5F] shrink-0" />
                <span>Easy Returns</span>
              </div>
            </div>

            {/* Delivery Pincode Check */}
            <form
              onSubmit={handleCheckPincode}
              className="pt-2 flex flex-col sm:flex-row sm:items-center gap-2"
            >
              <div className="flex items-center gap-2 bg-[#FAF7F2] border border-[#DFD2C0] rounded-xl px-3 py-2 max-w-xs">
                <MapPin className="w-4 h-4 text-[#E91E63] shrink-0" />
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter Pincode"
                  maxLength={6}
                  className="bg-transparent text-xs font-semibold text-[#141110] focus:outline-none w-full"
                />
                <button
                  type="submit"
                  className="text-xs font-bold text-[#E91E63] hover:underline shrink-0 cursor-pointer"
                >
                  Check
                </button>
              </div>
              <span className="text-xs text-[#5A4E46]">{pincodeStatus}</span>
            </form>
          </div>
        </div>
      </LuxuryReveal>

      {/* Product Detail Tabs (Description | Ingredients | How to Use | Reviews) */}
      <LuxuryReveal>
        <div className="bg-white rounded-2xl border border-[#EAE0D2] overflow-hidden shadow-2xs">
          <div className="flex flex-wrap border-b border-[#EFE6D8] bg-[#FAF7F2]">
            {[
              { id: 'description', label: 'Description' },
              { id: 'ingredients', label: 'Ingredients' },
              { id: 'howToUse', label: 'How to Use' },
              { id: 'reviews', label: `Reviews (${product.reviewCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3.5 text-xs sm:text-sm font-bold transition cursor-pointer border-b-2 ${
                  activeTab === tab.id
                    ? 'border-[#E91E63] text-[#E91E63] bg-white'
                    : 'border-transparent text-[#5A4E46] hover:text-[#141110]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div
            key={activeTab}
            className="lux-page-enter p-5 sm:p-7 text-xs sm:text-sm text-[#3A302B] leading-relaxed space-y-4"
          >
            {activeTab === 'description' && (
              <div className="space-y-3">
                <p>{product.description}</p>
                <h3 className="font-bold text-[#141110] pt-2">Key Benefits:</h3>
                <ul className="list-disc pl-5 space-y-1.5">
                  {product.keyBenefits.map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="space-y-3">
                <h3 className="font-bold text-[#141110]">Full Verified Ingredient List:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ing, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E5D7C3] text-xs font-medium text-[#141110]"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-[#7A6B61] pt-2">
                  *Always patch-test before first use. Ingredient lists are sourced from official brand packaging at Dazzlinglooks.in.
                </p>
              </div>
            )}

            {activeTab === 'howToUse' && (
              <div className="space-y-2.5">
                <h3 className="font-bold text-[#141110]">Recommended Application Steps:</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  {product.howToUse.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {product.reviews.length > 0 ? (
                  product.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE0D2] space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#141110]">{rev.author}</span>
                        <span className="text-xs text-[#7A6B61]">{rev.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#F59E0B]">
                        {[...Array(rev.rating)].map((_, idx) => (
                          <Star key={idx} className="w-3.5 h-3.5 fill-[#F59E0B]" />
                        ))}
                      </div>
                      <p className="font-semibold text-[#141110]">{rev.title}</p>
                      <p className="text-xs text-[#5A4E46]">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#6E5F55]">
                    Rated {product.rating} / 5.0 by {product.reviewCount} verified Dazzlinglooks.in shoppers.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </LuxuryReveal>

      {/* Related Products Section Matching Panel 3 */}
      <section className="space-y-5">
        <LuxuryReveal className="text-center">
          <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#141110]">
            Related Products
          </h2>
        </LuxuryReveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5">
          {relatedProducts.map((rel, idx) => (
            <LuxuryReveal key={rel.id} delayMs={idx * 55}>
              <ProductCard product={rel} variant="pink-cta" />
            </LuxuryReveal>
          ))}
        </div>
      </section>
    </div>
  );
};
