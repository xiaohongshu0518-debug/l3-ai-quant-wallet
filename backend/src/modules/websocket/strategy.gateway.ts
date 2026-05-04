import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';

@WebSocketGateway({
  namespace: /\/ws\/strategy\/.+/,
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class StrategyGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private userSockets: Map<string, Set<string>> = new Map();

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      // Extract token from URL query
      const token = client.handshake.query.token as string;
      if (!token) {
        client.emit('error', { message: 'Authentication token required' });
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      const walletAddress = payload.walletAddress;

      // Track user sockets
      if (!this.userSockets.has(walletAddress)) {
        this.userSockets.set(walletAddress, new Set());
      }
      this.userSockets.get(walletAddress)!.add(client.id);

      // Extract strategy ID from namespace and verify ownership
      const namespaceParts = client.nsp.name.split('/');
      const userStrategyId = namespaceParts[namespaceParts.length - 1];

      // 关键修复：验证策略所有权
      const user = await this.prisma.user.findUnique({
        where: { walletAddress },
      });
      if (!user) {
        client.emit('error', { message: 'User not found' });
        client.disconnect();
        return;
      }
      const userStrategy = await this.prisma.userStrategy.findUnique({
        where: { id: userStrategyId },
      });
      if (!userStrategy || userStrategy.userId !== user.id) {
        client.emit('error', { message: 'Strategy not found or access denied' });
        client.disconnect();
        return;
      }

      client.join(`strategy:${userStrategyId}`);
      client.emit('connected', {
        message: 'Connected to strategy gateway',
        walletAddress,
        userStrategyId,
      });
    } catch {
      client.emit('error', { message: 'Invalid authentication token' });
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    for (const [walletAddress, sockets] of this.userSockets.entries()) {
      sockets.delete(client.id);
      if (sockets.size === 0) {
        this.userSockets.delete(walletAddress);
      }
    }
  }

  handleSubscribeStrategy(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userStrategyId: string },
  ) {
    client.join(`strategy:${data.userStrategyId}`);
    return { event: 'subscribed', data: { userStrategyId: data.userStrategyId } };
  }

  handleUnsubscribeStrategy(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userStrategyId: string },
  ) {
    client.leave(`strategy:${data.userStrategyId}`);
    return { event: 'unsubscribed', data: { userStrategyId: data.userStrategyId } };
  }

  // Called by services to push PnL updates
  sendPnlUpdate(userStrategyId: string, data: any) {
    this.server
      .to(`strategy:${userStrategyId}`)
      .emit('pnl_update', {
        userStrategyId,
        pnl: data.pnl,
        timestamp: Date.now(),
        ...data,
      });
  }

  // Called by services to push strategy status changes
  sendStrategyStatus(userStrategyId: string, status: string, data?: any) {
    this.server
      .to(`strategy:${userStrategyId}`)
      .emit('strategy_status', {
        userStrategyId,
        status,
        timestamp: Date.now(),
        ...data,
      });
  }
}
