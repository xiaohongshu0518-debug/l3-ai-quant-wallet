# AI Quant Wallet（AI量化智能钱包）— 完整开发框架文档

> **版本：** v1.0  
> **定位：** 非托管钱包 + AI量化策略工具平台  
> **核心原则：** 不碰用户资产、不承诺收益、纯工具定位  
> **文档用途：** 可直接交给技术团队作为 PRD + 架构设计 + 开发计划

---

## 目录

1. [项目总览](#一项目总览)
2. [产品需求（PRD）](#二产品需求prd)
3. [系统架构](#三系统架构)
4. [智能合约设计](#四智能合约设计)
5. [数据库设计](#五数据库设计)
6. [API 设计](#六-api-设计)
7. [前端设计](#七前端设计)
8. [后端设计](#八后端设计)
9. [AI 量化引擎](#九-ai-量化引擎)
10. [安全设计](#十安全设计)
11. [合规设计](#十一合规设计)
12. [收费系统（点卡/Token）](#十二收费系统点卡token)
13. [增长与裂变系统](#十三增长与裂变系统)
14. [部署与运维](#十四部署与运维)
15. [MVP 路线图（2周可上线）](#十五-mvp-路线图2周可上线)
16. [对标产品参考](#十六对标产品参考)

---

## 一、项目总览

### 1.1 一句话定义

> 一个基于 Web3 的非托管智能钱包，内置 AI 量化策略工具，用户自主授权、自主执行、风险自担。

### 1.2 核心差异化

| 维度 | 传统量化平台 | AI Quant Wallet |
|------|-------------|-----------------|
| 资金托管 | 平台托管（高风险） | ❌ 不托管，用户自持 |
| 策略来源 | 手动策略或跟单 | AI 自动生成 + 用户选择 |
| 交易执行 | 平台内部撮合 | 交易所 API / 链上合约 |
| 收费模式 | 管理费 + 分成 | 点卡消耗 + 可选功能付费 |
| 数据透明度 | 黑箱 | 链上可查 + 策略回测可验证 |

### 1.3 技术栈选型总览

| 层级 | 技术选型 | 说明 |
|------|---------|------|
| 前端框架 | React 18 + Next.js 14 | SSR + SPA 混合 |
| 前端语言 | TypeScript | 全栈类型安全 |
| 钱包连接 | Web3-Onboard / RainbowKit | 支持 MetaMask、WalletConnect 等 |
| UI 框架 | Tailwind CSS + Shadcn/ui | 快速原型 |
| 后端语言 | Node.js (NestJS) + Python (FastAPI) | Node 负责业务逻辑，Python 负责 AI |
| 数据库 | PostgreSQL + Redis | 关系型 + 缓存 |
| 消息队列 | RabbitMQ / Redis Streams | 策略异步执行 |
| 区块链节点 | Alchemy / Infura / QuickNode | EVM 兼容链访问 |
| 合约语言 | Solidity 0.8.x | OpenZeppelin 标准库 |
| AI 框架 | PyTorch + Pandas + TA-Lib | 量化策略训练与回测 |
| 部署 | Docker + AWS ECS / EC2 | 容器化部署 |
| CDN/安全 | Cloudflare | DDoS 防护 + CDN |
| 监控 | Prometheus + Grafana | 系统监控 + 策略运行监控 |

---

## 二、产品需求（PRD）

### 2.1 用户角色

| 角色 | 权限 | 说明 |
|------|------|------|
| 普通用户 | 基本功能 | 连接钱包、选择策略、查看收益 |
| VIP 用户 | 高级功能 | 自定义策略参数、更低费率 |
| 管理员 | 平台管理 | 用户管理、策略上下架、系统监控 |

### 2.2 功能模块清单

#### 模块 A：钱包系统（必做）

| 功能 | 优先级 | 描述 |
|------|--------|------|
| 创建/导入钱包 | P0 | 支持助记词导入，本地生成 |
| MetaMask 连接 | P0 | 标准的 EIP-1193 连接 |
| WalletConnect 连接 | P1 | 支持移动端钱包 |
| 多链资产展示 | P0 | ETH / BSC / Polygon 余额展示 |
| 交易历史 | P1 | DEX 交易记录展示 |
| 资产图表 | P2 | 资产变化趋势图 |

#### 模块 B：AI 量化策略（核心）

| 功能 | 优先级 | 描述 |
|------|--------|------|
| 模式 A：交易所 API 交易 | P0 | Binance / OKX API 接入 |
| 模式 B：链上合约交易 | P1 | 智能合约执行 DEX 交易 |
| AI 策略列表 | P0 | 多策略选择（网格、趋势、套利） |
| 策略参数配置 | P1 | 用户自定义风险等级、金额 |
| 策略一键启停 | P0 | 即时控制 |
| 回测报告 | P1 | 历史数据回测展示 |
| 实时收益展示 | P0 | Dashboard 实时数据 |
| 风控预警 | P0 | 止损触发通知 |

#### 模块 C：收费系统（点卡）

| 功能 | 优先级 | 描述 |
|------|--------|------|
| 点卡购买 | P0 | USDT / Token 购买 |
| 策略运行扣费 | P0 | 按时间或按次扣点 |
| 点卡余额查询 | P0 | 实时余额展示 |
| 点卡消耗明细 | P1 | 历史扣费记录 |

#### 模块 D：增长系统

| 功能 | 优先级 | 描述 |
|------|--------|------|
| 邀请链接生成 | P1 | 自动生成带参链接 |
| 邀请奖励 | P1 | 邀请双方获点卡 |
| 用户等级体系 | P2 | 等级 + 权益 + 折扣 |

### 2.3 用户核心流程

```
用户打开 DApp
  ↓
连接钱包（MetaMask / 新建钱包）
  ↓
Dashboard 显示资产概览
  ↓
选择策略 → 查看策略详情 & 回测数据
  ↓
选择模式 A 或 B
  ├── 模式 A：输入交易所 API Key（仅交易权限）
  └── 模式 B：授权策略合约
  ↓
设置风险参数（金额 / 止损线 / 杠杆（可选））
  ↓
确认消耗点卡 → 启动策略
  ↓
实时监控 Dashboard
  ↓
用户可随时停止策略
```

### 2.4 UI 页面结构

```
/                       → Landing Page（产品介绍）
/wallet                 → 钱包管理（创建/导入/连接）
/dashboard              → 用户主面板（资产 + 策略运行状态）
/strategies             → 策略市场（列表 + 详情）
/strategies/:id         → 策略详情（回测数据、参数配置）
/strategies/:id/run     → 策略运行（模式选择 + 参数设置）
/points                 → 点卡管理（购买 + 余额 + 明细）
/referral               → 邀请系统
/settings               → 账户设置
/admin                  → 管理后台（管理员）
```

---

## 三、系统架构

### 3.1 整体架构图

```
┌─────────────────────────────────────────────────────┐
│                    用户浏览器                         │
│           Next.js SPA + MetaMask Wallet              │
└──────────────┬──────────────────────────┬───────────┘
               │ HTTP/WS                    │ EIP-1193
               ▼                            ▼
┌──────────────────────────┐   ┌──────────────────────┐
│     Cloudflare CDN       │   │   用户钱包本地签名     │
└──────────┬───────────────┘   └──────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────┐
│               API Gateway (NestJS)                   │
│           负载均衡 + 限流 + 认证 JWT                   │
└──────┬──────────┬──────────┬──────────┬─────────────┘
       │          │          │          │
       ▼          ▼          ▼          ▼
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌──────────────┐
│ 用户服务  │ │ 策略服务  │ │ 点卡服务  │ │ 邀请服务     │
└─────────┘ └────┬────┘ └─────────┘ └──────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│              AI 量化引擎 (Python FastAPI)             │
│      ┌──────────┬──────────┬──────────┐              │
│      │ 策略生成   │ 回测引擎  │ 实时执行   │              │
│      └──────────┴──────────┴────┬─────┘              │
│                                  │                    │
│                     ┌────────────┴────┐              │
│                     │  风控模块       │              │
│                     │ 止损/止盈/熔断   │              │
│                     └─────────────────┘              │
└─────────────────────────────────────────────────────┘
                 │
    ┌────────────┴────────────┐
    ▼                         ▼
┌──────────────┐    ┌──────────────────┐
│  交易所 API   │    │  链上执行器       │
│  Binance/OKX │    │  ↓                │
│              │    │  策略合约 → DEX    │
└──────────────┘    └──────────────────┘
```

### 3.2 数据流设计

#### 模式 A（交易所 API）数据流

```
用户 → 前端配置策略参数
  ↓
后端接收 → 验证 API Key 权限（确认无提现权限）
  ↓
存入数据库（API Key 加密存储）
  ↓
启动策略引擎
  ↓
AI 模块分析市场数据（实时 K 线 + 指标）
  ↓
生成交易信号 → 通过交易所 REST API 执行
  ↓
交易结果回调 → 更新用户收益数据
  ↓
前端实时展示（WebSocket 推送）
```

#### 模式 B（链上执行）数据流

```
用户 → 选择策略合约 → 钱包弹出授权签名
  ↓
用户授权策略合约使用其代币（approve）
  ↓
后端接收授权确认 → 部署用户专属策略实例
  ↓
AI 引擎监控市场 → 达到触发条件
  ↓
通过后端 Relayer 调用策略合约 → 合约执行 DEX 交易
  ↓
交易上链 → 链上数据可查
  ↓
前端实时展示（The Graph / 自定义索引器）
```

### 3.3 核心架构决策

| 决策 | 方案 | 理由 |
|------|------|------|
| 非托管设计 | 私钥永远在用户本地 | 合规 + 安全底线 |
| API Key 存储 | AES-256-GCM 加密存储，服务重启需解密密钥 | 防止数据库泄露导致 Key 泄露 |
| 策略执行 | 异步事件驱动（消息队列） | 避免阻塞、支持并发策略 |
| 实时推送 | WebSocket（Socket.IO） | 低延迟、断线重连 |
| 链上监听 | Event Listener 服务 | 监听合约事件更新状态 |

---

## 四、智能合约设计

### 4.1 合约架构

```
┌───────────────────────────────────────────┐
│            StrategyFactory（工厂合约）       │
│   部署统一模板策略合约，每位用户独立实例      │
└──────────────────┬────────────────────────┘
                   │
    ┌──────────────┼──────────────┐
    ▼              ▼              ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│ 用户A策略  │ │ 用户B策略  │ │ 用户C策略  │
│ (独立实例) │ │ (独立实例) │ │ (独立实例) │
└──────────┘ └──────────┘ └──────────┘
                   │
    ┌──────────────┴──────────────┐
    ▼                             ▼
┌──────────┐              ┌──────────────┐
│ PointToken│              │  Router (DEX) │
│ (点卡合约) │              │  Uniswap V3  │
└──────────┘              └──────────────┘
```

### 4.2 核心合约接口

#### StrategyFactory.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IStrategyFactory {
    /// @notice 为用户部署专属策略合约实例
    /// @param strategyType 策略类型（网格/趋势/套利）
    /// @param initialToken 初始交易代币地址
    /// @return strategyAddress 部署的策略合约地址
    function deployStrategy(
        uint8 strategyType,
        address initialToken
    ) external returns (address strategyAddress);

    /// @notice 注销策略合约（用户停止使用后）
    function revokeStrategy(address strategyAddress) external;

    /// @notice 查询用户所有策略实例
    function getUserStrategies(address user)
        external view returns (address[] memory);
}
```

#### UserStrategy.sol（用户策略合约模板）

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IUserStrategy {
    /// @notice 初始化策略参数
    /// @param tokenIn 买入代币
    /// @param tokenOut 卖出代币
    /// @param minPrice 最低价
    /// @param maxPrice 最高价
    /// @param gridCount 网格数量
    function initialize(
        address tokenIn,
        address tokenOut,
        uint256 minPrice,
        uint256 maxPrice,
        uint256 gridCount
    ) external;

    /// @notice 授权策略合约可操作的代币额度
    /// @param token 代币地址
    /// @param amount 授权额度
    function approveToken(address token, uint256 amount) external;

    /// @notice 执行交易（仅限平台 Relayer 调用）
    /// @param amountIn 输入数量
    /// @param minAmountOut 最小输出（滑点保护）
    /// @param path 交易路径
    function executeSwap(
        uint256 amountIn,
        uint256 minAmountOut,
        address[] calldata path
    ) external returns (uint256 amountOut);

    /// @notice 撤回所有授权代币（用户退出时）
    function withdrawAll() external;

    /// @notice 查询策略当前状态
    function getStrategyStatus()
        external view returns (
            uint256 totalDeposited,
            uint256 currentValue,
            uint256 pnl,
            uint256 lastUpdated
        );
}
```

#### PointToken.sol（点卡代币合约）

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IPointToken {
    /// @notice 购买点卡（使用 USDT 或平台 Token）
    function purchase(uint256 amount, address paymentToken) external;

    /// @notice 消耗点数（平台后端签名授权）
    function consume(
        address user,
        uint256 amount,
        bytes calldata signature
    ) external;

    /// @notice 查询用户余额
    function balanceOf(address user) external view returns (uint256);

    /// @notice 邀请奖励（批量空投）
    function referralReward(address referrer, address referee) external;
}
```

### 4.3 合约安全关键

| 安全要点 | 实现方式 |
|----------|----------|
| 防重入攻击 | OpenZeppelin ReentrancyGuard |
| 权限控制 | Ownable + Role-Based Access Control |
| 滑点保护 | 用户预设最小输出量 |
| 暂停机制 | Pausable（紧急情况暂停合约） |
| 升级机制 | UUPS Proxy（未来升级用） |
| 审计要求 | 上线前必须经过知名审计机构 |

---

## 五、数据库设计

### 5.1 ER 关系概览

```
users ──1:N── user_api_keys
users ──1:N── user_strategies
users ──1:N── point_transactions
users ──1:N── referral_relations
strategies ──1:N── user_strategies
user_strategies ──1:N── trade_logs
user_strategies ──1:N── pnl_snapshots
```

### 5.2 核心表结构

#### users（用户表）

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address VARCHAR(42) UNIQUE NOT NULL,  -- 0x... 地址
    nickname VARCHAR(50),
    avatar_url VARCHAR(255),
    level INTEGER DEFAULT 1,
    total_points_consumed DECIMAL(20,8) DEFAULT 0,
    referral_code VARCHAR(20) UNIQUE,
    referred_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login_at TIMESTAMP
);
CREATE INDEX idx_users_wallet ON users(wallet_address);
CREATE INDEX idx_users_referral ON users(referral_code);
```

#### user_api_keys（用户交易所 API Key 表）

```sql
CREATE TABLE user_api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exchange VARCHAR(20) NOT NULL,        -- binance / okx
    api_key_encrypted TEXT NOT NULL,       -- AES-256-GCM 加密
    api_secret_encrypted TEXT NOT NULL,    -- AES-256-GCM 加密
    permissions VARCHAR(50) DEFAULT 'trade', -- 只允许 trade
    is_active BOOLEAN DEFAULT TRUE,
    last_verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, exchange)
);
```

#### strategies（策略定义表）

```sql
CREATE TABLE strategies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,            -- 策略名称
    type VARCHAR(30) NOT NULL,             -- grid / trend / arbitrage
    description TEXT,
    risk_level VARCHAR(10) DEFAULT 'medium', -- low / medium / high
    min_investment DECIMAL(20,8),
    max_investment DECIMAL(20,8),
    supported_exchanges VARCHAR(100)[],    -- ['binance', 'okx']
    supported_chains VARCHAR(50)[],        -- ['eth', 'bsc', 'polygon']
    points_per_hour DECIMAL(10,2),         -- 每小时消耗点数
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### user_strategies（用户运行中的策略）

```sql
CREATE TABLE user_strategies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    strategy_id UUID NOT NULL REFERENCES strategies(id),
    mode VARCHAR(10) NOT NULL CHECK (mode IN ('exchange', 'chain')),
    chain_strategy_contract VARCHAR(42),    -- 链上部署的合约地址
    exchange_api_key_id UUID REFERENCES user_api_keys(id),
    parameters JSONB NOT NULL DEFAULT '{}', -- 用户自定义参数
    -- {
    --   "amount": "1000",
    --   "tradingPair": "ETH/USDT",
    --   "stopLoss": 0.05,
    --   "takeProfit": 0.15,
    --   "gridCount": 10,
    --   "leverage": 1
    -- }
    status VARCHAR(20) DEFAULT 'running',   -- running / paused / stopped / error
    total_pnl DECIMAL(20,8) DEFAULT 0,
    total_fees DECIMAL(20,8) DEFAULT 0,
    started_at TIMESTAMP DEFAULT NOW(),
    last_paused_at TIMESTAMP,
    stopped_at TIMESTAMP
);
CREATE INDEX idx_user_strategies_user ON user_strategies(user_id);
CREATE INDEX idx_user_strategies_status ON user_strategies(status);
```

#### trade_logs（交易日志）

```sql
CREATE TABLE trade_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_strategy_id UUID NOT NULL REFERENCES user_strategies(id) ON DELETE CASCADE,
    tx_hash VARCHAR(66),                    -- 链上交易哈希 / 交易所订单 ID
    exchange VARCHAR(20),
    trading_pair VARCHAR(20),
    side VARCHAR(4) CHECK (side IN ('buy', 'sell')),
    amount DECIMAL(20,8) NOT NULL,
    price DECIMAL(20,8) NOT NULL,
    fee DECIMAL(20,8) DEFAULT 0,
    pnl DECIMAL(20,8) DEFAULT 0,
    executed_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_trade_logs_strategy ON trade_logs(user_strategy_id);
CREATE INDEX idx_trade_logs_time ON trade_logs(executed_at);
```

#### pnl_snapshots（盈亏快照，用于回测和图表）

```sql
CREATE TABLE pnl_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_strategy_id UUID NOT NULL REFERENCES user_strategies(id) ON DELETE CASCADE,
    snapshot_time TIMESTAMP NOT NULL,
    total_value DECIMAL(20,8) NOT NULL,
    pnl DECIMAL(20,8) NOT NULL,            -- 自启动以来累计盈亏
    pnl_percentage DECIMAL(10,4) NOT NULL,  -- 收益率百分比
    UNIQUE(user_strategy_id, snapshot_time)
);
CREATE INDEX idx_pnl_snapshot_strategy_time ON pnl_snapshots(user_strategy_id, snapshot_time);
```

#### point_transactions（点卡交易记录）

```sql
CREATE TABLE point_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    type VARCHAR(20) NOT NULL CHECK (type IN ('purchase', 'consume', 'reward', 'refund')),
    amount DECIMAL(20,8) NOT NULL,
    balance_before DECIMAL(20,8) NOT NULL,
    balance_after DECIMAL(20,8) NOT NULL,
    related_strategy_id UUID REFERENCES user_strategies(id),
    tx_hash VARCHAR(66),                    -- 购买时链上哈希
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_point_tx_user ON point_transactions(user_id);
```

---

## 六、API 设计

### 6.1 认证方式

| 方式 | 说明 |
|------|------|
| 钱包签名登录 | 用户用钱包签名消息，后端验证签名后发放 JWT |
| JWT Token | Bearer Token，有效期 24h |
| API Key 签名 | 策略回调时的服务间认证 |

### 6.2 核心 API 接口

#### 用户相关

```http
### 钱包登录 / 注册
POST /api/auth/wallet-login
Request:
{
  "walletAddress": "0x...",
  "signature": "0x...",         // 用户对 challenge 的签名
  "message": "Sign this message to login: {challenge}"
}
Response:
{
  "token": "jwt...",
  "user": { "id": "...", "walletAddress": "...", "level": 1 }
}

### 获取用户信息
GET /api/user/profile
Header: Authorization: Bearer {jwt}
Response:
{
  "id": "...",
  "walletAddress": "0x...",
  "nickname": "...",
  "level": 3,
  "totalPnl": 1234.56,
  "activeStrategies": 2
}
```

#### 策略相关

```http
### 获取可用策略列表
GET /api/strategies
Response:
{
  "strategies": [
    {
      "id": "...",
      "name": "AI 网格交易",
      "type": "grid",
      "riskLevel": "medium",
      "minInvestment": 100,
      "pointsPerHour": 10,
      "roi30d": 12.5,           // 30 天回测收益率
      "description": "..."
    }
  ]
}

### 获取策略详情（含回测数据）
GET /api/strategies/:id
Response:
{
  "id": "...",
  "name": "...",
  "backtestData": {
    "totalReturn": 15.3,         // %
    "maxDrawdown": -8.2,         // %
    "sharpeRatio": 1.8,
    "winRate": 62.5,             // %
    "totalTrades": 240,
    "period": "2024-01-01 ~ 2024-12-31",
    "monthlyReturns": [1.2, -0.5, 2.1, ...]
  }
}

### 启动策略
POST /api/strategy/start
Request:
{
  "strategyId": "...",
  "mode": "exchange",              // exchange | chain
  "exchangeApiKeyId": "...",        // 模式 A 时必填
  "parameters": {
    "amount": 1000,
    "tradingPair": "ETH/USDT",
    "stopLoss": 0.05,
    "takeProfit": 0.15
  }
}
Response:
{
  "userStrategyId": "...",
  "status": "running",
  "estimatedPointsPerHour": 10,
  "startedAt": "2026-05-01T00:00:00Z"
}

### 停止策略
POST /api/strategy/stop
Request:
{
  "userStrategyId": "..."
}
Response:
{
  "status": "stopped",
  "totalPnl": 123.45,
  "totalFees": 50,
  "runDuration": "2h 30m"
}

### 获取策略实时状态（WebSocket）
WS /api/ws/strategy/:userStrategyId
Message stream:
{
  "type": "pnl_update",
  "data": {
    "currentValue": 1123.45,
    "pnl": 123.45,
    "pnlPercentage": 12.34,
    "lastTrade": { "side": "buy", "price": 3200, "time": "..." }
  }
}
```

#### 点卡相关

```http
### 获取点卡余额
GET /api/points/balance
Response:
{
  "balance": 500,
  "totalConsumed": 1200,
  "totalPurchased": 1700
}

### 购买点卡（生成链上交易参数）
POST /api/points/purchase
Request:
{
  "amount": 100,
  "paymentToken": "USDT"     // USDT / 平台 Token
}
Response:
{
  "txParams": {
    "to": "0xPointTokenContract",
    "data": "0x...",
    "value": "0"
  },
  "expectedCost": {
    "amount": 100,
    "token": "USDT"
  }
}

### 购买确认（后端验证链上交易）
POST /api/points/purchase/confirm
Request:
{
  "txHash": "0x..."
}
Response:
{
  "newBalance": 600
}

### 点卡消费明细
GET /api/points/transactions?page=1&limit=20
Response:
{
  "transactions": [
    {
      "type": "consume",
      "amount": -10,
      "reason": "策略运行 - AI网格交易",
      "time": "..."
    }
  ],
  "total": 45
}
```

#### 邀请相关

```http
### 生成邀请链接
POST /api/referral/generate
Response:
{
  "referralCode": "ABC123",
  "referralLink": "https://aiwallet.io/invite/ABC123",
  "rewardPerReferral": 50     // 每个邀请奖励 50 点卡
}

### 查询邀请记录
GET /api/referral/records
Response:
{
  "totalReferrals": 5,
  "totalEarned": 250,
  "referrals": [
    { "referee": "0x...", "joinedAt": "...", "reward": 50 }
  ]
}
```

### 6.3 API 状态码规范

| 状态码 | 含义 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未认证 / Token 过期 |
| 403 | 无权限（如 API Key 含提现权限） |
| 429 | 请求频率过高 |
| 500 | 服务端错误 |
| 503 | 策略引擎异常 / 交易所连接失败 |

---

## 七、前端设计

### 7.1 项目结构

```
src/
├── app/
│   ├── layout.tsx              # 根布局 + Providers
│   ├── page.tsx                # Landing Page
│   ├── (auth)/
│   │   └── login/page.tsx      # 钱包登录页
│   ├── (protected)/
│   │   ├── dashboard/page.tsx  # 用户面板
│   │   ├── strategies/page.tsx # 策略市场
│   │   ├── strategies/[id]/page.tsx  # 策略详情
│   │   ├── points/page.tsx     # 点卡管理
│   │   ├── referral/page.tsx   # 邀请中心
│   │   └── settings/page.tsx   # 设置
│   └── admin/
│       └── page.tsx            # 管理后台
├── components/
│   ├── wallet/                 # 钱包连接组件
│   │   ├── WalletConnector.tsx
│   │   ├── WalletBalance.tsx
│   │   └── WalletCreateDialog.tsx
│   ├── strategy/               # 策略组件
│   │   ├── StrategyCard.tsx
│   │   ├── StrategyDetail.tsx
│   │   ├── StrategyConfig.tsx
│   │   ├── BacktestChart.tsx
│   │   └── StrategyDashboard.tsx
│   ├── points/                 # 点卡组件
│   │   ├── PointBalance.tsx
│   │   └── PurchaseDialog.tsx
│   ├── shared/                 # 通用组件
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── LoadingSpinner.tsx
│   └── charts/                 # 图表组件
│       ├── PnLChart.tsx
│       ├── AssetChart.tsx
│       └── TradeHistoryChart.tsx
├── hooks/
│   ├── useWallet.ts
│   ├── useStrategy.ts
│   ├── useWebSocket.ts
│   └── useAuth.ts
├── services/
│   ├── api.ts                  # API 请求封装
│   └── wallet.ts               # 钱包交互
├── types/
│   └── index.ts                # TypeScript 类型定义
└── utils/
    ├── format.ts               # 格式化工具
    └── constants.ts            # 常量
```

### 7.2 关键页面原型描述

#### Dashboard（用户主面板）

```
┌──────────────────────────────────────────────────┐
│  Header: Logo | 策略管理 | 点卡管理 | 邀请 | 钱包地址 │
├──────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ 总资产     │ │ 总收益    │ │ 进行中策略 │          │
│  │ $12,345   │ │ +$1,234  │ │  3 个    │          │
│  │           │ │ (+11.1%) │ │          │          │
│  └──────────┘ └──────────┘ └──────────┘          │
│                                                    │
│  ┌──────────────────────────────────────────┐      │
│  │ 收益曲线图 (过去 30 天)                     │      │
│  │ 📈 上升趋势线                              │      │
│  └──────────────────────────────────────────┘      │
│                                                    │
│  正在运行的策略：                                    │
│  ┌────────────────────────────────────────┐        │
│  │ AI 网格交易  | ETH/USDT   | 运行中      │        │
│  │ 收益: +5.2%   | 时长: 2d 3h            │        │
│  │ [停止] [调整]                             │        │
│  └────────────────────────────────────────┘        │
│  ┌────────────────────────────────────────┐        │
│  │ AI 趋势追踪  | BTC/USDT   | 运行中      │        │
│  │ 收益: +3.8%   | 时长: 1d 12h           │        │
│  │ [停止] [调整]                             │        │
│  └────────────────────────────────────────┘        │
└──────────────────────────────────────────────────┘
```

#### 策略市场

```
┌──────────────────────────────────────────────────┐
│  策略市场                                         │
│  [全部] [网格] [趋势] [套利]                        │
│                                                    │
│  ┌──────────────── config ────────────────────┐   │
│  │  AI 网格交易                                │   │
│  │  风险: 中等  | 最低投入: 100 USDT            │   │
│  │  30天回测: +12.5%   | 胜率: 62.5%           │   │
│  │  ⭐ 推荐使用                                 │   │
│  │  [查看详情 →]                                 │   │
│  └────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────┐   │
│  │  AI 趋势追踪                                │   │
│  │  风险: 高  | 最低投入: 500 USDT             │   │
│  │  30天回测: +22.3%   | 胜率: 45.2%          │   │
│  │  [查看详情 →]                                │   │
│  └────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────┘
```

---

## 八、后端设计

### 8.1 后端项目结构（NestJS）

```
backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── jwt.strategy.ts
│   │   │   └── wallet-auth.guard.ts
│   │   ├── user/
│   │   │   ├── user.module.ts
│   │   │   ├── user.controller.ts
│   │   │   └── user.service.ts
│   │   ├── strategy/
│   │   │   ├── strategy.module.ts
│   │   │   ├── strategy.controller.ts
│   │   │   ├── strategy.service.ts
│   │   │   └── backtest.service.ts
│   │   ├── exchange/
│   │   │   ├── exchange.module.ts
│   │   │   ├── exchange.service.ts
│   │   │   ├── binance.client.ts
│   │   │   └── okx.client.ts
│   │   ├── chain/
│   │   │   ├── chain.module.ts
│   │   │   ├── chain.service.ts
│   │   │   ├── contract.service.ts
│   │   │   └── relayer.service.ts
│   │   ├── points/
│   │   │   ├── points.module.ts
│   │   │   ├── points.controller.ts
│   │   │   └── points.service.ts
│   │   ├── referral/
│   │   │   ├── referral.module.ts
│   │   │   └── referral.service.ts
│   │   └── websocket/
│   │       ├── websocket.module.ts
│   │       └── strategy.gateway.ts
│   ├── common/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── filters/
│   │   └── decorators/
│   └── config/
│       └── config.module.ts
├── test/
├── package.json
└── tsconfig.json
```

### 8.2 AI 量化引擎（Python FastAPI）

```
ai-engine/
├── main.py                        # FastAPI 入口
├── requirements.txt
├── core/
│   ├── engine.py                  # 策略引擎调度器
│   ├── risk_manager.py            # 风控模块
│   └── signal_generator.py        # 信号生成器
├── strategies/
│   ├── base.py                    # 策略基类
│   ├── grid_strategy.py           # 网格交易策略
│   ├── trend_strategy.py          # 趋势追踪策略
│   └── arbitrage_strategy.py      # 套利策略
├── backtest/
│   ├── backtest_engine.py         # 回测引擎
│   └── metrics.py                 # 回测评价指标
├── data/
│   ├── market_data.py             # 市场数据获取
│   ├── indicators.py              # 技术指标计算
│   └── models/                    # 机器学习模型
│       ├── price_predictor.py
│       └── regime_detector.py
└── connectors/
    ├── binance_connector.py
    ├── okx_connector.py
    └── web3_connector.py          # 链上交互
```

---

## 九、AI 量化引擎

### 9.1 核心能力

| 能力 | 说明 | 技术实现 |
|------|------|----------|
| 市场数据分析 | 实时获取 K 线数据，计算技术指标 | TA-Lib + WebSocket 行情 |
| 交易信号生成 | 基于多因子模型生成买卖信号 | 集成策略模型 |
| 风控管理 | 止损、止盈、净值回撤保护 | Risk Manager 模块 |
| 回测验证 | 历史数据回测评价策略效果 | 本地 Backtest Engine |
| 调仓建议 | AI 动态调整策略参数 | 基于市场状态检测 |

### 9.2 策略模型说明

#### 网格策略（Grid Strategy）

```
原理：在价格区间内布置多个买卖挂单
适用：震荡行情
参数：
  - 价格区间 [minPrice, maxPrice]
  - 网格数量 gridCount
  - 每格投入金额
AI 增强：
  - 动态调整网格范围（根据波动率）
  - 自动恢复偏移（趋势突破后重新平衡）
```

#### 趋势追踪策略（Trend Strategy）

```
原理：均线交叉 + MACD + RSI 多信号确认
适用：趋势行情
参数：
  - 快慢均线周期
  - RSI 超买/超卖阈值
AI 增强：
  - 自适应周期选择（通过市场状态检测）
  - 噪声过滤（使用价格通道）
```

#### 套利策略（Arbitrage Strategy）

```
原理：跨交易所价差套利
适用：波动剧烈期
注意：MVP 阶段暂不实现，列在 Roadmap 第二期
```

### 9.3 回测系统

```
输入：历史 K 线数据 (OHLCV)
  ↓
策略参数配置
  ↓
模拟交易执行
  ↓
输出评价指标：
  - 总收益率 (Total Return)
  - 年化收益率 (APR)
  - 最大回撤 (Max Drawdown)
  - 夏普比率 (Sharpe Ratio)
  - 胜率 (Win Rate)
  - 交易次数 (Total Trades)
  - 收益曲线图
```

---

## 十、安全设计

### 10.1 安全架构全景

```
┌─────────────────────────────────────────────────┐
│                   安全层                           │
├─────────────────────────────────────────────────┤
│  ① 网络安全                                      │
│  - Cloudflare WAF                                │
│  - HTTPS 强制                                    │
│  - DDoS 防护                                     │
│  - API 限流 (Rate Limiting)                       │
├─────────────────────────────────────────────────┤
│  ② 应用安全                                      │
│  - JWT Token 认证                                 │
│  - 钱包签名验证                                   │
│  - 输入校验 & 防注入                               │
│  - CORS 白名单                                    │
├─────────────────────────────────────────────────┤
│  ③ 数据安全                                      │
│  - API Key AES-256-GCM 加密存储                    │
│  - 数据库加密存储敏感字段                           │
│  - 定期密钥轮换                                   │
│  - 最小权限原则                                    │
├─────────────────────────────────────────────────┤
│  ④ 合约安全                                      │
│  - OpenZeppelin 标准库                            │
│  - 专业安全审计                                   │
│  - Bug Bounty 计划                                │
│  - 紧急暂停机制                                   │
├─────────────────────────────────────────────────┤
│  ⑤ 操作安全                                      │
│  - 权限分离 (Admin ≠ 策略操作)                     │
│  - 审计日志                                        │
│  - 多签合约管理                                    │
│  - 慢启动 + 限额                                   │
└─────────────────────────────────────────────────┘
```

### 10.2 交易所 API Key 安全处理

```typescript
// 伪代码示例
class ApiKeySecurity {
  // 1. 校验 API Key 权限（确保仅交易权限）
  async validateApiKeyPermissions(apiKey: string, apiSecret: string): Promise<boolean> {
    const permissions = await this.exchange.getKeyPermissions(apiKey);
    if (permissions.includes('withdraw')) {
      throw new Error('API Key 不允许包含提现权限');
    }
    if (!permissions.includes('trade')) {
      throw new Error('API Key 必须包含交易权限');
    }
    return true;
  }

  // 2. AES-256-GCM 加密存储
  encryptApiKey(plaintext: string): { ciphertext: string; iv: string; tag: string } {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', MASTER_KEY, iv);
    // ...
    return { ciphertext, iv: iv.toString('hex'), tag: tag.toString('hex') };
  }

  // 3. 仅在运行时解密使用，用完即清除内存
  decryptApiKey(encrypted: EncryptedData): string {
    // 只在需要进行交易操作时短暂解密
    const plaintext = // ...解密逻辑
    return plaintext;
    // 调用完成后立即 clear Buffer
  }
}

// 4. 关键安全策略
// - API Key 不落日志
// - 数据库只存加密密文
// - 解密密钥独立存储（或使用 KMS）
// - 每次操作前验证权限（防止 Key 被篡改）
// - 定期自动检查 Key 有效性
```

### 10.3 风控系统

| 风控级别 | 触发条件 | 动作 |
|----------|----------|------|
| Level 1 | 单笔亏损 > 预设止损比例 | 自动平仓该笔 |
| Level 2 | 策略总亏损 > 用户设置最大亏损 | 暂停整个策略 |
| Level 3 | 交易所异常（API 错误率 > 10%） | 暂停该交易所所有策略 |
| Level 4 | 链上 Gas 异常飙升 | 暂停链上策略执行 |
| Level 5 | 全局风控（重大市场事件） | 管理员手动暂停平台上所有策略 |

---

## 十一、合规设计

### 11.1 必须规避的表述

| ❌ 禁止 | ✅ 替换为 |
|---------|----------|
| "AI帮您赚钱" | "AI策略工具辅助交易" |
| "年化收益 20%" | "历史回测收益率（不代表未来）" |
| "保本策略" | "风险自担，不承诺保本" |
| "代操盘" | "用户自主执行策略" |
| "资金池" | "用户独立仓位" |
| "理财" | "量化交易工具" |
| "AI基金经理" | "策略信号生成器" |

### 11.2 产品上必须展示的声明

```text
⚠️ 风险声明：
1. 本产品仅提供策略执行工具，所有交易决策由用户自主选择。
2. 加密货币交易存在高风险，可能导致全部本金损失。
3. 历史回测数据不代表未来表现，不构成投资建议。
4. 用户资金始终在用户自己的钱包或交易所账户中，平台不托管任何用户资金。
5. 使用本产品前请确保了解相关风险。

使用即表示同意以上声明。
```

### 11.3 合规架构图

```
┌─────────────────────────────────────────────────┐
│              合规保障体系                          │
├─────────────────────────────────────────────────┤
│  产品层                                          │
│  - 明确的"工具"定位                                │
│  - 用户风险提示（首次使用强制阅读）                  │
│  - 风险分级（低/中/高）                            │
│  - 操作留痕（所有交易记录可追溯）                    │
├─────────────────────────────────────────────────┤
│  资金层                                          │
│  - 非托管：用户资金自持                             │
│  - 独立仓位：每用户独立策略实例                      │
│  - 透明可查：链上交易 > 浏览器可验证                 │
│  - 无资金池：无平台统一资金管理                      │
├─────────────────────────────────────────────────┤
│  法律层                                          │
│  - 用户协议（明确工具定位）                          │
│  - 隐私政策                                        │
│  - 免责声明                                        │
│  - 建议咨询当地法律顾问                             │
└─────────────────────────────────────────────────┘
```

### 11.4 各国合规关注点（产品设计上先做通用方案）

| 区域 | 关注点 | 应对方式 |
|------|--------|----------|
| 美国 | SEC 对资管/代投监管 | 非托管 + 不管理用户资金 |
| 欧盟 | MiCA 法案对加密服务商要求 | 明确工具定位，不涉及托管服务 |
| 新加坡 | MAS 对数字资产监管 | 非托管钱包 + 策略工具独立运行 |
| 香港 | SFC 对虚拟资产交易平台监管 | 不接入用户资产，仅提供 API 工具 |
| 中国大陆 | 加密货币交易政策 | 注意服务器部署地和目标用户 |

---

## 十二、收费系统（点卡/Token）

### 12.1 点卡经济模型

```
用户 → 用 USDT 或平台 Token 购买点卡
        ↓
        ↓  链上交易购买（智能合约）
        ↓
用户获得 Point Token（ERC-20 或平台内积分）
        ↓
启动策略 → 按时间/按次数消耗 Point
        ↓
点卡消耗记录到数据库 (point_transactions表)
```

### 12.2 定价策略

| 套餐 | 点数 | 价格 (USDT) | 说明 |
|------|------|-------------|------|
| 体验包 | 100 | 10 | 试用，约可运行网格策略 10h |
| 标准包 | 500 | 45 (9折) | 日常使用 |
| 专业包 | 1200 | 96 (8折) | 长期用户 |
| 旗舰包 | 5000 | 350 (7折) | 高频用户 |

### 12.3 策略消耗速率（示例）

| 策略类型 | 消耗速率 | 每 100 点可运行 |
|----------|----------|-----------------|
| 网格交易（低风险） | 10 点/小时 | 10 小时 |
| 趋势追踪（中风险） | 15 点/小时 | ~6.7 小时 |
| 套利（高风险） | 25 点/小时 | 4 小时 |
| 自定义参数 | 基础消耗 × 参数复杂度系数 | 可变 |

### 12.4 链上点卡合约设计

```solidity
// PointToken.sol - 核心逻辑
contract PointToken is ERC20Burnable, Ownable {
    // 价格配置
    uint256 public pointsPerUSDT = 10;  // 1 USDT = 10 点

    // 购买点卡
    function purchase(uint256 usdtAmount) external {
        require(usdtAmount > 0, "Amount must be > 0");
        usdtToken.transferFrom(msg.sender, treasuryAddress, usdtAmount);
        uint256 points = usdtAmount * pointsPerUSDT;
        _mint(msg.sender, points);
        emit PointsPurchased(msg.sender, usdtAmount, points);
    }

    // 消耗点数（仅后端签名后可由 Relayer 调用）
    function consume(address user, uint256 amount, bytes memory signature) external {
        require(verifySignature(user, amount, signature), "Invalid signature");
        _burn(user, amount);
        emit PointsConsumed(user, amount);
    }
}
```

---

## 十三、增长与裂变系统

### 13.1 邀请机制

```
用户 A → 生成邀请链接 → 分享给用户 B
         ↓
用户 B → 通过链接注册 & 首次使用策略
         ↓
用户 A → 获得邀请奖励（如 50 点卡）
用户 B → 获得新人奖励（如 20 点卡）
```

### 13.2 等级体系

| 等级 | 条件 | 权益 |
|------|------|------|
| Lv.1 青铜 | 注册即达 | 基础策略使用 |
| Lv.2 白银 | 累计消耗 500 点 | 点卡购买 95 折 |
| Lv.3 黄金 | 累计消耗 2000 点 | 点卡购买 9 折 + 优先新策略体验 |
| Lv.4 钻石 | 累计消耗 5000 点 | 点卡购买 85 折 + 自定义策略参数 |
| Lv.5 传说 | 累计消耗 15000 点 | 点卡购买 8 折 + 专属策略 + 邀请 50% 额外奖励 |

### 13.3 数据表设计（补充）

```sql
-- 邀请关系表
CREATE TABLE referral_relations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES users(id),
    referee_id UUID NOT NULL REFERENCES users(id),
    reward_amount DECIMAL(20,8) DEFAULT 50,  -- 给邀请人的奖励
    referee_reward DECIMAL(20,8) DEFAULT 20, -- 给新人的奖励
    status VARCHAR(20) DEFAULT 'pending',     -- pending / rewarded
    created_at TIMESTAMP DEFAULT NOW(),
    rewarded_at TIMESTAMP,
    UNIQUE(referee_id)  -- 一个用户只能被邀请一次
);
```

---

## 十四、部署与运维

### 14.1 部署架构

```
                    用户
                     |
              Cloudflare CDN
             /              \
      前端静态资源          API 网关
    (Next.js S3/CDN)      (负载均衡)
                             |
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
         Web 服务池      AI 引擎节点     WebSocket 服务
         (Auto Scaling)  (GPU 可选)      (Sticky Session)
              │              │              │
              └──────────────┼──────────────┘
                             ▼
                      PostgreSQL
                     (RDS with Read Replica)
                             |
                          Redis
                     (Cache + Queue + Session)
```

### 14.2 环境配置

```yaml
# docker-compose.yml 示例片段
version: '3.8'

services:
  api:
    image: quantx/api:latest
    env_file: .env
    depends_on:
      - postgres
      - redis
    environment:
      - NODE_ENV=production
      - JWT_SECRET=${JWT_SECRET}
      - ENCRYPTION_KEY=${ENCRYPTION_KEY}  # API Key 加密主密钥
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '2'
          memory: 4G

  ai-engine:
    image: quantx/ai-engine:latest
    depends_on:
      - redis
    environment:
      - REDIS_URL=redis://redis:6379
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '4'
          memory: 8G

  postgres:
    image: postgres:16
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: quantx
      POSTGRES_PASSWORD: ${DB_PASSWORD}

  redis:
    image: redis:7-alpine
    volumes:
      - redisdata:/data
```

### 14.3 CI/CD 流水线

```
Git Push → GitHub Actions
  ↓
Run Tests (单元测试 + 集成测试)
  ↓
Build Docker Images
  ↓
Push to Registry (Docker Hub / ECR)
  ↓
Deploy to Staging
  ↓
E2E Tests (Cypress)
  ↓
Manual Approval → Deploy to Production
  ↓
Slack / 钉钉通知
```

### 14.4 监控告警

| 指标 | 告警阈值 | 通知方式 |
|------|----------|----------|
| API 响应时间 > 2s | 持续 5 分钟 | Slack / 邮件 |
| 错误率 > 1% | 持续 3 分钟 | Slack / 电话 |
| AI 引擎延迟 > 5s | 即时 | Slack |
| 交易所 API 调用失败 | 连续 5 次 | Slack |
| 点卡余额过低 | 低于阈值 | 邮件通知用户 |
| 策略异常停止 | 即时 | 推送通知用户 |

---

## 十五、MVP 路线图（2周可上线）

### 15.1 MVP 定义：最小可行版本

**MVP 目标：** 1 个策略 + 1 种模式 + 点卡系统 + 1 条链

### 15.2 两周任务分解

#### 第 1 周：核心基础设施

| 天数 | 任务 | 负责人角色 | 产出 |
|------|------|-----------|------|
| D1 | 项目初始化（前端 + 后端脚手架） | 全栈工程师 | 可运行的项目骨架 |
| D2 | 钱包连接 + 签名登录 | 前端工程师 | 用户可连接 MetaMask 登录 |
| D3 | 数据库设计 + 用户 API | 后端工程师 | 用户注册/登录完成 |
| D4 | 策略市场页面 + 详情页面 | 前端工程师 | 策略列表展示 |
| D5 | AI 引擎基础架构（K 线获取 + 信号生成） | AI 工程师 | 可生成交易信号 |

#### 第 2 周：核心功能联调

| 天数 | 任务 | 负责人角色 | 产出 |
|------|------|-----------|------|
| D6 | 模式 A：交易所 API 接入（Binance） | 后端工程师 | 用户可授权 API 启动策略 |
| D7 | 模式 A：AI 策略执行 + 交易流转 | AI 工程师 | 策略自动执行交易 |
| D8 | Dashboard + 实时数据展示 | 前端工程师 | 用户可查看策略运行状态 |
| D9 | 点卡系统（购买 + 扣费） | 全栈工程师 | 点卡购买、策略运行时扣费 |
| D10 | 风控系统（止损） + 集成测试 | 全栈工程师 | 止损触发时自动停止策略 |
| D11 | 部署 + DNS + SSL 配置 | DevOps | 可公网访问 |
| D12 | 安全审查 + Bug 修复 | 全组 | 上线前检查清单 |

### 15.3 MVP 技术范围缩略

```
✅ MVP 包含：
  - 钱包连接 (MetaMask)
  - 钱包签名登录
  - 1 个策略 (AI 网格交易)
  - 1 种模式 (交易所 API / Binance)
  - Dashboard 实时展示
  - 点卡系统 (购买 + 扣费)
  - 止损风控
  - 前端部署 + API 部署

❌ MVP 暂不包含：
  - 模式 B (链上合约执行)
  - 多链支持 (只做 ETH)
  - 回测系统 (D1 做出骨架即可)
  - 邀请系统
  - 等级体系
  - 套利策略
  - 移动端适配
  - 多语言
```

### 15.4 MVP 上线检查清单

```
□ 1. 用户可连接 MetaMask 并登录
□ 2. 用户可创建 API Key (仅交易权限校验)
□ 3. 用户可选择策略并启动
□ 4. AI 引擎能生成交易信号并执行
□ 5. Dashboard 能实时显示收益
□ 6. 止损功能正常工作
□ 7. 点卡购买链上成功
□ 8. 策略运行时正确扣费
□ 9. 用户可以随时停止策略
□ 10. API 有 Rate Limiting
□ 11. 所有接口有 JWT 认证
□ 12. 前端部署 OK (HTTPS)
□ 13. 后端部署 OK (HTTPS)
□ 14. 数据库备份配置完成
□ 15. 监控告警配置完成
□ 16. 风险声明展示在明显位置
```

---

## 十六、对标产品参考

### 16.1 同类产品分析

| 产品 | 类型 | 模式 | 资金托管 | 策略 | 收费 |
|------|------|------|----------|------|------|
| **3Commas** | CeFi 量化工具 | 交易所 API | ❌ 非托管 | 用户自定义 + 市场策略 | 月费 $14.5+ |
| **Pionex** | CeFi 交易所 | 内置交易所 | ❌ 交易所托管 | 内置网格/马丁格尔 | 交易手续费 |
| **Bitsgap** | CeFi 量化工具 | 交易所 API | ❌ 非托管 | 网格 + DCA + 套利 | 月费 $23+ |
| **Uniswap** | DEX | 链上 | ❌ 非托管 | LP 做市 | 交易手续费 |
| **AI Quant Wallet** | **Web3 + AI** | **API + 链上** | **❌ 非托管** | **AI 驱动** | **点卡按需付费** |

### 16.2 AI Quant Wallet 差异化优势

```
AI Quant Wallet vs 3Commas/Bitsgap：
  ✅ 非托管设计（比 CeFi 平台更安全）
  ✅ 链上模式可选（真正 Web3）
  ✅ AI 自动策略（不依赖用户手动配置）
  ✅ 点卡按需付费（不强制月费）
  ✅ 代币化激励（未来可做平台 Token）

AI Quant Wallet vs Pionex：
  ✅ 不依赖单一交易所
  ✅ 非托管更符合合规趋势
  ✅ 支持多链（不限于单交易所）

AI Quant Wallet vs Uniswap：
  ✅ 主动量化交易（不是被动做市）
  ✅ 更丰富的策略选择
  ✅ 更低的使用门槛（不需要懂 DeFi）
```

---

## 附：版本历史

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v1.0 | 2026-05-04 | 初始版本，完整 PRD + 架构 + 开发计划 |

---

> **最后提醒：**
> - 这份文档可以直接交给技术团队作为开发蓝本
> - MVP 版本 2 周可完成核心闭环
> - 核心合规原则始终牢记：**非托管 + 不承诺收益 + 工具定位**
> - 任何涉及资金池、代管理、承诺收益的设计，必须立即叫停
