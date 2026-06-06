-- ============================================================
-- Certify Health — database schema
-- Run this in the Supabase SQL editor (once, in order)
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ── Facilities ───────────────────────────────────────────────
create table public.facilities (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  state      text not null,
  lga        text not null
);

-- ── Profiles (extends auth.users) ───────────────────────────
create type public.user_role as enum ('worker', 'admin');
create type public.worker_cadre as enum ('Registered Nurse', 'Midwife', 'CHEW');

create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  full_name   text not null,
  cadre       public.worker_cadre,
  ward        text,
  facility_id uuid references public.facilities (id),
  role        public.user_role not null default 'worker'
);

-- ── Competencies ─────────────────────────────────────────────
create table public.competencies (
  id                 uuid primary key default gen_random_uuid(),
  title              text not null,
  description        text,
  validity_months    integer not null default 12,
  estimated_minutes  integer not null default 30
);

-- ── Worker competency records ────────────────────────────────
create type public.competency_status as enum ('not_started', 'in_progress', 'complete', 'overdue');

create table public.worker_competencies (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles (id) on delete cascade,
  competency_id  uuid not null references public.competencies (id) on delete cascade,
  status         public.competency_status not null default 'not_started',
  completed_at   timestamptz,
  expires_at     timestamptz,
  unique (user_id, competency_id)
);

-- ── Module sections ──────────────────────────────────────────
create table public.module_sections (
  id             uuid primary key default gen_random_uuid(),
  competency_id  uuid not null references public.competencies (id) on delete cascade,
  title          text not null,
  body           text not null,
  section_order  integer not null
);

-- ── Assessment questions ─────────────────────────────────────
create table public.assessment_questions (
  id              uuid primary key default gen_random_uuid(),
  competency_id   uuid not null references public.competencies (id) on delete cascade,
  question        text not null,
  options         jsonb not null,   -- array of strings, e.g. ["A", "B", "C", "D"]
  correct_index   integer not null, -- 0-based index into options
  question_order  integer not null
);

-- ── Assessment attempts ──────────────────────────────────────
create table public.assessment_attempts (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles (id) on delete cascade,
  competency_id  uuid not null references public.competencies (id) on delete cascade,
  score          numeric(5,2) not null, -- percentage, e.g. 80.00
  passed         boolean not null,
  taken_at       timestamptz not null default now()
);

-- ============================================================
-- Row-Level Security
-- ============================================================

alter table public.facilities           enable row level security;
alter table public.profiles             enable row level security;
alter table public.competencies         enable row level security;
alter table public.worker_competencies  enable row level security;
alter table public.module_sections      enable row level security;
alter table public.assessment_questions enable row level security;
alter table public.assessment_attempts  enable row level security;

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean language sql security definer as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Helper: what facility does the current user belong to?
create or replace function public.my_facility_id()
returns uuid language sql security definer as $$
  select facility_id from public.profiles where id = auth.uid();
$$;

-- facilities: everyone can read
create policy "facilities_read" on public.facilities
  for select using (true);

-- profiles: own row, or admin sees same facility
create policy "profiles_read_own" on public.profiles
  for select using (
    id = auth.uid()
    or (public.is_admin() and facility_id = public.my_facility_id())
  );

create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid());

-- competencies: everyone authenticated can read
create policy "competencies_read" on public.competencies
  for select using (auth.uid() is not null);

-- worker_competencies: own rows, or admin sees same facility
create policy "wc_read" on public.worker_competencies
  for select using (
    user_id = auth.uid()
    or (
      public.is_admin()
      and exists (
        select 1 from public.profiles p
        where p.id = worker_competencies.user_id
          and p.facility_id = public.my_facility_id()
      )
    )
  );

create policy "wc_insert_own" on public.worker_competencies
  for insert with check (user_id = auth.uid());

create policy "wc_update_own" on public.worker_competencies
  for update using (user_id = auth.uid());

-- module_sections: everyone authenticated can read
create policy "sections_read" on public.module_sections
  for select using (auth.uid() is not null);

-- assessment_questions: everyone authenticated can read
create policy "questions_read" on public.assessment_questions
  for select using (auth.uid() is not null);

-- assessment_attempts: own rows only
create policy "attempts_read_own" on public.assessment_attempts
  for select using (user_id = auth.uid());

create policy "attempts_insert_own" on public.assessment_attempts
  for insert with check (user_id = auth.uid());
