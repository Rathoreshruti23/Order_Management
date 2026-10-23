import { api } from './api';
import { USE_MOCK_DATA } from '../config';
import { wait } from '../utils/format';
import { mockRecommend } from './mockStylist';

// POST /ai/recommendations
//   body:     { message, preferences: { occasion?, budget?, size?, style? }, history: [{ role, content }] }
//   response: { reply: string, products: Product[], preferences?: {...} }
// The AI provider key lives on the Spring Boot server only; the browser never sees it.
export const aiService = {
  async recommend(payload) {
    if (USE_MOCK_DATA) {
      await wait(600);
      return mockRecommend(payload);
    }
    try {
      const { data } = await api.post('/ai/recommendations', payload, { timeout: 30000 });
      return {
        reply: data?.reply || '',
        products: data?.products ?? [],
        preferences: data?.preferences ?? payload.preferences,
        isMock: false,
      };
    } catch (error) {
      // Backend down or erroring: fall back to the demo stylist so the widget stays usable.
      if (!error.response || error.response.status >= 500) {
        await wait(400);
        return mockRecommend(payload);
      }
      throw error;
    }
  },
};
