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
├── frontend/                 Next.js storefront + admin
│   ├── app/
│   │   ├── (storefront)/      customer-facing route group
│   │   └── (admin)/admin/     admin dashboard route group
│   ├── components/{ui,storefront,admin}/
│   └── lib/
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
| `GET /products`      | public                  | Filter/sort/paginate — `?categorySlug&minPrice&maxPrice&color&size&dressStyle&search&sort&page&limit`; excludes soft-deleted; → `{ data, total, page, limit }` |
| `GET /products/:slug`| public                  | Full detail: variants, images, category, `averageRating` |
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
- Product average rating is computed on the fly from `Review.rating` in
  `get-product-by-slug` (not stored on `Product`).

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
| `npm run seed`            | Run `prisma/seed.ts` (placeholder)      |

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev                   # http://localhost:3000
```

`NEXT_PUBLIC_API_URL` points the frontend at the backend (default
`http://localhost:4000`).

## Environment variables

### backend/.env

| Variable       | Example                                                        |
| -------------- | ------------------------------------------------------------- |
| `DATABASE_URL` | `postgresql://postgres:1234@localhost:5432/shopco?schema=public` |
| `JWT_SECRET`   | `change-me-in-production`                                     |
| `PORT`         | `4000`                                                        |
| `FRONTEND_URL` | `http://localhost:3000`                                       |

### frontend/.env.local

| Variable              | Example                 |
| --------------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` |
