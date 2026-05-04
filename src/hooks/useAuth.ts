// ============================================================
// useAuth - 认证状态 Hook
// ============================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';
import { signMessage } from '@/services/wallet';
import type { User } from '@/types';
import { STORAGE_KEYS } from '@/utils/constants';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 初始化：从 localStorage 恢复登录状态
  useEffect(() => {
    const savedToken = localStorage.getItem(STORAGE_KEYS.authToken);
    const savedUser = localStorage.getItem(STORAGE_KEYS.userData);

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
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
      // 1. 获取 challenge
      const { message } = await api.getChallenge(walletAddress);

      // 2. 用户签名
      const signature = await signMessage(message);
      if (!signature) throw new Error('签名失败');

      // 3. 登录
      const result = await api.walletLogin(walletAddress, signature, message);

      // 4. 保存到本地
      setToken(result.token);
      setUser(result.user);
      setIsAuthenticated(true);

      localStorage.setItem(STORAGE_KEYS.authToken, result.token);
      localStorage.setItem(STORAGE_KEYS.userData, JSON.stringify(result.user));

      return result;
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.authToken);
    localStorage.removeItem(STORAGE_KEYS.userData);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const profile = await api.getUserProfile();
      const updatedUser = { ...user!, ...profile };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEYS.userData, JSON.stringify(updatedUser));
    } catch (error) {
      console.error('刷新用户信息失败:', error);
    }
  }, [user]);

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
  };
}
