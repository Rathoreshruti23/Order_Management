import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import { EmptyState, ErrorState, ProductSkeletons } from '../components/StateViews';
import { categories } from '../data/categories';
import { useProducts } from '../hooks/useProducts';
import { formatINR } from '../utils/format';

const SORTS = [
  { value: '', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
];
const PRICE_CAPS = [1000, 2000, 3000, 5000];

export default function Products() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || '';
  const q = params.get('q') || '';
  const sort = params.get('sort') || '';
  const maxPrice = Number(params.get('max')) || undefined;

  const { data, loading, error, retry } = useProducts({ category: category || undefined, q: q || undefined, sort: sort || undefined, maxPrice });

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };
  const activeCategory = categories.find((c) => c.slug === category);
  const title = q ? `Results for “${q}”` : activeCategory?.name || 'All products';

  return (
    <div className="container-page py-10">
      <h1 className="section-title">{title}</h1>

      <div className="mt-6 flex flex-col gap-4 border-b border-ink/10 pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" role="group" aria-label="Filter by category">
          <button type="button" onClick={() => setParam('category', '')} aria-pressed={!category} className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium ${!category ? 'border-ink bg-ink text-white' : 'border-ink/25 hover:border-ink'}`}>All</button>
          {categories.map((c) => (
            <button key={c.slug} type="button" onClick={() => setParam('category', c.slug)} aria-pressed={category === c.slug} className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium ${category === c.slug ? 'border-ink bg-ink text-white' : 'border-ink/25 hover:border-ink'}`}>{c.name}</button>
          ))}
        </div>
        <div className="flex gap-3">
          <div>
            <label htmlFor="max" className="sr-only">Maximum price</label>
            <select id="max" value={maxPrice || ''} onChange={(e) => setParam('max', e.target.value)} className="field py-2">
              <option value="">Any price</option>
              {PRICE_CAPS.map((p) => <option key={p} value={p}>Under {formatINR(p)}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="sort" className="sr-only">Sort by</label>
            <select id="sort" value={sort} onChange={(e) => setParam('sort', e.target.value)} className="field py-2">
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-8">
        {loading ? (
          <ProductSkeletons count={8} />
        ) : error ? (
          <ErrorState message={error} onRetry={retry} />
        ) : data.length === 0 ? (
          <EmptyState title="No pieces match those filters">
            <p>Try a different category or a higher price limit.</p>
            <button type="button" onClick={() => setParams({}, { replace: true })} className="btn btn-outline">Clear filters</button>
          </EmptyState>
        ) : (
          <>
            <p className="mb-6 text-sm text-ink-soft" role="status">{data.length} {data.length === 1 ? 'product' : 'products'}</p>
            <ProductGrid products={data} />
          </>
        )}
      </div>
    </div>
  );
}
