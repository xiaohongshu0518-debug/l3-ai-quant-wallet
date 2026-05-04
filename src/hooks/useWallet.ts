// ============================================================
// useWallet - 钱包连接状态 Hook
// ============================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getCurrentAccount,
  requestAccount,
  onAccountChanged,
  onChainChanged,
  onDisconnect,
} from '@/services/wallet';

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 初始化：检查已连接的钱包
  useEffect(() => {
    const init = async () => {
      const acc = await getCurrentAccount();
      if (acc) {
        setAccount(acc);
        if (window.ethereum) {
          const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
          setChainId(parseInt(chainIdHex, 16));
        }
      }
    };
    init();
  }, []);

  // 监听钱包事件
  useEffect(() => {
    const unsubAccount = onAccountChanged((acc) => {
      setAccount(acc);
      if (!acc) {
        setChainId(null);
      }
    });

    const unsubChain = onChainChanged((id) => {
      setChainId(id);
    });

    const unsubDisconnect = onDisconnect(() => {
      setAccount(null);
      setChainId(null);
    });

    return () => {
      unsubAccount();
      unsubChain();
      unsubDisconnect();
    };
  }, []);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const acc = await requestAccount();
      setAccount(acc);
      if (window.ethereum) {
        const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
        setChainId(parseInt(chainIdHex, 16));
      }
      return acc;
    } catch (err: any) {
      const msg = err?.code === 4001 ? '用户拒绝了连接请求' : (err?.message || '连接钱包失败');
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  return {
    account,
    chainId,
    isConnecting,
    error,
    connect,
    isConnected: !!account,
  };
}
