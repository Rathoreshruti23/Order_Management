import { Link } from 'react-router-dom';
import SafeImage from './SafeImage';
import { BRAND_NAME } from '../config';
import { authImage } from '../data/categories';

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="grid min-h-[calc(100vh-7rem)] lg:grid-cols-2">
      <div className="hidden lg:block">
        <SafeImage src={authImage} alt="" className="h-full w-full" />
      </div>
      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <Link to="/" className="font-display text-3xl font-bold">{BRAND_NAME}</Link>
          <h1 className="mt-6 text-4xl font-semibold">{title}</h1>
          <p className="mt-2 text-ink-soft">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
