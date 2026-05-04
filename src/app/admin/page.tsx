'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/contexts/AuthContext';
import { Shield, Users, LineChart, AlertTriangle, Settings, Activity } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthContext();

  // 权限校验：未登录→登录页，非管理员→Dashboard
  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user && user.level < 5) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">验证权限中...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">正在跳转到登录页...</p>
      </div>
    );
  }

  if (!user || user.level < 5) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">正在跳转到仪表盘...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">管理后台</h1>
          <p className="text-muted-foreground text-sm mt-1">平台管理与监控（管理员专用）</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4 border-muted">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-purple-400" />
            <div>
              <p className="text-2xl font-bold">128</p>
              <p className="text-xs text-muted-foreground">总用户</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-muted">
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-muted-foreground">运行中策略</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-muted">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-muted-foreground">异常策略</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-muted">
          <div className="flex items-center gap-3">
            <LineChart className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">$45.2K</p>
              <p className="text-xs text-muted-foreground">总交易量</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 border-muted">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Settings className="h-4 w-4 text-purple-400" /> 快捷操作
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm">管理策略</Button>
          <Button variant="outline" size="sm">用户管理</Button>
          <Button variant="outline" size="sm">系统监控</Button>
          <Button variant="outline" size="sm">查看日志</Button>
          <Button variant="destructive" size="sm">紧急暂停所有策略</Button>
        </div>
      </Card>

      <Card className="p-6 border-muted">
        <h2 className="font-semibold mb-4">最近活动</h2>
        <div className="space-y-2 text-sm">
          {[
            { time: '10 分钟前', event: '用户 0x3a1b...2c9d 启动了 AI 网格策略' },
            { time: '30 分钟前', event: '用户 0x8e4f...1a3b 购买了 500 点卡' },
            { time: '1 小时前', event: 'Binance API 连接恢复正常' },
            { time: '2 小时前', event: '止损触发: ETH/USDT 策略自动停止' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 py-1">
              <span className="text-muted-foreground shrink-0">{item.time}</span>
              <span className="text-muted-foreground">·</span>
              <span>{item.event}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4 border-yellow-500/20 bg-yellow-500/5">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium mb-1">风控状态: 正常</p>
            <p className="text-muted-foreground">所有系统运行正常，无异常策略触发。</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
