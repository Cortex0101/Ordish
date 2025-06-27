export interface User {
  id: number;
  email: string;
  password_hash?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  email_verified: boolean;
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