# Supabase

This folder holds SQL migrations for the kentsele.ist database schema.

## Apply migrations (SQL Editor)

1. Open your project in the [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **SQL Editor**.
3. Create a new query.
4. Paste the full contents of `migrations/001_listings.sql`.
5. Click **Run**.

The migration is idempotent where possible (`if not exists`, `create or replace`, `drop trigger if exists`). Re-running is generally safe for a fresh project; on an existing database, review carefully if objects already differ.

## What `001_listings.sql` does

- Enables the `pgcrypto` extension (for `gen_random_uuid()`).
- Creates `public.listings` with status/payment checks, unique `slug` and `manage_token`.
- Adds indexes on `status`, `ilce`, `created_at`, and partial index on `agreement_requested_at`.
- Installs `set_updated_at` trigger so `updated_at` updates on row change.
- Creates `public.listings_public` view: only published statuses; hides phone/email when status is `anlasildi`.
- Enables RLS on `listings` and revokes direct table access from `anon` / `authenticated`.
- Grants `SELECT` on `listings_public` to `anon` and `authenticated`.

Writes (insert/update/delete) are intended to go through the service role or server-side code, not the public client.

## CLI (optional)

If you use the Supabase CLI and have linked the project:

```bash
supabase db push
```

Or apply a single file:

```bash
supabase db execute --file supabase/migrations/001_listings.sql
```
