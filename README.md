# SkillVerse Academy — Course Management

A Vercel-ready Next.js course management starter with Neon/PostgreSQL, admin login, course CRUD, categories and enrollment count.

## 1. Environment
Create `.env`:
DATABASE_URL=your Neon connection string
AUTH_SECRET=your long random secret

## 2. Install
npm install

## 3. Database
npm run db:push
npm run db:seed

## 4. Run
npm run dev

Open `/login`.

Seed admin:
Email: admin@skillverse.local
Password: ChangeMe123!

**Change the seed password before production.**

## Vercel
Add `DATABASE_URL` and `AUTH_SECRET` under Project Settings → Environment Variables, then deploy.