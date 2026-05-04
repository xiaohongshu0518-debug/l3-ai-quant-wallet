import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { StrategyModule } from './modules/strategy/strategy.module';
import { ExchangeModule } from './modules/exchange/exchange.module';
import { ChainModule } from './modules/chain/chain.module';
import { PointsModule } from './modules/points/points.module';
import { ReferralModule } from './modules/referral/referral.module';
import { WebSocketModule } from './modules/websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    StrategyModule,
    ExchangeModule,
    ChainModule,
    PointsModule,
    ReferralModule,
    WebSocketModule,
  ],
})
export class AppModule {}
