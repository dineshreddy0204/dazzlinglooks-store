import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingCart,
  TicketPercent,
  ArrowLeft,
  Trash2,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, BRAND_DATA } from '../data/sampleData';

export const AdminPage: React.FC = () => {
  const {
    products,
    orders,
    coupons,
    addProduct,
    deleteProduct,
    addCoupon,
    toggleCouponStatus,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'add' | 'orders' | 'coupons'>('dashboard');

  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('Cetaphil');
  const [category, setCategory] = useState<Product['category']>('Skincare');
  const [price, setPrice] = useState(899);
  const [originalPrice, setOriginalPrice] = useState(1050);
  const [stock, setStock] = useState(30);

  const [coupCode, setCoupCode] = useState('');
  const [coupValue, setCoupValue] = useState(150);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const discountPercent =
      originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    addProduct({
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title,
      shortTitle: title,
      brand,
      category,
      subcategory: 'Cleansers',
      price,
      originalPrice,
      discountPercent,
      rating: 4.8,
      reviewCount: 24,
      imageUrl: '/assets/v2/prod_cetaphil.png',
      gallery: ['/assets/v2/prod_cetaphil.png'],
      sizes: ['Standard'],
      defaultSize: 'Standard',
      skinTypes: ['All Skin Types'],
      concerns: ['Hydration'],
      badges: [`${discountPercent}% OFF`],
      stock,
      sku: `DL-${Date.now().toString().slice(-4)}`,
      shortDescription: 'Authentic beauty formula available at Dazzlinglooks.in.',
      description: 'Authentic beauty formula available at Dazzlinglooks.in Rajahmundry.',
      keyBenefits: ['100% Authentic Product', 'Dermatologically Tested'],
      ingredients: ['Aqua', 'Glycerin', 'Niacinamide'],
      howToUse: ['Apply gently as directed on pack.'],
      isBestSeller: true,
      reviews: [],
    });
    setTitle('');
    setActiveTab('products');
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coupCode.trim()) return;
    addCoupon({
      code: coupCode.trim().toUpperCase(),
      discountType: 'Flat',
      discountValue: coupValue,
      minOrder: 1000,
      description: `Flat ₹${coupValue} OFF on orders above ₹1,000`,
      active: true,
    });
    setCoupCode('');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#141110] flex flex-col">
      <header className="bg-[#141110] text-white px-6 py-4 flex items-center justify-between border-b border-[#C59B5F]/30">
        <div className="flex items-center gap-3">
          <img
            src="/assets/aistudio/file_0000000063108211bead702fb91a015a_ccc1a723.png"
            alt="Dazzlinglooks.in"
            className="w-11 h-11 rounded-full object-cover border border-[#C59B5F]"
          />
          <div>
            <h1 className="font-serif-editorial text-xl font-bold">
              Dazzlinglooks.in — Store Admin
            </h1>
            <p className="text-[11px] text-[#E5D7C3]">
              Rajahmundry Store &amp; Online Catalog Management
            </p>
          </div>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#E91E63] hover:bg-[#C2185B] text-white text-xs font-bold px-4 py-2 rounded-full transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Storefront</span>
        </Link>
      </header>

      <div className="max-w-[1380px] w-full mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        <aside className="lg:col-span-3 bg-white rounded-2xl border border-[#EAE0D2] p-4 space-y-1.5 h-fit">
          {[
            { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'add', label: 'Add Product', icon: PlusCircle },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingCart },
            { id: 'coupons', label: 'Coupons & Offers', icon: TicketPercent },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-[#E91E63] text-white'
                    : 'text-[#3A302B] hover:bg-[#FAF7F2]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        <main className="lg:col-span-9 space-y-6">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-[#EAE0D2] p-5">
                <div className="text-xs text-[#7A6B61]">Active Products</div>
                <div className="text-2xl font-extrabold mt-1">{products.length}</div>
              </div>
              <div className="bg-white rounded-2xl border border-[#EAE0D2] p-5">
                <div className="text-xs text-[#7A6B61]">Featured Brands</div>
                <div className="text-2xl font-extrabold mt-1">{BRAND_DATA.length}</div>
              </div>
              <div className="bg-white rounded-2xl border border-[#EAE0D2] p-5">
                <div className="text-xs text-[#7A6B61]">Recent Orders</div>
                <div className="text-2xl font-extrabold mt-1">{orders.length}</div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="bg-white rounded-2xl border border-[#EAE0D2] overflow-hidden">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#FAF7F2] border-b border-[#EAE0D2]">
                    <th className="p-3.5">Product</th>
                    <th className="p-3.5">Brand</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Price</th>
                    <th className="p-3.5">Stock</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE6D8]">
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td className="p-3.5 font-bold flex items-center gap-2.5">
                        <img
                          src={p.imageUrl}
                          alt={p.shortTitle}
                          className="w-9 h-9 object-contain rounded bg-[#FAF7F2] p-0.5"
                        />
                        <span>{p.shortTitle}</span>
                      </td>
                      <td className="p-3.5">{p.brand}</td>
                      <td className="p-3.5">{p.category}</td>
                      <td className="p-3.5 font-bold">₹{p.price}</td>
                      <td className="p-3.5">{p.stock}</td>
                      <td className="p-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => deleteProduct(p.id)}
                          className="text-[#E91E63] hover:underline inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'add' && (
            <form
              onSubmit={handleAddProduct}
              className="bg-white rounded-2xl border border-[#EAE0D2] p-6 space-y-4 max-w-xl"
            >
              <h2 className="font-serif-editorial text-2xl font-bold">Add New Product</h2>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Product Title"
                required
                className="w-full bg-[#FAF7F2] border border-[#DFD2C0] rounded-xl px-4 py-2.5 text-xs sm:text-sm"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="bg-[#FAF7F2] border border-[#DFD2C0] rounded-xl px-3 py-2.5 text-xs sm:text-sm"
                >
                  {BRAND_DATA.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="bg-[#FAF7F2] border border-[#DFD2C0] rounded-xl px-3 py-2.5 text-xs sm:text-sm"
                >
                  <option value="Skincare">Skincare</option>
                  <option value="Makeup">Makeup</option>
                  <option value="Haircare">Haircare</option>
                  <option value="Fragrances">Fragrances</option>
                  <option value="Salon Tools">Salon Tools</option>
                  <option value="Personal Care">Personal Care</option>
                  <option value="Combo Offers">Combo Offers</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="Sale Price"
                  className="bg-[#FAF7F2] border border-[#DFD2C0] rounded-xl px-3 py-2.5 text-xs sm:text-sm"
                />
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(Number(e.target.value))}
                  placeholder="MRP"
                  className="bg-[#FAF7F2] border border-[#DFD2C0] rounded-xl px-3 py-2.5 text-xs sm:text-sm"
                />
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  placeholder="Stock"
                  className="bg-[#FAF7F2] border border-[#DFD2C0] rounded-xl px-3 py-2.5 text-xs sm:text-sm"
                />
              </div>
              <button
                type="submit"
                className="bg-[#E91E63] text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl cursor-pointer"
              >
                Save Product
              </button>
            </form>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl border border-[#EAE0D2] overflow-hidden">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#FAF7F2] border-b border-[#EAE0D2]">
                    <th className="p-3.5">Order ID</th>
                    <th className="p-3.5">Customer</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE6D8]">
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td className="p-3.5 font-bold">{o.orderNumber}</td>
                      <td className="p-3.5">{o.customerName}</td>
                      <td className="p-3.5">{o.date}</td>
                      <td className="p-3.5 font-bold">₹{o.amount}</td>
                      <td className="p-3.5">{o.fulfilmentStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'coupons' && (
            <div className="space-y-4">
              <form
                onSubmit={handleCreateCoupon}
                className="bg-white rounded-2xl border border-[#EAE0D2] p-5 flex flex-wrap gap-3 items-center"
              >
                <input
                  type="text"
                  value={coupCode}
                  onChange={(e) => setCoupCode(e.target.value)}
                  placeholder="Coupon Code (e.g. RAJAHMUNDRY200)"
                  className="bg-[#FAF7F2] border border-[#DFD2C0] rounded-xl px-3.5 py-2 text-xs"
                />
                <input
                  type="number"
                  value={coupValue}
                  onChange={(e) => setCoupValue(Number(e.target.value))}
                  placeholder="Flat Discount ₹"
                  className="bg-[#FAF7F2] border border-[#DFD2C0] rounded-xl px-3.5 py-2 text-xs w-32"
                />
                <button
                  type="submit"
                  className="bg-[#E91E63] text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Create Coupon
                </button>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {coupons.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white rounded-2xl border border-[#EAE0D2] p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#E91E63]">{c.code}</span>
                      <button
                        type="button"
                        onClick={() => toggleCouponStatus(c.id)}
                        className="text-[11px] font-semibold underline"
                      >
                        {c.active ? 'Active' : 'Paused'}
                      </button>
                    </div>
                    <p className="text-xs text-[#5A4E46]">{c.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
