// ============================================================
// useWebSocket - WebSocket Hook
// ============================================================

'use client';

import { useEffect, useState, useCallback } from 'react';
import { wsService } from '@/services/websocket';
import type { PnLUpdateMessage, StrategyStatusMessage } from '@/types';

type ConnectionStatus = 'connected' | 'disconnected' | 'error';

export function useWebSocket(strategyId: string | null) {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [pnlUpdate, setPnlUpdate] = useState<PnLUpdateMessage['data'] | null>(null);
  const [statusUpdate, setStatusUpdate] = useState<StrategyStatusMessage['data'] | null>(null);

  useEffect(() => {
    if (!strategyId) return;

    // 连接
    wsService.connect(strategyId);

    // 监听状态变化
    const unsubStatus = wsService.onStatusChange(setConnectionStatus);

    // 监听 PnL 更新
    const unsubPnl = wsService.onMessage('pnl_update', (msg) => {
      if (msg.type === 'pnl_update') {
        setPnlUpdate(msg.data);
      }
    });

    // 监听策略状态更新
    const unsubStatusMsg = wsService.onMessage('strategy_status', (msg) => {
      if (msg.type === 'strategy_status') {
        setStatusUpdate(msg.data);
      }
    });

    return () => {
      unsubStatus();
      unsubPnl();
      unsubStatusMsg();
      // 不要断开连接，可能还有 others 在监听
    };
  }, [strategyId]);

  return {
    connectionStatus,
    pnlUpdate,
    statusUpdate,
  };
}
