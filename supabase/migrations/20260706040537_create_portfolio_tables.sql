/*
# Portfolio Database Schema

## Overview
Two tables for Akash's portfolio site (single-tenant, no auth required).
Visitors submit contact messages and each project click is tracked for analytics.

## New Tables

### 1. contact_messages
Stores every contact form submission from portfolio visitors.
- `id`         — UUID primary key
- `name`       — visitor's full name (required)
- `email`      — visitor's email address (required)
- `subject`    — optional message subject line
- `message`    — full message body (required)
- `created_at` — submission timestamp (auto-set)

### 2. project_views
One row per project view event, used to compute view counts.
- `id`           — UUID primary key
- `project_slug` — machine-readable project identifier (e.g. "motion-guard-ai")
- `project_name` — human-readable project name
- `created_at`   — view timestamp (auto-set)

## Security (RLS)
Both tables use Row Level Security with `TO anon, authenticated` policies
because this portfolio has no sign-in screen — all traffic uses the anon key.

### contact_messages
- Anon INSERT only: anyone can submit a form; nobody can read others' messages.
  The owner reads submissions directly in the Supabase dashboard.

### project_views
- Anon INSERT: client logs a view on each project click.
- Anon SELECT: client can read aggregate counts to display them.

## Notes
- All policies are dropped before re-creation so migrations are idempotent.
- No user_id columns — intentionally single-tenant public data.
*/

-- ─────────────────────────────────────────────
-- Table: contact_messages
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL,
  email      text        NOT NULL,
  subject    text,
  message    text        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Only allow inserting (visitors submit forms; no public read)
DROP POLICY IF EXISTS "anon_insert_contact_messages" ON contact_messages;
CREATE POLICY "anon_insert_contact_messages" ON contact_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- ─────────────────────────────────────────────
-- Table: project_views
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_views (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_slug text        NOT NULL,
  project_name text        NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE project_views ENABLE ROW LEVEL SECURITY;

-- Visitors log a view; anyone can read counts for display
DROP POLICY IF EXISTS "anon_insert_project_views" ON project_views;
CREATE POLICY "anon_insert_project_views" ON project_views
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_project_views" ON project_views;
CREATE POLICY "anon_select_project_views" ON project_views
  FOR SELECT TO anon, authenticated
  USING (true);

-- Index for fast count queries per project
CREATE INDEX IF NOT EXISTS idx_project_views_slug
  ON project_views (project_slug);
