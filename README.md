# BookBazar

BookBazar is a university-focused book marketplace built with Next.js 14,
TypeScript, Tailwind CSS, Prisma, PostgreSQL, Framer Motion, and lucide-react.
It includes the vintage library UI system plus full-stack auth, marketplace,
messaging, notifications, orders, reports, and admin workflows.

## Features

- Student authentication with register, login, logout, OTP verification, forgot
  password, and reset password flows.
- Book browsing, listing details, search pages, upload flow, wishlist, cart,
  orders, seller profiles, messages, notifications, and user settings.
- Admin dashboard APIs for stats, users, books, reports, moderation actions, and
  action logs.
- Prisma/PostgreSQL data model for users, books, wishlist, cart, orders,
  messages, notifications, reports, password reset OTPs, and admin logs.
- Email support through SMTP for OTP and password reset messages.
- Vintage library design system with paper textures, stacked shadows, custom
  typography, animated transitions, and reusable UI components.

## Tech Stack

- Next.js 14 App Router
- React 18 and TypeScript
- Tailwind CSS
- Prisma ORM with PostgreSQL
- Nodemailer for email delivery
- Framer Motion and lucide-react

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Update `.env` with your PostgreSQL connection string, JWT secret, SMTP
credentials, and optional admin seed values.

Generate Prisma Client and run migrations:

```bash
npm run db:generate
npm run db:migrate
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string used by Prisma. |
| `JWT_SECRET` | Secret used to sign local session and reset tokens. |
| `SMTP_HOST` | SMTP server host. |
| `SMTP_PORT` | SMTP server port, usually `587`. |
| `SMTP_USER` | SMTP username. |
| `SMTP_PASS` | SMTP password or app password. |
| `EMAIL_FROM` | Sender displayed in outgoing emails. |
| `ADMIN_EMAIL` | Email used by `npm run admin:create`. |
| `ADMIN_PASSWORD` | Password used by `npm run admin:create`. |
| `ADMIN_NAME` | Optional admin display name. |
| `ADMIN_UNIVERSITY` | Optional admin university/organization label. |

## Useful Scripts

```bash
npm run dev          # start local development
npm run build        # create a production build
npm run start        # run the production server
npm run lint         # run Next.js linting
npm run db:generate  # generate Prisma Client
npm run db:migrate   # run development migrations
npm run db:studio    # open Prisma Studio
npm run admin:create # create or update an admin user from env vars
```

## Design Signature

Two recurring motifs tie the experience together: a **book-opening** gesture
across loading and page transitions, and a **stacked-paper** shadow language
(`shadow-stack` / `shadow-paper`) used on cards and panels instead of generic
drop shadows.
