import { api } from '@/shared/api/base'

import type { RefreshSessionResponse } from '../types/session'

export async function refreshSession(): Promise<RefreshSessionResponse> {
  const { data } = await api.post<RefreshSessionResponse>('/auth/refresh')

  return data
}
