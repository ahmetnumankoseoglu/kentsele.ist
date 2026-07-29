import { createAnonClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { HABERLER } from "@/lib/content/haberler";
import type { NewsArticle, NewsComment } from "@/types/news";

function seedAsArticles(): NewsArticle[] {
  return HABERLER.map((h, i) => ({
    id: `seed-${i}`,
    slug: h.slug,
    title: h.title,
    description: h.description,
    body: h.body.join("\n\n"),
    cover_image_url: "/images/kentsel-donusum-cover.jpeg",
    banner_image_url: "/images/kentsel-donusum-cover.jpeg",
    status: "published" as const,
    author_name: h.authorName,
    tags: h.tags,
    published_at: h.datePublished,
    created_at: h.datePublished,
    updated_at: h.dateModified ?? h.datePublished,
  }));
}

export async function getPublishedNews(): Promise<NewsArticle[]> {
  try {
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from("news_public")
      .select("*")
      .order("published_at", { ascending: false });
    if (error) throw error;
    // DB boşsa seed’e düşme — seed devre dışı (admin’den eklenenler)
    return (data ?? []) as NewsArticle[];
  } catch {
    /* tablo yoksa boş */
  }
  return seedAsArticles();
}

export async function getPublishedNewsBySlug(
  slug: string
): Promise<NewsArticle | null> {
  try {
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from("news_public")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    if (data) return data as NewsArticle;
    // Seed yoksa 404
    return null;
  } catch {
    /* fallback */
  }
  return seedAsArticles().find((a) => a.slug === slug) ?? null;
}

export async function getAdminNews(): Promise<NewsArticle[]> {
  const admin = createServiceClient();
  const { data, error } = await admin
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as NewsArticle[];
}

export async function getNewsComments(newsId: string): Promise<NewsComment[]> {
  if (newsId.startsWith("seed-")) return [];
  try {
    const admin = createServiceClient();
    const { data, error } = await admin
      .from("news_comments")
      .select("*, profiles(full_name, role)")
      .eq("news_id", newsId)
      .eq("status", "published")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as NewsComment[];
  } catch {
    return [];
  }
}
