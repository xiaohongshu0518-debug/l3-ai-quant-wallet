import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface KeyPermissions {
  canTrade: boolean;
  canWithdraw: boolean;
}

@Injectable()
export class OkxClient {
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('exchange.okx.baseUrl') || 'https://www.okx.com';
  }

  async getKeyPermissions(apiKey: string, _apiSecret: string): Promise<KeyPermissions> {
    // In production, call OKX API to check permissions
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
    // In production, call OKX API: POST /api/v5/trade/order
    // For MVP, return mock response
    return {
      orderId: `okx-${Date.now()}`,
      symbol,
      side,
      type,
      quantity,
      price: price || 0,
      status: 'FILLED',
      fillSz: String(quantity),
      fillPnl: '0',
      fillTime: String(Date.now()),
    };
  }

  async getAccountInfo(apiKey: string, apiSecret: string): Promise<any> {
    // In production, call OKX API: GET /api/v5/account/balance
    // For MVP, return mock data
    return {
      totalEq: '50000',
      details: [
        { ccy: 'BTC', eq: '5000', availBal: '3000', frozenBal: '2000' },
        { ccy: 'ETH', eq: '8000', availBal: '6000', frozenBal: '2000' },
        { ccy: 'USDT', eq: '37000', availBal: '30000', frozenBal: '7000' },
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
    // In production, call OKX API: GET /api/v5/market/candles
    // For MVP, return mock data
    const now = Date.now();
    return Array.from({ length: limit }, (_, i) => ({
      ts: String(now - (limit - i) * 60000),
      o: '50000',
      h: '50100',
      l: '49900',
      c: '50050',
      vol: '1000',
    }));
  }
}
