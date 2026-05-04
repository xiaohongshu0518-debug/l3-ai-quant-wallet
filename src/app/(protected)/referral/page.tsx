// ============================================================
// Referral Page - 邀请中心
// ============================================================

'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Copy, Gift, Share2 } from 'lucide-react';

export default function ReferralPage() {
  const referralCode = 'AQW_ABC123';
  const referralLink = `https://aiwallet.io/invite/${referralCode}`;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">邀请中心</h1>
        <p className="text-muted-foreground text-sm mt-1">
          邀请好友使用，双方均可获得点卡奖励
        </p>
      </div>

      {/* Referral Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5 border-muted">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-600/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">已邀请</p>
              <p className="text-2xl font-bold">5</p>
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
              <p className="text-2xl font-bold">250</p>
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
              <p className="text-2xl font-bold">50</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Invite Link */}
      <Card className="p-6 border-muted">
        <h2 className="font-semibold mb-4">邀请链接</h2>
        <div className="flex gap-2">
          <div className="flex-1 p-3 rounded-lg bg-muted/50 text-sm font-mono truncate">
            {referralLink}
          </div>
          <Button variant="outline" size="icon" className="shrink-0">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2 mt-3">
          <Button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600">
            <Share2 className="h-4 w-4 mr-1" /> 分享邀请链接
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          每成功邀请一位好友注册并使用策略，您和好友各获得 50 点卡奖励
        </p>
      </Card>

      {/* Invite Records */}
      <Card className="p-6 border-muted">
        <h2 className="font-semibold mb-4">邀请记录</h2>
        <div className="space-y-3">
          {[
            { name: '0x3a1b...2c9d', joined: '2026-05-01', reward: 50 },
            { name: '0x8e4f...1a3b', joined: '2026-04-28', reward: 50 },
          ].map((record, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-muted last:border-0">
              <div>
                <p className="text-sm font-medium">{record.name}</p>
                <p className="text-xs text-muted-foreground">加入时间: {record.joined}</p>
              </div>
              <Badge variant="secondary">+{record.reward} 点</Badge>
            </div>
          ))}
        </div>
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
