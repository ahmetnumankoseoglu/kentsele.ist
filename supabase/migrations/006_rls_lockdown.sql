-- CRITICAL: prevent clients from self-approving or elevating role
-- Run after 001–005 on Supabase SQL Editor.

-- 1) Freeze profiles.role (only service_role / superuser can change)
create or replace function public.profiles_freeze_role()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'UPDATE' and new.role is distinct from old.role then
    raise exception 'role cannot be changed by client';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_freeze_role on public.profiles;
create trigger profiles_freeze_role
  before update on public.profiles
  for each row execute function public.profiles_freeze_role();

-- 2) Freeze contractor verification fields on client updates
create or replace function public.contractor_freeze_verification()
returns trigger
language plpgsql
as $$
begin
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

-- 3) Signup trigger: never allow admin from user metadata
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  r text;
begin
  r := coalesce(new.raw_user_meta_data->>'role', 'malik');
  -- admin must never come from signup metadata
  if r not in ('malik', 'muteahhit') then
    r := 'malik';
  end if;
  insert into public.profiles (id, role, full_name, phone)
  values (
    new.id,
    r,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'phone'
  );
  if r = 'muteahhit' then
    insert into public.contractor_profiles (user_id, company_name)
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'company_name', '')
    );
  end if;
  return new;
end;
$$;

-- 4) Tighten grants: authenticated may update only non-sensitive contractor fields
-- (column-level still enforced by freeze trigger for verification_*)
revoke update on public.contractor_profiles from authenticated;
grant update (company_name, tax_number, city, about) on public.contractor_profiles to authenticated;

revoke update on public.profiles from authenticated;
grant update (full_name, phone) on public.profiles to authenticated;
