import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const KEY = 'shrunity.wishlist.v1';
const WishlistContext = createContext(null);

function load() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(ids));
    } catch {
      /* ignore */
    }
  }, [ids]);

  const toggle = useCallback((id) => setIds((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id])), []);
  const has = useCallback((id) => ids.includes(id), [ids]);
  const value = useMemo(() => ({ ids, toggle, has }), [ids, toggle, has]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => useContext(WishlistContext);
