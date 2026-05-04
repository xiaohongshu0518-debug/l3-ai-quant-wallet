import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { StrategyGateway } from './strategy.gateway';

@Module({
  imports: [JwtModule.register({ secret: 'fallback-secret' })],
  providers: [StrategyGateway],
})
export class WebSocketModule {}
