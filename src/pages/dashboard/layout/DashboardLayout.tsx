import { useState } from 'react'
import type { ReactNode } from 'react'

import { Menu } from 'lucide-react'

import { AppHeader } from '@/shared/components/layout/AppHeader'
import { AppSidebar } from '@/shared/components/layout/AppSidebar'
import { DashboardSidebar } from '@/features/dashboard-sidebar'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [appSidebarExpanded, setAppSidebarExpanded] = useState(false)

  return (
    <div className="bg-background text-foreground flex min-h-dvh flex-col">
      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="bg-background/80 absolute inset-0 backdrop-blur"
            onClick={() => setMobileNavOpen(false)}
            role="presentation"
          />
          <div className="bg-sidebar text-sidebar-foreground absolute inset-y-0 left-0 w-[320px] border-r">
            <div className="flex h-full flex-col overflow-y-auto">
              <AppSidebar />
              <div className="border-sidebar-border border-t">
                <DashboardSidebar />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="border-border bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 flex items-center border-b backdrop-blur">
        <div className="flex items-center gap-2 pl-2 md:hidden">
          <Button
            aria-label="Open navigation"
            onClick={() => setMobileNavOpen(true)}
            size="icon-sm"
            variant="ghost"
          >
            <Menu />
          </Button>
        </div>
        <div className="min-w-0 flex-1">
          <AppHeader />
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        <div
          className="border-sidebar-border bg-sidebar text-sidebar-foreground relative hidden w-14 border-r md:block"
          onBlurCapture={() => setAppSidebarExpanded(false)}
          onFocusCapture={() => setAppSidebarExpanded(true)}
          onMouseEnter={() => setAppSidebarExpanded(true)}
          onMouseLeave={() => setAppSidebarExpanded(false)}
        >
          <div className="h-full w-14">
            <AppSidebar collapsed />
          </div>

          <div
            className={cn(
              'border-sidebar-border bg-sidebar text-sidebar-foreground absolute top-0 left-0 z-30 h-full w-[260px] border-r shadow-sm',
              'transition-[opacity,transform] duration-200 [transition-timing-function:var(--ease-out-quart)] motion-reduce:transition-none',
              appSidebarExpanded
                ? 'pointer-events-auto translate-x-0 opacity-100'
                : 'pointer-events-none -translate-x-2 opacity-0',
            )}
          >
            <AppSidebar collapsed={false} />
          </div>
        </div>

        <div className="border-sidebar-border bg-sidebar text-sidebar-foreground hidden w-[280px] border-r md:block">
          <DashboardSidebar />
        </div>

        <main className="flex min-h-0 min-w-0 flex-1 flex-col p-6 md:p-10">{children}</main>
      </div>
    </div>
  )
}
