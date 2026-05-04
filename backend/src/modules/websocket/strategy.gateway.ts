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
import { UnauthorizedException } from '@nestjs/common';

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

  constructor(private readonly jwtService: JwtService) {}

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

      // Join room based on user strategy
      const namespaceParts = client.nsp.name.split('/');
      const userStrategyId = namespaceParts[namespaceParts.length - 1];
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
    // Clean up user socket tracking
    for (const [walletAddress, sockets] of this.userSockets.entries()) {
      sockets.delete(client.id);
      if (sockets.size === 0) {
        this.userSockets.delete(walletAddress);
      }
    }
  }

  @SubscribeMessage('subscribe_strategy')
  handleSubscribeStrategy(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userStrategyId: string },
  ) {
    client.join(`strategy:${data.userStrategyId}`);
    return { event: 'subscribed', data: { userStrategyId: data.userStrategyId } };
  }

  @SubscribeMessage('unsubscribe_strategy')
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
