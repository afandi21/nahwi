create table if not exists public.certificate_templates (
  id uuid primary key default gen_random_uuid(),
  curriculum_id uuid not null references public.curriculum(id) on delete cascade,
  template_name text not null,
  template_mime_type text not null check (template_mime_type in ('text/html', 'image/svg+xml', 'text/plain')),
  template_content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (curriculum_id)
);

create or replace function public.set_certificate_templates_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_certificate_templates_updated_at on public.certificate_templates;
create trigger trg_certificate_templates_updated_at
before update on public.certificate_templates
for each row
execute function public.set_certificate_templates_updated_at();

alter table public.certificate_templates enable row level security;

drop policy if exists "certificate templates readable by authenticated users" on public.certificate_templates;
create policy "certificate templates readable by authenticated users"
on public.certificate_templates
for select
to authenticated
using (true);

drop policy if exists "certificate templates writable by admin" on public.certificate_templates;
create policy "certificate templates writable by admin"
on public.certificate_templates
for all
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
