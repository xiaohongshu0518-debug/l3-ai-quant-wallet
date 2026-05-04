// ============================================================
// Settings Page - 账户设置
// ============================================================

'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuthContext } from '@/contexts/AuthContext';
import { Shield, Key, Bell, Wallet } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuthContext();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">设置</h1>
        <p className="text-muted-foreground text-sm mt-1">
          管理您的账户和 API Key
        </p>
      </div>

      {/* Wallet Info */}
      <Card className="p-6 border-muted">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Wallet className="h-4 w-4 text-purple-400" /> 钱包信息
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-muted">
            <span className="text-sm text-muted-foreground">钱包地址</span>
            <span className="text-sm font-mono">
              {user?.walletAddress?.slice(0, 8)}...{user?.walletAddress?.slice(-6)}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-muted">
            <span className="text-sm text-muted-foreground">等级</span>
            <Badge>Lv.{user?.level || 1}</Badge>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">注册时间</span>
            <span className="text-sm">{user?.createdAt?.slice(0, 10) || '2026-05-04'}</span>
          </div>
        </div>
      </Card>

      {/* API Keys */}
      <Card className="p-6 border-muted">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Key className="h-4 w-4 text-purple-400" /> API Key 管理
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          添加交易所 API Key 以使用模式 A（交易所 API 交易）
        </p>
        <div className="space-y-3">
          <div className="p-3 rounded-lg border border-dashed border-muted text-center text-sm text-muted-foreground">
            <p>暂无 API Key</p>
            <Button variant="outline" size="sm" className="mt-2">
              添加 API Key
            </Button>
          </div>
        </div>
        <div className="mt-3 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20 text-xs text-muted-foreground">
          ⚠️ 安全提示：请确保 API Key 仅开启交易权限（Trade），切勿开启提现权限（Withdraw）
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6 border-muted">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Bell className="h-4 w-4 text-purple-400" /> 通知设置
        </h2>
        <div className="space-y-3">
          {[
            { label: '策略停止通知', desc: '策略异常停止时推送通知' },
            { label: '止损触发通知', desc: '策略触及止损线时推送通知' },
            { label: '点卡余额不足', desc: '点卡余额低于 100 点时提醒' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Badge variant="outline">已开启</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Security */}
      <Card className="p-6 border-muted">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Shield className="h-4 w-4 text-purple-400" /> 安全
        </h2>
        <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">🔐 安全说明</p>
          <ul className="space-y-1 text-sm">
            <li>• 私钥永远在您自己的浏览器中，不经过服务器</li>
            <li>• API Key 采用 AES-256-GCM 加密存储</li>
            <li>• 所有交易记录可追溯</li>
            <li>• 支持随时停止策略</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
