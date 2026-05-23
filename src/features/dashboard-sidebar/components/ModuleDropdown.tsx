import { ChevronDown } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'

import type { ModuleGroup, ModuleId } from '../types/module'

interface ModuleDropdownProps {
  activeModuleId: ModuleId
  moduleGroups: ReadonlyArray<ModuleGroup>
  onSelect: (id: ModuleId) => void
}

export function ModuleDropdown({
  activeModuleId,
  moduleGroups,
  onSelect,
}: ModuleDropdownProps) {
  const activeModuleLabel =
    moduleGroups
      .flatMap((group) => group.items)
      .find((item) => item.id === activeModuleId)?.label ?? 'Module'

  const groups = moduleGroups.filter((group) => group.items.length > 0)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="h-8 w-full justify-between rounded-sm px-2 text-sm font-semibold"
        >
          <span className="truncate">{activeModuleLabel}</span>
          <ChevronDown className="size-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="w-full min-w-60"
      >
        {groups.map((group, idx) => (
          <div key={group.id}>
            <DropdownMenuLabel className="text-muted-foreground text-xs tracking-wide uppercase">
              {group.id}
            </DropdownMenuLabel>
            {group.items.map((item) => (
              <DropdownMenuItem
                key={item.id}
                onSelect={() => onSelect(item.id)}
                className={
                  item.id === activeModuleId
                    ? 'bg-accent text-accent-foreground'
                    : undefined
                }
              >
                {item.label}
              </DropdownMenuItem>
            ))}
            {idx < groups.length - 1 ? <DropdownMenuSeparator /> : null}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
