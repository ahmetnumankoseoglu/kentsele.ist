-- Private storage for müteahhit belgeler
-- Kod: bucket adı tam olarak "contractor-docs"
-- Upload path: {user_id}/{timestamp}-{doc_type}.{ext}
-- Uygulama yükleme ve signed URL için service_role kullanır (RLS bypass).

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'contractor-docs',
  'contractor-docs',
  false,
  10485760, -- 10 MB (kod ile aynı limit)
  array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp'
  ]::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Authenticated kullanıcı kendi klasörüne yazabilsin (opsiyonel; API service_role kullanır)
drop policy if exists "contractor_docs_insert_own" on storage.objects;
create policy "contractor_docs_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'contractor-docs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "contractor_docs_select_own" on storage.objects;
create policy "contractor_docs_select_own"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'contractor-docs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "contractor_docs_delete_own" on storage.objects;
create policy "contractor_docs_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'contractor-docs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Not: service_role tüm işlemlere erişir (admin signed URL + API upload).
