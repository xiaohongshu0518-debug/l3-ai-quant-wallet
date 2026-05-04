// ============================================================
// Points Page - 点卡管理（真实 API）
// ============================================================

'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/services/api';
import { POINT_PACKAGES } from '@/utils/constants';
import type { PointTransaction, PointBalance } from '@/types';
import { Coins, History, Sparkles } from 'lucide-react';

export default function PointsPage() {
  const [balance, setBalance] = useState<PointBalance | null>(null);
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [bal, txns] = await Promise.all([
        api.getPointBalance(),
        api.getPointTransactions(1, 10),
      ]);
      setBalance(bal);
      setTransactions(txns.transactions || []);
    } catch (err) {
      console.error('加载点卡数据失败:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">点卡管理</h1>
        <p className="text-muted-foreground text-sm mt-1">
          购买点卡以使用 AI 量化策略
        </p>
      </div>

      {/* Balance Card */}
      <Card className="p-6 border-muted bg-gradient-to-br from-purple-600/5 to-blue-600/5">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">当前余额</p>
                <p className="text-4xl font-bold mt-1">{balance?.balance ?? 0}</p>
                <p className="text-sm text-muted-foreground mt-1">点卡</p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
                <Coins className="h-7 w-7 text-purple-400" />
              </div>
            </div>
            <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
              <span>累计已购买: {balance?.totalPurchased ?? 0} 点</span>
              <span>累计已消耗: {balance?.totalConsumed ?? 0} 点</span>
            </div>
          </>
        )}
      </Card>

      {/* Purchase Packages */}
      <div>
        <h2 className="text-lg font-semibold mb-4">购买点卡</h2>
        <div className="grid gap-4 md:grid-cols-4">
          {POINT_PACKAGES.map((pkg) => (
            <Card
              key={pkg.label}
              className={`p-5 border-muted hover:border-purple-500/30 transition-colors cursor-pointer ${
                pkg.discount > 0 ? 'border-purple-500/20' : ''
              }`}
            >
              {pkg.discount > 0 && (
                <Badge className="mb-2 bg-gradient-to-r from-purple-600 to-blue-600">
                  省 {(pkg.discount * 100).toFixed(0)}%
                </Badge>
              )}
              <h3 className="text-lg font-bold">{pkg.points} 点</h3>
              <p className="text-2xl font-bold mt-1">${pkg.price}</p>
              <p className="text-xs text-muted-foreground mt-2">{pkg.description}</p>
              <Button
                variant={pkg.discount > 0 ? 'default' : 'outline'}
                size="sm"
                className="w-full mt-4"
                onClick={() => alert(`购买功能待对接合约\n套餐: ${pkg.label}\n点数: ${pkg.points}\n价格: $${pkg.price}`)}
              >
                购买
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <Card className="p-6 border-muted">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <History className="h-4 w-4 text-purple-400" /> 最近记录
        </h2>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 text-sm">暂无交易记录</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-2 border-b border-muted last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                    tx.amount > 0 ? 'bg-green-500/10' : 'bg-red-500/10'
                  }`}>
                    {tx.amount > 0 ? (
                      <Sparkles className="h-4 w-4 text-green-500" />
                    ) : (
                      <Coins className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {tx.type === 'PURCHASE' ? '购买' : tx.type === 'CONSUMPTION' ? '消耗' : tx.type === 'REFERRAL_REWARD' ? '邀请奖励' : tx.type}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tx.description || new Date(tx.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
