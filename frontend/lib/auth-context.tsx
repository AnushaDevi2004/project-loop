'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Role, User } from '@/types';
import { users } from '@/lib/mock-data';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  switchRole: (role: Role) => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'loop-auth-user-id';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedId = localStorage.getItem(STORAGE_KEY);
      if (storedId) {
        const found = users.find((u) => u.id === storedId);
        if (found) {
          setUser(found);
        }
      } else {
        // Default: logged in as admin
        setUser(users[0]);
      }
    } catch {
      setUser(users[0]);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password: string): Promise<User> => {
    await new Promise((r) => setTimeout(r, 500));
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      throw new Error('Invalid credentials');
    }
    setUser(found);
    try {
      localStorage.setItem(STORAGE_KEY, found.id);
    } catch {
      // ignore
    }
    return found;
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const switchRole = (role: Role) => {
    if (!user) return;
    const updated = { ...user, role };
    setUser(updated);
    try {
      localStorage.setItem(STORAGE_KEY, updated.id);
    } catch {
      // ignore
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    try {
      localStorage.setItem(STORAGE_KEY, updated.id);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, switchRole, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
