import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import i18n from '../i18n';

interface User {
  id: number;
  email: string;
  username: string;
  avatar_url?: string;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
}

interface AuthError extends Error {
  field?: string;
  messageKey?: string;
  suggestionKey?: string;
  details?: Record<string, string | null>;
}

interface AuthContextType {
  user: User | null;
  preferences: UserPreferences | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  const applyTheme = useCallback((theme: 'light' | 'dark' | 'auto') => {
    const htmlElement = document.documentElement;
    
    if (theme === 'auto') {
      // Remove data-bs-theme to use system preference
      htmlElement.removeAttribute('data-bs-theme');
    } else {
      // Set explicit theme
      htmlElement.setAttribute('data-bs-theme', theme);
    }
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setPreferences(data.preferences);
        
        // Apply user preferences to front-end
        if (data.preferences) {
          if (data.preferences.theme) {
            applyTheme(data.preferences.theme);
          }
          if (data.preferences.language) {
            i18n.changeLanguage(data.preferences.language);
          }
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  }, [applyTheme]);

  // Check if user is logged in on app start
  useEffect(() => {
    // Handle OAuth success/failure
    const urlParams = new URLSearchParams(window.location.search);
    const oauthSuccess = urlParams.get('oauth_success');
    const oauthError = urlParams.get('error');
    
    if (oauthSuccess === 'true') {
      // OAuth was successful, refresh auth status
      console.log('OAuth login successful');
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (oauthError) {
      // OAuth failed
      console.error('OAuth error:', oauthError);
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    const data = await response.json();
    setUser(data.user);
    setPreferences(data.preferences);
    
    // Apply user preferences to front-end
    if (data.preferences) {
      if (data.preferences.theme) {
        applyTheme(data.preferences.theme);
      }
      if (data.preferences.language) {
        i18n.changeLanguage(data.preferences.language);
      }
    }
  };

  const register = async (email: string, username: string, password: string) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, username, password })
    });

    if (!response.ok) {
      const error = await response.json();
      // Create a detailed error with additional properties
      const errorWithDetails = new Error(error.message || error.error || 'Registration failed') as AuthError;
      errorWithDetails.field = error.field;
      errorWithDetails.messageKey = error.messageKey;
      errorWithDetails.suggestionKey = error.suggestionKey;
      errorWithDetails.details = error.details;
      throw errorWithDetails;
    }

    const data = await response.json();
    setUser(data.user);
    setPreferences(data.preferences);
    
    // Apply user preferences to front-end
    if (data.preferences) {
      if (data.preferences.theme) {
        applyTheme(data.preferences.theme);
      }
      if (data.preferences.language) {
        i18n.changeLanguage(data.preferences.language);
      }
    }
  };

  const logout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    
    setUser(null);
    setPreferences(null);
  };

  const updatePreferences = async (prefs: Partial<UserPreferences>) => {
    const response = await fetch('/api/auth/preferences', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(prefs)
    });

    if (response.ok) {
      const data = await response.json();
      setPreferences(data.preferences);
      
      // Apply front-end changes immediately
      if (prefs.theme) {
        applyTheme(prefs.theme);
      }
      
      if (prefs.language) {
        i18n.changeLanguage(prefs.language);
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      preferences,
      login,
      register,
      logout,
      updatePreferences,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};