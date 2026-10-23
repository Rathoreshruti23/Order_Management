import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Field from '../components/Field';
import GoogleAuthButton from '../components/GoogleAuthButton';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/authService';
import { getErrorMessage, isAuthFailure } from '../services/api';
import { validateEmail, validateSignIn } from '../utils/validators';

export function destinationFrom(location) {
  const from = location.state?.from;
  return from?.pathname ? `${from.pathname}${from.search || ''}` : '/';
}

export default function SignIn() {
  const { signIn, signInWithGoogle, isAuthenticated } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({ email: '', password: '', remember: false });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);
  const [resetMode, setResetMode] = useState(false);

  if (isAuthenticated) return <Navigate to={destinationFrom(location)} replace />;

  const set = (name) => (e) => setValues((v) => ({ ...v, [name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const goBack = () => navigate(destinationFrom(location), { replace: true });

  const submit = async (e) => {
    e.preventDefault();
    const found = validateSignIn(values);
    setErrors(found);
    if (Object.keys(found).length) return;
    setBusy(true);
    setFormError('');
    try {
      await signIn(values);
      goBack();
    } catch (err) {
      setFormError(isAuthFailure(err) ? 'Email or password is incorrect.' : getErrorMessage(err, 'Email or password is incorrect.'));
    } finally {
      setBusy(false);
    }
  };

  const reset = async (e) => {
    e.preventDefault();
    const problem = validateEmail(values.email);
    setErrors({ email: problem });
    if (problem) return;
    setBusy(true);
    setFormError('');
    try {
      await authService.forgotPassword(values.email);
      push('If an account exists for that email, a reset link is on its way.');
      setResetMode(false);
    } catch (err) {
      setFormError(getErrorMessage(err, "We couldn't send the reset link. Please try again."));
    } finally {
      setBusy(false);
    }
  };

  const onGoogle = async (credential) => {
    setFormError('');
    try {
      await signInWithGoogle(credential);
      goBack();
    } catch (err) {
      setFormError(getErrorMessage(err, "We couldn't sign you in with Google."));
    }
  };

  return (
    <AuthLayout title={resetMode ? 'Reset your password' : 'Welcome back'} subtitle={location.state?.from ? 'Sign in to continue where you left off.' : 'Sign in to see your orders and check out faster.'}>
      {resetMode ? (
        <form onSubmit={reset} noValidate className="space-y-5">
          <Field label="Email address" type="email" name="email" autoComplete="email" value={values.email} onChange={set('email')} error={errors.email} />
          {formError && <p className="text-sm text-red-700" role="alert">{formError}</p>}
          <button type="submit" disabled={busy} className="btn btn-primary w-full py-3">{busy ? 'Sending…' : 'Send reset link'}</button>
          <button type="button" onClick={() => { setResetMode(false); setErrors({}); setFormError(''); }} className="w-full text-sm underline underline-offset-4">Back to sign in</button>
        </form>
      ) : (
        <>
          <form onSubmit={submit} noValidate className="space-y-5">
            <Field label="Email address" type="email" name="email" autoComplete="email" value={values.email} onChange={set('email')} error={errors.email} />
            <Field label="Password" type="password" name="password" autoComplete="current-password" value={values.password} onChange={set('password')} error={errors.password} />
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" checked={values.remember} onChange={set('remember')} className="h-4 w-4 accent-blush-600" />Remember me</label>
              <button type="button" onClick={() => { setResetMode(true); setErrors({}); setFormError(''); }} className="underline underline-offset-4 hover:text-blush-600">Forgot password?</button>
            </div>
            {formError && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-900" role="alert">{formError}</p>}
            <button type="submit" disabled={busy} className="btn btn-primary w-full py-3">{busy ? 'Signing in…' : 'Sign In'}</button>
          </form>
          <div className="my-6 flex items-center gap-3 text-sm text-ink-mute"><span className="h-px flex-1 bg-ink/15" />or<span className="h-px flex-1 bg-ink/15" /></div>
          <GoogleAuthButton mode="signin" onCredential={onGoogle} />
          <p className="mt-8 text-center text-sm">New to Shrunity? <Link to="/signup" state={location.state} className="font-medium underline underline-offset-4 hover:text-blush-600">Create an account</Link></p>
        </>
      )}
    </AuthLayout>
  );
}
