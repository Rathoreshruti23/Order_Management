import { api } from './api';
import { USE_MOCK_DATA } from '../config';
import { products as mockProducts, getProductById } from '../data/products';
import { wait } from '../utils/format';

// Endpoints (adjust paths here if your controller differs):
//   GET /products?category=&q=&sort=&maxPrice=&trending=&isNew=&limit=   -> Product[] | Spring Page { content: [] }
//   GET /products/{id}                                                    -> Product
const SORTERS = {
  'price-asc': (a, b) => a.salePrice - b.salePrice,
  'price-desc': (a, b) => b.salePrice - a.salePrice,
  rating: (a, b) => b.rating - a.rating,
};

function queryMock({ category, q, sort, maxPrice, trending, isNew, limit } = {}) {
  let list = [...mockProducts];
  if (category === 'new-arrivals') list = list.filter((p) => p.isNew);
  else if (category) list = list.filter((p) => p.category === category);
  if (q) {
    const term = q.toLowerCase();
    list = list.filter((p) => [p.name, p.category, p.description, ...p.tags].join(' ').toLowerCase().includes(term));
  }
  if (maxPrice) list = list.filter((p) => p.salePrice <= maxPrice);
  if (trending) list = list.filter((p) => p.trending);
  if (isNew) list = list.filter((p) => p.isNew);
  if (SORTERS[sort]) list.sort(SORTERS[sort]);
  return limit ? list.slice(0, limit) : list;
}

export const productService = {
  async list(params = {}) {
    if (USE_MOCK_DATA) {
      await wait();
      return queryMock(params);
    }
    const { data } = await api.get('/products', { params });
    return Array.isArray(data) ? data : data?.content ?? [];
  },
  async get(id) {
    if (USE_MOCK_DATA) {
      await wait(250);
      const product = getProductById(id);
      if (!product) {
        throw Object.assign(new Error('Not found'), {
          response: { status: 404, data: { message: "We couldn't find that product." } },
        });
      }
      return product;
    }
    const { data } = await api.get(`/products/${encodeURIComponent(id)}`);
    return data;
  },
};
