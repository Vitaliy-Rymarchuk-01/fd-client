import {
  Activity,
  Database,
  Folder,
  HardDrive,
  Key,
  LayoutGrid,
  Logs,
  Radio,
  Settings,
  SquareFunction,
  Table,
  Terminal,
} from 'lucide-react'

import { cn } from '@/shared/lib/utils'

const TOP_ITEMS = [
  { id: 'overview', label: 'Project Overview', icon: LayoutGrid, active: false },
  { id: 'table-editor', label: 'Table Editor', icon: Table, active: false },
  { id: 'sql', label: 'SQL Editor', icon: Terminal, active: false },
  { id: 'database', label: 'Database', icon: Database, active: true },
  { id: 'auth', label: 'Authentication', icon: Key, active: false },
  { id: 'storage', label: 'Storage', icon: HardDrive, active: false },
  { id: 'edge', label: 'Edge Functions', icon: SquareFunction, active: false },
  { id: 'realtime', label: 'Realtime', icon: Radio, active: false },
] as const

const BOTTOM_ITEMS = [
  { id: 'advisors', label: 'Advisors', icon: Activity },
  { id: 'logs', label: 'Logs', icon: Logs },
  { id: 'integrations', label: 'Integrations', icon: Folder },
  { id: 'settings', label: 'Project Settings', icon: Settings },
] as const

interface AppSidebarProps {
  collapsed?: boolean
}

export function AppSidebar({ collapsed = false }: AppSidebarProps) {
  return (
    <nav className="flex h-full flex-col gap-2 px-2 py-3">
      <div className="space-y-1">
        {TOP_ITEMS.map(({ id, label, icon: Icon, active }) => (
          <a
            key={id}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 motion-reduce:transition-none',
              active
                ? 'bg-sidebar-accent text-sidebar-foreground'
                : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
            )}
            href="#"
          >
            <Icon className="size-4 shrink-0" />
            <span
              className={cn(
                'truncate transition-[opacity,transform,width] duration-200 [transition-timing-function:var(--ease-out-quart)] motion-reduce:transition-none',
                collapsed ? 'w-0 -translate-x-1 opacity-0' : 'w-auto translate-x-0 opacity-100',
              )}
            >
              {label}
            </span>
          </a>
        ))}
      </div>

      <div className="mt-auto space-y-1 pt-2">
        {BOTTOM_ITEMS.map(({ id, label, icon: Icon }) => (
          <a
            key={id}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 motion-reduce:transition-none"
            href="#"
          >
            <Icon className="size-4 shrink-0" />
            <span
              className={cn(
                'truncate transition-[opacity,transform,width] duration-200 [transition-timing-function:var(--ease-out-quart)] motion-reduce:transition-none',
                collapsed ? 'w-0 -translate-x-1 opacity-0' : 'w-auto translate-x-0 opacity-100',
              )}
            >
              {label}
            </span>
          </a>
        ))}
      </div>
    </nav>
  )
}
