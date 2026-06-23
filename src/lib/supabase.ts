import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Types mirroring the DB schema ─────────────────────────────

export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  tech: string[];
  image_url: string | null;
  github_url: string | null;
  live_url: string | null;
  featured: boolean;
  sort_order: number;
  created_at: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  caption: string | null;
  image_url: string;
  sort_order: number;
  created_at: string;
};

export type ContentRow = {
  key: string;
  value: string;
  updated_at: string;
};

export type Skill = {
  id: string;
  name: string;
  category: string;
  sort_order: number;
};

export type FunFact = {
  id: string;
  emoji: string;
  label: string;
  text: string;
  sort_order: number;
};

export type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
};

// ── Helpers ───────────────────────────────────────────────────

export async function getContent(): Promise<Record<string, string>> {
  const { data } = await supabase.from("content").select("key, value");
  if (!data) return {};
  return Object.fromEntries(data.map((r) => [r.key, r.value]));
}

export async function getProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order");
  return data ?? [];
}

export async function getGallery(): Promise<GalleryItem[]> {
  const { data } = await supabase
    .from("gallery")
    .select("*")
    .order("sort_order");
  return data ?? [];
}

export async function getSkills(): Promise<Skill[]> {
  const { data } = await supabase.from("skills").select("*").order("sort_order");
  return data ?? [];
}

export async function getFunFacts(): Promise<FunFact[]> {
  const { data } = await supabase
    .from("fun_facts")
    .select("*")
    .order("sort_order");
  return data ?? [];
}
