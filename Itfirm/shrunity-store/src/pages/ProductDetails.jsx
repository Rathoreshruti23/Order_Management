import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Heart, Minus, Plus } from 'lucide-react';
import SafeImage from '../components/SafeImage';
import Rating from '../components/Rating';
import ProductGrid from '../components/ProductGrid';
import { ErrorState, PageLoader } from '../components/StateViews';
import { ALL_SIZES } from '../data/products';
import { useProduct, useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useWishlist } from '../context/WishlistContext';
import { discountPercent, formatINR } from '../utils/format';

function Related({ product }) {
  const { data } = useProducts({ category: product.category, limit: 5 });
  const items = data.filter((p) => p.id !== product.id).slice(0, 4);
  if (!items.length) return null;
  return (
    <section className="mt-20" aria-labelledby="related-title">
      <h2 id="related-title" className="section-title">You may also like</h2>
      <div className="mt-8"><ProductGrid products={items} /></div>
    </section>
  );
}

function Details({ product }) {
  const { addItem, maxQty } = useCart();
  const { push } = useToast();
  const { has, toggle } = useWishlist();
  const navigate = useNavigate();
  const [size, setSize] = useState('');
  const [color, setColor] = useState(product.colors?.[0]?.name ?? 'Default');
  const [qty, setQty] = useState(1);
  const discount = discountPercent(product.price, product.salePrice);
  const wished = has(product.id);

  const ensureSize = () => {
    if (size) return true;
    push('Select a size first.', 'error');
    return false;
  };

  return (
    <>
      <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
        <SafeImage src={product.image} alt={product.name} loading="eager" className="aspect-[3/4] rounded-3xl" />
        <div className="flex flex-col gap-5">
          <div>
            <h1 className="text-4xl font-semibold sm:text-5xl">{product.name}</h1>
            <Rating value={product.rating} count={product.reviewCount} className="mt-3" />
          </div>
          <p className="flex items-baseline gap-3">
            <span className="text-2xl font-semibold">{formatINR(product.salePrice)}</span>
            {discount > 0 && (
              <>
                <span className="text-ink-mute line-through"><span className="sr-only">Original price </span>{formatINR(product.price)}</span>
                <span className="text-sm font-medium text-blush-600">{discount}% off</span>
              </>
            )}
          </p>
          <p className="max-w-prose text-ink-soft">{product.description}</p>

          <fieldset>
            <legend className="mb-2 text-sm font-medium">Colour: <span className="font-normal text-ink-soft">{color}</span></legend>
            <div className="flex flex-wrap gap-3">
              {product.colors?.map((c) => (
                <button key={c.name} type="button" onClick={() => setColor(c.name)} aria-label={c.name} aria-pressed={color === c.name} title={c.name} style={{ backgroundColor: c.hex }} className={`h-9 w-9 rounded-full border border-ink/20 ${color === c.name ? 'ring-2 ring-ink ring-offset-2 ring-offset-cream-100' : ''}`} />
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-sm font-medium">Size</legend>
            <div className="flex flex-wrap gap-2">
              {ALL_SIZES.map((s) => {
                const available = product.sizes?.includes(s);
                return (
                  <button key={s} type="button" disabled={!available} onClick={() => setSize(s)} aria-pressed={size === s} aria-label={available ? `Size ${s}` : `Size ${s}, unavailable`} className={`h-11 min-w-[3rem] rounded-xl border px-3 text-sm font-medium ${size === s ? 'border-ink bg-ink text-white' : 'border-ink/25 hover:border-ink'} disabled:cursor-not-allowed disabled:border-ink/10 disabled:text-ink/30 disabled:line-through`}>{s}</button>
                );
              })}
            </div>
          </fieldset>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium" id="qty-label">Quantity</span>
            <div className="flex items-center rounded-full border border-ink/25" role="group" aria-labelledby="qty-label">
              <button type="button" onClick={() => setQty((n) => Math.max(1, n - 1))} aria-label="Decrease quantity" className="p-3"><Minus className="h-4 w-4" /></button>
              <span className="w-8 text-center text-sm" aria-live="polite">{qty}</span>
              <button type="button" onClick={() => setQty((n) => Math.min(maxQty, n + 1))} aria-label="Increase quantity" className="p-3"><Plus className="h-4 w-4" /></button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => ensureSize() && addItem(product, { size, color, qty })} className="btn btn-primary px-8 py-3">Add to Cart</button>
            <button type="button" onClick={() => { if (!ensureSize()) return; addItem(product, { size, color, qty, silent: true }); navigate('/checkout'); }} className="btn btn-outline px-8 py-3">Buy Now</button>
            <button type="button" onClick={() => { toggle(product.id); push(wished ? 'Removed from your wishlist.' : 'Saved to your wishlist.'); }} aria-pressed={wished} aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'} className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/25 hover:border-ink">
              <Heart className={`h-5 w-5 ${wished ? 'fill-blush-500 text-blush-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>
      <Related product={product} />
    </>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const { data, loading, error, retry } = useProduct(id);

  return (
    <div className="container-page py-10">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink-soft">
        <Link to="/products" className="hover:text-blush-600">All products</Link>
        {data && <span> / {data.name}</span>}
      </nav>
      {loading ? <PageLoader label="Loading product…" /> : error ? <ErrorState message={error} onRetry={retry} /> : <Details key={data.id} product={data} />}
    </div>
  );
}
