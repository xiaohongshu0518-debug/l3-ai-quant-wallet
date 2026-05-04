// ============================================================
// Strategies Page - 策略市场
// ============================================================

'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { api } from '@/services/api';
import { ROUTES, STRATEGY_TYPES, RISK_LEVELS } from '@/utils/constants';
import { Star, TrendingUp, ArrowRight } from 'lucide-react';

const tabs = [
  { id: 'all', label: '全部' },
  { id: 'grid', label: '网格' },
  { id: 'trend', label: '趋势' },
  { id: 'arbitrage', label: '套利' },
];

export default function StrategiesPage() {
  const [strategies, setStrategies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const load = async () => {
      try {
        const result = await api.getStrategies();
        setStrategies(result.strategies || []);
      } catch (err) {
        console.error('加载策略失败:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const filtered = activeTab === 'all'
    ? strategies
    : strategies.filter((s) => s.type === activeTab);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">策略市场</h1>
        <p className="text-muted-foreground text-sm mt-1">
          选择适合您的 AI 量化策略
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-400 border border-purple-500/30'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Strategy List */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-44 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <TrendingUp className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">暂无该类策略</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((strategy: any) => {
            const typeInfo = STRATEGY_TYPES[strategy.type as keyof typeof STRATEGY_TYPES];
            const riskInfo = RISK_LEVELS[strategy.riskLevel as keyof typeof RISK_LEVELS];
            return (
              <Card key={strategy.id} className="p-6 border-muted hover:border-purple-500/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{strategy.name}</h3>
                      {strategy.roi30d && strategy.roi30d > 10 && (
                        <Badge variant="secondary" className="text-[10px] bg-yellow-500/10 text-yellow-500">
                          <Star className="h-3 w-3 mr-0.5 fill-yellow-500" /> 推荐
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{typeInfo?.description}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className={riskInfo?.color}>
                    {riskInfo?.label || strategy.riskLevel}
                  </Badge>
                  <Badge variant="outline">最低 {strategy.minInvestment || 100} USDT</Badge>
                  <Badge variant="outline">{strategy.pointsPerHour || 10} 点/h</Badge>
                </div>

                {strategy.roi30d && (
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <span className="text-green-500">
                      30天回测: +{strategy.roi30d}%
                    </span>
                    {strategy.backtestData?.winRate && (
                      <span className="text-muted-foreground">
                        胜率: {strategy.backtestData.winRate}%
                      </span>
                    )}
                  </div>
                )}

                <Link href={ROUTES.strategyDetail(strategy.id)}>
                  <Button variant="outline" className="w-full">
                    查看详情 <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
