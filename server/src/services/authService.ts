import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getPool } from '../db';
import { User } from '../models/User';

export class AuthService {
  static async createUser(email: string, username: string, password: string): Promise<User> {
    const passwordHash = await bcrypt.hash(password, 12);
    const pool = getPool();
    
    const [result] = await pool.execute(
      'INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?, ?)',
      [email, username, passwordHash]
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

  static async verifyPassword(email: string, password: string): Promise<User | null> {
    const pool = getPool();
    const [result] = await pool.execute(
      'SELECT id, email, password_hash, first_name, last_name, email_verified FROM users WHERE email = ?',
      [email]
    ) as any;
    
    if (result.length === 0) return null;
    
    const user = result[0];
    const isValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isValid) return null;
    
    // Remove password hash from return value
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async createSession(userId: number, sessionData: any): Promise<string> {
    const sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const pool = getPool();
    
    await pool.execute(
      'INSERT INTO user_sessions (id, user_id, data, expires_at) VALUES (?, ?, ?, ?)',
      [sessionId, userId, JSON.stringify(sessionData), expiresAt]
    );
    
    return sessionId;
  }

  static generateJWT(user: User): string {
    const payload = {
      id: user.id,
      email: user.email,
    };
    
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' });
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const pool = getPool();
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]) as any;
    return rows.length > 0 ? rows[0] : null;
  }

  static async getUserById(id: number): Promise<User | null> {
    const pool = getPool();
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]) as any;
    return rows.length > 0 ? rows[0] : null;
  }

  static async getUserPreferences(userId: number): Promise<any> {
    const pool = getPool();
    const [rows] = await pool.execute('SELECT * FROM user_preferences WHERE user_id = ?', [userId]) as any;
    return rows.length > 0 ? rows[0] : null;
  }

  static async updateUserPreferences(userId: number, preferences: any): Promise<void> {
    const pool = getPool();
    const { theme, language, timezone, notifications_enabled } = preferences;
    
    // Use REPLACE to update or insert preferences
    if (theme || language || timezone || notifications_enabled !== undefined) {
      await pool.execute(
        'REPLACE INTO user_preferences (user_id, theme, language, timezone, notifications_enabled) VALUES (?, ?, ?, ?, ?)',
        [userId, theme || 'auto', language || 'en', timezone || 'UTC', notifications_enabled !== undefined ? notifications_enabled : true]
      );
    }
  }

  static verifyJWT(token: string): any {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      return null;
    }
  }

  static async checkEmailExists(email: string): Promise<boolean> {
    const pool = getPool();
    const [rows] = await pool.execute('SELECT COUNT(*) as count FROM users WHERE email = ?', [email]) as any;
    return rows[0].count > 0;
  }
}