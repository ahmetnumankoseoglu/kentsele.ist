import type { ListingStatus, OdemeTercihi } from "@/lib/constants/listing";

export type Listing = {
  id: string;
  slug: string;
  ilce: string;
  mahalle: string | null;
  kat_sayisi: string;
  daire_sayisi: string;
  odeme_tercihi: OdemeTercihi;
  aciklama: string;
  iletisim_adi: string;
  telefon: string;
  email: string | null;
  status: ListingStatus;
  manage_token: string;
  agreement_requested_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PublicListing = Omit<Listing, "manage_token" | "telefon" | "email"> & {
  telefon: string | null;
  email: string | null;
};
