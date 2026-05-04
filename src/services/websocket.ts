// ============================================================
// WebSocket 服务封装
// ============================================================

import { WS_BASE_URL } from '@/utils/constants';
import type { WSMessage } from '@/types';

type MessageHandler = (message: WSMessage) => void;
type StatusHandler = (status: 'connected' | 'disconnected' | 'error') => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string;
  private messageHandlers: Map<string, MessageHandler[]> = new Map();
  private statusHandlers: StatusHandler[] = [];
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private maxReconnectAttempts = 5;
  private reconnectAttempts = 0;

  constructor() {
    this.url = WS_BASE_URL;
  }

  connect(strategyId: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.ws = new WebSocket(`${this.url}/ws/strategy/${strategyId}`);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.notifyStatus('connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WSMessage = JSON.parse(event.data);
        this.notifyHandlers(message.type, message);
      } catch (e) {
        console.error('WebSocket 消息解析失败:', e);
      }
    };

    this.ws.onclose = () => {
      this.notifyStatus('disconnected');
      this.attemptReconnect(strategyId);
    };

    this.ws.onerror = () => {
      this.notifyStatus('error');
    };
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.reconnectAttempts = this.maxReconnectAttempts; // 阻止重连
    this.ws?.close();
    this.ws = null;
  }

  onMessage(type: string, handler: MessageHandler) {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, []);
    }
    this.messageHandlers.get(type)!.push(handler);

    return () => {
      const handlers = this.messageHandlers.get(type);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) handlers.splice(index, 1);
      }
    };
  }

  onStatusChange(handler: StatusHandler) {
    this.statusHandlers.push(handler);
    return () => {
      const index = this.statusHandlers.indexOf(handler);
      if (index > -1) this.statusHandlers.splice(index, 1);
    };
  }

  private notifyHandlers(type: string, message: WSMessage) {
    const handlers = this.messageHandlers.get(type);
    handlers?.forEach((handler) => handler(message));
  }

  private notifyStatus(status: 'connected' | 'disconnected' | 'error') {
    this.statusHandlers.forEach((handler) => handler(status));
  }

  private attemptReconnect(strategyId: string) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) return;
    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    this.reconnectTimer = setTimeout(() => this.connect(strategyId), delay);
  }
}

export const wsService = new WebSocketService();
