import {
  Controller,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('challenge')
  @HttpCode(HttpStatus.OK)
  getChallenge(@Query('wallet') walletAddress: string) {
    if (!walletAddress) {
      throw new UnauthorizedException('wallet address is required');
    }
    const message = this.authService.getChallenge(walletAddress);
    return {
      message,
      walletAddress,
    };
  }

  @Post('wallet-login')
  @HttpCode(HttpStatus.OK)
  async walletLogin(
    @Body('walletAddress') walletAddress: string,
    @Body('signature') signature: string,
    @Body('message') message: string,
  ) {
    if (!walletAddress || !signature || !message) {
      throw new UnauthorizedException(
        'walletAddress, signature, and message are required',
      );
    }

    const isValid = await this.authService.validateSignature(
      walletAddress,
      signature,
      message,
    );
    if (!isValid) {
      throw new UnauthorizedException('Invalid signature');
    }

    return this.authService.login(walletAddress);
  }
}
