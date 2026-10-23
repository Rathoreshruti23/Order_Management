import { api } from './api';
import { USE_MOCK_DATA } from '../config';
import { wait } from '../utils/format';

// POST /newsletter/subscribe  body: { email }
export const newsletterService = {
  async subscribe(email) {
    if (USE_MOCK_DATA) {
      await wait(500); // demo mode: nothing is stored
      return;
    }
    await api.post('/newsletter/subscribe', { email: email.trim() });
  },
};
