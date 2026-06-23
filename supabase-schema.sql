-- ============================================================
-- Dilsha Portfolio – Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ── Projects ─────────────────────────────────────────────────
create table if not exists projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text not null,
  tags        text[] not null default '{}',   -- e.g. ['dev', 'uiux']
  tech        text[] not null default '{}',   -- e.g. ['React', 'PostgreSQL']
  image_url   text,
  github_url  text,
  live_url    text,
  featured    boolean not null default false,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

-- ── Gallery ──────────────────────────────────────────────────
create table if not exists gallery (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  caption    text,
  image_url  text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ── Bio / site content ───────────────────────────────────────
-- One row per named "slot". Admin edits these in place.
create table if not exists content (
  key        text primary key,   -- e.g. 'hero_tagline', 'about_body'
  value      text not null,
  updated_at timestamptz not null default now()
);

-- ── Skills ───────────────────────────────────────────────────
create table if not exists skills (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  category   text not null,      -- e.g. 'Languages', 'Frameworks', 'Tools'
  sort_order int not null default 0
);

-- ── Fun facts strip ──────────────────────────────────────────
create table if not exists fun_facts (
  id         uuid primary key default gen_random_uuid(),
  emoji      text not null,
  label      text not null,
  text       text not null,
  sort_order int not null default 0
);

-- ── Contact messages (received via the form) ─────────────────
create table if not exists messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  message    text not null,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

-- ── Row Level Security ───────────────────────────────────────
-- Public can READ everything except messages
alter table projects   enable row level security;
alter table gallery    enable row level security;
alter table content    enable row level security;
alter table skills     enable row level security;
alter table fun_facts  enable row level security;
alter table messages   enable row level security;

create policy "public read projects"   on projects   for select using (true);
create policy "public read gallery"    on gallery    for select using (true);
create policy "public read content"    on content    for select using (true);
create policy "public read skills"     on skills     for select using (true);
create policy "public read fun_facts"  on fun_facts  for select using (true);

-- Messages: public can INSERT (form submit), but NOT select
create policy "public insert messages" on messages for insert with check (true);

-- ── Seed: initial content slots ──────────────────────────────
insert into content (key, value) values
  ('hero_name',        'Dilsha'),
  ('hero_tagline',     'Software Engineering Student Exploring the Intersection of Development and Design'),
  ('about_lead',       'Computer Science and Engineering undergraduate at the University of Moratuwa with hands-on experience in full-stack development, UI/UX design, and low-level computing.'),
  ('about_body',       'Proficient in Java, Python, JavaScript, and Next.js with a strong grasp of OOP, REST APIs, and Firebase-backed architectures. Passionate about building thoughtful digital experiences that are both functional and beautiful.'),
  ('cv_url',           '/cv/Dilsha_Atugedara_CV.pdf'),
  ('github_url',       'https://github.com/Dilsha21'),
  ('linkedin_url',     'https://linkedin.com/in/your-handle'),
  ('instagram_url',    'https://instagram.com/your-handle'),
  ('contact_email',    'dilshaa.23@cse.mrt.ac.lk'),
  ('contact_location', 'Sri Lanka'),
  ('contact_open_to',  'Internships & Collaborations')
on conflict (key) do nothing;

-- ── Seed: fun facts ──────────────────────────────────────────
insert into fun_facts (emoji, label, text, sort_order) values
  ('🌊', 'Based in',   'Sri Lanka — the Pearl of the Indian Ocean', 0),
  ('🎓', 'GPA',        '3.70 at University of Moratuwa', 1),
  ('🏆', 'Achievement','Top 8 Finalist — CryptX 2.0 Designathon', 2),
  ('💼', 'Currently',  'Open to internship opportunities', 3)
on conflict do nothing;

-- ── Seed: skills ─────────────────────────────────────────────
insert into skills (name, category, sort_order) values
  ('Java',         'Languages',   0),
  ('Python',       'Languages',   1),
  ('JavaScript',   'Languages',   2),
  ('React',        'Frameworks',  0),
  ('Next.js',      'Frameworks',  1),
  ('Express',      'Frameworks',  2),
  ('Tailwind CSS', 'Frameworks',  3),
  ('PostgreSQL',   'Tools',       0),
  ('Firebase',     'Tools',       1),
  ('Docker',       'Tools',       2),
  ('Figma',        'Tools',       3),
  ('Git',          'Tools',       4)
on conflict do nothing;

-- ── Seed: projects ───────────────────────────────────────────
insert into projects (title, description, tags, tech, github_url, featured, sort_order) values
  (
    'BrightBuy',
    'Full-stack retail inventory and order management system for a consumer electronics chain. Handles inventory, online orders, stock updates, and customer transactions with JWT authentication and containerised deployment.',
    array['dev'],
    array['React', 'Express', 'PostgreSQL', 'Docker'],
    'https://github.com/KeshRD/BrightBuy-G16',
    true, 0
  ),
  (
    'IDKPay',
    'Shared expense tracker with real-time balance tracking, smart debt settlement logic, and multi-user group management. Complex edge cases handled across shared expense updates.',
    array['dev'],
    array['Next.js', 'Firebase', 'Tailwind CSS', 'shadcn/ui'],
    'https://github.com/Dilsha21/IDKPay',
    true, 1
  ),
  (
    'Nudge — CryptX 2.0 Designathon',
    'Top 8 Finalist. Designed high-fidelity Figma screens with a full design system — WCAG AA contrast ratios (up to 11.4:1), type scale, and a reusable component library. Conducted a 21-point heuristic audit of Goodreads.',
    array['uiux', 'design'],
    array['Figma', 'WCAG 2.1', 'Canva'],
    '',
    true, 2
  ),
  (
    'Nano-Processor Design',
    'Designed a nano-processor architecture using digital circuits with hands-on experience building instruction sets, control logic, and low-level computing components.',
    array['dev'],
    array['Digital Logic', 'Hardware Design'],
    '',
    false, 3
  )
on conflict do nothing;
