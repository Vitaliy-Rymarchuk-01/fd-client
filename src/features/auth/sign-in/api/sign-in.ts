import { api } from '@/shared/api/base'

import type { SignInRequestDto, SignInResponse } from '../types/types'

export async function signIn(
  payload: SignInRequestDto,
): Promise<SignInResponse> {
  const { data } = await api.post<SignInResponse>('/auth/sign-in', payload)

  return data
}
