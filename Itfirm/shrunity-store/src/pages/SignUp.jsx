import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Field from '../components/Field';
import GoogleAuthButton from '../components/GoogleAuthButton';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../services/api';
import { validateSignUp } from '../utils/validators';
import { destinationFrom } from './SignIn';

export default function SignUp() {
  const { signUp, signInWithGoogle, isAuthenticated } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({ fullName: '', email: '', password: '', confirmPassword: '', terms: false });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  if (isAuthenticated) return <Navigate to={destinationFrom(location)} replace />;

  const set = (name) => (e) => setValues((v) => ({ ...v, [name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const goBack = () => navigate(destinationFrom(location), { replace: true });

  const submit = async (e) => {
    e.preventDefault();
    const found = validateSignUp(values);
    setErrors(found);
    if (Object.keys(found).length) return;
    setBusy(true);
    setFormError('');
    try {
      const result = await signUp(values);
      if (result.requiresSignIn) {
        push('Account created. Sign in to continue.');
        navigate('/signin', { replace: true, state: location.state });
      } else {
        goBack();
      }
    } catch (err) {
      setFormError(getErrorMessage(err, "We couldn't create your account. Please try again."));
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
      setFormError(getErrorMessage(err, "We couldn't sign you up with Google."));
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Save your details for faster checkout and track every order.">
      <form onSubmit={submit} noValidate className="space-y-5">
        <Field label="Full name" name="fullName" autoComplete="name" value={values.fullName} onChange={set('fullName')} error={errors.fullName} />
        <Field label="Email address" type="email" name="email" autoComplete="email" value={values.email} onChange={set('email')} error={errors.email} />
        <Field label="Password" type="password" name="password" autoComplete="new-password" value={values.password} onChange={set('password')} error={errors.password} hint="At least 8 characters, with a letter and a number." />
        <Field label="Confirm password" type="password" name="confirmPassword" autoComplete="new-password" value={values.confirmPassword} onChange={set('confirmPassword')} error={errors.confirmPassword} />
        <div>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" checked={values.terms} onChange={set('terms')} aria-invalid={errors.terms ? 'true' : undefined} className="mt-0.5 h-4 w-4 accent-blush-600" />
            <span>I agree to the <Link to="/terms" className="underline underline-offset-4">Terms of Use</Link> and <Link to="/privacy" className="underline underline-offset-4">Privacy Policy</Link>.</span>
          </label>
          {errors.terms && <p className="mt-1.5 text-sm text-red-700">{errors.terms}</p>}
        </div>
        {formError && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-900" role="alert">{formError}</p>}
        <button type="submit" disabled={busy} className="btn btn-primary w-full py-3">{busy ? 'Creating account…' : 'Sign Up'}</button>
      </form>
      <div className="my-6 flex items-center gap-3 text-sm text-ink-mute"><span className="h-px flex-1 bg-ink/15" />or<span className="h-px flex-1 bg-ink/15" /></div>
      <GoogleAuthButton mode="signup" onCredential={onGoogle} />
      <p className="mt-8 text-center text-sm">Already have an account? <Link to="/signin" state={location.state} className="font-medium underline underline-offset-4 hover:text-blush-600">Sign in</Link></p>
    </AuthLayout>
  );
}
