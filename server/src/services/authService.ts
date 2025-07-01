import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getPool } from "../db.js";
import { User } from "../models/User.js";
import validator from "validator";
import { log } from "../utils/logger.js";

export class AuthService {
  static async getUserByEmail(email: string): Promise<User | null> {
    const startTime = Date.now();
    const pool = getPool();
    const [rows] = (await pool.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ])) as any;
    const duration = Date.now() - startTime;
    
    log.dbQuery("SELECT * FROM users WHERE email = ?", [email], duration);
    
    return rows.length > 0 ? rows[0] : null;
  }

  static async getUserByUsername(
    username: string
  ): Promise<User | null> {
    const startTime = Date.now();
    const pool = getPool();
    const [rows] = (await pool.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    )) as any;
    const duration = Date.now() - startTime;
    
    log.dbQuery("SELECT * FROM users WHERE username = ?", [username], duration);
    
    return rows.length > 0 ? rows[0] : null;
  }

  static async getUserById(id: number): Promise<User | null> {
    const startTime = Date.now();
    const pool = getPool();
    const [rows] = (await pool.execute("SELECT * FROM users WHERE id = ?", [
      id,
    ])) as any;
    const duration = Date.now() - startTime;
    
    log.dbQuery("SELECT * FROM users WHERE id = ?", [id], duration);
    
    return rows.length > 0 ? rows[0] : null;
  }

  static verifyPasswordStrength(password: string): boolean {
    return (
      validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 0,
        minSymbols: 0,
      })
    );
  }

  static async verifyInformationIsValidForRegistration(
    email: string,
    username: string,
    password: string
  ): Promise<void> {
    if (!email || !validator.isEmail(email)) {
      throw new Error("auth.validation.email-invalid");
    }

    if (!username || !validator.isAlphanumeric(username)) {
      throw new Error("auth.validation.username-invalid-chars");
    }
    else if (username.length < 3 || username.length > 20) {
      throw new Error("auth.validation.username-length");
    }

    if (!this.verifyPasswordStrength(password)) {
      throw new Error("auth.validation.password-weak");
    }

    const existingUser = await this.getUserByEmail(email);
    if (existingUser) {
      throw new Error("auth.validation.email-exists");
    }

    const existingUsername = await this.getUserByUsername(username);
    if (existingUsername) {
      throw new Error("auth.validation.username-exists");
    }

    return Promise.resolve();
  }
    
  static async createUser(
    email: string,
    username: string,
    password: string
  ): Promise<User> {
    log.info('Creating new user', { 
      email: email.substring(0, 3) + '***', 
      username: username.substring(0, 3) + '***' 
    });

    const passwordHash = await bcrypt.hash(password, 12);
    const pool = getPool();

    // Verify information before inserting, will throw an error if invalid
    await this.verifyInformationIsValidForRegistration(email, username, password);

    try {
      const startTime = Date.now();
      const [result] = await pool.execute(
        "INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)",
        [email, username, passwordHash]
      );
      const userCreationDuration = Date.now() - startTime;

      log.dbQuery(
        "INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)",
        [email, '***', '***'],
        userCreationDuration
      );

      const userId = (result as any).insertId;

      // Create default preferences
      const prefStartTime = Date.now();
      await pool.execute(
        "INSERT INTO user_preferences (user_id, theme, language) VALUES (?, ?, ?)",
        [userId, "auto", "en"]
      );
      const prefDuration = Date.now() - prefStartTime;

      log.dbQuery(
        "INSERT INTO user_preferences (user_id, theme, language) VALUES (?, ?, ?)",
        [userId, "auto", "en"],
        prefDuration
      );

      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error("User creation failed");
      }

      log.business('User created successfully', { 
        userId: user.id, 
        email: email.substring(0, 3) + '***' 
      });

      return user;
    } catch (error) {
      log.dbError('Failed to create user', error as Error, 
        "INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)",
        [email, username, '***']
      );
      throw error;
    }
  }

  static async verifyPassword(
    email: string,
    password: string
  ): Promise<User | null> {
    log.info('Password verification attempt', { 
      email: email.substring(0, 3) + '***' 
    });
    
    const startTime = Date.now();
    const pool = getPool();
    const [result] = (await pool.execute(
      "SELECT id, email, username, password_hash, email_verified FROM users WHERE email = ?",
      [email]
    )) as any;
    const duration = Date.now() - startTime;

    log.dbQuery(
      "SELECT id, email, username, password_hash, email_verified FROM users WHERE email = ?",
      [email],
      duration
    );

    if (result.length === 0) {
      log.warn('Password verification failed - user not found', { 
        email: email.substring(0, 3) + '***' 
      });
      return null;
    }

    const user = result[0];
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      log.warn('Password verification failed - invalid password', { 
        email: email.substring(0, 3) + '***',
        userId: user.id 
      });
      return null;
    }

    log.info('Password verification successful', { 
      userId: user.id,
      email: email.substring(0, 3) + '***' 
    });

    // Remove password hash from return value
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async createSession(
    userId: number,
    sessionData: any
  ): Promise<string> {
    const sessionId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    
    log.debug('Creating user session', { userId, sessionId });
    
    const startTime = Date.now();
    const pool = getPool();

    await pool.execute(
      "INSERT INTO user_sessions (id, user_id, data, expires_at) VALUES (?, ?, ?, ?)",
      [sessionId, userId, JSON.stringify(sessionData), expiresAt]
    );
    const duration = Date.now() - startTime;

    log.dbQuery(
      "INSERT INTO user_sessions (id, user_id, data, expires_at) VALUES (?, ?, ?, ?)",
      [sessionId, userId, '[sessionData]', expiresAt],
      duration
    );

    log.business('User session created', { userId, sessionId });

    return sessionId;
  }

  static generateJWT(user: User): string {
    log.debug('Generating JWT token', { userId: user.id });
    
    const payload = {
      id: user.id,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
    
    log.business('JWT token generated', { userId: user.id });
    
    return token;
  }

  static verifyJWT(token: string): any {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      log.debug('JWT token verified successfully', { userId: (decoded as any).id });
      return decoded;
    } catch (error) {
      log.warn('JWT token verification failed', { 
        error: (error as Error).message,
        tokenPreview: token.substring(0, 20) + '...' 
      });
      return null;
    }
  }

  static async getUserPreferences(userId: number): Promise<any> {
    const startTime = Date.now();
    const pool = getPool();
    const [rows] = (await pool.execute(
      "SELECT * FROM user_preferences WHERE user_id = ?",
      [userId]
    )) as any;
    const duration = Date.now() - startTime;
    
    log.dbQuery("SELECT * FROM user_preferences WHERE user_id = ?", [userId], duration);
    
    return rows.length > 0 ? rows[0] : null;
  }

  static async updateUserPreferences(
    userId: number,
    preferences: any
  ): Promise<void> {
    log.info('Updating user preferences', { 
      userId, 
      preferences: Object.keys(preferences) 
    });
    
    const startTime = Date.now();
    const pool = getPool();
    const { theme, language, timezone, notifications_enabled } = preferences;

    // Use REPLACE to update or insert preferences
    if (theme || language || timezone || notifications_enabled !== undefined) {
      await pool.execute(
        "REPLACE INTO user_preferences (user_id, theme, language, timezone, notifications_enabled) VALUES (?, ?, ?, ?, ?)",
        [
          userId,
          theme || "auto",
          language || "en",
          timezone || "UTC",
          notifications_enabled !== undefined ? notifications_enabled : true,
        ]
      );
      const duration = Date.now() - startTime;

      log.dbQuery(
        "REPLACE INTO user_preferences (user_id, theme, language, timezone, notifications_enabled) VALUES (?, ?, ?, ?, ?)",
        [userId, theme || "auto", language || "en", timezone || "UTC", notifications_enabled !== undefined ? notifications_enabled : true],
        duration
      );

      log.business('User preferences updated', { userId, preferences });
    }
  }

  static async createGoogleUser(
    email: string,
    username: string,
    googleData: {
      googleId: string;
      displayName: string;
      profilePicture: string;
    }
  ): Promise<User> {
    log.info('Creating new Google OAuth user', { 
      email: email.substring(0, 3) + '***', 
      username: username.substring(0, 3) + '***',
      googleId: googleData.googleId
    });

    const pool = getPool();

    try {
      const startTime = Date.now();
      const [result] = await pool.execute(
        "INSERT INTO users (email, username, google_id, display_name, profile_picture, email_verified) VALUES (?, ?, ?, ?, ?, ?)",
        [email, username, googleData.googleId, googleData.displayName, googleData.profilePicture, 1] // Google emails are pre-verified
      );
      const userCreationDuration = Date.now() - startTime;

      log.dbQuery(
        "INSERT INTO users (email, username, google_id, display_name, profile_picture, email_verified) VALUES (?, ?, ?, ?, ?, ?)",
        [email, '***', googleData.googleId, googleData.displayName.substring(0, 10) + '***', '[URL]', 1],
        userCreationDuration
      );

      const userId = (result as any).insertId;

      // Create default preferences
      const prefStartTime = Date.now();
      await pool.execute(
        "INSERT INTO user_preferences (user_id, theme, language) VALUES (?, ?, ?)",
        [userId, "auto", "en"]
      );
      const prefDuration = Date.now() - prefStartTime;

      log.dbQuery(
        "INSERT INTO user_preferences (user_id, theme, language) VALUES (?, ?, ?)",
        [userId, "auto", "en"],
        prefDuration
      );

      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error("Google user creation failed");
      }

      log.business('Google OAuth user created successfully', { 
        userId: user.id, 
        email: email.substring(0, 3) + '***' 
      });

      return user;
    } catch (error) {
      log.dbError('Failed to create Google OAuth user', error as Error, 
        "INSERT INTO users (email, username, google_id, display_name, profile_picture, email_verified) VALUES (?, ?, ?, ?, ?, ?)",
        [email, username, googleData.googleId, googleData.displayName, '[URL]', 1]
      );
      throw error;
    }
  }
}
