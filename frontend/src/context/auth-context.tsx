import React, { createContext, useContext, useState, useEffect } from 'react';
import { queryClient } from '@/lib/query-client';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  district: string;
  city: string;
  state: string;
  landHolding: number;
  primaryCrops: string[];
  role: 'farmer' | 'trader' | 'admin';
  isVerified: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: { phone: string; password: string }) => Promise<{ success: boolean; message?: string; error?: string }>;
  register: (data: {
    name: string;
    phone: string;
    email?: string;
    password: string;
    district: string;
    city: string;
    landHolding?: number;
    primaryCrops?: string[];
  }) => Promise<{ success: boolean; message?: string; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const storedToken = localStorage.getItem('auth_token');
      const res = await fetch('/api/auth/me', {
        headers: storedToken ? { Authorization: `Bearer ${storedToken}` } : {},
      });
      const data = await res.json();

      if (data.authenticated && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error('Failed to fetch auth user:', e);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: { phone: string; password: string }) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const u = data.data?.user || data.user;
        const t = data.data?.token || data.token;
        setUser(u);
        setToken(t);
        localStorage.setItem('auth_token', t);
        queryClient.invalidateQueries();
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.message || data.error || 'Login failed' };
      }
    } catch (e) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const register = async (formData: {
    name: string;
    phone: string;
    email?: string;
    password: string;
    district: string;
    city: string;
    landHolding?: number;
    primaryCrops?: string[];
  }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const u = data.data?.user || data.user;
        const t = data.data?.token || data.token;
        setUser(u);
        setToken(t);
        localStorage.setItem('auth_token', t);
        queryClient.invalidateQueries();
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.message || data.error || 'Registration failed' };
      }
    } catch (e) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      const storedToken = localStorage.getItem('auth_token');
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: storedToken ? { Authorization: `Bearer ${storedToken}` } : {},
      });
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('auth_token');
      queryClient.invalidateQueries();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
