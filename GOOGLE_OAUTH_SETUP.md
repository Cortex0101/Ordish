# Google OAuth2 Setup Guide

## Backend Setup (Already Completed)

✅ **The following has already been implemented:**

1. **Passport Configuration** (`server/src/config/passport.ts`)
   - Google OAuth2 strategy configured
   - User serialization/deserialization
   - Automatic user creation for new Google accounts

2. **Database Schema** 
   - OAuth fields added to users table (run migration when database is available)
   - Fields: `google_id`, `display_name`, `profile_picture`

3. **API Routes** (`server/src/routes/auth.ts`)
   - `/api/auth/google` - Initiates OAuth flow
   - `/api/auth/google/callback` - Handles OAuth callback
   - `/api/auth/oauth/failure` - Handles OAuth failures

4. **AuthService** (`server/src/services/authService.ts`)
   - `createGoogleUser()` method for OAuth user creation
   - Comprehensive logging for OAuth operations

5. **Server Configuration** (`server/src/index.ts`)
   - Passport middleware initialized
   - Session middleware configured

6. **Frontend Integration** 
   - SignUp and Login pages updated to trigger Google OAuth
   - AuthContext handles OAuth success/failure

## Google Cloud Console Setup (You Need To Do This)

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note down your Project ID

### Step 2: Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google+ API" 
3. Click on it and press "Enable"

### Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Configure the consent screen if prompted:
   - Choose "External" for user type
   - Fill in the required fields:
     - App name: "Ordish"
     - User support email: your email
     - Developer contact: your email
4. Create OAuth 2.0 Client ID:
   - Application type: "Web application"
   - Name: "Ordish Development"
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - `http://localhost:5173`
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/google/callback`

### Step 4: Update Environment Variables

Update your `server/.env.development` file with the credentials:

\`\`\`bash
# Google OAuth (replace with your actual values)
GOOGLE_CLIENT_ID=your-actual-google-client-id-here
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
\`\`\`

## Database Migration

Run this SQL to add the OAuth fields to your users table:

\`\`\`sql
USE ordish_db_dev;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS display_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS profile_picture VARCHAR(500);

CREATE INDEX IF NOT EXISTS idx_google_id ON users(google_id);
\`\`\`

## Testing the OAuth Flow

1. **Start the database:**
   \`\`\`bash
   docker compose up -d
   \`\`\`

2. **Run the migration:**
   \`\`\`bash
   docker compose exec db mysql -u root -pordish_password_123 -e "ALTER TABLE ordish_db_dev.users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE, ADD COLUMN IF NOT EXISTS display_name VARCHAR(255), ADD COLUMN IF NOT EXISTS profile_picture VARCHAR(500); CREATE INDEX IF NOT EXISTS idx_google_id ON ordish_db_dev.users(google_id);"
   \`\`\`

3. **Start the server:**
   \`\`\`bash
   cd server && npm run dev
   \`\`\`

4. **Start the client:**
   \`\`\`bash
   cd client && npm run dev
   \`\`\`

5. **Test the flow:**
   - Go to `http://localhost:5173/signup` or `http://localhost:5173/login`
   - Click the "Sign in with Google" button
   - You should be redirected to Google's OAuth consent screen
   - After authorization, you'll be redirected back and logged in

## Troubleshooting

### Winston Exit Error (Fixed)
The Winston "exitOnError" error has been fixed by setting `exitOnError: false` in the logger configuration.

### Common Issues

1. **"redirect_uri_mismatch"**
   - Ensure the callback URL in Google Console matches exactly: `http://localhost:3000/api/auth/google/callback`

2. **"invalid_client"**
   - Check that GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correctly set

3. **"access_denied"**
   - User cancelled the OAuth flow - this is normal behavior

4. **Database connection issues**
   - Ensure the database is running: `docker compose up -d`
   - Check that the migration has been applied

## Security Notes

- Never commit real OAuth credentials to version control
- Use different credentials for production
- Consider implementing rate limiting for OAuth endpoints
- The session secret should be a strong, random string in production

## Next Steps

1. Set up the Google Cloud Console project and get your credentials
2. Update the `.env.development` file with real credentials
3. Run the database migration
4. Test the OAuth flow
5. Consider adding other OAuth providers (Facebook, Apple) using the same pattern
