import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { AuthService } from '../services/authService.js';
import { log } from '../utils/logger.js';

let passportConfigured = false;

// Initialize passport configuration
export function initializePassport() {
  if (passportConfigured) {
    return;
  }

  // Only configure Google OAuth if credentials are provided
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (googleClientId && googleClientSecret && 
      googleClientId !== 'your-google-client-id-here' && 
      googleClientSecret !== 'your-google-client-secret-here') {
    
    log.info('Configuring Google OAuth strategy');
    
    // Google OAuth Strategy
    passport.use(new GoogleStrategy({
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback"
    }, async (_accessToken, _refreshToken, profile, done) => {
      try {
        log.info('Google OAuth attempt', { 
          profileId: profile.id,
          email: profile.emails?.[0]?.value?.substring(0, 3) + '***',
          displayName: profile.displayName?.substring(0, 10) + '***'
        });

        const email = profile.emails?.[0]?.value;
        const displayName = profile.displayName;
        
        if (!email) {
          log.warn('Google OAuth failed - no email provided', { profileId: profile.id });
          return done(new Error('No email provided by Google'), false);
        }

        // Check if user already exists by Google ID first
        let user = await AuthService.getUserByGoogleId(profile.id);
        
        if (user) {
          // User exists with this Google account, log them in
          log.business('Google OAuth login successful (existing Google account)', { 
            userId: user.id,
            email: email.substring(0, 3) + '***' 
          });
          
          return done(null, user);
        }

        // Check if user exists by email (might be a regular account)
        user = await AuthService.getUserByEmail(email);
        
        if (user) {
          // User exists with this email but no Google account linked
          // For now, we'll treat this as a separate account
          // In the future, you might want to implement account linking
          log.warn('User exists with same email but no Google account linked', {
            email: email.substring(0, 3) + '***',
            userId: user.id
          });
          
          // You could either:
          // 1. Link the accounts (add social_account record)
          // 2. Reject the OAuth (current approach)
          // 3. Create a new account with modified email
          
          return done(new Error('Account with this email already exists. Please log in with your password.'), false);
        }

        // User doesn't exist, create new account
        // Generate a username from display name or email
        let username = displayName?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        if (!username || username.length < 3) {
          username = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        }
        
        // Ensure username is unique
        let finalUsername = username;
        let counter = 1;
        while (await AuthService.getUserByUsername(finalUsername)) {
          finalUsername = `${username}${counter}`;
          counter++;
        }

        try {
          // Create user without password (OAuth account)
          user = await AuthService.createGoogleUser(email, finalUsername, {
            googleId: profile.id,
            displayName: displayName || '',
            profilePicture: profile.photos?.[0]?.value || ''
          });

          log.business('Google OAuth registration successful', { 
            userId: user.id,
            email: email.substring(0, 3) + '***',
            username: finalUsername.substring(0, 3) + '***'
          });

          return done(null, user);
        } catch (error) {
          log.error('Failed to create Google OAuth user', error as Error, {
            email: email.substring(0, 3) + '***',
            profileId: profile.id
          });
          return done(error as Error, false);
        }
      } catch (error) {
        log.error('Google OAuth strategy error', error as Error, {
          profileId: profile.id
        });
        return done(error as Error, false);
      }
    }));
  } else {
    log.warn('Google OAuth not configured - missing or placeholder credentials', {
      hasClientId: !!googleClientId,
      hasClientSecret: !!googleClientSecret,
      isPlaceholder: googleClientId === 'your-google-client-id-here'
    });
  }

  // Serialize user for session
  passport.serializeUser((user: any, done) => {
    log.debug('Serializing user for session', { userId: user.id });
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await AuthService.getUserById(id);
      if (user) {
        log.debug('User deserialized from session', { userId: user.id });
        done(null, user);
      } else {
        log.warn('Failed to deserialize user - user not found', { userId: id });
        done(new Error('User not found'), false);
      }
    } catch (error) {
      log.error('Error deserializing user', error as Error, { userId: id });
      done(error, false);
    }
  });

  passportConfigured = true;
  log.info('Passport configuration completed');
}

export default passport;
