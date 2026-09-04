# shopco-ecommerce-app

Full-stack e-commerce application for a minimalist black / white / gray fashion
brand.

- **frontend/** — Next.js (App Router) + TypeScript + Tailwind CSS v4
- **backend/** — NestJS + TypeScript + Prisma (PostgreSQL)

Implemented so far: project scaffolding, the **Auth** module and the **Users**
module. Remaining feature modules are added in later steps.

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
│       └── modules/
│           ├── auth/          register / login / logout / me  (Clean Architecture)
│           └── users/         profile + admin user list       (Clean Architecture)
└── README.md
```

Each feature module is split into `presentation/` (controllers + DTOs),
`application/` (use-cases), `domain/` (entities + repository interfaces) and
`infrastructure/` (Passport strategies, persistence). Auth and Users share a
single `UserRepository` contract and its Prisma implementation.

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
