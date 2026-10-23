// DEMO ONLY: a rule-based stand-in for the Spring Boot AI recommendation API.
// It reads occasion / budget / size / category from the message and filters the demo catalogue.
import { products } from '../data/products';
import { formatINR } from '../utils/format';

const OCCASIONS = {
  party: ['party', 'night out', 'date night', 'cocktail', 'club'],
  office: ['office', 'work', 'formal', 'meeting', 'interview'],
  casual: ['casual', 'everyday', 'weekend', 'brunch', 'college', 'outing'],
  wedding: ['wedding', 'festive', 'sangeet', 'reception', 'diwali', 'puja', 'engagement'],
  vacation: ['vacation', 'summer', 'holiday', 'beach', 'trip', 'travel'],
};
const CATEGORY_WORDS = {
  dresses: ['dress', 'gown'],
  tops: ['top', 'shirt', 'blouse', 'tee', 'blazer'],
  jeans: ['jeans', 'denim', 'trouser', 'pants'],
  'ethnic-wear': ['ethnic', 'kurta', 'saree', 'sari', 'anarkali', 'lehenga'],
  accessories: ['accessor', 'bag', 'earring', 'jewel', 'sandal', 'necklace', 'shoes'],
};
const OUTFITS = {
  party: ['dresses', 'accessories'],
  office: ['tops', 'jeans', 'accessories'],
  casual: ['tops', 'jeans'],
  wedding: ['ethnic-wear', 'accessories'],
  vacation: ['dresses', 'tops', 'accessories'],
};
const STYLES = ['minimal', 'classic', 'boho', 'bold', 'elegant', 'trendy', 'romantic'];

export function parsePreferences(text) {
  const t = text.toLowerCase();
  const prefs = {};
  for (const [key, words] of Object.entries(OCCASIONS)) {
    if (words.some((w) => t.includes(w))) { prefs.occasion = key; break; }
  }
  for (const [key, words] of Object.entries(CATEGORY_WORDS)) {
    if (words.some((w) => t.includes(w))) { prefs.category = key; break; }
  }
  const budget = t.match(/(?:under|below|within|less than|upto|up to|budget(?: of)?)\s*(?:₹|rs\.?|inr)?\s*(\d[\d,]*(?:\.\d+)?)\s*(k)?/);
  if (budget) {
    let n = Number(budget[1].replace(/,/g, ''));
    if (budget[2]) n *= 1000;
    if (n > 0) prefs.budget = n;
  }
  const size = t.match(/\bsize\s*(?:is\s*)?(xs|xl|s|m|l)\b/) || t.match(/^\s*(xs|xl|s|m|l)\s*$/);
  if (size) prefs.size = size[1].toUpperCase();
  const style = STYLES.find((s) => t.includes(s));
  if (style) prefs.style = style;
  return prefs;
}

const topRated = (list) => [...list].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);

function matches(p, prefs) {
  if (prefs.budget && p.salePrice > prefs.budget) return false;
  if (prefs.size && !p.sizes.includes(prefs.size)) return false;
  return true;
}

function nextQuestion(prefs) {
  if (!prefs.occasion) return 'What is the occasion: office, a party, a wedding, a casual outing or a vacation?';
  if (!prefs.budget) return 'What budget should I stay within?';
  if (!prefs.size) return 'Which size do you usually wear (XS to XL)?';
  if (!prefs.style) return 'Do you lean minimal, classic, bold or romantic?';
  return 'Want me to adjust the budget, size or occasion?';
}

export function mockRecommend({ message, preferences = {} }) {
  const parsed = parsePreferences(message);
  const prefs = { ...preferences, ...parsed };
  const wantsOutfit = /outfit|wear|look|style me|suggest/i.test(message);
  let picks = [];

  if (prefs.category && (parsed.category || !prefs.occasion)) {
    let pool = products.filter((p) => (prefs.category === 'new-arrivals' ? p.isNew : p.category === prefs.category) && matches(p, prefs));
    if (prefs.occasion) {
      const byOccasion = pool.filter((p) => p.tags.includes(prefs.occasion));
      if (byOccasion.length) pool = byOccasion;
    }
    picks = topRated(pool).slice(0, 4);
  } else if (prefs.occasion && wantsOutfit) {
    // One piece per category in the outfit template.
    picks = OUTFITS[prefs.occasion]
      .map((cat) => topRated(products.filter((p) => p.category === cat && p.tags.includes(prefs.occasion) && matches(p, prefs)))[0])
      .filter(Boolean);
  } else if (prefs.occasion) {
    picks = topRated(products.filter((p) => p.tags.includes(prefs.occasion) && matches(p, prefs))).slice(0, 4);
  } else if (prefs.budget) {
    picks = topRated(products.filter((p) => matches(p, prefs))).slice(0, 4);
  }

  const bits = [];
  if (prefs.occasion) bits.push(`for ${prefs.occasion === 'casual' ? 'a casual day out' : prefs.occasion}`);
  if (prefs.budget) bits.push(`under ${formatINR(prefs.budget)}`);
  if (prefs.size) bits.push(`in size ${prefs.size}`);
  const scope = bits.join(' ');

  let reply;
  if (picks.length) {
    const outfit = prefs.occasion && wantsOutfit && !parsed.category;
    reply = `${outfit ? 'Here is an outfit' : 'Here are my top picks'}${scope ? ` ${scope}` : ''}. ${nextQuestion(prefs)}`;
  } else if (scope || prefs.category) {
    reply = `I couldn't find a match${scope ? ` ${scope}` : ''}. Try a higher budget or a different size. ${nextQuestion(prefs)}`;
  } else {
    reply = `Happy to help. Tell me about your style first. ${nextQuestion(prefs)}`;
  }
  return { reply, products: picks, preferences: prefs, isMock: true };
}
