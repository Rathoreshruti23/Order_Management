import { useEffect, useState } from 'react';
import { productService } from '../services/productService';
import { getErrorMessage } from '../services/api';

export function useProducts(params = {}) {
  const [state, setState] = useState({ data: [], loading: true, error: null });
  const [attempt, setAttempt] = useState(0);
  const key = JSON.stringify(params);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    productService
      .list(JSON.parse(key))
      .then((data) => !cancelled && setState({ data, loading: false, error: null }))
      .catch((err) => !cancelled && setState({ data: [], loading: false, error: getErrorMessage(err, "We couldn't load products.") }));
    return () => { cancelled = true; };
  }, [key, attempt]);

  return { ...state, retry: () => setAttempt((n) => n + 1) };
}

export function useProduct(id) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ data: null, loading: true, error: null });
    productService
      .get(id)
      .then((data) => !cancelled && setState({ data, loading: false, error: null }))
      .catch((err) => !cancelled && setState({ data: null, loading: false, error: getErrorMessage(err, "We couldn't load this product.") }));
    return () => { cancelled = true; };
  }, [id, attempt]);

  return { ...state, retry: () => setAttempt((n) => n + 1) };
}
