import { Module } from '@nestjs/common';
import { StrategyGateway } from './strategy.gateway';

@Module({
  providers: [StrategyGateway],
})
export class WebSocketModule {}
