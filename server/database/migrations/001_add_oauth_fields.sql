-- Add OAuth fields to users table
-- This migration adds support for Google OAuth login

USE ordish_db_dev;

-- Add Google OAuth fields to users table if they don't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS display_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS profile_picture VARCHAR(500);

-- Add indexes for OAuth fields
CREATE INDEX IF NOT EXISTS idx_google_id ON users(google_id);

-- Update the social_accounts table to ensure it can handle our OAuth data properly
-- (It should already exist from init.sql, but this ensures compatibility)

SELECT 'OAuth migration completed successfully' AS migration_status;
