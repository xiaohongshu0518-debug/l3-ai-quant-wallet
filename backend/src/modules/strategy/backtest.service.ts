import { Injectable } from '@nestjs/common';

@Injectable()
export class BacktestService {
  async getBacktestData(strategyId: string) {
    // MVP stage: return mock data
    return {
      strategyId,
      totalReturn: 15.32,
      annualizedReturn: 22.5,
      sharpeRatio: 1.85,
      maxDrawdown: -8.12,
      winRate: 62.5,
      totalTrades: 128,
      profitTrades: 80,
      lossTrades: 48,
      startDate: '2025-01-01',
      endDate: '2025-03-31',
      monthlyReturns: [
        { month: '2025-01', return: 5.2 },
        { month: '2025-02', return: -2.1 },
        { month: '2025-03', return: 11.7 },
      ],
      equityCurve: Array.from({ length: 90 }, (_, i) => ({
        day: i + 1,
        value: 10000 * (1 + (i / 90) * 0.15 + Math.sin(i / 10) * 0.02),
      })),
    };
  }
}
