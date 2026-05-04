import { Module } from '@nestjs/common';
import { StrategyController } from './strategy.controller';
import { StrategyService } from './strategy.service';
import { BacktestService } from './backtest.service';

@Module({
  controllers: [StrategyController],
  providers: [StrategyService, BacktestService],
})
export class StrategyModule {}
