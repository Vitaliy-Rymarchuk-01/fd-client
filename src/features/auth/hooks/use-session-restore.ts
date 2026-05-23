import { useEffect } from 'react'

import { refreshSession } from '@/features/auth/api/refresh-session'
import {
  clearAuthSession,
  getAccessToken,
  setAccessToken,
  setAuthBootstrapping,
  useAuthSessionStore,
} from '@/features/auth/store/session'

export function useSessionRestore(): void {
  const isBootstrapping = useAuthSessionStore((state) => state.isBootstrapping)

  useEffect(() => {
    if (!isBootstrapping) {
      return
    }

    const accessToken = getAccessToken()

    if (accessToken) {
      setAuthBootstrapping(false)
      return
    }

    void refreshSession()
      .then((response) => {
        setAccessToken(response.accessToken)
      })
      .catch(() => {
        clearAuthSession()
      })
      .finally(() => {
        setAuthBootstrapping(false)
      })
  }, [isBootstrapping])
}
