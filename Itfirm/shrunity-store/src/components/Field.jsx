import { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

// Labelled input with inline error text and (for type="password") a visibility toggle.
export default function Field({ label, error, hint, type = 'text', className = '', ...props }) {
  const id = useId();
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={isPassword && show ? 'text' : type}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          className={`field ${isPassword ? 'pr-12' : ''} ${error ? 'field-error' : ''}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? 'Hide password' : 'Show password'}
            aria-pressed={show}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-ink-mute hover:text-ink"
          >
            {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      {error && <p id={`${id}-error`} className="mt-1.5 text-sm text-red-700">{error}</p>}
      {!error && hint && <p id={`${id}-hint`} className="mt-1.5 text-sm text-ink-mute">{hint}</p>}
    </div>
  );
}
