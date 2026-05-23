import { useMutation, type UseMutationResult } from '@tanstack/react-query'

import type { ApiErrorPayload } from '@/shared/api/types'

import { logout } from '../api/logout'

const logoutMutationKey = ['auth', 'logout']

export function useLogoutMutation(): UseMutationResult<void, ApiErrorPayload, void> {
  return useMutation({
    mutationKey: logoutMutationKey,
    mutationFn: logout,
  })
}
