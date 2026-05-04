// ============================================================
// Referral Page - 邀请中心（真实 API）
// ============================================================

'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/services/api';
import { Users, Copy, Gift, Share2, Check } from 'lucide-react';
import type { ReferralRecord } from '@/types';

export default function ReferralPage() {
  const [referralInfo, setReferralInfo] = useState<{
    referralCode: string;
    referralLink: string;
    rewardPerReferral: number;
  } | null>(null);
  const [records, setRecords] = useState<{ totalReferrals: number; totalEarned: number; referrals: ReferralRecord[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [info, recs] = await Promise.all([
        api.generateReferralLink(),
        api.getReferralRecords(),
      ]);
      setReferralInfo(info);
      setRecords(recs);
    } catch (err) {
      console.error('加载邀请数据失败:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleCopyLink = () => {
    if (!referralInfo) return;
    navigator.clipboard.writeText(referralInfo.referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">邀请中心</h1>
        <p className="text-muted-foreground text-sm mt-1">
          邀请好友使用，双方均可获得点卡奖励
        </p>
      </div>

      {/* Referral Stats */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-5 border-muted">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-600/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">已邀请</p>
                <p className="text-2xl font-bold">{records?.totalReferrals ?? 0}</p>
              </div>
            </div>
          </Card>
          <Card className="p-5 border-muted">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Gift className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">累计奖励</p>
                <p className="text-2xl font-bold">{records?.totalEarned ?? 0}</p>
              </div>
            </div>
          </Card>
          <Card className="p-5 border-muted">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Share2 className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">每个邀请奖励</p>
                <p className="text-2xl font-bold">{referralInfo?.rewardPerReferral ?? 50}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Invite Link */}
      <Card className="p-6 border-muted">
        <h2 className="font-semibold mb-4">邀请链接</h2>
        {isLoading ? (
          <Skeleton className="h-12 w-full rounded-lg" />
        ) : (
          <>
            <div className="flex gap-2">
              <div className="flex-1 p-3 rounded-lg bg-muted/50 text-sm font-mono truncate">
                {referralInfo?.referralLink || '加载中...'}
              </div>
              <Button variant="outline" size="icon" className="shrink-0" onClick={handleCopyLink}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              每成功邀请一位好友注册并使用策略，您和好友各获得 {referralInfo?.rewardPerReferral ?? 50} 点卡奖励
            </p>
          </>
        )}
      </Card>

      {/* Invite Records */}
      <Card className="p-6 border-muted">
        <h2 className="font-semibold mb-4">邀请记录</h2>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : records?.referrals && records.referrals.length > 0 ? (
          <div className="space-y-3">
            {records.referrals.map((record, i) => (
              <div key={record.id || i} className="flex items-center justify-between py-2 border-b border-muted last:border-0">
                <div>
                  <p className="text-sm font-medium">
                    {record.refereeName || (record.refereeAddress ? record.refereeAddress.slice(0, 8) + '...' : '未知用户')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    加入时间: {new Date(record.joinedAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="secondary">+{record.reward} 点</Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8 text-sm">暂无邀请记录</p>
        )}
      </Card>

      {/* Level System */}
      <Card className="p-6 border-muted">
        <h2 className="font-semibold mb-4">等级权益</h2>
        <div className="space-y-3">
          {[
            { level: 1, name: '青铜', condition: '注册即达', benefit: '基础策略使用' },
            { level: 2, name: '白银', condition: '累计消耗 500 点', benefit: '点卡购买 95 折' },
            { level: 3, name: '黄金', condition: '累计消耗 2000 点', benefit: '点卡购买 9 折' },
            { level: 4, name: '钻石', condition: '累计消耗 5000 点', benefit: '点卡购买 85 折' },
            { level: 5, name: '传说', condition: '累计消耗 15000 点', benefit: '点卡购买 8 折' },
          ].map((level) => (
            <div key={level.level} className="flex items-center justify-between py-2 border-b border-muted last:border-0">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center text-xs font-bold">
                  {level.level}
                </div>
                <div>
                  <p className="text-sm font-medium">Lv.{level.level} {level.name}</p>
                  <p className="text-xs text-muted-foreground">{level.condition}</p>
                </div>
              </div>
              <Badge variant="outline">{level.benefit}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
