import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Field from '../components/Field';
import { EmptyState } from '../components/StateViews';
import { OrderSummary } from './Cart';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/orderService';
import { getErrorMessage } from '../services/api';
import { validateAddress } from '../utils/validators';

export default function Checkout() {
  const { user } = useAuth();
  const { items, clear } = useCart();
  const { push } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: user?.fullName || user?.name || '', phone: '', line1: '', city: '', state: '', pincode: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const bind = (name) => ({
    name,
    value: form[name],
    error: errors[name],
    onChange: (e) => setForm((f) => ({ ...f, [name]: e.target.value })),
  });

  if (items.length === 0) {
    return (
      <div className="container-page py-10">
        <EmptyState title="Nothing to check out yet">
          <Link to="/products" className="btn btn-primary">Continue shopping</Link>
        </EmptyState>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    const found = validateAddress(form);
    setErrors(found);
    if (Object.keys(found).length) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      // No payment gateway yet: orders are placed as cash on delivery. Prices are computed by the backend.
      await orderService.create({ items, shippingAddress: form, paymentMethod: 'COD' });
      clear();
      push('Order placed. Thank you!');
      navigate('/orders');
    } catch (err) {
      setSubmitError(getErrorMessage(err, "We couldn't place your order. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-page py-10">
      <h1 className="section-title">Checkout</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
        <form id="checkout-form" onSubmit={submit} noValidate className="space-y-5 rounded-3xl bg-white p-6 sm:p-8">
          <h2 className="text-2xl font-semibold">Delivery address</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" autoComplete="name" {...bind('fullName')} />
            <Field label="Mobile number" type="tel" inputMode="numeric" autoComplete="tel-national" {...bind('phone')} />
          </div>
          <Field label="Street address" autoComplete="address-line1" {...bind('line1')} />
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="City" autoComplete="address-level2" {...bind('city')} />
            <Field label="State" autoComplete="address-level1" {...bind('state')} />
            <Field label="PIN code" inputMode="numeric" maxLength={6} autoComplete="postal-code" {...bind('pincode')} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Payment</h2>
            <label className="mt-3 flex items-center gap-3 rounded-xl border border-ink/20 p-4 text-sm">
              <input type="radio" checked readOnly className="accent-blush-600" />Cash on delivery
            </label>
          </div>
          {submitError && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-900" role="alert">{submitError}</p>}
        </form>
        <OrderSummary>
          <button type="submit" form="checkout-form" disabled={submitting} className="btn btn-primary mt-6 w-full py-3">{submitting ? 'Placing order…' : 'Place order'}</button>
        </OrderSummary>
      </div>
    </div>
  );
}
