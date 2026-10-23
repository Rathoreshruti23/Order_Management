import { api } from './api';

// Server-side cart for signed-in users. The local cart is the source of truth in the UI;
// the signed-in cart is saved as a snapshot (last write wins).
//   GET /cart -> { items: [{ productId, size, color, quantity }] }
//   PUT /cart  body: { items: [{ productId, size, color, quantity }] }
const toPayload = (items) =>
  items.map(({ productId, size, color, qty }) => ({ productId, size, color, quantity: qty }));

export const cartService = {
  async get() {
    const { data } = await api.get('/cart');
    return data;
  },
  async save(items) {
    const { data } = await api.put('/cart', { items: toPayload(items) });
    return data;
  },
};
