-- Lookup auth.users by email for "skip activate-account if already registered"

create or replace function public.auth_user_id_by_email(p_email text)
returns uuid
language sql
stable
security definer
set search_path = public, auth
as $$
  select u.id
  from auth.users u
  where u.email is not null
    and lower(trim(both from u.email)) = lower(trim(both from coalesce(p_email, '')))
  limit 1;
$$;

revoke all on function public.auth_user_id_by_email(text) from public;
revoke all on function public.auth_user_id_by_email(text) from anon, authenticated;
grant execute on function public.auth_user_id_by_email(text) to service_role;
