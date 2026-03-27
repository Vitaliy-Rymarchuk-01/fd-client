import { useNavigate } from 'react-router'

import { LogOut, User } from 'lucide-react'
import { toast } from 'sonner'

import { clearAuthSession, useLogoutMutation } from '@/features/auth'

import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Separator } from '@/shared/components/ui/separator'
import { ThemeToggle } from '@/shared/components/ui/theme-toggle'
import { APP_ROUTES } from '@/shared/config/routes'

export function AppHeader() {
  const navigate = useNavigate()
  const logoutMutation = useLogoutMutation()

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        clearAuthSession()
        navigate(APP_ROUTES.signIn, { replace: true })
      },
      onError: (error) => {
        clearAuthSession()
        toast.error(error.message || 'Failed to log out')
        navigate(APP_ROUTES.signIn, { replace: true })
      },
    })
  }

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label="User menu"
              size="icon-sm"
              title="User"
              variant="ghost"
            >
              <User />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8}>
            <DropdownMenuItem onSelect={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
