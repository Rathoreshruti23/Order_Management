import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';
import { tokenStorage } from '../services/tokenStorage';
import { UNAUTHORIZED_EVENT } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // 'loading' while we validate a stored token with the backend.
  const [status, setStatus] = useState(tokenStorage.get() ? 'loading' : 'unauthenticated');

  useEffect(() => {
    if (!tokenStorage.get()) return undefined;
    let cancelled = false;
    authService
      .me()
      .then((me) => {
        if (cancelled) return;
        setUser(me);
        setStatus('authenticated');
      })
      .catch((err) => {
        if (cancelled) return;
        // Server said the token is bad -> forget it. Network error -> keep it for next time.
        if (err.response) tokenStorage.clear();
        setUser(null);
        setStatus('unauthenticated');
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const onUnauthorized = () => { setUser(null); setStatus('unauthenticated'); };
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
  }, []);

  const completeLogin = useCallback(async (data, remember) => {
    if (!data.token) throw new Error('The server did not return a session token.');
    tokenStorage.set(data.token, remember);
    const profile = data.user || (await authService.me());
    setUser(profile);
    setStatus('authenticated');
    return profile;
  }, []);

  const signIn = useCallback(
    async ({ email, password, remember }) => completeLogin(await authService.login({ email, password }), remember),
    [completeLogin],
  );

  const signUp = useCallback(
    async (values) => {
      const data = await authService.register(values);
      // Some backends require email verification and return no token.
      if (data.token) {
        await completeLogin(data, true);
        return { requiresSignIn: false };
      }
      // This backend answers registration with a message only (no token): sign in with the same credentials.
      try {
        const session = await authService.login({ email: values.email, password: values.password });
        await completeLogin(session, true);
        return { requiresSignIn: false };
      } catch {
        return { requiresSignIn: true };
      }
    },
    [completeLogin],
  );

  const signInWithGoogle = useCallback(
    async (idToken) => completeLogin(await authService.googleLogin(idToken), true),
    [completeLogin],
  );

  const signOut = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  const value = useMemo(
    () => ({ user, status, isAuthenticated: status === 'authenticated', signIn, signUp, signInWithGoogle, signOut }),
    [user, status, signIn, signUp, signInWithGoogle, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
