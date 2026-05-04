import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BacktestService } from './backtest.service';

@Injectable()
export class StrategyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly backtestService: BacktestService,
  ) {}

  async getStrategies(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [strategies, total] = await Promise.all([
      this.prisma.strategy.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.strategy.count(),
    ]);

    return {
      data: strategies,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getStrategyDetail(id: string) {
    const strategy = await this.prisma.strategy.findUnique({
      where: { id },
    });

    if (!strategy) {
      return null;
    }

    const backtestData = await this.backtestService.getBacktestData(id);

    return {
      ...strategy,
      backtest: backtestData,
    };
  }

  async startStrategy(walletAddress: string, data: { strategyId: string; name?: string; config?: any }) {
    const user = await this.prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const strategy = await this.prisma.strategy.findUnique({
      where: { id: data.strategyId },
    });

    if (!strategy) {
      throw new NotFoundException('Strategy not found');
    }

    // Check for duplicate running strategy of the same type
    const existing = await this.prisma.userStrategy.findFirst({
      where: {
        userId: user.id,
        strategyId: data.strategyId,
        status: 'RUNNING',
      },
    });

    if (existing) {
      throw new ConflictException('This strategy is already running for the user');
    }

    return this.prisma.userStrategy.create({
      data: {
        userId: user.id,
        strategyId: data.strategyId,
        name: data.name || strategy.name,
        status: 'RUNNING',
        config: data.config ? JSON.stringify(data.config) : '{}',
      },
    });
  }

  async stopStrategy(walletAddress: string, userStrategyId: string) {
    const user = await this.prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userStrategy = await this.prisma.userStrategy.findUnique({
      where: { id: userStrategyId },
    });

    if (!userStrategy) {
      throw new NotFoundException('User strategy not found');
    }

    if (userStrategy.userId !== user.id) {
      throw new ForbiddenException('You do not own this strategy');
    }

    return this.prisma.userStrategy.update({
      where: { id: userStrategyId },
      data: { status: 'STOPPED' },
    });
  }

  async getUserStrategies(walletAddress: string) {
    const user = await this.prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.userStrategy.findMany({
      where: { userId: user.id },
      include: {
        strategy: true,
        tradeLogs: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
