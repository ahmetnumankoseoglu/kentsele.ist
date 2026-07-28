export type NewsStatus = "draft" | "published" | "archived";

export type NewsArticle = {
  id: string;
  slug: string;
  title: string;
  description: string;
  body: string;
  cover_image_url: string | null;
  banner_image_url: string | null;
  status: NewsStatus;
  author_name: string;
  tags: string[];
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type NewsComment = {
  id: string;
  news_id: string;
  user_id: string;
  body: string;
  status: "published" | "hidden";
  created_at: string;
  profiles?: { full_name: string; role: string } | null;
};
