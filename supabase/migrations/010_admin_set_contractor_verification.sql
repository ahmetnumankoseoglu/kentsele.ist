-- Bulletproof admin contractor approval:
-- 1) Freeze trigger allows service_role OR session bypass flag
-- 2) SECURITY DEFINER RPC sets bypass + updates (used by admin API)

create or replace function public.contractor_freeze_verification()
returns trigger
language plpgsql
as $$
declare
  jwt_role text;
begin
  -- Set by admin_set_contractor_verification() for one transaction
  if coalesce(current_setting('app.bypass_contractor_verification', true), '') = 'on' then
    return new;
  end if;

  begin
    jwt_role := coalesce(
      nullif(current_setting('request.jwt.claim.role', true), ''),
      nullif(auth.role(), '')
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

drop trigger if exists contractor_freeze_verification on public.contractor_profiles;
create trigger contractor_freeze_verification
  before update on public.contractor_profiles
  for each row execute function public.contractor_freeze_verification();

create or replace function public.admin_set_contractor_verification(
  p_user_id uuid,
  p_status text,
  p_rejection_reason text default null
)
returns public.contractor_profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  row public.contractor_profiles;
begin
  if p_status is null or p_status not in ('pending', 'approved', 'rejected') then
    raise exception 'invalid verification status';
  end if;

  perform set_config('app.bypass_contractor_verification', 'on', true);

  update public.contractor_profiles
  set
    verification_status = p_status,
    rejection_reason = case
      when p_status = 'rejected' then p_rejection_reason
      else null
    end,
    reviewed_at = now(),
    updated_at = now()
  where user_id = p_user_id
  returning * into row;

  if not found then
    raise exception 'contractor not found';
  end if;

  return row;
end;
$$;

revoke all on function public.admin_set_contractor_verification(uuid, text, text) from public;
revoke all on function public.admin_set_contractor_verification(uuid, text, text) from anon, authenticated;
grant execute on function public.admin_set_contractor_verification(uuid, text, text) to service_role;
