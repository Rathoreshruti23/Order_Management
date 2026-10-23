import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AiStylist from './AiStylist';
import { FREE_SHIPPING_THRESHOLD } from '../config';
import { formatINR } from '../utils/format';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function Layout() {
  return (
    <>
      <a href="#main" className="sr-only z-[80] rounded-full bg-white px-4 py-2 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to content</a>
      <ScrollToTop />
      <p className="bg-ink px-4 py-2 text-center text-sm text-white">Free shipping on orders above {formatINR(FREE_SHIPPING_THRESHOLD)}</p>
      <Navbar />
      <main id="main" className="min-h-[60vh]"><Outlet /></main>
      <Footer />
      <AiStylist />
    </>
  );
}
