import { Module, forwardRef } from '@nestjs/common';
import { PublicStrategyController, StrategyController, UserStrategyController } from './strategy.controller';
import { StrategyService } from './strategy.service';
import { BacktestService } from './backtest.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [PublicStrategyController, StrategyController, UserStrategyController],
  providers: [StrategyService, BacktestService],
})
export class StrategyModule {}
