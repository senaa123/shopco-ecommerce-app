# shopco-ecommerce-app

Full-stack e-commerce application for a minimalist black / white / gray fashion
brand.

- **frontend/** — Next.js (App Router) + TypeScript + Tailwind CSS v4
- **backend/** — NestJS + TypeScript + Prisma (PostgreSQL)

Implemented so far: project scaffolding and the **Auth**, **Users**, **Catalog**,
**Cart**, **Orders**, **Payments** (mock gateway) and **Reviews** modules.
Remaining feature modules are added in later steps.

## Repository layout

```
shopco-ecommerce-app/
├── frontend/                 Next.js 16 (App Router) + Tailwind v4
│   ├── proxy.ts               route protection (was middleware.ts)
│   ├── app/
│   │   ├── (storefront)/      home · shop/[category] · product/[slug] · cart
│   │   │                      · checkout · login · register · orders
│   │   └── (admin)/admin/     admin dashboard route group
│   ├── components/{ui,storefront,admin}/
│   └── lib/                   api-client · api · auth · auth-context · format
├── backend/                  NestJS API
│   ├── prisma/schema.prisma
│   └── src/
│       ├── config/
│       ├── common/{decorators,guards,filters,interceptors,pipes}/
│       ├── infrastructure/
│       │   ├── database/      PrismaModule / PrismaService
│       │   └── persistence/   shared PrismaUserRepository + USER_REPOSITORY token
│       └── modules/           auth · users · catalog · cart · orders · payments · reviews
└── README.md
```

Each feature module is split into `presentation/` (controllers + DTOs),
`application/` (use-cases), `domain/` (entities + repository interfaces) and
`infrastructure/` (Passport strategies, per-module Prisma repositories). Auth and
Users share a single `UserRepository` contract; the other modules own their
repositories. All money math is done server-side and rounded to cents.

## API

Auth cookies: login sets an httpOnly `access_token` JWT cookie
(`sameSite=lax`, `secure=false` in dev); protected routes read it back.

| Method & path        | Auth                    | Description                                   |
| -------------------- | ----------------------- | -------------------------------------------- |
| `POST /auth/register`| public                  | Create a CUSTOMER account (role is forced)   |
| `POST /auth/login`   | public                  | Verify credentials, set the cookie           |
| `POST /auth/logout`  | public                  | Clear the cookie                             |
| `GET /auth/me`       | JWT                     | Current user from the JWT payload            |
| `GET /users/me`      | JWT                     | Current user's profile (incl. `createdAt`)   |
| `PATCH /users/me`    | JWT                     | Update `name` only                           |
| `GET /users`         | JWT + `@Roles('ADMIN')` | Paginated user list `?page=1&limit=20` → `{ data, total, page, limit }` |
| `GET /categories`    | public                  | All categories                               |
| `POST /categories`   | admin                   | Create a category                            |
| `PATCH /categories/:id` | admin                | Update a category                            |
| `GET /products`      | public                  | Filter/sort/paginate — `?categorySlug&types&minPrice&maxPrice&color&size&dressStyle&search&sort&page&limit` (`types` is a comma-separated list, `IN`-matched); excludes soft-deleted; → `{ data, total, page, limit }` |
| `GET /products/:slug`| public                  | Full detail: variants, images, category, `averageRating` |
| `GET /products/by-id/:id` | admin              | Same detail, looked up by id (for the admin edit form) |
| `POST /products`     | admin                   | Create product + nested `variants[]` + `images[]` (one transaction) |
| `PATCH /products/:id`| admin                   | Update scalar product fields                 |
| `DELETE /products/:id`| admin                  | Soft delete (`isDeleted = true`)             |
| `GET /cart`          | JWT                     | Current user's cart + computed `subtotal`    |
| `POST /cart/items`   | JWT                     | Add item (merges same variant; validates stock) |
| `PATCH /cart/items/:id` | JWT                  | Change quantity (validates stock)            |
| `DELETE /cart/items/:id` | JWT                 | Remove item                                  |
| `POST /orders`       | JWT                     | Create order from cart — recomputes totals, applies `WELCOME20` (20%), $15 delivery (free over $200 after discount), decrements stock + clears cart in one transaction |
| `GET /orders`        | JWT                     | Current user's own orders                    |
| `GET /orders/:id`    | JWT                     | One order (owner, or any if ADMIN)           |
| `GET /admin/orders`  | admin                   | All orders, paginated                        |
| `PATCH /admin/orders/:id/status` | admin       | Transition status (PENDING→PAID→SHIPPED→DELIVERED; →CANCELLED from PENDING/PAID) |
| `POST /payments`     | JWT                     | Mock-charge a PENDING order (`{ orderId, method: "CARD"｜"COD" }`); SUCCESS → order PAID, FAILED → `402`, order stays PENDING for retry |
| `GET /products/:productId/reviews` | public    | Paginated reviews with reviewer name + rating                          |
| `POST /products/:productId/reviews` | JWT      | One review per user per product; requires a DELIVERED order containing the product |

### Notes / limitations

- **Payments** use `MockPaymentGateway` (bound to `PAYMENT_GATEWAY` in
  `payments.module.ts`). CARD charges fail ~10% of the time at random; COD always
  succeeds. Swapping in a real Stripe/PayPal adapter is a one-line change to that
  provider binding.
- **Reviews** enforce the "must have purchased" rule: a review is only accepted
  when the user has a `DELIVERED` order containing that product.
- Product average rating is computed on the fly from `Review.rating` (in the
  product list and detail queries) — never stored on `Product`.
- The storefront's `/shop` price/colour/size filters are driven entirely by URL
  query params, so each change is a fresh server-rendered `GET /products`.
- Checkout's shipping address is not persisted (mock), matching the brief.

## Prerequisites

- Node.js 20+
- npm 10+
- A local PostgreSQL 14+ instance running on `localhost:5432`

## Getting started

### 1. Database

Use your local PostgreSQL server. Create a database named `shopco` (or let
`prisma migrate dev` create it for you). The default connection string expects
user `postgres` / password `1234` — adjust `DATABASE_URL` in `backend/.env` to
match your setup.

### 2. Backend

```bash
cd backend
cp .env.example .env          # adjust values as needed
npm install
npm run prisma:migrate        # create the schema
npm run start:dev             # http://localhost:4000
```

Backend npm scripts:

| Script                    | Description                              |
| ------------------------- | ---------------------------------------- |
| `npm run start:dev`       | Start Nest in watch mode                 |
| `npm run prisma:migrate`  | `prisma migrate dev`                     |
| `npm run prisma:generate` | Regenerate the Prisma client            |
| `npm run seed`            | Load demo data (`prisma db seed` → `prisma/seed.ts`) |

`npm run seed` is **idempotent** — it resets the catalog + transactional data
(users are never touched) and rebuilds it: 4 categories (Casual / Formal / Party /
Gym), 19 products matching the Figma names/prices (each with 2–3 variants, ≥2
`picsum.photos` images and 3–5 reviews), plus demo accounts. It prints a summary
of what it created.

The **admin account is bootstrapped from environment variables** — set
`ADMIN_EMAIL` / `ADMIN_PASSWORD` in `backend/.env` first (the script never
hard-codes a password and errors out if they're missing):

| Account | Credentials |
| ------- | ----------- |
| Admin | `ADMIN_EMAIL` / `ADMIN_PASSWORD` (from `.env`) |
| Customers | `ava@`, `liam@`, `noah@`, `mia@`, `ethan@` `shopco.dev` — password `password123` |

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev                   # http://localhost:3000
```

`NEXT_PUBLIC_API_URL` points the frontend at the backend (default
`http://localhost:4000`).

## Storefront

`frontend/app/(storefront)/` implements the customer-facing site against the
backend API:

| Route | What it does |
| ----- | ------------ |
| `/` | Hero, brand strip, New Arrivals (`?sort=newest`) & Top Selling (`?sort=popular`) rows, dress-style tiles, testimonials |
| `/shop/[category]` | Server-driven listing — the filter sidebar (price, colour, size, dress style) and sort push URL query params that re-run `GET /products`. `[category]` accepts `all`, a real category slug, or `casual`/`formal`/`party`/`gym` (mapped to the `dressStyle` filter). Paginated. |
| `/product/[slug]` | Gallery + thumbnails, colour/size variant picker (updates stock), quantity stepper, `Add to Cart`, Details/Reviews/FAQs tabs, review list with "Load More" + a write-review form for logged-in buyers, "You might also like" |
| `/cart` | Line-item qty (`PATCH`) / remove (`DELETE`), promo code, order summary computed with the same math the backend uses at checkout |
| `/checkout` | Mock shipping form + payment method (Card / COD). `POST /orders` → `POST /payments`; a declined card shows an inline error with **Retry** / switch-to-COD, then redirects to the order confirmation |
| `/login`, `/register` | Minimal centred forms; redirect to `/` (or `?redirect=`) on success |
| `/orders`, `/orders/[id]` | The current user's order history + detail |

Shared pieces: `lib/api-client.ts` (isomorphic fetch — forwards cookies
server-side, `credentials: "include"` in the browser, throws `ApiError` on
non-2xx), `lib/stores/auth-store.ts` (Zustand: `{ user, cartCount, setUser,
setCartCount, clearAuth }`) seeded once on load by `<AuthBootstrap>` in the root
layout via `GET /auth/me`, `components/ui/` (Button, Card, Badge, StarRating,
Input, Skeleton, …), `components/storefront/` (Navbar, Footer, Breadcrumb,
product cards, …). The category sidebar batches every filter (type checkboxes,
price, colour, size, dress style) behind one **Apply Filter** button.

`frontend/proxy.ts` (Next.js 16 renamed `middleware` → `proxy`) redirects
logged-out visitors away from `/cart`, `/checkout`, `/orders` and non-admins away
from `/admin/*`. The backend still enforces real auth on every request.

## Admin panel

`frontend/app/(admin)/admin/` — same design system as the storefront (reuses
`components/ui/` Button / Card / Badge / Table / Input; no admin-only component
library). Persistent left sidebar with a black active state; the top bar reads
the admin's name from the **same Zustand `auth-store`**. `proxy.ts` is the primary
guard; `AdminShell` adds a client-side role check that redirects non-admins.

| Route | What it does |
| ----- | ------------ |
| `/admin` | Stat cards (total orders, revenue, products, low-stock) aggregated on the client from `GET /admin/orders` + `GET /products` — no new endpoint — plus a recent-orders table |
| `/admin/products` | Table (name, category, type, price, summed stock, status) with search, **Add Product**, edit / soft-delete row actions |
| `/admin/products/new`, `/admin/products/[id]` | Product form — scalars + category/type/dress-style selects; on **create** an interactive variants + image-URL editor (`POST /products`); on **edit** scalars only (`PATCH /products/:id`), variants/images shown read-only |
| `/admin/categories` | Table + inline add / edit form (`POST` / `PATCH /categories`) |
| `/admin/orders` | All orders paginated; a per-row status `<select>` calls `PATCH /admin/orders/:id/status` and surfaces the backend's error verbatim on an illegal transition |

## Environment variables

### backend/.env

| Variable       | Example                                                        |
| -------------- | ------------------------------------------------------------- |
| `DATABASE_URL` | `postgresql://postgres:1234@localhost:5432/shopco?schema=public` |
| `JWT_SECRET`   | `change-me-in-production`                                     |
| `PORT`         | `4000`                                                        |
| `FRONTEND_URL` | `http://localhost:3000`                                       |
| `ADMIN_EMAIL`    | `admin@shopco.dev` — bootstrap admin, used only by `npm run seed` |
| `ADMIN_PASSWORD` | a strong password — hashed by the seed, never stored in the repo |

### frontend/.env.local

| Variable              | Example                 |
| --------------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` |
