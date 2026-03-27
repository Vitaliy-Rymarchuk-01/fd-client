import { Navigate, Outlet } from 'react-router'

import { APP_ROUTES } from '@/shared/config/routes'

import { useAuthSessionStore } from '../store/session'

function AuthPending() {
  return <div className="bg-background min-h-dvh" />
}

export function RequireAuth() {
  const isAuthenticated = useAuthSessionStore((state) => state.isAuthenticated)
  const isBootstrapping = useAuthSessionStore((state) => state.isBootstrapping)

  if (isBootstrapping) {
    return <AuthPending />
  }

  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.signIn} replace />
  }

  return <Outlet />
}

export function RequireGuest() {
  const isAuthenticated = useAuthSessionStore((state) => state.isAuthenticated)
  const isBootstrapping = useAuthSessionStore((state) => state.isBootstrapping)

  if (isBootstrapping) {
    return <AuthPending />
  }

  if (isAuthenticated) {
    return <Navigate to={APP_ROUTES.dashboard} replace />
  }

  return <Outlet />
}
