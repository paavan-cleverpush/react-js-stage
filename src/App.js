import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import { CartProvider } from './context/CartContext';
import { ProductsProvider } from './context/ProductsContext';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import About from './pages/About';
import Contact from './pages/Contact';
import FeaturesPage from './pages/FeaturesPage';
import ShippingPage from './pages/ShippingPage';
import ReturnsPage from './pages/ReturnsPage';
import './paavan.css';
import './App.css';

function App() {
  // Only hide the static crawl block once the real app shell exists. Otherwise
  // display:none runs while #root is still empty → gray screen on some prod timings.
  useEffect(() => {
    let cancelled = false;
    let raf = 0;
    function tick() {
      if (cancelled) return;
      if (document.querySelector('#root .App')) {
        document.body.classList.add('react-app-mounted');
        return;
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      document.body.classList.remove('react-app-mounted');
    };
  }, []);

  return (
    <BrowserRouter>
      <ProductsProvider>
        <CartProvider>
          <div className="App">
            <header id="site-header">
              <SiteHeader />
            </header>
            <main className="site-main">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/features" element={<FeaturesPage />} />
                <Route path="/shipping" element={<ShippingPage />} />
                <Route path="/returns" element={<ReturnsPage />} />
              </Routes>
            </main>
            <SiteFooter />
          </div>
        </CartProvider>
      </ProductsProvider>
    </BrowserRouter>
  );
}

export default App;
