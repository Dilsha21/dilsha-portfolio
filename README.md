# Dilsha Portfolio — Next.js + Supabase

A fully dynamic personal portfolio with a password-protected admin panel for managing projects, gallery, bio content, skills, and contact messages — without ever touching code.

---

## Tech stack

- **Next.js 14** (App Router, TypeScript)
- **Supabase** (Postgres DB + Storage for images)
- **Tailwind CSS** (Velvet Bloom palette)
- **Vercel** (hosting — free tier)

---

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) → New project
2. Once created, go to **SQL Editor → New query**
3. Paste the entire contents of `supabase-schema.sql` and run it
4. This creates all tables and seeds your initial data

### 3. Get your Supabase keys

Settings → API:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Create your `.env.local`

```bash
cp .env.local.example .env.local
```

Fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
ADMIN_PASSWORD=pick-something-strong
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — portfolio  
Open [http://localhost:3000/admin](http://localhost:3000/admin) — admin panel

---

## Adding your photo and CV

1. Drop your photo as `dilsha.jpeg` into `public/images/`
2. Drop your CV PDF as `Dilsha_Atugedara_CV.pdf` into `public/cv/`
3. These are served statically — no upload needed

---

## Adding project images

**Option A — Supabase Storage (recommended):**
1. Supabase dashboard → Storage → New bucket → name it `portfolio-images` → Public bucket
2. Upload your image files there
3. Copy the public URL (looks like `https://xxxx.supabase.co/storage/v1/object/public/portfolio-images/brightbuy.jpeg`)
4. Paste that URL into the Image URL field in the admin panel

**Option B — External:**  
Any public image URL works (Cloudinary, Imgur, etc.)

---

## Deployment on Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/Dilsha21/portfolio.git
git push -u origin main
```

### 2. Deploy

1. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
2. Add environment variables (same as `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_PASSWORD`
3. Click Deploy

Done — your site is live. Every `git push` redeploys automatically.

---

## How the admin panel works

Visit `/admin` → enter your `ADMIN_PASSWORD`.

| Tab | What you can do |
|-----|----------------|
| **Projects** | Add, edit, delete projects. Control title, description, tech stack, tags (dev/uiux/design), GitHub link, live link, image URL, sort order |
| **Gallery** | Add, edit, remove photos. Paste Supabase Storage URLs |
| **Content** | Edit hero tagline, about paragraphs, CV link, social URLs, contact info — live on the site within 60 seconds |
| **Messages** | Read contact form submissions, mark as read |

Changes go live on the public site within **~60 seconds** (Next.js ISR revalidation). No redeploy needed.

---

## Project structure

```
src/
  app/
    page.tsx              ← main portfolio page (server component)
    layout.tsx            ← root layout
    globals.css           ← Velvet Bloom palette + base styles
    admin/
      page.tsx            ← full admin dashboard (client)
      layout.tsx          ← standalone admin layout
    api/
      contact/route.ts    ← contact form → saves to Supabase
      admin/
        route.ts          ← login / logout (sets cookie)
        projects/route.ts ← CRUD for projects
        gallery/route.ts  ← CRUD for gallery
        content/route.ts  ← upsert content slots
        messages/route.ts ← read contact messages
  components/
    Nav.tsx Hero.tsx Projects.tsx Gallery.tsx
    FunFacts.tsx About.tsx WhatIDo.tsx
    Skills.tsx Contact.tsx Footer.tsx
  lib/
    supabase.ts           ← client, types, data helpers
    auth.ts               ← cookie-based admin auth check
public/
  images/dilsha.jpeg       ← your photo (add this)
  cv/Dilsha_Atugedara_CV.pdf ← your CV (add this)
supabase-schema.sql       ← run this in Supabase SQL editor once
```

---

## Updating your CV

Just replace `public/cv/Dilsha_Atugedara_CV.pdf` with the new file and push. Or upload to Supabase Storage and update the `cv_url` value in the Content tab — no redeploy needed.

---

## What this demonstrates (for your portfolio / resume)

- Full-stack Next.js with App Router and TypeScript
- Supabase (Postgres) with Row Level Security
- REST API routes with cookie-based authentication
- Incremental Static Regeneration (ISR) — content updates without redeploy
- CI/CD via Vercel (auto-deploy on push)
