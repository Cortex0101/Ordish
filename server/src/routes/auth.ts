import { Router } from 'express';
import passport from '../config/passport.js';
import { AuthService } from '../services/authService.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { log } from '../utils/logger.js';

const router = Router();

// Check if email exists
// This endpoint checks if an email is already registered,
// and wether
router.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      log.warn('Email check attempt without email', { ip: req.ip, userAgent: req.get('User-Agent') });
      res.status(400).json({ error: 'Email is required' });
      return;
    }
    
    log.debug('Checking email existence', { email: email.substring(0, 3) + '***' });
    const user = await AuthService.getUserByEmail(email);
    const exists = !!user; // true if user exists false if 'exists' is null
    
    // Check if user has social accounts only (no password)
    const requiresPassword = exists && user.password_hash;
    const hasSocialAccounts = exists && !user.password_hash;
    
    log.info('Email check completed', { 
      emailExists: exists, 
      requiresPassword, 
      hasSocialAccounts,
      maskedEmail: email.substring(0, 3) + '***'
    });
    
    res.json({
      exists,
      requiresPassword,
      hasSocialAccounts
    });
  } catch (error) {
    log.error('Check email error', error as Error, { 
      email: req.body?.email?.substring(0, 3) + '***',
      ip: req.ip 
    });
    res.status(500).json({ error: 'Failed to check email' });
  }
});

// Email/Password Registration
router.post('/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    // Validate input data first
    if (!email || !username || !password) {
      log.warn('Registration attempt with missing fields', { 
        hasEmail: !!email, 
        hasUsername: !!username, 
        hasPassword: !!password,
        ip: req.ip 
      });
      res.status(400).json({ 
        error: 'validation.missing-fields',
        details: {
          email: !email ? 'validation.email-required' : null,
          username: !username ? 'validation.username-required' : null,
          password: !password ? 'validation.password-required' : null
        }
      });
      return;
    }

    log.info('User registration attempt', { 
      email: email.substring(0, 3) + '***',
      username: username.substring(0, 3) + '***',
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    const user = await AuthService.createUser(email, username, password);
    const token = AuthService.generateJWT(user);
    const preferences = await AuthService.getUserPreferences(user.id);
    
    // Set secure cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    log.business('User registered successfully', {
      userId: user.id,
      email: email.substring(0, 3) + '***',
      username: username.substring(0, 3) + '***'
    });
    
    res.json({
      user: { ...user, password_hash: undefined },
      preferences,
      token
    });
  } catch (error) {
    log.error('Registration error', error as Error, { 
      email: req.body?.email?.substring(0, 3) + '***',
      username: req.body?.username?.substring(0, 3) + '***',
      ip: req.ip 
    });
    
    // Handle specific validation errors from AuthService
    const errorMessage = (error as Error).message;
    
    // Map AuthService error keys to response structure
    if (errorMessage.includes('auth.validation.email-invalid')) {
      res.status(400).json({ 
        error: 'validation.failed',
        field: 'email',
        messageKey: 'email-invalid'
      });
    } else if (errorMessage.includes('auth.validation.username-invalid-chars')) {
      res.status(400).json({ 
        error: 'validation.failed',
        field: 'username',
        messageKey: 'username-invalid-chars'
      });
    } else if (errorMessage.includes('auth.validation.username-length')) {
      res.status(400).json({ 
        error: 'validation.failed',
        field: 'username',
        messageKey: 'username-too-short'
      });
    } else if (errorMessage.includes('auth.validation.password-weak')) {
      res.status(400).json({ 
        error: 'validation.failed',
        field: 'password',
        messageKey: 'password-too-weak'
      });
    } else if (errorMessage.includes('auth.validation.email-exists')) {
      res.status(409).json({ 
        error: 'validation.failed',
        field: 'email',
        messageKey: 'email-exists',
        suggestionKey: 'email-exists-signin'
      });
    } else if (errorMessage.includes('auth.validation.username-exists')) {
      res.status(409).json({ 
        error: 'validation.failed',
        field: 'username',
        messageKey: 'username-exists',
        suggestionKey: 'username-choose-different'
      });
    } else {
      // Generic server error
      res.status(500).json({ 
        error: 'server.registration-failed',
        messageKey: 'register-error'
      });
    }
  }
});

// Email/Password Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    log.info('Login attempt', { 
      email: email?.substring(0, 3) + '***',
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    const user = await AuthService.getUserByEmail(email);
    if (!user || !user.password_hash) {
      log.authAttempt(email, false, req.ip, req.get('User-Agent'));
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    
    const isValidPassword = await AuthService.verifyPassword(user.email, password);
    if (!isValidPassword) {
      log.authAttempt(email, false, req.ip, req.get('User-Agent'));
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    log.authAttempt(email, true, req.ip, req.get('User-Agent'));
    
    const token = AuthService.generateJWT(user);
    const preferences = await AuthService.getUserPreferences(user.id);
    
    // Set secure cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    log.business('User logged in successfully', {
      userId: user.id,
      email: email.substring(0, 3) + '***'
    });
    
    res.json({
      user: { ...user, password_hash: undefined },
      preferences,
      token
    });
  } catch (error) {
    log.error('Login error', error as Error, { 
      email: req.body?.email?.substring(0, 3) + '***',
      ip: req.ip 
    });
    res.status(500).json({ error: 'Login failed' });
  }
});

// Google OAuth routes
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login?error=oauth_failed' }),
  async (req, res) => {
    try {
      const user = req.user as User;
      log.business('Google OAuth callback successful', { 
        userId: user.id,
        email: user.email?.substring(0, 3) + '***'
      });
      
      // Generate JWT token for the authenticated user
      const token = AuthService.generateJWT(user);
      
      // Set secure cookie
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      // Redirect to frontend success page
      const redirectUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      res.redirect(`${redirectUrl}/?oauth_success=true`);
    } catch (error) {
      log.error('Google OAuth callback error', error as Error);
      const redirectUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      res.redirect(`${redirectUrl}/login?error=oauth_callback_failed`);
    }
  }
);

// OAuth failure handler
router.get('/oauth/failure', (req, res) => {
  log.warn('OAuth failure accessed', { 
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    query: req.query 
  });
  
  const redirectUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  res.redirect(`${redirectUrl}/login?error=oauth_failed`);
});

// Logout
router.post('/logout', (_req, res) => {
  res.clearCookie('auth_token');
  res.json({ message: 'Logged out successfully' });
});

// Get current user
router.get('/me', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = req.user as User;
    const preferences = await AuthService.getUserPreferences(user.id);
    
    res.json({
      user: { ...user, password_hash: undefined },
      preferences
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

// Update preferences
router.put('/preferences', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = req.user as User;
    const { theme, language, timezone } = req.body;
    
    await AuthService.updateUserPreferences(user.id, { theme, language, timezone });
    const preferences = await AuthService.getUserPreferences(user.id);
    
    res.json({ preferences });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

export default router;