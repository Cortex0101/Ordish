import { Router } from 'express';
// import passport from 'passport'; // Commented out until OAuth is configured
import { AuthService } from '../services/authService';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { User } from '../models/User';

const router = Router();

// Check if email exists
router.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }
    
    const user = await AuthService.getUserByEmail(email);
    const exists = !!user;
    
    // Check if user has social accounts only (no password)
    const requiresPassword = exists && user.password_hash;
    const hasSocialAccounts = exists && !user.password_hash;
    
    res.json({
      exists,
      requiresPassword,
      hasSocialAccounts
    });
  } catch (error) {
    console.error('Check email error:', error);
    res.status(500).json({ error: 'Failed to check email' });
  }
});

// Email/Password Registration
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    // Check if user exists
    const existingUser = await AuthService.getUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }
    
    const user = await AuthService.createUser(email, password, firstName, lastName);
    const token = AuthService.generateToken(user);
    const preferences = await AuthService.getUserPreferences(user.id);
    
    // Set secure cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({
      user: { ...user, password_hash: undefined },
      preferences,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Email/Password Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await AuthService.getUserByEmail(email);
    if (!user || !user.password_hash) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    
    const isValidPassword = await AuthService.verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    
    const token = AuthService.generateToken(user);
    const preferences = await AuthService.getUserPreferences(user.id);
    
    // Set secure cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    res.json({
      user: { ...user, password_hash: undefined },
      preferences,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Google OAuth - Commented out until Passport strategies are configured
// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// router.get('/google/callback', 
//   passport.authenticate('google', { session: false }),
//   async (req, res) => {
//     const user = req.user as User;
//     const token = AuthService.generateToken(user);
    
//     res.cookie('auth_token', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict',
//       maxAge: 7 * 24 * 60 * 60 * 1000
//     });
    
//     // Redirect to frontend with success
//     res.redirect(`${process.env.CLIENT_URL}?auth=success`);
//   }
// );

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