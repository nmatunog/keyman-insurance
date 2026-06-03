-- Keyman Readiness Assessment leads (GIYA / joingiya.com)
create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  mobile text,
  agency text,
  years_in_service text,
  keyman_cases text,
  confidence_level text,
  challenge_areas text[] not null default '{}',
  business_owner_network text,
  discussed_last_12_months text,
  markets text[] not null default '{}',
  advanced_topics text[] not null default '{}',
  masterclass_interest text,
  preferred_format text,
  resource_permission boolean not null default false,
  conversation_commitment text,
  lead_score integer not null default 0,
  lead_tier text not null default 'General',
  source text not null default 'keyman_readiness'
);

create index if not exists idx_giya_assessments_email on public.assessments (email);
create index if not exists idx_giya_assessments_tier on public.assessments (lead_tier);
create index if not exists idx_giya_assessments_created on public.assessments (created_at desc);

alter table public.assessments enable row level security;

-- Public form: anonymous insert only (no read/update/delete for anon)
create policy "anon_insert_assessments"
  on public.assessments
  for insert
  to anon
  with check (true);

-- Authenticated dashboard / service role reads via service_role key (bypasses RLS)

comment on table public.assessments is 'GIYA Keyman Readiness Assessment lead captures';
