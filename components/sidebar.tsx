'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Calendar,
  DollarSign,
  CheckSquare,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

const navItems = [
  {
    label: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    label: 'Schedule',
    href: '/schedule',
    icon: Calendar,
  },
  {
    label: 'Expenses',
    href: '/expenses',
    icon: DollarSign,
  },
  {
    label: 'To-Do Lists',
    href: '/todos',
    icon: CheckSquare,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:flex lg:flex-col lg:border-r lg:border-sidebar-border lg:transition-all lg:duration-300',
          isOpen ? 'lg:w-64' : 'lg:w-20'
        )}
        style={{
          backgroundColor: 'hsl(var(--sidebar-background))',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
          {isOpen && (
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                style={{
                  backgroundColor: 'hsl(var(--primary))',
                }}
              >
                📚
              </div>
              <span
                className="font-bold text-lg"
                style={{
                  color: 'hsl(var(--sidebar-foreground))',
                }}
              >
                Scholar
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="lg:flex hidden"
          >
            {isOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative group',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {isOpen && (
                  <span className="font-medium truncate">{item.label}</span>
                )}

                {/* Active Indicator */}
                {isActive && (
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-r-lg"
                    style={{
                      backgroundColor: 'hsl(var(--accent))',
                    }}
                  />
                )}

                {/* Tooltip for collapsed state */}
                {!isOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-sidebar-primary text-sidebar-primary-foreground rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          {isOpen && (
            <div className="text-xs text-sidebar-foreground opacity-60">
              <p>© 2024 Scholar</p>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Navigation - Top Bar */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 h-16 border-b border-sidebar-border flex items-center px-4 gap-4 z-40"
        style={{
          backgroundColor: 'hsl(var(--sidebar-background))',
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-lg"
            style={{
              backgroundColor: 'hsl(var(--primary))',
            }}
          >
            📚
          </div>
          <span
            className="font-bold text-lg"
            style={{
              color: 'hsl(var(--sidebar-foreground))',
            }}
          >
            Scholar
          </span>
        </div>

        {/* Mobile Nav Items - Horizontal Scroll */}
        <div className="flex-1 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap text-sm',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Offset */}
      <div
        className={cn(
          'hidden lg:block',
          isOpen ? 'ml-64' : 'ml-20'
        )}
      />
    </>
  );
}
