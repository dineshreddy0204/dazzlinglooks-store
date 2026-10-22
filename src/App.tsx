/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage, CheckoutPage } from './pages/CartAndCheckoutPages';
import {
  BrandsPage,
  OffersPage,
  WishlistPage,
  AccountPage,
  AboutPage,
  ContactPage,
  PolicyPage,
  FAQPage,
} from './pages/StorefrontPages';
import { AdminPage } from './pages/AdminPage';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppShell: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <>
        <ScrollToTop />
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </>
    );
  }

  return (
    <Layout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<CategoryPage />} />
        <Route path="/brands" element={<BrandsPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/product/:slug" element={<ProductDetailPage />} />
        <Route path="/search" element={<CategoryPage />} />
        <Route path="/offers" element={<OffersPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/shipping-policy" element={<PolicyPage type="shipping" />} />
        <Route path="/returns-policy" element={<PolicyPage type="returns" />} />
        <Route path="/privacy-policy" element={<PolicyPage type="privacy" />} />
        <Route path="/terms" element={<PolicyPage type="terms" />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Layout>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </StoreProvider>
  );
}
