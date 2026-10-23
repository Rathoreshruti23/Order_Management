import { useEffect, useRef, useState } from 'react';
import { GOOGLE_CLIENT_ID } from '../config';

// Google Identity Services. Google renders its own button; we receive an ID token (JWT)
// that the Spring Boot backend must verify before issuing its own session token.
const SCRIPT_SRC = 'https://accounts.google.com/gsi/client';
let scriptPromise = null;

function loadGoogleScript() {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = () => { scriptPromise = null; reject(new Error('Google script failed to load')); };
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

export default function GoogleAuthButton({ mode = 'signin', onCredential }) {
  const container = useRef(null);
  const callback = useRef(onCredential);
  callback.current = onCredential;
  const [status, setStatus] = useState(GOOGLE_CLIENT_ID ? 'loading' : 'unconfigured');

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return undefined;
    let cancelled = false;
    loadGoogleScript()
      .then(() => {
        if (cancelled || !container.current) return;
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => callback.current(response.credential),
        });
        const width = Math.min(400, Math.max(200, container.current.offsetWidth || 320));
        window.google.accounts.id.renderButton(container.current, {
          type: 'standard', theme: 'outline', size: 'large', shape: 'pill', width,
          text: mode === 'signup' ? 'signup_with' : 'signin_with',
        });
        setStatus('ready');
      })
      .catch(() => !cancelled && setStatus('error'));
    return () => { cancelled = true; };
  }, [mode]);

  if (status === 'unconfigured') {
    return (
      <div>
        <button type="button" disabled className="btn btn-outline w-full">Continue with Google</button>
        <p className="mt-1.5 text-center text-xs text-ink-mute">Google sign-in is off. Set VITE_GOOGLE_CLIENT_ID in .env to enable it.</p>
      </div>
    );
  }

  return (
    <div>
      <div ref={container} className="flex min-h-[44px] w-full justify-center" />
      {status === 'error' && <p className="mt-1.5 text-center text-sm text-red-700" role="alert">Google sign-in couldn't load. Check your connection or use email instead.</p>}
    </div>
  );
}
