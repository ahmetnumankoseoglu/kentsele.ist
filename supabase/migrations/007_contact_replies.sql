-- Admin cevapları iletişim mesajlarına
alter table public.contact_messages
  add column if not exists admin_reply text,
  add column if not exists replied_at timestamptz;

create index if not exists contact_messages_replied_idx
  on public.contact_messages (replied_at desc nulls last);
