import React, { createContext, useContext, useState } from 'react';
import {
  Product,
  INITIAL_PRODUCTS,
  CouponCode,
  INITIAL_COUPONS,
  SampleOrder,
  INITIAL_ORDERS,
} from '../data/sampleData';

export interface CartItem {
  productId: string;
  size: string;
  quantity: number;
}

export interface BannerSettings {
  announcementText: string;
  heroHeadline: string;
  heroSubtext: string;
  heroCta: string;
  promoHeadline: string;
  promoDiscountTag: string;
  editorialHeadline: string;
  editorialSubtext: string;
}

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  coupons: CouponCode[];
  appliedCoupon: CouponCode | null;
  orders: SampleOrder[];
  banners: BannerSettings;
  toastMessage: string | null;
  deliveryMethod: 'express' | 'standard';
  setDeliveryMethod: (method: 'express' | 'standard') => void;
  addToCart: (productId: string, size?: string, quantity?: number) => void;
  updateCartQuantity: (productId: string, size: string, delta: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  applyCouponCode: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addProduct: (newProduct: Omit<Product, 'id'>) => void;
  updateProduct: (updated: Product) => void;
  deleteProduct: (id: string) => void;
  addCoupon: (coupon: Omit<CouponCode, 'id' | 'usedCount'>) => void;
  toggleCouponStatus: (id: string) => void;
  updateBanners: (banners: BannerSettings) => void;
  placeDemoOrder: (orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    address: string;
    paymentMethod: string;
  }) => SampleOrder;
  showToast: (msg: string) => void;
  cartSubtotal: number;
  cartOriginalSubtotal: number;
  cartProductSavings: number;
  couponDiscountAmount: number;
  cartTotalDiscount: number;
  shippingFee: number;
  cartFinalTotal: number;
  cartCount: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Pre-populated with the exact 3 items from Panel 4 Reference ("Your Cart (3 Items)")
// Cetaphil Gentle Skin Cleanser 500ml (₹899) + Laneige Lip Sleeping Mask 20g (₹1,350) + Kay Beauty Matte Lipstick (₹799) = ₹3,048 Subtotal
const INITIAL_CART: CartItem[] = [
  { productId: 'prod-1', size: '500ml', quantity: 1 },
  { productId: 'prod-2', size: '20g', quantity: 1 },
  { productId: 'prod-3', size: '4.2g - Debut', quantity: 1 },
];

const INITIAL_BANNERS: BannerSettings = {
  announcementText:
    'Free Delivery on orders ₹2,500+ (Rajahmundry & AP)  |  100% Authentic Products  |  Easy Returns  |  Secure Payments',
  heroHeadline: 'Your Complete Beauty Destination',
  heroSubtext: 'Authentic Brands  |  Genuine Products  |  Real Results',
  heroCta: 'SHOP NOW',
  promoHeadline: 'Skincare Essentials',
  promoDiscountTag: 'UP TO 30% OFF',
  editorialHeadline: 'More Than Beauty, A Brighter You',
  editorialSubtext: 'Skincare · Makeup · Haircare · Fragrances · Salon Tools',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>(INITIAL_CART);
  const [wishlist, setWishlist] = useState<string[]>(['prod-1', 'prod-2', 'prod-7']);
  const [coupons, setCoupons] = useState<CouponCode[]>(INITIAL_COUPONS);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponCode | null>(null);
  const [orders, setOrders] = useState<SampleOrder[]>(INITIAL_ORDERS);
  const [banners, setBanners] = useState<BannerSettings>(INITIAL_BANNERS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<'express' | 'standard'>('express');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const addToCart = (productId: string, size?: string, quantity = 1) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const targetSize = size || product.defaultSize;

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === productId && item.size === targetSize
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { productId, size: targetSize, quantity }];
    });
    showToast(`Added ${product.shortTitle} to cart`);
  };

  const updateCartQuantity = (productId: string, size: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId && item.size === size) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart((prev) => prev.filter((item) => !(item.productId === productId && item.size === size)));
    showToast('Item removed from cart');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        if (product) showToast(`Removed ${product.shortTitle} from wishlist`);
        return prev.filter((id) => id !== productId);
      } else {
        if (product) showToast(`Saved ${product.shortTitle} to wishlist`);
        return [...prev, productId];
      }
    });
  };

  // Calculate cart totals matching Reference Panel 4 & Panel 5:
  // Subtotal: ₹3,048 | Discount: -₹150 | Shipping: ₹99 | Total: ₹2,997
  const cartSaleSum = cart.reduce((sum, item) => {
    const p = products.find((prod) => prod.id === item.productId);
    return sum + (p ? p.price * item.quantity : 0);
  }, 0);

  const cartOriginalSubtotal = cart.reduce((sum, item) => {
    const p = products.find((prod) => prod.id === item.productId);
    return sum + (p ? p.originalPrice * item.quantity : 0);
  }, 0);

  // Automatic ₹150 store promo savings on orders ₹1,500+ (matches Panel 4 & 5 "-₹150")
  const baseSavings = cartSaleSum >= 1500 ? 150 : 0;

  let couponDiscountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'Percentage') {
      couponDiscountAmount = Math.round((cartSaleSum * appliedCoupon.discountValue) / 100);
    } else {
      couponDiscountAmount = appliedCoupon.discountValue;
    }
  }

  const cartSubtotal = cartSaleSum;
  const cartProductSavings = baseSavings;
  const cartTotalDiscount = appliedCoupon ? couponDiscountAmount : cartProductSavings;
  const shippingFee =
    cartSubtotal === 0
      ? 0
      : deliveryMethod === 'express'
      ? 99
      : cartSubtotal >= 2500
      ? 0
      : 99;
  const cartFinalTotal = Math.max(0, cartSubtotal - cartTotalDiscount + shippingFee);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const applyCouponCode = (rawCode: string) => {
    const code = rawCode.trim().toUpperCase();
    if (!code) {
      return { success: false, message: 'Please enter a coupon code.' };
    }
    const found = coupons.find((c) => c.code.toUpperCase() === code && c.active);
    if (!found) {
      return {
        success: false,
        message: 'Invalid coupon code. Try DAZZLE150, DAZZLE20, or FIRST10.',
      };
    }
    if (cartSubtotal < found.minOrder) {
      return {
        success: false,
        message: `Minimum order of ₹${found.minOrder} required for ${found.code}.`,
      };
    }
    setAppliedCoupon(found);
    showToast(`Coupon ${found.code} applied!`);
    return { success: true, message: `Coupon ${found.code} applied (${found.description})` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed');
  };

  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const created: Product = {
      ...newProd,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [created, ...prev]);
    showToast(`Added "${created.shortTitle}" to store catalog`);
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`Updated "${updated.shortTitle}"`);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Removed product from catalog');
  };

  const addCoupon = (coupon: Omit<CouponCode, 'id' | 'usedCount'>) => {
    const created: CouponCode = {
      ...coupon,
      id: `coup-${Date.now()}`,
      usedCount: 0,
    };
    setCoupons((prev) => [created, ...prev]);
    showToast(`Created coupon ${created.code}`);
  };

  const toggleCouponStatus = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  const updateBanners = (newBanners: BannerSettings) => {
    setBanners(newBanners);
    showToast('Updated storefront banners');
  };

  const placeDemoOrder = (orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    address: string;
    paymentMethod: string;
  }) => {
    const newOrder: SampleOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `#${Math.floor(1025 + Math.random() * 900)}`,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      address: orderData.address,
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      amount: cartFinalTotal,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod.includes('Cash') ? 'COD Pending' : 'Paid',
      fulfilmentStatus: 'Processing',
      items: cart.map((item) => {
        const p = products.find((prod) => prod.id === item.productId);
        return {
          productName: p ? p.shortTitle : 'Beauty Product',
          brand: p ? p.brand : 'Dazzlinglooks.in',
          size: item.size,
          qty: item.quantity,
          price: p ? p.price : 0,
        };
      }),
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        wishlist,
        coupons,
        appliedCoupon,
        orders,
        banners,
        toastMessage,
        deliveryMethod,
        setDeliveryMethod,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        applyCouponCode,
        removeCoupon,
        addProduct,
        updateProduct,
        deleteProduct,
        addCoupon,
        toggleCouponStatus,
        updateBanners,
        placeDemoOrder,
        showToast,
        cartSubtotal,
        cartOriginalSubtotal,
        cartProductSavings,
        couponDiscountAmount,
        cartTotalDiscount,
        shippingFee,
        cartFinalTotal,
        cartCount,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};
