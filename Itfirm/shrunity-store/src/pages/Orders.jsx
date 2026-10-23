import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SafeImage from '../components/SafeImage';
import { EmptyState, ErrorState, PageLoader } from '../components/StateViews';
import { orderService } from '../services/orderService';
import { getErrorMessage } from '../services/api';
import { formatINR } from '../utils/format';

export default function Orders() {
  const [state, setState] = useState({ orders: [], loading: true, error: '' });

  const load = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: '' }));
    orderService
      .list()
      .then((orders) => setState({ orders, loading: false, error: '' }))
      .catch((err) => setState({ orders: [], loading: false, error: getErrorMessage(err, "We couldn't load your orders.") }));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="container-page max-w-3xl py-10">
      <h1 className="section-title">Your orders</h1>
      <div className="mt-8">
        {state.loading ? (
          <PageLoader label="Loading orders…" />
        ) : state.error ? (
          <ErrorState message={state.error} onRetry={load} />
        ) : state.orders.length === 0 ? (
          <EmptyState title="No orders yet">
            <p>When you place an order, it shows up here.</p>
            <Link to="/products" className="btn btn-primary">Start shopping</Link>
          </EmptyState>
        ) : (
          <ul className="space-y-5">
            {state.orders.map((o) => (
              <li key={o.id} className="rounded-3xl bg-white p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <p><span className="font-medium">Order #{o.id}</span>{o.createdAt && <span className="text-ink-soft"> placed {new Date(o.createdAt).toLocaleDateString('en-IN')}</span>}</p>
                  <p className="rounded-full bg-blush-100 px-3 py-1 font-medium">{o.status}</p>
                </div>
                <ul className="mt-4 space-y-3">
                  {o.items?.map((it, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <SafeImage src={it.image} alt={it.name} className="h-16 w-12 rounded-lg" />
                      <span className="flex-1">{it.name}<span className="block text-ink-soft">Size {it.size}, {it.color}, qty {it.quantity}</span></span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 border-t border-ink/10 pt-3 text-right font-semibold">Total {formatINR(o.total)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
