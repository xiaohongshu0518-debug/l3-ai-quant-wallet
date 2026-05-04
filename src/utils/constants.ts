// ============================================================
// AI Quant Wallet - 常量定义
// ============================================================

export const APP_NAME = 'AI Quant Wallet';
export const APP_DESCRIPTION = 'AI 量化智能钱包 - 非托管 · 智能策略 · 用户自主执���';

// 链配置
export const SUPPORTED_CHAINS = [
  { id: 1, name: 'Ethereum', shortName: 'ETH', rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/demo' },
  { id: 56, name: 'BNB Smart Chain', shortName: 'BSC', rpcUrl: 'https://bsc-dataseed.binance.org' },
  { id: 137, name: 'Polygon', shortName: 'MATIC', rpcUrl: 'https://polygon-rpc.com' },
] as const;

// 交易所支持列表
export const SUPPORTED_EXCHANGES = [
  { id: 'binance', name: 'Binance', logo: '/exchanges/binance.svg' },
  { id: 'okx', name: 'OKX', logo: '/exchanges/okx.svg' },
] as const;

// 策略类型
export const STRATEGY_TYPES = {
  grid: { label: '网格交易', description: '在价格区间内布置多个买卖挂单，适合震荡行情' },
  trend: { label: '趋势追踪', description: '均线交叉 + MACD + RSI 多信号确认，适合趋势行情' },
  arbitrage: { label: '套利策略', description: '跨交易所价差套利，适合波动剧烈期' },
} as const;

// 风险等级
export const RISK_LEVELS = {
  low: { label: '低风险', color: 'text-green-500' },
  medium: { label: '中风险', color: 'text-yellow-500' },
  high: { label: '高风险', color: 'text-red-500' },
} as const;

// 点卡套餐
export const POINT_PACKAGES = [
  { points: 100, price: 10, label: '体验包', discount: 0, description: '约可运行网格策略 10h' },
  { points: 500, price: 45, label: '标准包', discount: 0.1, description: '日常使用' },
  { points: 1200, price: 96, label: '专业包', discount: 0.2, description: '长期用户' },
  { points: 5000, price: 350, label: '旗舰包', discount: 0.3, description: '高频用户' },
] as const;

// API 基础路径
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
export const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';

// 钱包配置
export const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

// 页面路由
export const ROUTES = {
  home: '/',
  login: '/login',
  dashboard: '/dashboard',
  strategies: '/strategies',
  strategyDetail: (id: string) => `/strategies/${id}`,
  points: '/points',
  referral: '/referral',
  settings: '/settings',
  admin: '/admin',
} as const;

// 本地存储 Key
export const STORAGE_KEYS = {
  authToken: 'aqw_auth_token',
  userData: 'aqw_user_data',
  theme: 'aqw_theme',
} as const;
