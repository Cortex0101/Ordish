export interface User {
  id: number;
  site_id?: string;
  email?: string;
  username?: string;
  password_hash?: string;
  avatar_url?: string;
  email_verified: boolean;
  is_anonymous: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UserPreferences {
  id: number;
  user_id: number;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  created_at: Date;
  updated_at: Date;
}

export interface SocialAccount {
  id: number;
  user_id: number;
  provider: 'google' | 'apple' | 'facebook';
  provider_id: string;
  provider_email?: string;
  created_at: Date;
}