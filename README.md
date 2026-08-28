# Islamic Lessons

## MongoDB API

The backend uses Node.js, Express, and MongoDB through Mongoose. The instructor is the single admin user (`role: "admin"`); regular listeners use `role: "user"`. Content follows `category -> book -> lesson`, and bookmarks belong to users.

1. Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.
2. Install dependencies with `npm install`.
3. Create the instructor admin with `npm run admin:create -- "Instructor name" admin@example.com "strong-password"`.
4. Start the API with `npm run server:dev`.

To populate MongoDB with sample data, run `npm run db:seed`. This creates 1 admin instructor, 3 regular users, 4 categories, 8 books, 20 lessons, and sample bookmarks. Use `npm run db:seed:reset` only when you want to clear the database and recreate this sample dataset.

Seed credentials: the admin email is `admin@islamic.local` and password is `Admin12345!`; regular users use `User12345!`. Change these with `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` in `.env` before seeding.

The API is available at `http://localhost:3000`. Public endpoints are `GET /api/categories`, `GET /api/books`, and `GET /api/lessons`. Admin content creation requires a Bearer token from `/api/auth/login`; bookmarks use `/api/bookmarks`. Public registration always creates a regular user, never an admin.

## Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).
