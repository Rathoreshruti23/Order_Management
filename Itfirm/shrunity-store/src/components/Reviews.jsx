import { reviews } from '../data/reviews';
import Rating from './Rating';

export default function Reviews() {
  return (
    <section className="container-page mt-24" aria-labelledby="reviews-title">
      <h2 id="reviews-title" className="section-title">What customers say</h2>
      <ul className="mt-8 grid gap-5 md:grid-cols-3">
        {reviews.map((r) => (
          <li key={r.id} className="flex flex-col gap-4 rounded-2xl bg-white p-6">
            <Rating value={r.rating} />
            <blockquote className="flex-1 text-ink-soft">{r.text}</blockquote>
            <p className="text-sm"><span className="font-medium">{r.name}</span> <span className="text-ink-mute">from {r.city}</span></p>
          </li>
        ))}
      </ul>
    </section>
  );
}
