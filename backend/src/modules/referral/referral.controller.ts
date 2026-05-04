import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ReferralService } from './referral.service';
import { WalletAuthGuard } from '../auth/wallet-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('referral')
@UseGuards(WalletAuthGuard)
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Post('generate')
  async generateReferralLink(@CurrentUser() user: { walletAddress: string }) {
    return this.referralService.generateCode(user.walletAddress);
  }

  @Get('records')
  async getReferralRecords(@CurrentUser() user: { walletAddress: string }) {
    return this.referralService.getRecords(user.walletAddress);
  }

  @Post('claim')
  async claimReferral(
    @CurrentUser() user: { walletAddress: string },
    @Body('referralCode') referralCode: string,
  ) {
    return this.referralService.claimReferral(referralCode, user.walletAddress);
  }
}
