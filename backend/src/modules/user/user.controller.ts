import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { WalletAuthGuard } from '../auth/wallet-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('user')
@UseGuards(WalletAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: { walletAddress: string }) {
    return this.userService.getProfile(user.walletAddress);
  }

  @Patch('profile')
  async updateProfile(
    @CurrentUser() user: { walletAddress: string },
    @Body() data: { nickname?: string; avatar?: string },
  ) {
    const profile = await this.userService.getProfile(user.walletAddress);
    return this.userService.updateProfile(profile.id, data);
  }
}
