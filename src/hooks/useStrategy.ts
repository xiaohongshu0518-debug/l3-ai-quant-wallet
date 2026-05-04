// ============================================================
// useStrategy - 策略操作 Hook
// ============================================================

'use client';

import { useState, useCallback } from 'react';
import { api } from '@/services/api';
import type { Strategy, UserStrategy, StartStrategyRequest } from '@/types';

export function useStrategy() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [userStrategies, setUserStrategies] = useState<UserStrategy[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStrategies = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.getStrategies();
      setStrategies(result.strategies);
      return result.strategies;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchStrategyDetail = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.getStrategyDetail(id);
      setSelectedStrategy(result as Strategy);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUserStrategies = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.getUserStrategies();
      setUserStrategies(result.strategies);
      return result.strategies;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startStrategy = useCallback(async (data: StartStrategyRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.startStrategy(data);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stopStrategy = useCallback(async (userStrategyId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.stopStrategy(userStrategyId);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    strategies,
    userStrategies,
    selectedStrategy,
    isLoading,
    error,
    fetchStrategies,
    fetchStrategyDetail,
    fetchUserStrategies,
    startStrategy,
    stopStrategy,
  };
}
