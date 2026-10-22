import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '../data/sampleData';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'pink-cta';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'default' }) => {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className="group bg-white rounded-xl border border-[#EAE0D2] hover:border-[#C59B5F] shadow-[0_2px_12px_rgba(20,17,16,0.04)] hover:shadow-[0_8px_24px_rgba(20,17,16,0.08)] transition-all duration-200 flex flex-col overflow-hidden relative">
      {/* Top-Right Wishlist Heart Button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product.id);
        }}
        aria-label="Toggle Wishlist"
        className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-[#FCE8EE] border border-[#EAE0D2] flex items-center justify-center transition cursor-pointer"
      >
        <Heart
          className={`w-4 h-4 ${
            isWishlisted ? 'fill-[#E91E63] text-[#E91E63]' : 'text-[#8C7B70]'
          }`}
        />
      </button>

      {/* Product Image Container */}
      <Link
        to={`/product/${product.slug}`}
        className="relative aspect-[4/3.6] w-full bg-gradient-to-b from-[#FFFDF9] to-[#FAF5ED] p-3 flex items-center justify-center overflow-hidden"
      >
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </Link>

      {/* Card Details */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between bg-white border-t border-[#F4EDE2]">
        <div>
          <Link
            to={`/product/${product.slug}`}
            className="block text-xs sm:text-[13px] font-semibold text-[#141110] hover:text-[#E91E63] line-clamp-2 leading-snug min-h-[2.4rem]"
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

        {/* Full-Width Add to Cart CTA */}
        <button
          type="button"
          onClick={() => addToCart(product.id, product.defaultSize, 1)}
          className={`mt-3 w-full py-2 px-3 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs ${
            variant === 'pink-cta'
              ? 'bg-[#E91E63] hover:bg-[#C2185B]'
              : 'bg-[#141110] hover:bg-[#E91E63]'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};
