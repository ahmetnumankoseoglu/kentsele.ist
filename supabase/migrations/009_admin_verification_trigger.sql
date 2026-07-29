-- Fix: contractor_freeze_verification blocked ALL updates including service_role
-- (admin API). Allow service_role / postgres; keep client freeze.

create or replace function public.contractor_freeze_verification()
returns trigger
language plpgsql
as $$
declare
  jwt_role text;
begin
  -- PostgREST / supabase-js service_role
  begin
    jwt_role := coalesce(
      nullif(current_setting('request.jwt.claim.role', true), ''),
      auth.role()
    );
  exception
    when others then
      jwt_role := null;
  end;

  if jwt_role = 'service_role'
     or current_user in ('postgres', 'supabase_admin', 'service_role')
     or session_user in ('postgres', 'supabase_admin')
  then
    return new;
  end if;

  if tg_op = 'UPDATE' then
    if new.verification_status is distinct from old.verification_status
      or new.reviewed_at is distinct from old.reviewed_at
      or new.rejection_reason is distinct from old.rejection_reason
    then
      raise exception 'verification fields cannot be changed by client';
    end if;
  end if;
  return new;
end;
$$;

-- Ensure trigger exists
drop trigger if exists contractor_freeze_verification on public.contractor_profiles;
create trigger contractor_freeze_verification
  before update on public.contractor_profiles
  for each row execute function public.contractor_freeze_verification();
