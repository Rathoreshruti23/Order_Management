const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export const formatINR = (value) => inr.format(Number(value) || 0);

export const discountPercent = (mrp, sale) =>
  mrp > 0 && sale < mrp ? Math.round(((mrp - sale) / mrp) * 100) : 0;

export const wait = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));
