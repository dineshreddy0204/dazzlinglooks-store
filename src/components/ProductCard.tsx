import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Check, Eye } from 'lucide-react';
import { Product } from '../data/sampleData';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'pink-cta';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'default' }) => {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const isWishlisted = wishlist.includes(product.id);
  const [heartAnimating, setHeartAnimating] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setHeartAnimating(true);
    toggleWishlist(product.id);
    window.setTimeout(() => setHeartAnimating(false), 400);
  };

  const handleAddToCart = () => {
    addToCart(product.id, product.defaultSize, 1);
    setAddedFeedback(true);
    window.setTimeout(() => setAddedFeedback(false), 1150);
  };

  return (
    <div className="lux-card group bg-white rounded-xl border border-[#EAE0D2] hover:border-[#C59B5F] shadow-[0_2px_12px_rgba(20,17,16,0.04)] flex flex-col overflow-hidden relative">
      {/* Top-Right Wishlist Heart Button with Micro-Interaction */}
      <button
        type="button"
        onClick={handleWishlistClick}
        aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/95 hover:bg-[#FCE8EE] border border-[#EAE0D2] hover:border-[#E91E63]/40 flex items-center justify-center transition-all duration-250 cursor-pointer shadow-2xs ${
          heartAnimating ? 'lux-heart-pop' : ''
        }`}
      >
        <Heart
          className={`w-4 h-4 transition-transform duration-200 ${
            isWishlisted ? 'fill-[#E91E63] text-[#E91E63] scale-105' : 'text-[#8C7B70]'
          }`}
        />
      </button>

      {/* Product Image Container — Stable, Sharp, Restrained Hover Zoom */}
      <Link
        to={`/product/${product.slug}`}
        className="relative aspect-[4/3.6] w-full bg-gradient-to-b from-[#FFFDF9] to-[#FAF5ED] p-3 flex items-center justify-center overflow-hidden"
      >
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-contain transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          loading="lazy"
        />
        {/* Subtle Quick-Inspect Pill on Desktop Hover (Top-Left, never covering title/price) */}
        <span className="hidden sm:inline-flex items-center gap-1 absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs border border-[#E5D7C3] text-[10px] font-semibold text-[#3A302B] opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
          <Eye className="w-3 h-3 text-[#C59B5F]" /> View
        </span>
      </Link>

      {/* Card Details */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between bg-white border-t border-[#F4EDE2]">
        <div>
          <Link
            to={`/product/${product.slug}`}
            className="block text-xs sm:text-[13px] font-semibold text-[#141110] hover:text-[#E91E63] transition-colors line-clamp-2 leading-snug min-h-[2.4rem]"
          >
            {product.shortTitle}
          </Link>

          {/* Price Row + Discount Badge */}
          <div className="mt-1.5 flex items-center flex-wrap gap-1.5">
            <span className="text-sm sm:text-base font-extrabold text-[#141110]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-[#9A8B7E] line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            {product.discountPercent > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FCE8EE] text-[#E91E63]">
                {product.discountPercent}% OFF
              </span>
            )}
          </div>

          {/* 5-Star Rating Row */}
          <div className="mt-1.5 flex items-center gap-1">
            <div className="flex items-center text-[#F59E0B]">
              {[...Array(5)].map((_, idx) => (
                <Star
                  key={idx}
                  className={`w-3 h-3 ${
                    idx < Math.round(product.rating)
                      ? 'fill-[#F59E0B] text-[#F59E0B]'
                      : 'text-[#E5D7C3]'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] text-[#7A6B61]">({product.reviewCount})</span>
          </div>
        </div>

        {/* Full-Width Add to Cart CTA with Micro-Confirmation */}
        <button
          type="button"
          onClick={handleAddToCart}
          className={`lux-btn mt-3 w-full py-2 px-3 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
            addedFeedback
              ? 'lux-cart-pop bg-[#16A34A]'
              : variant === 'pink-cta'
              ? 'bg-[#E91E63] hover:bg-[#C2185B]'
              : 'bg-[#141110] hover:bg-[#E91E63]'
          }`}
        >
          {addedFeedback ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added to Cart</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
