import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db';
import { User, UserPreferences } from '../models/User';

export class AuthService {
  // Create user with email/password
  static async createUser(email: string, password: string, firstName?: string, lastName?: string): Promise<User> {
    const passwordHash = await bcrypt.hash(password, 12);
    
    const [result] = await pool.execute(
      'INSERT INTO users (email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?)',
      [email, passwordHash, firstName, lastName]
    );
    
    const userId = (result as any).insertId;
    
    // Create default preferences
    await pool.execute(
      'INSERT INTO user_preferences (user_id, theme, language) VALUES (?, ?, ?)',
      [userId, 'auto', 'en']
    );
    
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error('User creation failed');
    }
    return user;
  }

  // Create user from social login
  static async createSocialUser(provider: string, providerData: any): Promise<User> {
    const [result] = await pool.execute(
      'INSERT INTO users (email, first_name, last_name, avatar_url, email_verified) VALUES (?, ?, ?, ?, ?)',
      [providerData.email, providerData.given_name, providerData.family_name, providerData.picture, true]
    );
    
    const userId = (result as any).insertId;
    
    // Link social account
    await pool.execute(
      'INSERT INTO social_accounts (user_id, provider, provider_id, provider_email) VALUES (?, ?, ?, ?)',
      [userId, provider, providerData.id, providerData.email]
    );
    
    // Create default preferences
    await pool.execute(
      'INSERT INTO user_preferences (user_id, theme, language) VALUES (?, ?, ?)',
      [userId, 'auto', 'en']
    );
    
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error('Social user creation failed');
    }   
    return user;
  }

  // Get user by email
  static async getUserByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return (rows as User[])[0] || null;
  }

  // Get user by ID with preferences
  static async getUserById(id: number): Promise<User | null> {
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    return (rows as User[])[0] || null;
  }

  // Get user preferences
  static async getUserPreferences(userId: number): Promise<UserPreferences | null> {
    const [rows] = await pool.execute('SELECT * FROM user_preferences WHERE user_id = ?', [userId]);
    return (rows as UserPreferences[])[0] || null;
  }

  // Update user preferences
  static async updateUserPreferences(userId: number, preferences: Partial<UserPreferences>): Promise<void> {
    const fields = Object.keys(preferences).filter(key => key !== 'id' && key !== 'user_id');
    const values = fields.map(field => preferences[field as keyof UserPreferences]);
    
    if (fields.length > 0) {
      const setClause = fields.map(field => `${field} = ?`).join(', ');
      await pool.execute(
        `UPDATE user_preferences SET ${setClause} WHERE user_id = ?`,
        [...values, userId]
      );
    }
  }

  // Verify password
  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Generate JWT
  static generateToken(user: User): string {
    return jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
  }

  // Verify JWT
  static verifyToken(token: string): any {
    return jwt.verify(token, process.env.JWT_SECRET!);
  }
}