// ============================================================
// Seed Script - 演示数据
// ============================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 开始写入演示数据...');

  // 删除现有数据
  await prisma.pnLSnapshot.deleteMany();
  await prisma.tradeLog.deleteMany();
  await prisma.pointTransaction.deleteMany();
  await prisma.referralRelation.deleteMany();
  await prisma.userStrategy.deleteMany();
  await prisma.userApiKey.deleteMany();
  await prisma.strategy.deleteMany();
  await prisma.user.deleteMany();

  // 创建演示策略
  const gridStrategy = await prisma.strategy.create({
    data: {
      id: 'strat-grid-001',
      name: 'AI 网格交易',
      description: '在价格区间内布置多个买卖挂单，AI 动态调整网格范围，适合震荡行情。',
      type: 'grid',
      riskLevel: 'medium',
      minCapital: 100,
      maxCapital: 100000,
      configSchema: JSON.stringify({
        priceRange: { min: 0, max: 100000 },
        gridCount: { min: 3, max: 50, default: 10 },
        amountPerGrid: { min: 10, default: 100 },
      }),
      isActive: true,
    },
  });

  const trendStrategy = await prisma.strategy.create({
    data: {
      id: 'strat-trend-002',
      name: 'AI 趋势追踪',
      description: '均线交叉 + MACD + RSI 多信号确认，自适应周期选择，适合趋势行情。',
      type: 'trend',
      riskLevel: 'high',
      minCapital: 500,
      maxCapital: 500000,
      configSchema: JSON.stringify({
        fastPeriod: { min: 5, max: 50, default: 12 },
        slowPeriod: { min: 10, max: 200, default: 26 },
        rsiPeriod: { min: 5, max: 30, default: 14 },
      }),
      isActive: true,
    },
  });

  const arbStrategy = await prisma.strategy.create({
    data: {
      id: 'strat-arb-003',
      name: '跨所套利',
      description: '跨交易所价差套利策略，适合波动剧烈行情。（即将上线）',
      type: 'arbitrage',
      riskLevel: 'high',
      minCapital: 1000,
      maxCapital: 1000000,
      isActive: false,
    },
  });

  // 创建两个演示用户
  const userAlice = await prisma.user.create({
    data: {
      id: 'user-alice-001',
      walletAddress: '0x3a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b',
      nickname: 'Alice',
      pointsBalance: 500,
      referralCode: 'ALICE001',
    },
  });

  const userBob = await prisma.user.create({
    data: {
      id: 'user-bob-002',
      walletAddress: '0x8e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f',
      nickname: 'Bob',
      pointsBalance: 1200,
      referralCode: 'BOB0002',
    },
  });

  // Alice 运行一个策略
  const userStrat = await prisma.userStrategy.create({
    data: {
      id: 'us-alice-grid-001',
      userId: userAlice.id,
      strategyId: gridStrategy.id,
      name: 'ETH/USDT 网格',
      status: 'RUNNING',
      config: JSON.stringify({
        amount: 1000,
        tradingPair: 'ETH/USDT',
        stopLoss: 5,
        takeProfit: 15,
        gridCount: 10,
      }),
      startedAt: new Date(Date.now() - 86400000 * 2),
    },
  });

  // Alice 的交易记录
  await prisma.tradeLog.create({
    data: {
      userStrategyId: userStrat.id,
      exchange: 'binance',
      symbol: 'ETH/USDT',
      side: 'BUY',
      type: 'MARKET',
      quantity: 0.05,
      price: 3200,
      fee: 0.8,
      feeCurrency: 'USDT',
      profit: 15.5,
      externalOrderId: 'binance-order-001',
      status: 'FILLED',
      executedAt: new Date(Date.now() - 3600000),
    },
  });

  await prisma.tradeLog.create({
    data: {
      userStrategyId: userStrat.id,
      exchange: 'binance',
      symbol: 'ETH/USDT',
      side: 'SELL',
      type: 'MARKET',
      quantity: 0.05,
      price: 3320,
      fee: 0.83,
      feeCurrency: 'USDT',
      profit: 5.5,
      externalOrderId: 'binance-order-002',
      status: 'FILLED',
      executedAt: new Date(Date.now() - 1800000),
    },
  });

  // PnL 快照
  for (let i = 30; i >= 0; i--) {
    const baseValue = 1000;
    const pnlPercent = Math.sin(i * 0.3) * 5 + Math.random() * 2;
    await prisma.pnLSnapshot.create({
      data: {
        userStrategyId: userStrat.id,
        pnl: baseValue * pnlPercent / 100,
        pnlPercent,
        totalInvested: baseValue,
        currentValue: baseValue * (1 + pnlPercent / 100),
        snapshotAt: new Date(Date.now() - i * 3600000 * 24),
      },
    });
  }

  // Alice 点卡交易记录
  await prisma.pointTransaction.create({
    data: {
      userId: userAlice.id,
      type: 'PURCHASE',
      amount: 1000,
      status: 'COMPLETED',
      description: '购买点卡 - 标准包',
    },
  });

  await prisma.pointTransaction.create({
    data: {
      userId: userAlice.id,
      type: 'CONSUMPTION',
      amount: -500,
      status: 'COMPLETED',
      strategyId: userStrat.id,
      description: '运行策略消耗 - ETH/USDT 网格',
    },
  });

  console.log('✅ 演示数据写入完成！');
  console.log(`   - 策略: ${await prisma.strategy.count()} 个`);
  console.log(`   - 用户: ${await prisma.user.count()} 个`);
  console.log(`   - 运行中策略: ${await prisma.userStrategy.count()} 个`);
  console.log(`   - 交易记录: ${await prisma.tradeLog.count()} 条`);
  console.log(`   - PnL 快照: ${await prisma.pnLSnapshot.count()} 条`);
  console.log(`   - 点卡交易: ${await prisma.pointTransaction.count()} 条`);
}

main()
  .catch((e) => {
    console.error('❌ 种子数据写入失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
