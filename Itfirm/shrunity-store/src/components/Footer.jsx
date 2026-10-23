import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { BRAND_NAME } from '../config';
import { categories } from '../data/categories';

// Replace the "#" hrefs with your real social profiles.
const socials = [
  { label: 'Instagram', icon: Instagram, href: '#' },
  { label: 'Facebook', icon: Facebook, href: '#' },
  { label: 'X (Twitter)', icon: Twitter, href: '#' },
  { label: 'YouTube', icon: Youtube, href: '#' },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-ink/10 bg-cream-200">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-3xl font-bold">{BRAND_NAME}</p>
          <p className="mt-3 max-w-xs text-sm text-ink-soft">Dresses, tops, jeans and ethnic wear designed for everyday life and the occasions in between.</p>
          <ul className="mt-5 flex gap-2">
            {socials.map(({ label, icon: Icon, href }) => (
              <li key={label}>
                <a href={href} aria-label={label} className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink hover:bg-blush-100">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <nav aria-label="Shop">
          <h2 className="text-xl font-semibold">Shop</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}><Link className="hover:text-blush-600" to={`/products?category=${c.slug}`}>{c.name}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Company">
          <h2 className="text-xl font-semibold">Company</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-blush-600" to="/about">About Us</Link></li>
            <li><Link className="hover:text-blush-600" to="/contact">Contact</Link></li>
            <li><Link className="hover:text-blush-600" to="/privacy">Privacy Policy</Link></li>
            <li><Link className="hover:text-blush-600" to="/terms">Terms of Use</Link></li>
          </ul>
        </nav>
        <nav aria-label="Account">
          <h2 className="text-xl font-semibold">Your account</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-blush-600" to="/orders">Orders</Link></li>
            <li><Link className="hover:text-blush-600" to="/profile">Profile</Link></li>
            <li><Link className="hover:text-blush-600" to="/cart">Cart</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-ink/10 py-5 text-center text-sm text-ink-soft">© {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.</div>
    </footer>
  );
}
