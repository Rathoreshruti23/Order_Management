import { useEffect, useState } from 'react';
import { Shirt } from 'lucide-react';

// Image with lazy loading, a fade-in and a placeholder if the URL fails.
export default function SafeImage({ src, alt, className = '', imgClassName = '', ...rest }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setFailed(false);
    setLoaded(false);
  }, [src]);

  if (failed || !src) {
    return (
      <div role="img" aria-label={alt} className={`flex items-center justify-center bg-gradient-to-br from-blush-100 to-cream-200 text-blush-400 ${className}`}>
        <Shirt className="h-10 w-10" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className={`overflow-hidden bg-blush-50 ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
        {...rest}
      />
    </div>
  );
}
