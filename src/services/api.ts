// ============================================================
// AI Quant Wallet - API 请求封装
// ============================================================

import { API_BASE_URL } from '@/utils/constants';

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
      // Token 过期，清除本地存储
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

  async walletLogin(walletAddress: string, signature: string, message: string) {
    return this.request<{ token: string; user: any }>('/auth/wallet-login', {
      method: 'POST',
      body: JSON.stringify({ walletAddress, signature, message }),
    });
  }

  async getUserProfile() {
    return this.request<{ id: string; walletAddress: string; level: number; totalPnl: number; activeStrategies: number }>(
      '/user/profile'
    );
  }

  // ---- Strategy ----
  async getStrategies() {
    return this.request<{ strategies: any[] }>('/strategies');
  }

  async getStrategyDetail(id: string) {
    return this.request<{ id: string; name: string; backtestData: any }>(`/strategies/${id}`);
  }

  async startStrategy(data: any) {
    return this.request<{ userStrategyId: string; status: string; estimatedPointsPerHour: number; startedAt: string }>(
      '/strategy/start',
      { method: 'POST', body: JSON.stringify(data) }
    );
  }

  async stopStrategy(userStrategyId: string) {
    return this.request<{ status: string; totalPnl: number; totalFees: number; runDuration: string }>(
      '/strategy/stop',
      { method: 'POST', body: JSON.stringify({ userStrategyId }) }
    );
  }

  async getUserStrategies() {
    return this.request<{ strategies: any[] }>('/user/strategies');
  }

  // ---- API Key ----
  async createApiKey(data: { exchange: string; apiKey: string; apiSecret: string }) {
    return this.request<{ id: string; exchange: string }>('/api-keys', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getApiKeys() {
    return this.request<{ keys: any[] }>('/api-keys');
  }

  // ---- Points ----
  async getPointBalance() {
    return this.request<{ balance: number; totalConsumed: number; totalPurchased: number }>('/points/balance');
  }

  async purchasePoints(amount: number, paymentToken: string) {
    return this.request<{ txParams: any; expectedCost: { amount: number; token: string } }>(
      '/points/purchase',
      { method: 'POST', body: JSON.stringify({ amount, paymentToken }) }
    );
  }

  async confirmPurchase(txHash: string) {
    return this.request<{ newBalance: number }>('/points/purchase/confirm', {
      method: 'POST',
      body: JSON.stringify({ txHash }),
    });
  }

  async getPointTransactions(page = 1, limit = 20) {
    return this.request<{ transactions: any[]; total: number }>(
      `/points/transactions?page=${page}&limit=${limit}`
    );
  }

  // ---- Referral ----
  async generateReferralLink() {
    return this.request<{ referralCode: string; referralLink: string; rewardPerReferral: number }>(
      '/referral/generate',
      { method: 'POST' }
    );
  }

  async getReferralRecords() {
    return this.request<{ totalReferrals: number; totalEarned: number; referrals: any[] }>('/referral/records');
  }
}

export const api = new ApiClient();
