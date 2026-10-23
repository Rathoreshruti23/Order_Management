import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, Menu, Package, Search, ShoppingBag, User, X } from 'lucide-react';
import { BRAND_NAME } from '../config';
import { categories } from '../data/categories';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function SearchForm({ onDone, className = '' }) {
  const navigate = useNavigate();
  const [term, setTerm] = useState('');
  const submit = (e) => {
    e.preventDefault();
    const q = term.trim();
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products');
    onDone?.();
  };
  return (
    <form onSubmit={submit} role="search" className={`relative ${className}`}>
      <label htmlFor="site-search" className="sr-only">Search products</label>
      <input
        id="site-search"
        type="search"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search dresses, kurtas, bags…"
        className="w-full rounded-full border border-ink/15 bg-white py-2.5 pl-11 pr-4 text-sm placeholder:text-ink-mute focus:border-blush-600 focus:outline-none focus:ring-2 focus:ring-blush-300"
      />
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" aria-hidden="true" />
    </form>
  );
}

function UserMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const first = (user?.fullName || user?.name || user?.email || 'Account').split(' ')[0];
  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="menu" className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium hover:bg-blush-100">
        <User className="h-5 w-5" aria-hidden="true" />
        <span className="hidden max-w-[7rem] truncate sm:inline">{first}</span>
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-ink/10 bg-white py-1 text-sm shadow-lg">
          <Link role="menuitem" to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-2.5 hover:bg-blush-50"><User className="h-4 w-4" />Profile</Link>
          <Link role="menuitem" to="/orders" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-2.5 hover:bg-blush-50"><Package className="h-4 w-4" />Orders</Link>
          <button role="menuitem" type="button" onClick={() => { setOpen(false); signOut(); navigate('/'); }} className="flex w-full items-center gap-2 px-4 py-2.5 text-left hover:bg-blush-50"><LogOut className="h-4 w-4" />Sign out</button>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { isAuthenticated, status } = useAuth();
  const { count } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.search]);

  const linkClass = ({ isActive }) => `text-sm font-medium transition-colors hover:text-blush-600 ${isActive ? 'text-blush-600' : 'text-ink'}`;

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream-50/95 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-4">
        <button type="button" className="-ml-2 p-2 lg:hidden" onClick={() => setMobileOpen((o) => !o)} aria-expanded={mobileOpen} aria-controls="mobile-menu" aria-label={mobileOpen ? 'Close menu' : 'Open menu'}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <Link to="/" className="font-display text-3xl font-bold tracking-tight text-ink" aria-label={`${BRAND_NAME} home`}>
          {BRAND_NAME}
        </Link>

        <nav aria-label="Categories" className="ml-6 hidden items-center gap-6 lg:flex">
          {categories.map((c) => (
            <NavLink key={c.slug} to={`/products?category=${c.slug}`} className={linkClass} end>{c.name}</NavLink>
          ))}
        </nav>

        <SearchForm className="ml-auto hidden w-64 md:block xl:w-72" />

        <div className="ml-auto flex items-center gap-1 md:ml-2">
          {status === 'loading' ? null : isAuthenticated ? (
            <UserMenu />
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link to="/signin" className="rounded-full px-3 py-2 text-sm font-medium hover:bg-blush-100">Sign In</Link>
              <Link to="/signup" className="btn btn-primary">Sign Up</Link>
            </div>
          )}
          <Link to="/cart" className="relative rounded-full p-2.5 hover:bg-blush-100" aria-label={`Shopping cart, ${count} ${count === 1 ? 'item' : 'items'}`}>
            <ShoppingBag className="h-6 w-6" aria-hidden="true" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-blush-600 px-1 text-xs font-semibold text-white">{count}</span>
            )}
          </Link>
        </div>
      </div>

      {mobileOpen && (
        <div id="mobile-menu" className="border-t border-ink/10 bg-cream-50 lg:hidden">
          <div className="container-page space-y-4 py-4">
            <SearchForm onDone={() => setMobileOpen(false)} className="md:hidden" />
            <nav aria-label="Categories" className="grid grid-cols-2 gap-1">
              {categories.map((c) => (
                <Link key={c.slug} to={`/products?category=${c.slug}`} className="rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-blush-100">{c.name}</Link>
              ))}
            </nav>
            {!isAuthenticated && status !== 'loading' && (
              <div className="flex gap-2 sm:hidden">
                <Link to="/signin" className="btn btn-outline flex-1">Sign In</Link>
                <Link to="/signup" className="btn btn-primary flex-1">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
