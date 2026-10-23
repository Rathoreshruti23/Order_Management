import { useState } from 'react';
import { newsletterService } from '../services/newsletterService';
import { getErrorMessage } from '../services/api';
import { validateEmail } from '../utils/validators';
import Field from './Field';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [state, setState] = useState('idle'); // idle | loading | done

  const submit = async (e) => {
    e.preventDefault();
    const problem = validateEmail(email);
    if (problem) return setError(problem);
    setError('');
    setState('loading');
    try {
      await newsletterService.subscribe(email);
      setState('done');
    } catch (err) {
      setError(getErrorMessage(err, "We couldn't subscribe you. Please try again."));
      setState('idle');
    }
  };

  return (
    <section className="bg-blush-100" aria-labelledby="newsletter-title">
      <div className="container-page grid items-center gap-8 py-14 md:grid-cols-2">
        <div>
          <h2 id="newsletter-title" className="section-title">First look at new arrivals</h2>
          <p className="mt-3 max-w-md text-ink-soft">Join the list for early access to new collections and sale days. One email a week, unsubscribe any time.</p>
        </div>
        {state === 'done' ? (
          <p className="rounded-2xl bg-white p-6 text-lg" role="status">You're on the list. Watch your inbox for the next drop.</p>
        ) : (
          <form onSubmit={submit} noValidate className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <Field label="Email address" type="email" name="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={error} placeholder="you@example.com" className="flex-1" />
            <button type="submit" disabled={state === 'loading'} className="btn btn-primary sm:mt-[1.85rem] sm:py-3">{state === 'loading' ? 'Subscribing…' : 'Subscribe'}</button>
          </form>
        )}
      </div>
    </section>
  );
}
