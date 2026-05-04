// ============================================================
// AI Quant Wallet - API 请求封装（类型安全版）
// ============================================================

import { API_BASE_URL } from '@/utils/constants';
import type { User, Strategy, UserStrategy, PointBalance, PointTransaction, ReferralInfo, ReferralRecord } from '@/types';

interface AuthResponse {
  token: string;
  user: User;
}

interface StartStrategyResponse {
  userStrategyId: string;
  status: string;
  estimatedPointsPerHour: number;
  startedAt: string;
}

interface StopStrategyResponse {
  status: string;
  totalPnl: number;
  totalFees: number;
  runDuration: string;
}

interface StrategyDetailResponse extends Strategy {
  backtestData?: {
    totalReturn: number;
    maxDrawdown: number;
    sharpeRatio: number;
    winRate: number;
    totalTrades: number;
    period: string;
    monthlyReturns: number[];
  };
}

interface PurchaseResponse {
  txParams: {
    to: string;
    data: string;
    value: string;
  };
  expectedCost: {
    amount: number;
    token: string;
  };
}

interface ConfirmPurchaseResponse {
  newBalance: number;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('aqw_auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      localStorage.removeItem('aqw_auth_token');
      localStorage.removeItem('aqw_user_data');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('认证已过期，请重新登录');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: '请求失败' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // ---- Auth ----
  async getChallenge(walletAddress: string): Promise<{ message: string }> {
    return this.request(`/auth/challenge?wallet=${walletAddress}`);
  }

  async walletLogin(walletAddress: string, signature: string, message: string): Promise<AuthResponse> {
    return this.request('/auth/wallet-login', {
      method: 'POST',
      body: JSON.stringify({ walletAddress, signature, message }),
    });
  }

  async getUserProfile(): Promise<Partial<User>> {
    return this.request('/user/profile');
  }

  // ---- Strategy ----
  async getStrategies(): Promise<{ strategies: Strategy[] }> {
    return this.request('/strategies');
  }

  async getStrategyDetail(id: string): Promise<StrategyDetailResponse> {
    return this.request(`/strategies/${id}`);
  }

  async startStrategy(data: {
    strategyId: string;
    mode: 'exchange' | 'chain';
    exchangeApiKeyId?: string;
    parameters: {
      amount: number;
      tradingPair: string;
      stopLoss: number;
      takeProfit: number;
      gridCount?: number;
      leverage?: number;
    };
  }): Promise<StartStrategyResponse> {
    return this.request('/strategy/start', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async stopStrategy(userStrategyId: string): Promise<StopStrategyResponse> {
    return this.request('/strategy/stop', {
      method: 'POST',
      body: JSON.stringify({ userStrategyId }),
    });
  }

  async getUserStrategies(): Promise<{ strategies: UserStrategy[] }> {
    return this.request('/user/strategies');
  }

  // ---- API Key ----
  async createApiKey(data: { exchange: string; apiKey: string; apiSecret: string }) {
    return this.request<{ id: string; exchange: string }>('/api-keys', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getApiKeys() {
    return this.request<{ keys: { id: string; exchange: string; isActive: boolean }[] }>('/api-keys');
  }

  // ---- Points ----
  async getPointBalance(): Promise<PointBalance> {
    return this.request('/points/balance');
  }

  async purchasePoints(amount: number, paymentToken: string): Promise<PurchaseResponse> {
    return this.request('/points/purchase', {
      method: 'POST',
      body: JSON.stringify({ amount, paymentToken }),
    });
  }

  async confirmPurchase(txHash: string): Promise<ConfirmPurchaseResponse> {
    return this.request('/points/purchase/confirm', {
      method: 'POST',
      body: JSON.stringify({ txHash }),
    });
  }

  async getPointTransactions(page = 1, limit = 20): Promise<{ transactions: PointTransaction[]; total: number }> {
    return this.request(`/points/transactions?page=${page}&limit=${limit}`);
  }

  // ---- Referral ----
  async generateReferralLink(): Promise<ReferralInfo> {
    return this.request('/referral/generate', { method: 'POST' });
  }

  async getReferralRecords(): Promise<{ totalReferrals: number; totalEarned: number; referrals: ReferralRecord[] }> {
    return this.request('/referral/records');
  }
}

export const api = new ApiClient();
