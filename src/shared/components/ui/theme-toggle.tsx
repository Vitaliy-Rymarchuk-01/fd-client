import { Moon, Sun } from 'lucide-react'

import { useTheme } from '@/shared/hooks/use-theme'

import { Button } from './button'

export function ThemeToggle() {
  const { resolvedTheme, toggle } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      aria-label="Toggle theme"
      className="rounded-md"
      onClick={toggle}
      size="icon-sm"
      title="Toggle theme"
      variant="ghost"
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  )
}
