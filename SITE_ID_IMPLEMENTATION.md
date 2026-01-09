# Site-ID Cookie Feature Implementation Guide

## Overview
This implementation adds persistent anonymous user tracking via site-id cookies. Users who visit the site without logging in are automatically assigned a site-id cookie and stored as anonymous users in the database. Their preferences and game data are tracked. When they later create an account or sign in with Google, their data is automatically migrated to their registered account.

## Database Changes

### Migration File: `002_add_site_id.sql`
The migration adds:
- `site_id` VARCHAR(36) UNIQUE - UUID for anonymous users
- `is_anonymous` BOOLEAN - Flag to identify anonymous users
- Makes `email` and `username` nullable (for anonymous users)

**Manual Steps Required:**
1. Run the migration on your database:
   ```sql
   USE ordish_db_dev;
   ALTER TABLE users 
   ADD COLUMN site_id VARCHAR(36) UNIQUE AFTER id,
   ADD COLUMN is_anonymous BOOLEAN DEFAULT FALSE AFTER site_id,
   ADD INDEX idx_site_id (site_id);
   
   ALTER TABLE users 
   MODIFY email VARCHAR(255) UNIQUE NULL,
   MODIFY username VARCHAR(50) UNIQUE NULL;
   ```

## Backend Changes

### 1. Dependencies
- Added `uuid` package for site-id generation
- **Action:** Run `npm install uuid` in the server directory

### 2. User Model (`src/models/User.ts`)
Updated to include:
- `site_id?: string` - Unique identifier for anonymous users
- `is_anonymous: boolean` - Flag indicating if user is anonymous
- Made `email` and `username` optional

### 3. AuthService (`src/services/authService.ts`)
New methods added:

#### `getUserBySiteId(siteId: string): Promise<User | null>`
- Retrieves user by site-id

#### `generateSiteId(): string`
- Generates a new UUID v4 for anonymous users

#### `createAnonymousUser(siteId: string): Promise<User>`
- Creates an anonymous user with the given site-id
- Automatically creates default preferences

#### `getUserBySiteIdOrCreate(siteId: string): Promise<User>`
- Gets existing user by site-id or creates a new anonymous user

#### `migrateAnonymousUserToRegistered(...): Promise<User>`
- Migrates an anonymous user to a registered account with email/password
- Transfers all preferences and data
- Marks user as no longer anonymous

#### `migrateAnonymousUserToGoogle(...): Promise<User>`
- Migrates an anonymous user to a Google OAuth account
- Creates social_accounts record
- Transfers all preferences and data

### 4. Site-ID Middleware (`src/middleware/siteId.ts`)
New middleware that:
- Runs on every request to check/create site-id cookie
- If user has `auth_token` cookie, skips (authenticated users)
- If user has `site_id` cookie, loads their anonymous user data
- If user has neither, generates new site-id and creates anonymous user
- Stores site-id in request as `req.siteId` and user ID as `req.anonymousUserId`
- Sets cookie with 1-year expiration

### 5. Auth Routes (`src/routes/auth.ts`)
Updated endpoints:

#### `POST /api/auth/register`
- Now accepts site-id migration
- If user has site-id, migrates their anonymous account instead of creating new
- Clears site-id cookie on successful registration

#### `GET /api/auth/google/callback`
- Now applies site-id middleware to check for anonymous user
- Clears site-id cookie when user authenticates with Google

#### `GET /api/auth/me`
- Now supports both authenticated and anonymous users
- Returns `isAuthenticated: true/false` flag
- Uses optional auth middleware to work without JWT token
- Falls back to anonymous user data if not authenticated

### 6. Passport Configuration (`src/config/passport.ts`)
Updated Google OAuth strategy to:
- Check if user is anonymous before rejecting email conflicts
- Migrate anonymous users to Google OAuth automatically
- Create social_accounts record during migration

### 7. Server Setup (`src/index.ts`)
- Added site-id middleware to global middleware stack
- Runs after session middleware but before route handlers

## Frontend Changes

### AuthContext (`client/src/contexts/AuthContext.tsx`)
- No changes needed! Site-id cookie is managed entirely server-side
- Frontend treats both authenticated and anonymous users normally via `/api/auth/me` endpoint
- The response includes `isAuthenticated` flag to distinguish them if needed

## Data Flow

### First-Time User Visit
1. User visits site without auth_token or site_id cookie
2. siteIdMiddleware generates UUID and creates anonymous user in database
3. site_id cookie set for 1 year
4. User preferences created with defaults (dark theme, en language)
5. User can access game features and preferences saved to their anonymous account

### User Creates Account (Email/Password)
1. User fills registration form
2. POST /api/auth/register includes site-id cookie (auto-sent)
3. AuthService detects site-id and calls migrateAnonymousUserToRegistered()
4. Anonymous user record updated with email, username, password hash
5. User marked as registered (is_anonymous = false)
6. JWT token generated and site_id cookie cleared
7. All previous preferences and game data preserved

### User Signs In with Google
1. User clicks "Sign in with Google"
2. Passport strategy receives Google profile
3. Checks if already linked to Google - if yes, logs in
4. Checks if email exists as registered user - if yes, shows error (prevent email conflicts)
5. Checks if email belongs to anonymous user with site_id - if yes, calls migrateAnonymousUserToGoogle()
6. Anonymous user record updated with email, username, avatar, social_accounts record created
7. User marked as registered (is_anonymous = false)
8. JWT token generated and site_id cookie cleared
9. All previous preferences and game data preserved

### Existing Anonymous User Upgrades Later
1. User has been visiting site for weeks, accumulating preferences and game history
2. User decides to create account or sign in with Google
3. System detects their site-id matches an anonymous account
4. Migration process transfers all data to new authenticated account
5. User continues seamlessly with all their history intact

## API Changes

### Response Format for /api/auth/me

#### Authenticated User
```json
{
  "user": {
    "id": 1,
    "site_id": null,
    "email": "user@example.com",
    "username": "username",
    "avatar_url": "...",
    "email_verified": true,
    "is_anonymous": false,
    "created_at": "2024-01-09T10:00:00Z",
    "updated_at": "2024-01-09T10:00:00Z"
  },
  "preferences": { ... },
  "isAuthenticated": true
}
```

#### Anonymous User
```json
{
  "user": {
    "id": 2,
    "site_id": "550e8400-e29b-41d4-a716-446655440000",
    "email": null,
    "username": null,
    "avatar_url": null,
    "email_verified": false,
    "is_anonymous": true,
    "created_at": "2024-01-09T10:00:00Z",
    "updated_at": "2024-01-09T10:00:00Z"
  },
  "preferences": { ... },
  "isAuthenticated": false
}
```

## Setup Checklist

- [ ] Run database migration (002_add_site_id.sql)
- [ ] Install uuid package: `npm install uuid`
- [ ] Update TypeScript types and interfaces
- [ ] Deploy backend with all new services and middleware
- [ ] Test first-time user flow (no cookies → anonymous user created)
- [ ] Test email registration flow (anonymous → registered migration)
- [ ] Test Google OAuth flow (anonymous → Google registered migration)
- [ ] Test existing registered users (should still work normally)
- [ ] Verify site-id cookie persists across sessions (1 year)
- [ ] Verify preferences and game data persist through migrations
- [ ] Monitor logs for site-id creation and migration events

## Testing Scenarios

### Scenario 1: New Anonymous User
1. Open app in incognito window
2. Check cookies - should see site_id
3. Call `/api/auth/me` - should return anonymous user with preferences
4. Change theme preference - should persist
5. Start a game, save progress
6. Refresh page - data should persist

### Scenario 2: Anonymous to Registered Migration (Email)
1. Use site as anonymous for a while
2. Create account with email/password
3. Verify email exists in database with site_id
4. Verify is_anonymous = false after registration
5. Verify preferences and game data preserved
6. Verify site_id cookie is cleared after registration

### Scenario 3: Anonymous to Google Migration
1. Use site as anonymous for a while
2. Click "Sign in with Google"
3. Complete Google OAuth flow
4. Verify user record updated with Google data
5. Verify social_accounts record created
6. Verify is_anonymous = false
7. Verify preferences and game data preserved
8. Verify site_id cookie is cleared

### Scenario 4: Returning Registered User
1. User creates account, logs out
2. Close browser completely
3. Open site in new window
4. Should NOT have site_id cookie (different than before)
5. Should redirect to login since no auth_token
6. After login, should get authenticated user data

## Important Notes

- **Site-ID cookie is httpOnly and secure** - Cannot be accessed by JavaScript for security
- **Site-ID is NOT JWT** - It's a simple UUID stored in database, sent as cookie
- **One year expiration** - Site-ID cookies last 1 year of inactivity
- **Registered users don't use site-id** - Once logged in, only JWT auth_token is used
- **Graceful degradation** - If site-id creation fails, app continues without it
- **Database constraints at app layer** - Email/username must be provided for registered users, not required for anonymous

## Future Enhancements

1. Account linking - Allow users to link Google/Apple to existing email account
2. Site-ID refresh - Provide option to generate new site-id if user wants fresh start
3. Anonymous to anonymous transfer - QR code to sync between devices
4. Cleanup job - Remove very old inactive anonymous users after 1+ year
5. Analytics - Track anonymous vs registered user engagement
