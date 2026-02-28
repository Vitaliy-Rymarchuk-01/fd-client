import { User } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Separator } from '@/shared/components/ui/separator'
import { ThemeToggle } from '@/shared/components/ui/theme-toggle'

export function AppHeader() {
  return (
    <header className="bg-sidebar flex h-12 items-center justify-between gap-4 px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">Fracture detection</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Separator className="h-6" orientation="vertical" />
        <Button aria-label="User menu" size="icon-sm" title="User" variant="ghost">
          <User />
        </Button>
      </div>
    </header>
  )
}
