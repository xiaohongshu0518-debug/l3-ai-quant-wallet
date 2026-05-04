import { Injectable, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findByWallet(walletAddress: string) {
    return this.prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
    });
  }

  async createUser(walletAddress: string) {
    const normalizedAddress = walletAddress.toLowerCase();
    let referralCode: string;
    let isUnique = false;

    while (!isUnique) {
      referralCode = crypto.randomBytes(4).toString('hex').toUpperCase();
      const existing = await this.findByReferralCode(referralCode);
      if (!existing) {
        isUnique = true;
      }
    }

    return this.prisma.user.create({
      data: {
        walletAddress: normalizedAddress,
        referralCode: referralCode!,
      },
    });
  }

  async findByReferralCode(code: string) {
    return this.prisma.user.findUnique({
      where: { referralCode: code },
    });
  }

  async updateProfile(
    userId: string,
    data: { nickname?: string; avatar?: string },
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.nickname !== undefined && { nickname: data.nickname }),
        ...(data.avatar !== undefined && { avatar: data.avatar }),
      },
      select: {
        id: true,
        walletAddress: true,
        nickname: true,
        avatar: true,
        referralCode: true,
        createdAt: true,
      },
    });
  }

  async getProfile(walletAddress: string) {
    const normalizedAddress = walletAddress.toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { walletAddress: normalizedAddress },
      select: {
        id: true,
        walletAddress: true,
        nickname: true,
        avatar: true,
        referralCode: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
