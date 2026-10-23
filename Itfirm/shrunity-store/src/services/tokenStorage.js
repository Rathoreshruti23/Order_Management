// Stores the JWT. "Remember me" -> localStorage (survives restarts); otherwise sessionStorage.
// Note: any JS-readable storage is exposed to XSS. For production, prefer an httpOnly,
// SameSite cookie issued by Spring Boot and switch axios to `withCredentials: true`.
const KEY = 'shrunity.token';

export const tokenStorage = {
  get() {
    try {
      return localStorage.getItem(KEY) || sessionStorage.getItem(KEY);
    } catch {
      return null;
    }
  },
  set(token, remember) {
    tokenStorage.clear();
    try {
      (remember ? localStorage : sessionStorage).setItem(KEY, token);
    } catch {
      /* storage unavailable */
    }
  },
  clear() {
    try {
      localStorage.removeItem(KEY);
      sessionStorage.removeItem(KEY);
    } catch {
      /* storage unavailable */
    }
  },
};
