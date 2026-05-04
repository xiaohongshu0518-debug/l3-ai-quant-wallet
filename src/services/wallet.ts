// ============================================================
// AI Quant Wallet - 钱包交互服务
// ============================================================

import { createWalletClient, custom, type WalletClient } from 'viem';
import { mainnet } from 'viem/chains';

// 获取以太坊 provider
function getProvider() {
  if (typeof window === 'undefined' || !window.ethereum) {
    return null;
  }
  return window.ethereum;
}

// 请求用户签名消息
export async function signMessage(message: string): Promise<string | null> {
  try {
    const provider = getProvider();
    if (!provider) {
      throw new Error('请安装 MetaMask');
    }

    const accounts = await provider.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];

    const signature = await provider.request({
      method: 'personal_sign',
      params: [message, account],
    });

    return signature;
  } catch (error: any) {
    console.error('签名失败:', error);
    throw new Error(error?.message || '签名失败');
  }
}

// 获取当前钱包地址
export async function getCurrentAccount(): Promise<string | null> {
  try {
    const provider = getProvider();
    if (!provider) return null;

    const accounts = await provider.request({ method: 'eth_accounts' });
    return accounts[0] || null;
  } catch {
    return null;
  }
}

// 请求钱包地址（弹出 MetaMask）
export async function requestAccount(): Promise<string> {
  const provider = getProvider();
  if (!provider) throw new Error('请安装 MetaMask');

  const accounts = await provider.request({ method: 'eth_requestAccounts' });
  return accounts[0];
}

// 切换链
export async function switchChain(chainId: number): Promise<void> {
  const provider = getProvider();
  if (!provider) throw new Error('请安装 MetaMask');

  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  } catch (error: any) {
    // 如果链未添加，添加链
    if (error.code === 4902) {
      // 可扩展的链配置
      const chainConfig = {
        56: {
          chainId: '0x38',
          chainName: 'BNB Smart Chain',
          nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
          rpcUrls: ['https://bsc-dataseed.binance.org'],
          blockExplorerUrls: ['https://bscscan.com'],
        },
      } as Record<number, any>;

      if (chainConfig[chainId]) {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [chainConfig[chainId]],
        });
      }
    } else {
      throw error;
    }
  }
}

// 监听账户变化
export function onAccountChanged(callback: (account: string | null) => void): () => void {
  const provider = getProvider();
  if (!provider) return () => {};

  const handler = (accounts: string[]) => {
    callback(accounts[0] || null);
  };

  provider.on?.('accountsChanged', handler);
  return () => provider.removeListener?.('accountsChanged', handler);
}

// 监听链变化
export function onChainChanged(callback: (chainId: number) => void): () => void {
  const provider = getProvider();
  if (!provider) return () => {};

  const handler = (chainId: string) => {
    callback(parseInt(chainId, 16));
  };

  provider.on?.('chainChanged', handler);
  return () => provider.removeListener?.('chainChanged', handler);
}

// 监听断开连接
export function onDisconnect(callback: () => void): () => void {
  const provider = getProvider();
  if (!provider) return () => {};

  const handler = () => callback();
  provider.on?.('disconnect', handler);
  return () => provider.removeListener?.('disconnect', handler);
}
