// ============================================================
// 环境配置
// ============================================================

export default () => ({
  port: parseInt(process.env.PORT || '3001', 10),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'super-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },

  // Database
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ai_quant_wallet',
  },

  // Redis
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },

  // API Key 加密
  encryption: {
    key: process.env.ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef', // 32 bytes hex
  },

  // Exchange API
  exchange: {
    binance: {
      baseUrl: process.env.BINANCE_BASE_URL || 'https://api.binance.com',
      wsUrl: process.env.BINANCE_WS_URL || 'wss://stream.binance.com:9443/ws',
    },
    okx: {
      baseUrl: process.env.OKX_BASE_URL || 'https://www.okx.com',
      wsUrl: process.env.OKX_WS_URL || 'wss://ws.okx.com:8443/ws/v5/public',
    },
  },

  // Blockchain
  blockchain: {
    rpcUrl: process.env.RPC_URL || 'https://eth-mainnet.g.alchemy.com/v2/demo',
    chainId: parseInt(process.env.CHAIN_ID || '1', 10),
    relayerPrivateKey: process.env.RELAYER_PRIVATE_KEY || '',
  },
});
