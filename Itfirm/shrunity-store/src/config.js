export const BRAND_NAME = 'Shrunity';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
// Dev: demo data unless VITE_USE_MOCK_DATA=false. Production builds: backend unless VITE_USE_MOCK_DATA=true.
export const USE_MOCK_DATA = import.meta.env.DEV
  ? import.meta.env.VITE_USE_MOCK_DATA !== 'false'
  : import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Shipping rules used for the cart summary. The backend must recompute totals at order time.
export const FREE_SHIPPING_THRESHOLD = 1999;
export const SHIPPING_FEE = 99;
