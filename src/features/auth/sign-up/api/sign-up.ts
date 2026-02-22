import { api } from '@/shared/api/base'

import type { SignUpRequestDto, SignUpResponse } from '../types/types'

export async function signUp(payload: SignUpRequestDto): Promise<SignUpResponse> {
  const { data } = await api.post<SignUpResponse>('/auth/sign-up', payload)

  return data
}
