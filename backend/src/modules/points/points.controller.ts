import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PointsService } from './points.service';
import { WalletAuthGuard } from '../auth/wallet-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('points')
@UseGuards(WalletAuthGuard)
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Get('balance')
  async getBalance(@CurrentUser() user: { walletAddress: string }) {
    return this.pointsService.getBalance(user.walletAddress);
  }

  @Post('purchase')
  async createPurchaseOrder(
    @CurrentUser() user: { walletAddress: string },
    @Body('amount') amount: number,
    @Body('paymentToken') paymentToken: string,
  ) {
    return this.pointsService.createPurchaseOrder(
      user.walletAddress,
      amount,
      paymentToken,
    );
  }

  @Post('purchase/confirm')
  async confirmPurchase(
    @CurrentUser() user: { walletAddress: string },
    @Body('txHash') txHash: string,
  ) {
    return this.pointsService.confirmPurchase(user.walletAddress, txHash);
  }

  @Get('transactions')
  async getTransactions(
    @CurrentUser() user: { walletAddress: string },
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.pointsService.getTransactions(
      user.walletAddress,
      Number(page),
      Number(limit),
    );
  }
}
