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

@Controller('strategy')
export class StrategyController {
  constructor(private readonly strategyService: StrategyService) {}

  @Get('strategies')
  async getStrategies(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.strategyService.getStrategies(Number(page), Number(limit));
  }

  @Get('strategies/:id')
  async getStrategyDetail(@Param('id') id: string) {
    const detail = await this.strategyService.getStrategyDetail(id);
    if (!detail) {
      throw new NotFoundException('Strategy not found');
    }
    return detail;
  }

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
    return this.strategyService.stopStrategy(userStrategyId);
  }

  @Get('user/strategies')
  @UseGuards(WalletAuthGuard)
  async getUserStrategies(@CurrentUser() user: { walletAddress: string }) {
    return this.strategyService.getUserStrategies(user.walletAddress);
  }
}
