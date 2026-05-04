// ============================================================
// Dashboard - 用户主面板
// ============================================================

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/services/api';
import { useAuthContext } from '@/contexts/AuthContext';
import {
  TrendingUp,
  Wallet,
  LineChart,
  StopCircle,
  PlayCircle,
  AlertTriangle,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthContext();
  const [activeStrategies, setActiveStrategies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await api.getUserStrategies();
        setActiveStrategies(result.strategies || []);
      } catch (err) {
        console.error('加载策略失败:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const statsCards = [
    {
      title: '总资产',
      value: '$12,345.00',
      change: '+11.1%',
      trend: 'up' as const,
      icon: Wallet,
    },
    {
      title: '总收益',
      value: '+$1,234.56',
      change: '+11.1%',
      trend: 'up' as const,
      icon: TrendingUp,
    },
    {
      title: '进行中策略',
      value: String(activeStrategies.filter((s: any) => s.status === 'running').length),
      change: `${activeStrategies.length} 个总策略`,
      trend: 'neutral' as const,
      icon: LineChart,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">
          欢迎回来
        </h1>
        <p className="text-muted-foreground text-sm">
          {user?.walletAddress?.slice(0, 6)}...{user?.walletAddress?.slice(-4)}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6 border-muted">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 flex items-center gap-1 ${
                    stat.trend === 'up' ? 'text-green-500' : 'text-muted-foreground'
                  }`}>
                    {stat.trend === 'up' && <TrendingUp className="h-3 w-3" />}
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
        <h2 className="text-lg font-semibold mb-4">进行中的策略</h2>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        ) : activeStrategies.length === 0 ? (
          <Card className="p-8 text-center border-dashed">
            <LineChart className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground mb-1">暂无运行中的策略</p>
            <p className="text-sm text-muted-foreground/70 mb-4">
              前往策略市场选择一个 AI 策略开始交易
            </p>
            <Link href="/strategies">
              <Button variant="outline">浏览策略</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {activeStrategies.map((strategy: any) => (
              <Card key={strategy.id} className="p-5 border-muted">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{strategy.strategy?.name || '策略'}</h3>
                      <Badge variant={strategy.status === 'running' ? 'default' : 'secondary'} className="text-[10px]">
                        {strategy.status === 'running' ? '运行中' : strategy.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {strategy.parameters?.tradingPair || 'ETH/USDT'}
                      {' | '}
                      {strategy.mode === 'exchange' ? '交易所模式' : '链上模式'}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className={strategy.totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                        收益: {strategy.totalPnl >= 0 ? '+' : ''}{strategy.totalPnl?.toFixed(2) || '0.00'} USDT
                      </span>
                      <span className="text-muted-foreground">
                        已运行: {strategy.startedAt ? Math.floor((Date.now() - new Date(strategy.startedAt).getTime()) / 3600000) + 'h' : '刚启动'}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={strategy.status === 'running' ? 'text-destructive hover:text-destructive' : ''}
                  >
                    {strategy.status === 'running' ? (
                      <><StopCircle className="h-4 w-4 mr-1" /> 停止</>
                    ) : (
                      <><PlayCircle className="h-4 w-4 mr-1" /> 启动</>
                    )}
                  </Button>
                </div>
              </Card>
            ))}
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
