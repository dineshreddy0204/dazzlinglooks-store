import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Truck,
  CreditCard,
  ShoppingBag,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartPage: React.FC = () => {
  const {
    cart,
    products,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    applyCouponCode,
    appliedCoupon,
    removeCoupon,
    cartSubtotal,
    cartTotalDiscount,
    shippingFee,
    cartFinalTotal,
    cartCount,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const navigate = useNavigate();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyCouponCode(couponInput);
    setCouponFeedback(res);
  };

  const cartItemsDetailed = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter(Boolean) as {
    productId: string;
    size: string;
    quantity: number;
    product: (typeof products)[0];
  }[];

  return (
    <div className="max-w-[1380px] mx-auto px-3 sm:px-6 py-6 sm:py-9">
      <div className="mb-6">
        <h1 className="font-serif-editorial text-2xl sm:text-4xl font-bold text-[#141110]">
          Shopping Cart
        </h1>
        <p className="text-xs sm:text-sm text-[#6E5F55] mt-1">
          You have <strong className="text-[#141110]">{cartCount} items</strong> in your cart
        </p>
      </div>

      {cartItemsDetailed.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#EAE0D2] p-10 text-center space-y-4 shadow-2xs">
          <ShoppingBag className="w-12 h-12 text-[#E91E63] mx-auto stroke-[1.5]" />
          <h2 className="font-serif-editorial text-2xl font-bold text-[#141110]">
            Your Shopping Cart is Empty
          </h2>
          <p className="text-xs sm:text-sm text-[#6E5F55] max-w-md mx-auto">
            Explore our authentic skincare, makeup, haircare, fragrances, and combo offers to add items to your bag.
          </p>
          <Link
            to="/category/skincare"
            className="inline-block bg-[#E91E63] hover:bg-[#C2185B] text-white text-xs sm:text-sm font-bold px-7 py-3 rounded-full transition"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Left Column: Cart Items List (Matching Panel 4) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl border border-[#EAE0D2] divide-y divide-[#EFE6D8] overflow-hidden shadow-2xs">
              {cartItemsDetailed.map(({ product, size, quantity }) => (
                <div
                  key={`${product.id}-${size}`}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <Link
                      to={`/product/${product.slug}`}
                      className="w-20 h-20 rounded-xl bg-[#FAF7F2] border border-[#EFE6D8] p-2 flex items-center justify-center shrink-0"
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.shortTitle}
                        className="w-full h-full object-contain"
                      />
                    </Link>

                    <div className="space-y-1">
                      <Link
                        to={`/product/${product.slug}`}
                        className="text-sm sm:text-base font-bold text-[#141110] hover:text-[#E91E63] transition block"
                      >
                        {product.shortTitle}
                      </Link>
                      <p className="text-xs text-[#7A6B61]">
                        Brand: {product.brand} &nbsp;·&nbsp; Size: {size}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#16A34A]">
                        <CheckCircle2 className="w-3 h-3" /> In Stock
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F4EDE2]">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-[#DFD2C0] rounded-lg bg-[#FAF7F2]">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(product.id, size, -1)}
                        className="p-2 text-[#141110] hover:text-[#E91E63] cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs sm:text-sm font-bold text-[#141110]">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(product.id, size, 1)}
                        className="p-2 text-[#141110] hover:text-[#E91E63] cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Line Price */}
                    <div className="text-right min-w-[75px]">
                      <div className="text-sm sm:text-base font-extrabold text-[#141110]">
                        ₹{(product.price * quantity).toLocaleString('en-IN')}
                      </div>
                      {product.originalPrice > product.price && (
                        <div className="text-[11px] text-[#9A8B7E] line-through">
                          ₹{(product.originalPrice * quantity).toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>

                    {/* Remove Icon */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(product.id, size)}
                      className="p-2 text-[#8C7B70] hover:text-[#E91E63] transition cursor-pointer"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Actions Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <Link
                to="/category/skincare"
                className="inline-flex items-center gap-2 bg-white hover:bg-[#FAF7F2] border border-[#DFD2C0] text-[#141110] text-xs font-bold px-5 py-2.5 rounded-xl transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Continue Shopping</span>
              </Link>

              <button
                type="button"
                onClick={clearCart}
                className="bg-white hover:bg-[#FCE8EE] border border-[#DFD2C0] hover:border-[#E91E63] text-[#5A4E46] hover:text-[#E91E63] text-xs font-bold px-5 py-2.5 rounded-xl transition cursor-pointer"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Right Column: Order Summary (Matching Panel 4) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-[#EAE0D2] p-5 sm:p-6 space-y-4 shadow-2xs sticky top-24">
              <h2 className="font-serif-editorial text-xl font-bold text-[#141110] pb-3 border-b border-[#EFE6D8]">
                Order Summary
              </h2>

              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-[#4A3E37]">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#141110]">
                    ₹{cartSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[#16A34A]">
                  <span>Discount {appliedCoupon ? `(${appliedCoupon.code})` : ''}</span>
                  <span className="font-bold">-₹{cartTotalDiscount.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex items-center justify-between text-[#4A3E37]">
                  <span>Shipping</span>
                  <span className="font-bold text-[#141110]">
                    {shippingFee === 0 ? 'Free' : `₹${shippingFee}`}
                  </span>
                </div>

                <p className="text-[11px] text-[#7A6B61] bg-[#FAF7F2] p-2.5 rounded-lg border border-[#EFE6D8]">
                  Free Standard Delivery on orders ₹2,500+ across Rajahmundry &amp; Andhra Pradesh
                </p>

                <div className="pt-3 border-t border-[#EFE6D8] flex items-center justify-between text-base sm:text-lg font-extrabold text-[#141110]">
                  <span>Total</span>
                  <span>₹{cartFinalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Coupon Box */}
              <form onSubmit={handleApplyCoupon} className="pt-1 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter Coupon Code (e.g. DAZZLE150)"
                    className="flex-1 bg-[#FAF7F2] border border-[#DFD2C0] rounded-xl px-3.5 py-2 text-xs text-[#141110] focus:outline-none focus:border-[#E91E63]"
                  />
                  <button
                    type="submit"
                    className="bg-[#141110] hover:bg-[#E91E63] text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <div className="flex items-center justify-between text-[11px] text-[#16A34A] font-semibold">
                    <span>Applied: {appliedCoupon.code}</span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-[#E91E63] underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
                {couponFeedback && (
                  <p
                    className={`text-[11px] ${
                      couponFeedback.success ? 'text-[#16A34A]' : 'text-[#E91E63]'
                    }`}
                  >
                    {couponFeedback.message}
                  </p>
                )}
              </form>

              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 px-6 rounded-xl bg-[#E91E63] hover:bg-[#C2185B] text-white text-sm font-bold transition shadow-sm cursor-pointer"
              >
                Proceed to Checkout
              </button>

              <div className="pt-2 text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A4E46]">
                  <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
                  <span>100% Secure Payments</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="px-2 py-0.5 rounded border border-[#E5D7C3] text-[10px] font-extrabold text-[#1A1F71]">
                    VISA
                  </span>
                  <span className="px-2 py-0.5 rounded border border-[#E5D7C3] text-[10px] font-bold text-[#EB001B]">
                    Mastercard
                  </span>
                  <span className="px-2 py-0.5 rounded border border-[#E5D7C3] text-[10px] font-bold text-[#097969]">
                    RuPay
                  </span>
                  <span className="px-2 py-0.5 rounded border border-[#E5D7C3] text-[10px] font-extrabold text-[#141110]">
                    UPI
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    products,
    cartSubtotal,
    cartTotalDiscount,
    shippingFee,
    cartFinalTotal,
    deliveryMethod,
    setDeliveryMethod,
    placeDemoOrder,
    clearCart,
  } = useStore();

  const [customerName, setCustomerName] = useState('P. Dinesh Kumar Reddy');
  const [customerEmail, setCustomerEmail] = useState('dinesh.reddy@example.com');
  const [customerPhone, setCustomerPhone] = useState('+91 90XXXXXXXX');
  const [address, setAddress] = useState('Thadithota, Rajahmundry, Andhra Pradesh - 533103');
  const [editingAddress, setEditingAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI (Google Pay, PhonePe, Paytm)');
  const [placedOrderNumber, setPlacedOrderNumber] = useState<string | null>(null);

  const cartItemsDetailed = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter(Boolean) as {
    productId: string;
    size: string;
    quantity: number;
    product: (typeof products)[0];
  }[];

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItemsDetailed.length === 0) return;
    const order = placeDemoOrder({
      customerName,
      customerEmail,
      customerPhone,
      address,
      paymentMethod,
    });
    setPlacedOrderNumber(order.orderNumber);
    clearCart();
  };

  if (placedOrderNumber) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-[#EAE0D2] p-8 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="font-serif-editorial text-3xl font-bold text-[#141110]">
            Order Confirmed!
          </h1>
          <p className="text-xs sm:text-sm text-[#5A4E46]">
            Thank you, <strong>{customerName}</strong>! Your order{' '}
            <strong className="text-[#E91E63]">{placedOrderNumber}</strong> has been placed with{' '}
            <strong>Dazzlinglooks.in (Rajahmundry)</strong>.
          </p>
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE0D2] text-xs text-left space-y-1 text-[#4A3E37]">
            <div>
              <strong>Delivery Address:</strong> {address}
            </div>
            <div>
              <strong>Payment Method:</strong> {paymentMethod}
            </div>
          </div>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              to="/account"
              className="bg-[#E91E63] hover:bg-[#C2185B] text-white text-xs font-bold px-6 py-3 rounded-full transition"
            >
              View Order in My Account
            </Link>
            <Link
              to="/"
              className="bg-[#141110] text-white text-xs font-bold px-6 py-3 rounded-full transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1380px] mx-auto px-3 sm:px-6 py-6 sm:py-9">
      <h1 className="font-serif-editorial text-2xl sm:text-4xl font-bold text-[#141110] mb-6">
        Checkout
      </h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: 1. Shipping Address, 2. Delivery Method, 3. Payment Method (Matching Panel 5) */}
        <div className="lg:col-span-8 space-y-5">
          {/* 1. Shipping Address */}
          <div className="bg-white rounded-2xl border border-[#EAE0D2] p-5 sm:p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <h2 className="font-serif-editorial text-lg sm:text-xl font-bold text-[#141110] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#E91E63]" />
                <span>1. Shipping Address</span>
              </h2>
              <button
                type="button"
                onClick={() => setEditingAddress(!editingAddress)}
                className="text-xs font-bold text-[#E91E63] hover:underline cursor-pointer"
              >
                {editingAddress ? 'Done' : '+ Add / Edit Address'}
              </button>
            </div>

            <div className="rounded-xl border-2 border-[#E91E63] bg-[#FCE8EE]/25 p-4 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  checked
                  readOnly
                  className="mt-1 text-[#E91E63] focus:ring-[#E91E63]"
                />
                <div className="space-y-1 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#141110]">{customerName}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FCE8EE] text-[#E91E63]">
                      Home
                    </span>
                  </div>
                  <p className="text-[#4A3E37]">{address}</p>
                  <p className="text-[#6E5F55]">Phone: {customerPhone}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingAddress(!editingAddress)}
                className="text-xs font-semibold text-[#5A4E46] hover:text-[#E91E63]"
              >
                Edit
              </button>
            </div>

            {editingAddress && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Full Name"
                  className="bg-[#FAF7F2] border border-[#DFD2C0] rounded-xl px-3.5 py-2.5 text-xs"
                  required
                />
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Phone Number"
                  className="bg-[#FAF7F2] border border-[#DFD2C0] rounded-xl px-3.5 py-2.5 text-xs"
                  required
                />
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Email Address"
                  className="sm:col-span-2 bg-[#FAF7F2] border border-[#DFD2C0] rounded-xl px-3.5 py-2.5 text-xs"
                  required
                />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Complete Address, Rajahmundry, Andhra Pradesh - 533103"
                  className="sm:col-span-2 bg-[#FAF7F2] border border-[#DFD2C0] rounded-xl px-3.5 py-2.5 text-xs"
                  required
                />
              </div>
            )}
          </div>

          {/* 2. Delivery Method */}
          <div className="bg-white rounded-2xl border border-[#EAE0D2] p-5 sm:p-6 space-y-3 shadow-2xs">
            <h2 className="font-serif-editorial text-lg sm:text-xl font-bold text-[#141110] flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#E91E63]" />
              <span>2. Delivery Method</span>
            </h2>

            <div className="space-y-2.5">
              <label
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                  deliveryMethod === 'express'
                    ? 'border-[#E91E63] bg-[#FCE8EE]/25'
                    : 'border-[#EAE0D2] bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center gap-3 text-xs sm:text-sm">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    checked={deliveryMethod === 'express'}
                    onChange={() => setDeliveryMethod('express')}
                    className="text-[#E91E63] focus:ring-[#E91E63]"
                  />
                  <div>
                    <span className="font-bold text-[#141110]">
                      Express Delivery - ₹99 (1-2 Days)
                    </span>
                    <p className="text-[11px] text-[#6E5F55]">
                      Priority dispatch from Thadithota, Rajahmundry store
                    </p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-[#141110]">₹99</span>
              </label>

              <label
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                  deliveryMethod === 'standard'
                    ? 'border-[#E91E63] bg-[#FCE8EE]/25'
                    : 'border-[#EAE0D2] bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center gap-3 text-xs sm:text-sm">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    checked={deliveryMethod === 'standard'}
                    onChange={() => setDeliveryMethod('standard')}
                    className="text-[#E91E63] focus:ring-[#E91E63]"
                  />
                  <div>
                    <span className="font-bold text-[#141110]">
                      Free Delivery (Orders ₹2,500+)
                    </span>
                    <p className="text-[11px] text-[#6E5F55]">
                      Standard Delivery across Rajahmundry &amp; Andhra Pradesh
                    </p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-[#16A34A]">
                  {cartSubtotal >= 2500 ? 'FREE' : '₹99'}
                </span>
              </label>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="bg-white rounded-2xl border border-[#EAE0D2] p-5 sm:p-6 space-y-3 shadow-2xs">
            <h2 className="font-serif-editorial text-lg sm:text-xl font-bold text-[#141110] flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#E91E63]" />
              <span>3. Payment Method</span>
            </h2>

            <div className="space-y-2.5">
              {[
                {
                  label: 'UPI (Google Pay, PhonePe, Paytm)',
                  badge: 'UPI',
                },
                {
                  label: 'Credit / Debit Card',
                  badge: 'VISA / Mastercard / RuPay',
                },
                {
                  label: 'Net Banking',
                  badge: 'All Indian Banks',
                },
                {
                  label: 'Cash on Delivery (COD)',
                  badge: 'Pay at Doorstep',
                },
              ].map((opt) => (
                <label
                  key={opt.label}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                    paymentMethod === opt.label
                      ? 'border-[#E91E63] bg-[#FCE8EE]/25'
                      : 'border-[#EAE0D2] bg-[#FAF7F2]'
                  }`}
                >
                  <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-[#141110]">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === opt.label}
                      onChange={() => setPaymentMethod(opt.label)}
                      className="text-[#E91E63] focus:ring-[#E91E63]"
                    />
                    <span>{opt.label}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#6E5F55] bg-white px-2.5 py-1 rounded border border-[#E5D7C3]">
                    {opt.badge}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary (Matching Panel 5) */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl border border-[#EAE0D2] p-5 sm:p-6 space-y-4 shadow-2xs sticky top-24">
            <h2 className="font-serif-editorial text-xl font-bold text-[#141110] pb-3 border-b border-[#EFE6D8]">
              Order Summary
            </h2>

            {/* Itemized Mini List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-[#F4EDE2]">
              {cartItemsDetailed.map(({ product, size, quantity }) => (
                <div key={`${product.id}-${size}`} className="pt-2.5 first:pt-0 flex items-center gap-3">
                  <img
                    src={product.imageUrl}
                    alt={product.shortTitle}
                    className="w-12 h-12 rounded-lg bg-[#FAF7F2] border border-[#EFE6D8] object-contain p-1 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#141110] truncate">
                      {product.shortTitle}
                    </p>
                    <p className="text-[11px] text-[#7A6B61]">
                      Qty: {quantity} · {size}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#141110]">
                    ₹{(product.price * quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#EFE6D8] space-y-2 text-xs sm:text-sm">
              <div className="flex items-center justify-between text-[#4A3E37]">
                <span>Subtotal</span>
                <span className="font-bold text-[#141110]">
                  ₹{cartSubtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#16A34A]">
                <span>Discount</span>
                <span className="font-bold">-₹{cartTotalDiscount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-[#4A3E37]">
                <span>Shipping</span>
                <span className="font-bold text-[#141110]">
                  {shippingFee === 0 ? 'Free' : `₹${shippingFee}`}
                </span>
              </div>
              <div className="pt-3 border-t border-[#EFE6D8] flex items-center justify-between text-base sm:text-lg font-extrabold text-[#141110]">
                <span>Total</span>
                <span>₹{cartFinalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-[#E91E63] hover:bg-[#C2185B] text-white text-sm font-bold transition shadow-sm cursor-pointer"
            >
              Place Order
            </button>

            <div className="text-center text-[11px] text-[#6E5F55] flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
              <span>100% Secure Checkout</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
