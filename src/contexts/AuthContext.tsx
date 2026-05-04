// ============================================================
// AuthContext - 认证上下文
// ============================================================

'use client';

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { api } from '@/services/api';
import { signMessage } from '@/services/wallet';
import type { User } from '@/types';
import { STORAGE_KEYS } from '@/utils/constants';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (walletAddress: string) => Promise<any>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem(STORAGE_KEYS.authToken);
    const savedUser = localStorage.getItem(STORAGE_KEYS.userData);
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem(STORAGE_KEYS.authToken);
        localStorage.removeItem(STORAGE_KEYS.userData);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (walletAddress: string) => {
    setIsLoading(true);
    try {
      const { message } = await api.getChallenge(walletAddress);
      const signature = await signMessage(message);
      if (!signature) throw new Error('签名失败');
      const result = await api.walletLogin(walletAddress, signature, message);
      setToken(result.token);
      setUser(result.user);
      localStorage.setItem(STORAGE_KEYS.authToken, result.token);
      localStorage.setItem(STORAGE_KEYS.userData, JSON.stringify(result.user));
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.authToken);
    localStorage.removeItem(STORAGE_KEYS.userData);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const profile = await api.getUserProfile();
      const updated = { ...user!, ...profile };
      setUser(updated);
      localStorage.setItem(STORAGE_KEYS.userData, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext 必须在 AuthProvider 内使用');
  return ctx;
}
