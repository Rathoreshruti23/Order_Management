import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import SafeImage from '../components/SafeImage';
import { EmptyState } from '../components/StateViews';
import { FREE_SHIPPING_THRESHOLD } from '../config';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/format';

export function OrderSummary({ children }) {
  const { subtotal, savings, shipping, total } = useCart();
  return (
    <aside className="h-fit rounded-3xl bg-white p-6" aria-label="Order summary">
      <h2 className="text-2xl font-semibold">Order summary</h2>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatINR(subtotal)}</dd></div>
        {savings > 0 && <div className="flex justify-between text-blush-600"><dt>You save</dt><dd>{formatINR(savings)}</dd></div>}
        <div className="flex justify-between"><dt>Shipping</dt><dd>{shipping === 0 ? 'Free' : formatINR(shipping)}</dd></div>
        <div className="flex justify-between border-t border-ink/10 pt-3 text-base font-semibold"><dt>Total</dt><dd>{formatINR(total)}</dd></div>
      </dl>
      {shipping > 0 && <p className="mt-3 text-xs text-ink-soft">Add {formatINR(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping.</p>}
      {children}
    </aside>
  );
}

export default function Cart() {
  const { items, updateQty, removeItem, maxQty } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container-page py-10">
        <EmptyState title="Your cart is empty">
          <p>Pieces you add will wait for you here.</p>
          <Link to="/products" className="btn btn-primary">Continue shopping</Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="section-title">Your cart</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
        <ul className="divide-y divide-ink/10 rounded-3xl bg-white px-4 sm:px-6">
          {items.map((line) => (
            <li key={line.key} className="flex gap-4 py-5">
              <Link to={`/products/${line.productId}`} className="shrink-0"><SafeImage src={line.image} alt={line.name} className="h-32 w-24 rounded-xl" /></Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex justify-between gap-3">
                  <div>
                    <Link to={`/products/${line.productId}`} className="font-display text-xl font-semibold hover:text-blush-600">{line.name}</Link>
                    <p className="text-sm text-ink-soft">Size {line.size}, {line.color}</p>
                  </div>
                  <p className="font-semibold">{formatINR(line.price * line.qty)}</p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-full border border-ink/25" role="group" aria-label={`Quantity for ${line.name}`}>
                    <button type="button" onClick={() => updateQty(line.key, line.qty - 1)} disabled={line.qty <= 1} aria-label="Decrease quantity" className="p-2.5 disabled:opacity-40"><Minus className="h-4 w-4" /></button>
                    <span className="w-7 text-center text-sm" aria-live="polite">{line.qty}</span>
                    <button type="button" onClick={() => updateQty(line.key, line.qty + 1)} disabled={line.qty >= maxQty} aria-label="Increase quantity" className="p-2.5 disabled:opacity-40"><Plus className="h-4 w-4" /></button>
                  </div>
                  <button type="button" onClick={() => removeItem(line.key)} className="flex items-center gap-1.5 text-sm text-ink-soft hover:text-red-700"><Trash2 className="h-4 w-4" aria-hidden="true" />Remove<span className="sr-only"> {line.name}</span></button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <OrderSummary>
          <div className="mt-6 flex flex-col gap-3">
            <button type="button" onClick={() => navigate('/checkout')} className="btn btn-primary py-3">Proceed to Checkout</button>
            <Link to="/products" className="btn btn-outline py-3">Continue shopping</Link>
          </div>
        </OrderSummary>
      </div>
    </div>
  );
}
