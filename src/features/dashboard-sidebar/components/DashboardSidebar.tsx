import { Separator } from '@/shared/components/ui/separator'

const SECTIONS = [
  {
    title: 'Database management',
    items: ['Schema Visualizer', 'Tables', 'Functions', 'Triggers'],
  },
  {
    title: 'Configuration',
    items: ['Roles', 'Policies', 'Settings'],
  },
  {
    title: 'Platform',
    items: ['Replication', 'Backups', 'Migrations', 'Wrappers', 'Webhooks'],
  },
  {
    title: 'Tools',
    items: ['Security Advisor', 'Performance Advisor', 'Query Performance'],
  },
] as const

export function DashboardSidebar() {
  return (
    <nav className="h-full overflow-y-auto px-4 py-4">
      <div className="space-y-5">
        <div>
          <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            Database
          </p>
        </div>

        {SECTIONS.map((section) => (
          <div key={section.title} className="space-y-2">
            <p className="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => (
                <a
                  key={item}
                  className="text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:ring-ring/60 block rounded-md px-2 py-1.5 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none motion-reduce:transition-none"
                  href="#"
                >
                  {item}
                </a>
              ))}
            </div>
            <Separator className="bg-sidebar-border" />
          </div>
        ))}
      </div>
    </nav>
  )
}
