// ============================================================
// Dashboard - 用户主面板（真实 API 版）
// ============================================================

'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/services/api';
import { useAuthContext } from '@/contexts/AuthContext';
import type { UserStrategy } from '@/types';
import {
  TrendingUp,
  LineChart,
  StopCircle,
  PlayCircle,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthContext();
  const [strategies, setStrategies] = useState<UserStrategy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stoppingId, setStoppingId] = useState<string | null>(null);

  const loadStrategies = useCallback(async () => {
    try {
      const result = await api.getUserStrategies();
      setStrategies(result.strategies || []);
    } catch (err) {
      console.error('加载策略失败:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStrategies();
  }, [loadStrategies]);

  // 计算总收益
  const totalPnl = strategies.reduce((sum, s) => sum + (s.totalPnl || 0), 0);
  const runningStrategies = strategies.filter((s) => s.status === 'RUNNING');

  const handleStop = async (userStrategyId: string) => {
    setStoppingId(userStrategyId);
    try {
      await api.stopStrategy(userStrategyId);
      await loadStrategies();
    } catch (err: any) {
      alert(err.message || '停止策略失败');
    } finally {
      setStoppingId(null);
    }
  };

  const statsCards = [
    {
      title: '总收益',
      value: totalPnl >= 0 ? `+$${totalPnl.toFixed(2)}` : `-$${Math.abs(totalPnl).toFixed(2)}`,
      change: `${strategies.length} 个策略`,
      trend: totalPnl >= 0 ? 'up' as const : 'neutral' as const,
      icon: TrendingUp,
    },
    {
      title: '进行中策略',
      value: String(runningStrategies.length),
      change: `${strategies.length} 个总策略`,
      trend: 'neutral' as const,
      icon: LineChart,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">欢迎回来</h1>
        <p className="text-muted-foreground text-sm">
          {user?.walletAddress?.slice(0, 6)}...{user?.walletAddress?.slice(-4)}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6 border-muted">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className={`text-2xl font-bold mt-1 ${totalPnl >= 0 ? '' : 'text-red-500'}`}>
                    {stat.value}
                  </p>
                  <p className="text-sm mt-1 flex items-center gap-1 text-muted-foreground">
                    {stat.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                    {stat.change}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-purple-400" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Active Strategies */}
      <div>
        <h2 className="text-lg font-semibold mb-4">我的策略</h2>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        ) : strategies.length === 0 ? (
          <Card className="p-8 text-center border-dashed">
            <LineChart className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground mb-1">暂无策略</p>
            <p className="text-sm text-muted-foreground/70 mb-4">
              前往策略市场选择一个 AI 策略开始交易
            </p>
            <Link href="/strategies">
              <Button variant="outline">浏览策略</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {strategies.map((strategy) => {
              const isRunning = strategy.status === 'RUNNING';
              const isStopping = stoppingId === strategy.id;
              return (
                <Card key={strategy.id} className="p-5 border-muted">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{strategy.name}</h3>
                        <Badge
                          variant={isRunning ? 'default' : 'secondary'}
                          className={`text-[10px] ${isRunning ? 'bg-green-500/10 text-green-500 border-green-500/20' : ''}`}
                        >
                          {isRunning ? '运行中' : strategy.status === 'STOPPED' ? '已停止' : strategy.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {strategy.config
                          ? (() => { try { const c = JSON.parse(strategy.config); return c.tradingPair || 'ETH/USDT'; } catch { return 'ETH/USDT'; } })()
                          : 'ETH/USDT'}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-muted-foreground">
                          已运行: {strategy.startedAt
                            ? Math.floor((Date.now() - new Date(strategy.startedAt).getTime()) / 3600000) + 'h'
                            : '刚启动'}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isStopping || !isRunning}
                      onClick={() => isRunning && handleStop(strategy.id)}
                      className={isRunning ? 'text-destructive hover:text-destructive' : ''}
                    >
                      {isStopping ? (
                        <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> 停止中</>
                      ) : isRunning ? (
                        <><StopCircle className="h-4 w-4 mr-1" /> 停止</>
                      ) : (
                        <><PlayCircle className="h-4 w-4 mr-1 text-muted-foreground" /> 已停止</>
                      )}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Risk Notice */}
      <Card className="p-4 border-yellow-500/20 bg-yellow-500/5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">风险提示</p>
            <p>加密货币交易存在高风险。本平台仅提供策略执行工具，不构成投资建议。请理性参与，风险自担。</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
