import { Injectable, BadRequestException } from '@nestjs/common';
import { BinanceClient } from './binance.client';
import { OkxClient } from './okx.client';

@Injectable()
export class ExchangeService {
  constructor(
    private readonly binanceClient: BinanceClient,
    private readonly okxClient: OkxClient,
  ) {}

  private getClient(exchange: string): BinanceClient | OkxClient {
    switch (exchange.toLowerCase()) {
      case 'binance':
        return this.binanceClient;
      case 'okx':
        return this.okxClient;
      default:
        throw new BadRequestException(`Unsupported exchange: ${exchange}`);
    }
  }

  async verifyApiKey(exchange: string, apiKey: string, apiSecret: string) {
    const client = this.getClient(exchange);
    const permissions = await client.getKeyPermissions(apiKey, apiSecret);

    if (permissions.canWithdraw) {
      throw new BadRequestException(
        'API key should not have withdrawal permission',
      );
    }
    if (!permissions.canTrade) {
      throw new BadRequestException(
        'API key must have trading permission',
      );
    }

    return { valid: true, permissions };
  }

  async executeOrder(
    exchange: string,
    apiKey: string,
    apiSecret: string,
    order: {
      symbol: string;
      side: 'BUY' | 'SELL';
      type: 'MARKET' | 'LIMIT';
      quantity: number;
      price?: number;
    },
  ) {
    const client = this.getClient(exchange);
    return client.createOrder(
      apiKey,
      apiSecret,
      order.symbol,
      order.side,
      order.type,
      order.quantity,
      order.price,
    );
  }

  async getBalance(exchange: string, apiKey: string, apiSecret: string) {
    const client = this.getClient(exchange);
    return client.getAccountInfo(apiKey, apiSecret);
  }
}
