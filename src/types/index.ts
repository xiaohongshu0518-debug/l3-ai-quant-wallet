// ============================================================
// AI Quant Wallet - 类型定义
// ============================================================

// ---- 用户 ----
export interface User {
  id: string;
  walletAddress: string;
  nickname: string | null;
  avatarUrl: string | null;
  level: number;
  totalPnl: number;
  activeStrategies: number;
  referralCode: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ---- 策略 ----
export type StrategyType = 'grid' | 'trend' | 'arbitrage';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface Strategy {
  id: string;
  name: string;
  type?: StrategyType;
  description?: string;
  riskLevel?: RiskLevel;
  minInvestment?: number;
  maxInvestment?: number;
  supportedExchanges?: string[];
  supportedChains?: string[];
  pointsPerHour?: number;
  isActive?: boolean;
  roi30d?: number;
  backtestData?: BacktestData;
}

export interface BacktestData {
  totalReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  winRate: number;
  totalTrades: number;
  period: string;
  monthlyReturns: number[];
}

// ---- 用户策略运行 ----
export type StrategyMode = 'exchange' | 'chain';
export type StrategyStatus = 'RUNNING' | 'STOPPED' | 'PAUSED' | 'ERROR';

export interface StrategyConfigParams {
  amount: number;
  tradingPair: string;
  stopLoss: number;
  takeProfit: number;
  gridCount?: number;
  leverage?: number;
}

export interface StartStrategyRequest {
  strategyId: string;
  mode: StrategyMode;
  exchangeApiKeyId?: string;
  chainStrategyContract?: string;
  parameters: StrategyConfigParams;
}

export interface UserStrategy {
  id: string;
  userId: string;
  strategyId: string;
  name?: string;
  mode?: StrategyMode;
  exchangeApiKeyId?: string | null;
  chainStrategyContract?: string | null;
  parameters?: StrategyConfigParams;
  config?: string | null;
  status: StrategyStatus;
  totalPnl?: number;
  totalFees?: number;
  startedAt?: string;
  stoppedAt?: string | null;
  strategy?: Strategy;
  tradeLogs?: TradeLog[];
}

// ---- 交易所 API Key ----
export interface UserApiKey {
  id: string;
  userId: string;
  exchange: string;
  isActive: boolean;
  lastVerifiedAt: string | null;
  createdAt: string;
}

// ---- 交易日志 ----
export interface TradeLog {
  id: string;
  userStrategyId: string;
  txHash: string | null;
  exchange: string;
  tradingPair: string;
  side: 'buy' | 'sell';
  amount: number;
  price: number;
  fee: number;
  pnl: number;
  executedAt: string;
}

// ---- PnL 快照 ----
export interface PnLSnapshot {
  snapshotTime: string;
  totalValue: number;
  pnl: number;
  pnlPercentage: number;
}

// ---- 点卡 ----
export interface PointBalance {
  balance: number;
  totalConsumed: number;
  totalPurchased: number;
}

export interface PointTransaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  description?: string;
  txHash?: string | null;
  createdAt: string;
}

// ---- 邀请 ----
export interface ReferralInfo {
  referralCode: string;
  referralLink: string;
  rewardPerReferral: number;
}

export interface ReferralRecord {
  id: string;
  refereeName?: string;
  refereeAddress?: string;
  reward: number;
  joinedAt: string;
}

// ---- WebSocket ----
export interface PnLUpdateMessage {
  type: 'pnl_update';
  data: {
    currentValue: number;
    pnl: number;
    pnlPercentage: number;
    lastTrade: {
      side: 'buy' | 'sell';
      price: number;
      time: string;
    } | null;
  };
}

export interface StrategyStatusMessage {
  type: 'strategy_status';
  data: {
    status: StrategyStatus;
    reason?: string;
  };
}

export type WSMessage = PnLUpdateMessage | StrategyStatusMessage;

// ---- API 响应 ----
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
