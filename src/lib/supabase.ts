import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Types ──────────────────────────────────────────────────────────────────

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
}

export interface ProjectView {
  id: string;
  project_slug: string;
  project_name: string;
  created_at: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────

export async function submitContactMessage(payload: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  const { error } = await supabase.from('contact_messages').insert(payload);
  if (error) throw error;
}

export async function logProjectView(projectSlug: string, projectName: string) {
  const { error } = await supabase
    .from('project_views')
    .insert({ project_slug: projectSlug, project_name: projectName });
  if (error) throw error;
}

export async function getProjectViewCounts(): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from('project_views')
    .select('project_slug');
  if (error) throw error;

  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    counts[row.project_slug] = (counts[row.project_slug] ?? 0) + 1;
  }
  return counts;
}
