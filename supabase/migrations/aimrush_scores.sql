-- Migration: Create aimrush_scores table
-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS aimrush_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score integer NOT NULL,
  accuracy integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for efficient monthly queries
CREATE INDEX IF NOT EXISTS idx_aimrush_scores_user_id ON aimrush_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_aimrush_scores_created_at ON aimrush_scores(created_at);

-- Enable Row Level Security
ALTER TABLE aimrush_scores ENABLE ROW LEVEL SECURITY;

-- Everyone can read scores (for the leaderboard)
CREATE POLICY "Tout le monde peut lire les scores"
  ON aimrush_scores
  FOR SELECT
  USING (true);

-- Only authenticated users can insert their own scores
CREATE POLICY "Les utilisateurs connectés peuvent insérer leur propre score"
  ON aimrush_scores
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);