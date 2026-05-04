import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { StrategyService } from './strategy.service';
import { WalletAuthGuard } from '../auth/wallet-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

// 公开策略路由（无需认证）
@Controller('strategies')
export class PublicStrategyController {
  constructor(private readonly strategyService: StrategyService) {}

  @Get()
  async getStrategies(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const result = await this.strategyService.getStrategies(Number(page), Number(limit));
    return { strategies: result.data, total: result.meta.total };
  }

  @Get(':id')
  async getStrategyDetail(@Param('id') id: string) {
    const detail = await this.strategyService.getStrategyDetail(id);
    if (!detail) {
      throw new NotFoundException('Strategy not found');
    }
    // 添加模拟回测数据
    return {
      ...detail,
      backtestData: {
        totalReturn: 15.3,
        maxDrawdown: -8.2,
        sharpeRatio: 1.8,
        winRate: 62.5,
        totalTrades: 240,
        period: '2024-01-01 ~ 2024-12-31',
        monthlyReturns: [1.2, -0.5, 2.1, 1.8, -1.2, 3.5, 2.0, -2.1, 1.5, 2.8, 1.0, -0.8],
      },
    };
  }
}

// 用户策略路由（需 JWT 认证）
@Controller('strategy')
export class StrategyController {
  constructor(private readonly strategyService: StrategyService) {}

  @Post('start')
  @UseGuards(WalletAuthGuard)
  async startStrategy(
    @CurrentUser() user: { walletAddress: string },
    @Body() data: { strategyId: string; name?: string; config?: any },
  ) {
    return this.strategyService.startStrategy(user.walletAddress, data);
  }

  @Post('stop')
  @UseGuards(WalletAuthGuard)
  async stopStrategy(
    @CurrentUser() user: { walletAddress: string },
    @Body('userStrategyId') userStrategyId: string,
  ) {
    return this.strategyService.stopStrategy(user.walletAddress, userStrategyId);
  }
}

// 用户策略列表路由
@Controller('user')
export class UserStrategyController {
  constructor(private readonly strategyService: StrategyService) {}

  @Get('strategies')
  @UseGuards(WalletAuthGuard)
  async getUserStrategies(@CurrentUser() user: { walletAddress: string }) {
    const strategies = await this.strategyService.getUserStrategies(user.walletAddress);
    return { strategies };
  }
}
