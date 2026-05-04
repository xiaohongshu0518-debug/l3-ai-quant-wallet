import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ethers } from 'ethers';
import * as crypto from 'crypto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  getChallenge(walletAddress: string): string {
    const timestamp = Date.now();
    const nonce = crypto.randomBytes(4).toString('hex');
    return `AI Quant Wallet Login: ${timestamp}:${walletAddress.toLowerCase()}:${nonce}`;
  }

  async validateSignature(
    walletAddress: string,
    signature: string,
    message: string,
  ): Promise<boolean> {
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      return recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
    } catch {
      return false;
    }
  }

  async login(walletAddress: string) {
    const normalizedAddress = walletAddress.toLowerCase();

    let user = await this.userService.findByWallet(normalizedAddress);
    if (!user) {
      user = await this.userService.createUser(normalizedAddress);
    }

    const token = this.jwtService.sign({ walletAddress: normalizedAddress });

    return {
      token,
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        nickname: user.nickname,
        avatar: user.avatar,
        referralCode: user.referralCode,
      },
    };
  }
}
