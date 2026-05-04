import { Module } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { BinanceClient } from './binance.client';
import { OkxClient } from './okx.client';

@Module({
  providers: [ExchangeService, BinanceClient, OkxClient],
  exports: [ExchangeService],
})
export class ExchangeModule {}
