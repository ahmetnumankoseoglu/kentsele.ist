-- Site iletişim formu mesajları
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  body text not null,
  status text not null default 'yeni'
    check (status in ('yeni', 'okundu', 'arsiv')),
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_status_idx
  on public.contact_messages (status, created_at desc);

alter table public.contact_messages enable row level security;

revoke all on public.contact_messages from anon, authenticated;
-- Inserts yalnızca service_role (API) üzerinden
