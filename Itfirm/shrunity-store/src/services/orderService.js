import { api } from './api';

// POST /orders  body: { items: [{ productId, size, color, quantity }], shippingAddress, paymentMethod }
//   -> Order. Prices are NOT sent: the backend must price the order from its own catalogue.
// GET  /orders  -> Order[] | Spring Page { content: [] }
//   Order: { id, createdAt, status, total, items: [{ name, image, size, color, quantity, price }] }
export const orderService = {
  async create({ items, shippingAddress, paymentMethod }) {
    const body = {
      items: items.map(({ productId, size, color, qty }) => ({ productId, size, color, quantity: qty })),
      shippingAddress,
      paymentMethod,
    };
    const { data } = await api.post('/orders', body);
    return data;
  },
  async list() {
    const { data } = await api.get('/orders');
    return Array.isArray(data) ? data : data?.content ?? [];
  },
};
