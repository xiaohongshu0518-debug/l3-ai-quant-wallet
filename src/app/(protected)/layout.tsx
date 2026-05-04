// ============================================================
// Protected Layout - 认证用户布局
// ============================================================

'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  LineChart,
  Coins,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Wallet,
  BarChart3,
  ChevronDown,
} from 'lucide-react';
import { ROUTES } from '@/utils/constants';

const navItems = [
  { href: ROUTES.dashboard, label: '仪表盘', icon: LayoutDashboard },
  { href: ROUTES.strategies, label: '策略市场', icon: LineChart },
  { href: ROUTES.points, label: '点卡管理', icon: Coins },
  { href: ROUTES.referral, label: '邀请中心', icon: Users },
  { href: ROUTES.settings, label: '设置', icon: Settings },
];

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuthContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 未登录则重定向
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 animate-pulse" />
          <p className="text-sm text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 border-r bg-background transition-transform duration-200 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-2 px-6 border-b">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">AQ</span>
          </div>
          <span className="font-bold text-sm">AI Quant Wallet</span>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600/10 to-blue-600/10 text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600/30 to-blue-600/30 flex items-center justify-center">
              <Wallet className="h-4 w-4 text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.walletAddress?.slice(0, 6)}...{user?.walletAddress?.slice(-4)}
              </p>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                Lv.{user?.level || 1}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-destructive"
            onClick={() => { logout(); router.push('/'); }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            退出登录
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 border-b bg-background/95 backdrop-blur flex items-center justify-between px-4 lg:px-6">
          <button
            className="md:hidden p-2 -ml-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden md:flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-muted-foreground">
              {pathname === ROUTES.dashboard && '仪表盘'}
              {pathname.startsWith(ROUTES.strategies) && '策略市场'}
              {pathname === ROUTES.points && '点卡管理'}
              {pathname === ROUTES.referral && '邀请中心'}
              {pathname === ROUTES.settings && '设置'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-1 py-1.5">
              <Coins className="h-3 w-3" />
              <span>0 点</span>
            </Badge>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
              {user?.walletAddress?.slice(2, 4).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
