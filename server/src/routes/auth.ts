import { Router } from 'express';
import passport from 'passport';
import { AuthService } from '../services/authService';
import { authMiddleware } from '../middleware/auth';
import { User } from '../models/User';

const router = Router();

// Email/Password Registration
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    // Check if user exists
    const existingUser = await AuthService.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
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
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isValidPassword = await AuthService.verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
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

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { session: false }),
  async (req, res) => {
    const user = req.user as User;
    const token = AuthService.generateToken(user);
    const preferences = await AuthService.getUserPreferences(user.id);
    
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    // Redirect to frontend with success
    res.redirect(`${process.env.CLIENT_URL}?auth=success`);
  }
);

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.json({ message: 'Logged out successfully' });
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
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
router.put('/preferences', authMiddleware, async (req, res) => {
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