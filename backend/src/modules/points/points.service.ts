import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PointsService {
  constructor(private readonly prisma: PrismaService) {}

  async getBalance(walletAddress: string) {
    const user = await this.prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
      select: { pointsBalance: true, id: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { balance: user.pointsBalance };
  }

  async createPurchaseOrder(
    walletAddress: string,
    amount: number,
    paymentToken: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Create a pending purchase transaction
    return this.prisma.pointTransaction.create({
      data: {
        userId: user.id,
        type: 'PURCHASE',
        amount,
        status: 'PENDING',
        paymentToken,
        description: `Purchase ${amount} points with ${paymentToken}`,
      },
    });
  }

  async confirmPurchase(walletAddress: string, txHash: string) {
    const user = await this.prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Find the purchase transaction matching the specific txHash
    const pendingTx = await this.prisma.pointTransaction.findFirst({
      where: {
        userId: user.id,
        type: 'PURCHASE',
        status: 'PENDING',
        txHash,
      },
    });

    if (!pendingTx) {
      throw new NotFoundException('No pending purchase found for the given transaction hash');
    }

    // Update transaction status and user balance
    await this.prisma.$transaction([
      this.prisma.pointTransaction.update({
        where: { id: pendingTx.id },
        data: {
          status: 'COMPLETED',
          txHash,
        },
      }),
      this.prisma.user.update({
        where: { id: user.id },
        data: {
          pointsBalance: { increment: pendingTx.amount },
        },
      }),
    ]);

    return { success: true, txHash, amount: pendingTx.amount };
  }

  async consumePoints(
    walletAddress: string,
    amount: number,
    strategyId: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.pointsBalance < amount) {
      throw new BadRequestException('Insufficient points balance');
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: user.id },
        data: {
          pointsBalance: { decrement: amount },
        },
      }),
      this.prisma.pointTransaction.create({
        data: {
          userId: user.id,
          type: 'CONSUMPTION',
          amount: -amount,
          status: 'COMPLETED',
          strategyId,
          description: `Consume ${amount} points for strategy ${strategyId}`,
        },
      }),
    ]);

    return { success: true, consumed: amount };
  }

  async getTransactions(
    walletAddress: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      this.prisma.pointTransaction.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.pointTransaction.count({
        where: { userId: user.id },
      }),
    ]);

    return {
      data: transactions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
