import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import SafeImage from './SafeImage';
import Rating from './Rating';
import { ALL_SIZES } from '../data/products';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useWishlist } from '../context/WishlistContext';
import { discountPercent, formatINR } from '../utils/format';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { push } = useToast();
  const { has, toggle } = useWishlist();
  const navigate = useNavigate();
  const [size, setSize] = useState('');
  const [color, setColor] = useState(product.colors?.[0]?.name ?? 'Default');
  const [sizeError, setSizeError] = useState(false);

  const discount = discountPercent(product.price, product.salePrice);
  const wished = has(product.id);

  const ensureSize = () => {
    if (size) return true;
    setSizeError(true);
    push('Select a size first.', 'error');
    return false;
  };
  const handleAdd = () => ensureSize() && addItem(product, { size, color });
  const handleBuyNow = () => {
    if (!ensureSize()) return;
    addItem(product, { size, color, silent: true });
    navigate('/checkout'); // ProtectedRoute redirects to /signin and returns here afterwards
  };

  return (
    <article className="group flex flex-col">
      <div className="relative">
        <Link to={`/products/${product.id}`} aria-label={`View ${product.name}`}>
          <SafeImage
            src={product.image}
            alt={product.name}
            className="aspect-[3/4] rounded-2xl"
            imgClassName="group-hover:scale-105 motion-reduce:group-hover:scale-100"
          />
        </Link>
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium text-blush-600">{discount}% off</span>
        )}
        <button
          type="button"
          onClick={() => {
            toggle(product.id);
            push(wished ? 'Removed from your wishlist.' : 'Saved to your wishlist.');
          }}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-ink transition hover:scale-110 motion-reduce:hover:scale-100"
        >
          <Heart className={`h-5 w-5 ${wished ? 'fill-blush-500 text-blush-500' : ''}`} />
        </button>
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-2.5">
        <Link to={`/products/${product.id}`} className="text-lg font-semibold leading-snug hover:text-blush-600">{product.name}</Link>
        <Rating value={product.rating} count={product.reviewCount} />
        <p className="flex items-baseline gap-2">
          <span className="text-base font-semibold">{formatINR(product.salePrice)}</span>
          {discount > 0 && <span className="text-sm text-ink-mute line-through"><span className="sr-only">Original price </span>{formatINR(product.price)}</span>}
        </p>

        <div role="group" aria-label="Choose a colour" className="flex flex-wrap gap-2">
          {product.colors?.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setColor(c.name)}
              aria-label={c.name}
              aria-pressed={color === c.name}
              title={c.name}
              style={{ backgroundColor: c.hex }}
              className={`h-6 w-6 rounded-full border border-ink/20 ${color === c.name ? 'ring-2 ring-ink ring-offset-2 ring-offset-cream-100' : ''}`}
            />
          ))}
        </div>

        <div role="group" aria-label="Choose a size" className="flex flex-wrap gap-1.5">
          {ALL_SIZES.map((s) => {
            const available = product.sizes?.includes(s);
            return (
              <button
                key={s}
                type="button"
                disabled={!available}
                onClick={() => { setSize(s); setSizeError(false); }}
                aria-pressed={size === s}
                aria-label={available ? `Size ${s}` : `Size ${s}, unavailable`}
                className={`h-8 min-w-[2.25rem] rounded-lg border px-2 text-xs font-medium transition-colors ${
                  size === s ? 'border-ink bg-ink text-white' : sizeError && available ? 'border-red-600 text-ink' : 'border-ink/25 hover:border-ink'
                } disabled:cursor-not-allowed disabled:border-ink/10 disabled:text-ink/30 disabled:line-through`}
              >
                {s}
              </button>
            );
          })}
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-2">
          <button type="button" onClick={handleAdd} className="btn btn-primary px-3">
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />Add to Cart
          </button>
          <button type="button" onClick={handleBuyNow} className="btn btn-outline px-3">Buy Now</button>
        </div>
      </div>
    </article>
  );
}
