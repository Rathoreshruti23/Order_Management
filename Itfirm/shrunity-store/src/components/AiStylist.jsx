import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, Sparkles, X } from 'lucide-react';
import { aiService } from '../services/aiService';
import { getErrorMessage } from '../services/api';
import SafeImage from './SafeImage';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/format';

const QUICK_PROMPTS = [
  'Suggest an outfit for a party',
  'Show me dresses under ₹2,000',
  'What should I wear to the office?',
  'Recommend a casual summer outfit',
];

const WELCOME = {
  id: 'welcome',
  role: 'assistant',
  text: "Hi, I'm Luna, your AI stylist. Tell me the occasion, your budget, your size and the style you like, and I'll suggest pieces. You can also start with one of these:",
};

function RecommendedProduct({ product, defaultSize }) {
  const { addItem } = useCart();
  const sizes = product.sizes?.length ? product.sizes : ['M'];
  const [size, setSize] = useState(sizes.includes(defaultSize) ? defaultSize : sizes[Math.floor(sizes.length / 2)]);
  const color = product.colors?.[0]?.name ?? 'Default';

  return (
    <li className="flex gap-3 rounded-xl border border-ink/10 bg-white p-2.5">
      <Link to={`/products/${product.id}`} className="shrink-0">
        <SafeImage src={product.image} alt={product.name} className="h-24 w-20 rounded-lg" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <Link to={`/products/${product.id}`} className="truncate text-sm font-semibold hover:text-blush-600">{product.name}</Link>
        <p className="text-sm">{formatINR(product.salePrice ?? product.price)}</p>
        <div className="mt-auto flex items-center gap-2 pt-2">
          <label className="sr-only" htmlFor={`size-${product.id}`}>Size for {product.name}</label>
          <select id={`size-${product.id}`} value={size} onChange={(e) => setSize(e.target.value)} className="rounded-lg border border-ink/20 bg-white px-2 py-1.5 text-xs">
            {sizes.map((s) => <option key={s}>{s}</option>)}
          </select>
          <button type="button" onClick={() => addItem(product, { size, color })} className="btn btn-primary flex-1 px-3 py-1.5 text-xs">Add to Cart</button>
        </div>
      </div>
    </li>
  );
}

export default function AiStylist() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [prefs, setPrefs] = useState({});
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sending, open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  async function send(text) {
    const message = text.trim();
    if (!message || sending) return;
    const userMsg = { id: `u${Date.now()}`, role: 'user', text: message };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setSending(true);
    try {
      const history = [...messages, userMsg].slice(-10).map(({ role, text: content }) => ({ role, content }));
      const res = await aiService.recommend({ message, preferences: prefs, history });
      setPrefs(res.preferences || prefs);
      setMessages((m) => [...m, { id: `a${Date.now()}`, role: 'assistant', text: res.reply, products: res.products, isMock: res.isMock }]);
    } catch (err) {
      setMessages((m) => [...m, { id: `e${Date.now()}`, role: 'assistant', error: true, text: getErrorMessage(err, "I couldn't put that together. Please try again.") }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {open && (
        <section
          role="dialog"
          aria-label="Luna AI Stylist"
          className="fixed bottom-24 right-4 z-50 flex h-[min(34rem,calc(100vh-8rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-ink/10 bg-cream-50 shadow-2xl sm:right-6 sm:w-[24rem]"
        >
          <header className="flex items-center justify-between bg-blush-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blush-600" aria-hidden="true" />
              <h2 className="text-xl font-semibold">Luna AI Stylist</h2>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close stylist" className="rounded-full p-1.5 hover:bg-blush-200"><X className="h-5 w-5" /></button>
          </header>

          <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4" aria-live="polite">
            {messages.map((m) => (
              <div key={m.id} className={m.role === 'user' ? 'flex justify-end' : ''}>
                <div className={`max-w-[92%] space-y-3 rounded-2xl px-3.5 py-2.5 text-sm ${m.role === 'user' ? 'bg-ink text-white' : m.error ? 'bg-red-50 text-red-900' : 'bg-white'}`}>
                  <p>{m.text}</p>
                  {m.products?.length > 0 && (
                    <ul className="space-y-2">
                      {m.products.map((p) => <RecommendedProduct key={p.id} product={p} defaultSize={prefs.size} />)}
                    </ul>
                  )}
                  {m.isMock && <p className="text-xs text-ink-mute">Demo suggestions: the AI service isn't connected.</p>}
                </div>
              </div>
            ))}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((q) => (
                  <button key={q} type="button" onClick={() => send(q)} className="rounded-full border border-blush-300 bg-white px-3 py-1.5 text-left text-xs font-medium hover:bg-blush-100">{q}</button>
                ))}
              </div>
            )}
            {sending && <p className="text-sm text-ink-mute" role="status">Luna is styling…</p>}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2 border-t border-ink/10 bg-white p-3">
            <label htmlFor="stylist-input" className="sr-only">Message Luna</label>
            <input id="stylist-input" ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Occasion, budget, size…" maxLength={500} className="field flex-1 py-2.5" />
            <button type="submit" disabled={sending || !input.trim()} aria-label="Send message" className="btn btn-primary h-11 w-11 shrink-0 p-0"><Send className="h-4 w-4" /></button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? 'Close Luna AI Stylist' : 'Open Luna AI Stylist'}
        className="fixed bottom-5 right-4 z-50 flex h-14 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-white shadow-xl transition-colors hover:bg-blush-600 sm:right-6"
      >
        <Sparkles className="h-5 w-5" aria-hidden="true" />
        <span className="hidden sm:inline">Ask Luna</span>
      </button>
    </>
  );
}
