import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface KeyPermissions {
  canTrade: boolean;
  canWithdraw: boolean;
}

@Injectable()
export class BinanceClient {
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('exchange.binance.baseUrl') || 'https://api.binance.com';
  }

  async getKeyPermissions(apiKey: string, _apiSecret: string): Promise<KeyPermissions> {
    // In production, call Binance API: GET /sapi/v1/account/apiRestrictions
    // For MVP, return mock data
    return {
      canTrade: true,
      canWithdraw: false,
    };
  }

  async createOrder(
    apiKey: string,
    apiSecret: string,
    symbol: string,
    side: string,
    type: string,
    quantity: number,
    price?: number,
  ): Promise<any> {
    // In production, call Binance API: POST /api/v3/order
    // For MVP, return mock response
    return {
      orderId: `binance-${Date.now()}`,
      symbol,
      side,
      type,
      quantity,
      price: price || 0,
      status: 'FILLED',
      executedQty: quantity,
      cummulativeQuoteQty: quantity * (price || 50000),
      transactTime: Date.now(),
    };
  }

  async getAccountInfo(apiKey: string, apiSecret: string): Promise<any> {
    // In production, call Binance API: GET /api/v3/account
    // For MVP, return mock data
    return {
      makerCommission: 10,
      takerCommission: 10,
      buyerCommission: 0,
      sellerCommission: 0,
      canTrade: true,
      canWithdraw: false,
      canDeposit: true,
      balances: [
        { asset: 'BTC', free: '0.1', locked: '0.05' },
        { asset: 'ETH', free: '2.5', locked: '0.5' },
        { asset: 'USDT', free: '10000', locked: '2000' },
      ],
    };
  }

  async getKlines(
    apiKey: string,
    apiSecret: string,
    symbol: string,
    interval: string,
    limit: number,
  ): Promise<any[]> {
    // In production, call Binance API: GET /api/v3/klines
    // For MVP, return mock data
    const now = Date.now();
    return Array.from({ length: limit }, (_, i) => ({
      openTime: now - (limit - i) * 60000,
      open: 50000 + Math.random() * 100,
      high: 50100 + Math.random() * 100,
      low: 49900 + Math.random() * 100,
      close: 50000 + Math.random() * 100,
      volume: Math.random() * 1000,
      closeTime: now - (limit - i - 1) * 60000,
    }));
  }
}
