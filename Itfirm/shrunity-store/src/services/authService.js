import { api } from './api';

// Expected Spring Boot responses: { token | accessToken, user: { id, fullName, email, avatarUrl? } }
// `user` may be omitted; the app then calls GET /auth/me.
const normalize = (data) => ({ token: data?.token || data?.accessToken || null, user: data?.user || null });

export const authService = {
  async login({ email, password }) {
    const { data } = await api.post('/auth/login', { email: email.trim(), password });
    return normalize(data);
  },
  async register({ fullName, email, password }) {
    const { data } = await api.post('/auth/register', { fullName: fullName.trim(), email: email.trim(), password });
    return normalize(data);
  },
  // Send the Google ID token (JWT) to the backend; Spring Boot verifies it with Google and returns its own session token.
  async googleLogin(idToken) {
    const { data } = await api.post('/auth/google', { idToken });
    return normalize(data);
  },
  async me() {
    const { data } = await api.get('/auth/me');
    return data;
  },
  async forgotPassword(email) {
    await api.post('/auth/forgot-password', { email: email.trim() });
  },
};
