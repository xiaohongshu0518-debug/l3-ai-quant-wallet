// ============================================================
// Login Page - 钱包登录
// ============================================================

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuthContext } from '@/contexts/AuthContext';
import { useWallet } from '@/hooks/useWallet';
import { AlertCircle, Loader2, Wallet } from 'lucide-react';
import { ROUTES } from '@/utils/constants';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuthContext();
  const { account, connect, isConnecting } = useWallet();
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // 已登录则跳转
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.push(ROUTES.dashboard);
    }
  }, [isAuthenticated, authLoading, router]);

  const handleConnectAndLogin = async () => {
    setError(null);
    try {
      // 1. 连接钱包
      const walletAddress = await connect();

      // 2. 登录
      setIsLoggingIn(true);
      await login(walletAddress);

      // 3. 跳转 Dashboard
      router.push(ROUTES.dashboard);
    } catch (err: any) {
      setError(err.message || '登录失败');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const isLoading = isConnecting || isLoggingIn || authLoading;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/50">
      <Card className="w-full max-w-md p-8 border-muted">
        <div className="text-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">AQ</span>
          </div>
          <h1 className="text-2xl font-bold">登录 AI Quant Wallet</h1>
          <p className="text-sm text-muted-foreground mt-2">
            使用您的加密钱包连接
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button
          onClick={handleConnectAndLogin}
          disabled={isLoading}
          className="w-full h-12 text-base bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              连接中...
            </>
          ) : (
            <>
              <Wallet className="mr-2 h-5 w-5" />
              连接 MetaMask
            </>
          )}
        </Button>

        {account && (
          <p className="text-xs text-muted-foreground text-center mt-3">
            已检测到钱包: {account.slice(0, 6)}...{account.slice(-4)}
          </p>
        )}

        <div className="mt-6 p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
          <p className="font-medium mb-1">🔐 安全说明</p>
          <p>您的私钥永远不会离开您的设备。我们仅通过钱包签名验证身份，不存储任何私钥信息。</p>
        </div>
      </Card>
    </div>
  );
}
