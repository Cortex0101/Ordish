-- Add site_id support for anonymous users
-- This migration allows users to be tracked without requiring registration

USE ordish_db_dev;

-- Add site_id column and is_anonymous flag to users table
ALTER TABLE users 
ADD COLUMN site_id VARCHAR(36) UNIQUE AFTER id,
ADD COLUMN is_anonymous BOOLEAN DEFAULT FALSE AFTER site_id,
ADD INDEX idx_site_id (site_id);

-- Make email and username nullable for anonymous users
-- First, we need to update the existing schema
ALTER TABLE users 
MODIFY email VARCHAR(255) UNIQUE NULL,
MODIFY username VARCHAR(50) UNIQUE NULL;

-- Add constraint to ensure either (email + username) or site_id is set
-- This is handled at the application layer since MySQL doesn't support CHECK constraints with OR well

SELECT 'Site ID migration completed successfully' AS migration_status;
