// Demo catalogue used when VITE_USE_MOCK_DATA=true.
// Images are Unsplash photos (free to use under the Unsplash licence). Swap any URL here;
// SafeImage shows a placeholder if a URL fails to load.
export const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL'];

export const unsplash = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const c = (name, hex) => ({ name, hex });

export const products = [
  // Dresses
  {
    id: 'd1', name: 'Rosewater Wrap Dress', category: 'dresses', price: 3499, salePrice: 2499,
    rating: 4.7, reviewCount: 186, sizes: ['XS', 'S', 'M', 'L'], colors: [c('Rose', '#E4829A'), c('Ivory', '#F3EBE1'), c('Sage', '#9DB09A')],
    image: unsplash('1496747611176-843222e1e57c'), tags: ['party', 'casual', 'vacation'], trending: true, isNew: true,
    description: 'A fluid wrap silhouette in a soft crepe that moves well and stays put. Adjustable waist tie, flutter sleeves, midi length.',
  },
  {
    id: 'd2', name: 'Garden Party Floral Midi', category: 'dresses', price: 3999, salePrice: 2799,
    rating: 4.6, reviewCount: 142, sizes: ['S', 'M', 'L', 'XL'], colors: [c('Blush Floral', '#F6CBD5'), c('Navy Floral', '#2F3B5C')],
    image: unsplash('1572804013309-59a88b7e92f1'), tags: ['party', 'vacation', 'casual'], trending: true, isNew: false,
    description: 'A printed midi with a smocked bodice and a full skirt. Lined, with side pockets.',
  },
  {
    id: 'd3', name: 'Satin Slip Evening Dress', category: 'dresses', price: 5499, salePrice: 3999,
    rating: 4.8, reviewCount: 94, sizes: ['XS', 'S', 'M'], colors: [c('Wine', '#7A2B3F'), c('Black', '#2A2226')],
    image: unsplash('1566174053879-31528523f8ae'), tags: ['party', 'wedding'], trending: true, isNew: true,
    description: 'Bias-cut satin with a cowl neckline and a low back. Falls just below the knee.',
  },
  {
    id: 'd4', name: 'Linen Summer Sundress', category: 'dresses', price: 2499, salePrice: 1799,
    rating: 4.4, reviewCount: 210, sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: [c('Sand', '#E3D5C0'), c('Sky', '#A9C6DE')],
    image: unsplash('1509631179647-0177331693ae'), tags: ['casual', 'vacation'], trending: false, isNew: false,
    description: 'Breathable linen blend with tiered skirt and adjustable straps. Made for warm days.',
  },
  // Tops
  {
    id: 't1', name: 'Ivory Poplin Shirt', category: 'tops', price: 1799, salePrice: 1299,
    rating: 4.5, reviewCount: 320, sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: [c('Ivory', '#F3EBE1'), c('Sky', '#A9C6DE')],
    image: unsplash('1594633312681-425c7b97ccd1'), tags: ['office', 'casual'], trending: true, isNew: false,
    description: 'A crisp cotton poplin shirt with a relaxed fit and a curved hem.',
  },
  {
    id: 't2', name: 'Ribbed Knit Tank', category: 'tops', price: 999, salePrice: 699,
    rating: 4.3, reviewCount: 512, sizes: ['XS', 'S', 'M', 'L'], colors: [c('White', '#FFFFFF'), c('Blush', '#F6CBD5'), c('Black', '#2A2226')],
    image: unsplash('1485968579580-b6d095142e6e'), tags: ['casual', 'vacation'], trending: false, isNew: false,
    description: 'Stretch rib-knit tank that layers under blazers or stands on its own.',
  },
  {
    id: 't3', name: 'Puff Sleeve Blouse', category: 'tops', price: 1999, salePrice: 1499,
    rating: 4.6, reviewCount: 128, sizes: ['S', 'M', 'L', 'XL'], colors: [c('Cream', '#F3EBE1'), c('Rose', '#E4829A')],
    image: unsplash('1581044777550-4cfa60707c03'), tags: ['office', 'party', 'casual'], trending: true, isNew: true,
    description: 'Lightweight georgette blouse with gathered sleeves and a tie neck.',
  },
  {
    id: 't4', name: 'Linen Co-ord Set', category: 'tops', price: 3799, salePrice: 2899,
    rating: 4.7, reviewCount: 76, sizes: ['XS', 'S', 'M', 'L'], colors: [c('Oat', '#E3D5C0'), c('Olive', '#7B8560')],
    image: unsplash('1539109136881-3be0616acf4b'), tags: ['casual', 'vacation', 'office'], trending: false, isNew: true,
    description: 'A matching shirt and wide-leg trouser set in washed linen. Wear together or mix with other pieces.',
  },
  {
    id: 't5', name: 'Tailored Blazer', category: 'tops', price: 4999, salePrice: 3499,
    rating: 4.8, reviewCount: 88, sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: [c('Camel', '#C19A6B'), c('Black', '#2A2226')],
    image: unsplash('1591047139829-d91aecb6caea'), tags: ['office', 'party'], trending: false, isNew: false,
    description: 'A single-breasted blazer with soft shoulders and a structured, lined body.',
  },
  // Jeans & trousers
  {
    id: 'j1', name: 'High-Rise Straight Jeans', category: 'jeans', price: 2999, salePrice: 2199,
    rating: 4.5, reviewCount: 402, sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: [c('Indigo', '#3B4A6B'), c('Light Wash', '#9DB7D5')],
    image: unsplash('1541099649105-f69ad21f3246'), tags: ['casual', 'office'], trending: true, isNew: false,
    description: 'Mid-weight stretch denim with a high rise and a clean straight leg.',
  },
  {
    id: 'j2', name: 'Wide-Leg Denim', category: 'jeans', price: 3299, salePrice: 2399,
    rating: 4.4, reviewCount: 233, sizes: ['S', 'M', 'L', 'XL'], colors: [c('Mid Blue', '#5B7BA6'), c('Black', '#2A2226')],
    image: unsplash('1542272604-787c3835535d'), tags: ['casual', 'vacation'], trending: false, isNew: true,
    description: 'A relaxed wide leg in rigid denim with a full-length hem.',
  },
  {
    id: 'j3', name: 'Pleated Tailored Trousers', category: 'jeans', price: 2799, salePrice: 1999,
    rating: 4.6, reviewCount: 117, sizes: ['XS', 'S', 'M', 'L'], colors: [c('Charcoal', '#4A4348'), c('Stone', '#CFC4B4')],
    image: unsplash('1475178626620-a4d074967452'), tags: ['office'], trending: false, isNew: false,
    description: 'Front-pleated trousers in a wrinkle-resistant blend. Hidden zip, side pockets.',
  },
  // Ethnic wear
  {
    id: 'e1', name: 'Chanderi Silk Kurta Set', category: 'ethnic-wear', price: 4499, salePrice: 3299,
    rating: 4.8, reviewCount: 164, sizes: ['S', 'M', 'L', 'XL'], colors: [c('Peach', '#F2B8A2'), c('Teal', '#3E7C7B')],
    image: unsplash('1583391733956-3750e0ff4e8b'), tags: ['wedding', 'party', 'office'], trending: true, isNew: true,
    description: 'Kurta, straight pants and dupatta in a Chanderi silk blend with subtle zari detailing.',
  },
  {
    id: 'e2', name: 'Banarasi Silk Saree', category: 'ethnic-wear', price: 8999, salePrice: 6499,
    rating: 4.9, reviewCount: 61, sizes: ['M', 'L', 'XL'], colors: [c('Crimson', '#9E1B32'), c('Emerald', '#1F6B53')],
    image: unsplash('1610030469983-98e550d6193c'), tags: ['wedding'], trending: true, isNew: false,
    description: 'A woven Banarasi saree with a rich border and pallu. Blouse piece included.',
  },
  {
    id: 'e3', name: 'Embroidered Anarkali', category: 'ethnic-wear', price: 5999, salePrice: 4299,
    rating: 4.7, reviewCount: 99, sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: [c('Mint', '#BFD8C8'), c('Dusty Pink', '#E4B1BB')],
    image: unsplash('1617627143750-d86bc21e42bb'), tags: ['wedding', 'party'], trending: false, isNew: true,
    description: 'A floor-length Anarkali with thread embroidery on the yoke and a flared, lined skirt.',
  },
  // Accessories
  {
    id: 'a1', name: 'Gold Hoop Earrings', category: 'accessories', price: 899, salePrice: 599,
    rating: 4.5, reviewCount: 388, sizes: ['S', 'M'], colors: [c('Gold', '#D4AF37'), c('Silver', '#C0C0C0')],
    image: unsplash('1535632066927-ab7c9ab60908'), tags: ['party', 'casual', 'office', 'wedding'], trending: false, isNew: false,
    description: 'Lightweight hoops with a hypoallergenic plating. Everyday size.',
  },
  {
    id: 'a2', name: 'Structured Tote Bag', category: 'accessories', price: 3499, salePrice: 2599,
    rating: 4.6, reviewCount: 143, sizes: ['M', 'L'], colors: [c('Tan', '#B07D56'), c('Black', '#2A2226')],
    image: unsplash('1584917865442-de89df76afd3'), tags: ['office', 'casual'], trending: true, isNew: false,
    description: 'Faux-leather tote that fits a 14-inch laptop. Zip closure and an inner pocket.',
  },
  {
    id: 'a3', name: 'Block-Heel Sandals', category: 'accessories', price: 2499, salePrice: 1799,
    rating: 4.3, reviewCount: 190, sizes: ['S', 'M', 'L'], colors: [c('Nude', '#D9B8A0'), c('Gold', '#D4AF37')],
    image: unsplash('1543163521-1bf539c55dd2'), tags: ['party', 'wedding', 'office'], trending: false, isNew: true,
    description: 'A 5 cm block heel with a padded footbed and an ankle strap.',
  },
  {
    id: 'a4', name: 'Pearl Drop Necklace', category: 'accessories', price: 1499, salePrice: 999,
    rating: 4.6, reviewCount: 72, sizes: ['M'], colors: [c('Pearl', '#F3EBE1')],
    image: unsplash('1611591437281-460bfbe1220a'), tags: ['wedding', 'party', 'office'], trending: false, isNew: true,
    description: 'Freshwater-style pearls on a gold-tone chain with an adjustable clasp.',
  },
];

export const getProductById = (id) => products.find((p) => p.id === id);
