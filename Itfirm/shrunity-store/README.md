# Shrunity: Women's Fashion Store (React frontend)

React + Vite + Tailwind storefront with Google sign-in, a guest-friendly cart, and the **Luna AI Stylist** chat widget. It is ready to talk to a Spring Boot REST API.

## Run it

```bash
npm install
cp .env.example .env     # on Windows: copy .env.example .env
npm run dev              # http://localhost:5173
```

With `VITE_USE_MOCK_DATA=true` (the default in dev, even if `.env` is missing) the catalogue, the AI stylist and the newsletter form use built-in demo data, so the storefront works without a backend. **Sign in, sign up, checkout and orders always call the backend** and show a clear error if it is unreachable. Nothing fakes a successful login.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Spring Boot base URL, e.g. `http://localhost:8080/api` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth *Web* client ID (public). Add `http://localhost:5173` under "Authorized JavaScript origins" in Google Cloud Console |
| `VITE_USE_MOCK_DATA` | `true` = demo products / AI / newsletter, `false` = call the API |

Never put API secrets or AI provider keys in `VITE_*` variables: they are bundled into the browser code.

## Structure

```
src/
  components/   Navbar, Footer, ProductCard, AiStylist, GoogleAuthButton, Field, ...
  pages/        Home, Products, ProductDetails, Cart, Checkout, SignIn, SignUp, Profile, Orders, InfoPage
  context/      AuthContext, CartContext, WishlistContext, ToastContext
  services/     api.js (Axios), authService, productService, cartService, orderService, aiService, newsletterService, mockStylist
  hooks/        useProducts / useProduct
  data/         demo products, categories, sample reviews
  utils/        formatting and form validators
```

## Routes

`/` `/products` `/products/:id` `/cart` `/signin` `/signup` are public. `/checkout`, `/profile` and `/orders` are protected. `/about`, `/contact`, `/privacy`, `/terms` are footer pages with placeholder copy.

## Auth and cart flow

- Add to Cart works for guests; the cart lives in `localStorage` (`shrunity.cart.v1`).
- **Buy Now** adds the item and goes to `/checkout`. **Proceed to Checkout** goes to `/checkout`. If the user is signed out, `ProtectedRoute` redirects to `/signin` and remembers the target; after sign-in or sign-up (email or Google) they return to it, with the cart intact.
- Signed-in carts are saved to the backend as a debounced snapshot (`PUT /cart`). Failures are ignored.

## Backend contract (change paths in `src/services/*`)

| Call | Request | Response |
| --- | --- | --- |
| `POST /auth/login` | `{ email, password }` | `{ token, user }` |
| `POST /auth/register` | `{ fullName, email, password }` | `{ token, user }` (omit `token` if email verification is required) |
| `POST /auth/google` | `{ idToken }` (Google ID token) | `{ token, user }` |
| `GET /auth/me` | Bearer token | `{ id, fullName, email, avatarUrl? }` |
| `POST /auth/forgot-password` | `{ email }` | 2xx |
| `GET /products` | `category, q, sort, maxPrice, trending, isNew, limit` | `Product[]` or Spring `Page` |
| `GET /products/{id}` | | `Product` |
| `GET` / `PUT /cart` | `{ items: [{ productId, size, color, quantity }] }` | |
| `POST /orders` | `{ items, shippingAddress, paymentMethod }` | `Order` |
| `GET /orders` | | `Order[]` or `Page` |
| `POST /ai/recommendations` | `{ message, preferences, history }` | `{ reply, products, preferences? }` |
| `POST /newsletter/subscribe` | `{ email }` | 2xx |

`Product`: `{ id, name, category, price, salePrice, rating, reviewCount, sizes[], colors[{name,hex}], image, description, tags[], trending, isNew }`.

Backend notes:
- Verify the Google ID token server-side (e.g. `GoogleIdTokenVerifier`) and then issue your own JWT.
- Price orders from your own catalogue. The frontend never sends prices.
- Enable CORS for `http://localhost:5173` (and `http.cors(Customizer.withDefaults())` if Spring Security is on).
- The JWT is kept in browser storage ("Remember me" = localStorage, otherwise sessionStorage). For production, consider an httpOnly SameSite cookie instead.
- The AI provider key stays on the server; the frontend only calls `/ai/recommendations`. If that call fails (network or 5xx), the widget falls back to the clearly labelled demo stylist.

## Images

Product images are Unsplash URLs in `src/data/products.js` and `src/data/categories.js`. If one fails to load, the UI shows a placeholder. Check each image matches its product and swap URLs freely. Replace the sample reviews in `src/data/reviews.js` and the placeholder privacy/terms text before launch.

## Build

```bash
npm run build && npm run preview
```
