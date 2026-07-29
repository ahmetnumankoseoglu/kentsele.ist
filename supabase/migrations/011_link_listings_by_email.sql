-- Link guest listings to user when contact email matches (case-insensitive)

create or replace function public.link_listings_by_email(
  p_user_id uuid,
  p_email text
)
returns setof uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  norm text;
begin
  if p_user_id is null then
    return;
  end if;

  norm := lower(trim(both from coalesce(p_email, '')));
  if norm = '' or position('@' in norm) = 0 then
    return;
  end if;

  -- FK: profile must exist
  if not exists (select 1 from public.profiles where id = p_user_id) then
    return;
  end if;

  return query
  update public.listings l
  set
    owner_user_id = p_user_id,
    updated_at = now()
  where l.owner_user_id is null
    and l.email is not null
    and lower(trim(both from l.email)) = norm
  returning l.id;
end;
$$;

revoke all on function public.link_listings_by_email(uuid, text) from public;
revoke all on function public.link_listings_by_email(uuid, text) from anon, authenticated;
grant execute on function public.link_listings_by_email(uuid, text) to service_role;

-- Optional index to speed email lookups (expression)
create index if not exists listings_email_lower_idx
  on public.listings (lower(trim(both from email)))
  where email is not null;
