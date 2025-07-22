/*
  # Create cv_data table for storing complete CV information

  1. New Tables
    - `cv_data`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `cv_data` (jsonb, stores the complete CV data structure)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `cv_data` table
    - Add policies for authenticated users to manage their own CV data
*/

CREATE TABLE IF NOT EXISTS cv_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cv_data jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE cv_data ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own CV data
CREATE POLICY "Users can read own CV data"
  ON cv_data
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for users to insert their own CV data
CREATE POLICY "Users can insert own CV data"
  ON cv_data
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own CV data
CREATE POLICY "Users can update own CV data"
  ON cv_data
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to delete their own CV data
CREATE POLICY "Users can delete own CV data"
  ON cv_data
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Trigger to automatically update updated_at
CREATE TRIGGER update_cv_data_updated_at
  BEFORE UPDATE ON cv_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();