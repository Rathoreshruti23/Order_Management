import { Star } from 'lucide-react';

export default function Rating({ value, count, className = '' }) {
  const filled = Math.round(value);
  return (
    <div className={`flex items-center gap-1.5 text-sm ${className}`}>
      <span className="flex" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} className={`h-4 w-4 ${n <= filled ? 'fill-blush-500 text-blush-500' : 'text-ink/20'}`} />
        ))}
      </span>
      <span className="sr-only">Rated {value} out of 5{count != null ? ` from ${count} reviews` : ''}</span>
      <span className="font-medium">{value}</span>
      {count != null && <span className="text-ink-mute">({count})</span>}
    </div>
  );
}
