// ============================================================
// Strategy Detail - 策略详情页
// ============================================================

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/services/api';
import { STRATEGY_TYPES, RISK_LEVELS, ROUTES } from '@/utils/constants';
import { ArrowLeft, BarChart3, Play } from 'lucide-react';

export default function StrategyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [strategy, setStrategy] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await api.getStrategyDetail(params.id as string);
        setStrategy(result);
      } catch (err) {
        console.error('加载策略详情失败:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (!strategy) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">策略未找到</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push(ROUTES.strategies)}>
          返回策略市场
        </Button>
      </div>
    );
  }

  const typeInfo = STRATEGY_TYPES[strategy.type as keyof typeof STRATEGY_TYPES];
  const riskInfo = RISK_LEVELS[strategy.riskLevel as keyof typeof RISK_LEVELS];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back */}
      <button
        onClick={() => router.push(ROUTES.strategies)}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> 返回策略市场
      </button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{strategy.name}</h1>
          <p className="text-muted-foreground mt-1">{typeInfo?.description}</p>
          <div className="flex gap-2 mt-3">
            <Badge variant="outline" className={riskInfo?.color}>{riskInfo?.label}</Badge>
            <Badge variant="outline">最低 {strategy.minInvestment || 100} USDT</Badge>
            <Badge variant="outline">{strategy.pointsPerHour || 10} 点/小时</Badge>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
          <Play className="h-4 w-4 mr-1" /> 启动策略
        </Button>
      </div>

      {/* Backtest Data */}
      {strategy.backtestData && (
        <Card className="p-6 border-muted">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-purple-400" /> 回测数据
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-green-500">
                +{strategy.backtestData.totalReturn}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">总收益率</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-red-500">
                {strategy.backtestData.maxDrawdown}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">最大回撤</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold">{strategy.backtestData.sharpeRatio}</p>
              <p className="text-xs text-muted-foreground mt-1">夏普比率</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold">{strategy.backtestData.winRate}%</p>
              <p className="text-xs text-muted-foreground mt-1">胜率</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            回测周期: {strategy.backtestData.period} | 总交易次数: {strategy.backtestData.totalTrades}
          </p>
        </Card>
      )}

      {/* Run Config */}
      <Card className="p-6 border-muted">
        <h2 className="font-semibold mb-4">运行配置</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">交易对</label>
            <Select defaultValue="ETH/USDT">
              <SelectTrigger>
                <SelectValue placeholder="选择交易对" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ETH/USDT">ETH/USDT</SelectItem>
                <SelectItem value="BTC/USDT">BTC/USDT</SelectItem>
                <SelectItem value="BNB/USDT">BNB/USDT</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">投入金额 (USDT)</label>
            <Input type="number" placeholder="1000" defaultValue={1000} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">止损比例 (%)</label>
            <Input type="number" placeholder="5" defaultValue={5} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">止盈比例 (%)</label>
            <Input type="number" placeholder="15" defaultValue={15} />
          </div>
        </div>

        {/* Risk Statement */}
        <div className="mt-4 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20 text-xs text-muted-foreground">
          ⚠️ 风险声明：本平台仅提供策略执行工具，不构成投资建议。历史回测不代表未来表现，请理性参与。
        </div>
      </Card>
    </div>
  );
}
