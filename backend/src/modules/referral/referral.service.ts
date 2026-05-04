import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReferralService {
  constructor(private readonly prisma: PrismaService) {}

  async generateCode(walletAddress: string) {
    const user = await this.prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      referralCode: user.referralCode,
      referralLink: `https://app.aiquantwallet.com/register?ref=${user.referralCode}`,
    };
  }

  async getRecords(walletAddress: string) {
    const user = await this.prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const relations = await this.prisma.referralRelation.findMany({
      where: { referrerId: user.id },
      include: {
        referee: {
          select: {
            id: true,
            walletAddress: true,
            nickname: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      totalReferrals: relations.length,
      records: relations.map((r) => ({
        id: r.id,
        referee: r.referee,
        createdAt: r.createdAt,
        reward: r.reward,
      })),
    };
  }

  async claimReferral(referralCode: string, newUserWalletAddress: string) {
    const referrer = await this.prisma.user.findUnique({
      where: { referralCode },
    });

    if (!referrer) {
      throw new NotFoundException('Invalid referral code');
    }

    const newUser = await this.prisma.user.findUnique({
      where: { walletAddress: newUserWalletAddress.toLowerCase() },
    });

    if (!newUser) {
      throw new NotFoundException('User not found');
    }

    if (referrer.id === newUser.id) {
      throw new BadRequestException('Cannot refer yourself');
    }

    // Check if already claimed
    const existing = await this.prisma.referralRelation.findFirst({
      where: { refereeId: newUser.id },
    });

    if (existing) {
      throw new BadRequestException('Referral already claimed');
    }

    const relation = await this.prisma.referralRelation.create({
      data: {
        referrerId: referrer.id,
        refereeId: newUser.id,
        reward: 100, // Default reward points
      },
    });

    // Give reward points to referrer
    await this.prisma.user.update({
      where: { id: referrer.id },
      data: {
        pointsBalance: { increment: relation.reward },
      },
    });

    return {
      success: true,
      reward: relation.reward,
      message: `Referral claimed successfully! You earned ${relation.reward} points.`,
    };
  }
}
