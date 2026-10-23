import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SafeImage from '../components/SafeImage';
import ProductGrid from '../components/ProductGrid';
import Reviews from '../components/Reviews';
import Newsletter from '../components/Newsletter';
import { ErrorState, ProductSkeletons } from '../components/StateViews';
import { categories, collectionImage, heroImage } from '../data/categories';
import { useProducts } from '../hooks/useProducts';

const TRENDING = { trending: true, limit: 4 };

export default function Home() {
  const { data, loading, error, retry } = useProducts(TRENDING);

  return (
    <>
      <section className="bg-blush-50" aria-labelledby="hero-title">
        <div className="container-page grid items-end gap-10 pt-12 md:grid-cols-2 md:pt-16">
          <div className="pb-10 md:pb-20">
            <h1 id="hero-title" className="text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Dressed for the season ahead
            </h1>
            <p className="mt-5 max-w-md text-lg text-ink-soft">New dresses, easy tailoring and festive ethnic wear, cut to fit and priced to wear on repeat.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products?category=new-arrivals" className="btn btn-primary px-7 py-3">Shop new arrivals</Link>
              <Link to="/products?category=dresses" className="btn btn-outline px-7 py-3">Browse dresses</Link>
            </div>
          </div>
          <div className="mx-auto w-full max-w-md md:max-w-none">
            <SafeImage src={heroImage} alt="Woman in a fashionable outfit" loading="eager" className="aspect-[4/5] w-full rounded-t-[999px]" />
          </div>
        </div>
      </section>

      <section className="container-page mt-20" aria-labelledby="cat-title">
        <h2 id="cat-title" className="section-title">Shop by category</h2>
        <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link to={`/products?category=${c.slug}`} className="group block">
                <SafeImage src={c.image} alt="" className="aspect-[3/4] rounded-2xl" imgClassName="group-hover:scale-105 motion-reduce:group-hover:scale-100" />
                <span className="mt-3 flex items-center justify-between font-display text-xl font-semibold">{c.name}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page mt-24" aria-labelledby="trend-title">
        <div className="flex items-end justify-between gap-4">
          <h2 id="trend-title" className="section-title">Trending now</h2>
          <Link to="/products" className="text-sm font-medium underline-offset-4 hover:text-blush-600 hover:underline">View all products</Link>
        </div>
        <div className="mt-8">
          {loading ? <ProductSkeletons /> : error ? <ErrorState message={error} onRetry={retry} /> : <ProductGrid products={data} />}
        </div>
      </section>

      <section className="container-page mt-24" aria-labelledby="season-title">
        <div className="grid overflow-hidden rounded-3xl bg-blush-100 md:grid-cols-2">
          <SafeImage src={collectionImage} alt="New season collection" className="aspect-[4/3] md:aspect-auto md:min-h-[26rem]" />
          <div className="flex flex-col justify-center gap-4 p-8 sm:p-12">
            <h2 id="season-title" className="section-title">New Season Collection</h2>
            <p className="max-w-md text-ink-soft">Soft crepes, washed linen and hand-finished embroidery. Thirty-odd pieces that mix with what you already own.</p>
            <div><Link to="/products?category=new-arrivals" className="btn btn-primary px-7 py-3">Explore the collection</Link></div>
          </div>
        </div>
      </section>

      <Reviews />
      <div className="mt-24"><Newsletter /></div>
    </>
  );
}
