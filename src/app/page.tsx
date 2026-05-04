// ============================================================
// Landing Page - 产品介绍首页
// ============================================================

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Shield, Brain, Coins, Users, TrendingUp, Wallet } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: '非托管钱包',
    description: '私钥永远在您自己手中，平台不触碰用户资产资金安全由您掌控。',
  },
  {
    icon: Brain,
    title: 'AI 量化策略',
    description: '智能网格交易、趋势追踪等策略，AI 自动分析市场行情，生成交易信号。',
  },
  {
    icon: Coins,
    title: '点卡按需付费',
    description: '无需月费，按使用量付费。购买点卡即可运行策略，用完即止。',
  },
  {
    icon: TrendingUp,
    title: '实时监控',
    description: 'Dashboard 实时展示策略运行状态、收益曲线，随时可启停策略。',
  },
  {
    icon: Wallet,
    title: '双模式支持',
    description: '支持交易所 API 交易和链上合约执行两种模式，灵活选择。',
  },
  {
    icon: Users,
    title: '邀请奖励',
    description: '分享邀请链接，好友加入双方均可获得点卡奖励。',
  },
];

const riskSteps = [
  { step: 1, title: '连接钱包', desc: '使用 MetaMask 连接，私钥本地保存' },
  { step: 2, title: '选择策略', desc: 'AI 策略市场，查看回测数据' },
  { step: 3, title: '授权执行', desc: '输入 API Key 或授权合约，仅交易权限' },
  { step: 4, title: '实时监控', desc: 'Dashboard 查看收益，随时停止策略' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">AQ</span>
            </div>
            <span className="font-bold text-lg">AI Quant Wallet</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">功能</Link>
            <Link href="#how-it-works" className="hover:text-foreground transition-colors">使用流程</Link>
            <Link href="#risk" className="hover:text-foreground transition-colors">风险说明</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">登录</Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                开始使用 <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 text-center relative">
          <Badge className="mb-4 px-4 py-1.5 text-sm bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/30 text-purple-400">
            🚀 非托管 · AI 驱动 · 用户自主执行
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            AI 量化智能钱包
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            基于 Web3 的非托管智能钱包，内置 AI 量化策略工具。
            <br />
            用户自主授权、自主执行、风险自担。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-base px-8">
                开始使用 <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-base px-8">
                了解更多
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 border-t">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">核心功能</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            六大核心模块，构建完整的量化交易工具链
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="p-6 border-muted hover:border-purple-500/30 transition-colors">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-purple-400" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 border-t bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">使用流程</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            简单四步，开启 AI 量化交易之旅
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            {riskSteps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Statement */}
      <section id="risk" className="py-20 border-t">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto p-8 border-yellow-500/20 bg-yellow-500/5">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              ⚠️ 风险声明
            </h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>1. 本产品仅提供策略执行工具，所有交易决策由用户自主选择。</li>
              <li>2. 加密货币交易存在高风险，可能导致全部本金损失。</li>
              <li>3. 历史回测数据不代表未来表现，不构成投资建议。</li>
              <li>4. 用户资金始终在用户自己的钱包或交易所账户中，平台不托管任何用户资金。</li>
              <li>5. 使用本产品前请确保了解相关风险。</li>
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">使用即表示同意以上声明。</p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>AI Quant Wallet — 非托管 · AI 驱动 · 用户自主执行</p>
          <p className="mt-2">本平台不提供投资建议，不托管用户资产，不承诺任何收益。</p>
        </div>
      </footer>
    </div>
  );
}
