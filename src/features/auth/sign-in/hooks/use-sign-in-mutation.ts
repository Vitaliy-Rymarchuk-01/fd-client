import { useMutation, type UseMutationResult } from '@tanstack/react-query'

import type { ApiErrorPayload } from '@/shared/api/types'

import { signIn } from '../api/sign-in'
import type { SignInRequestDto, SignInResponse } from '../types/types'

const signInMutationKey = ['auth', 'sign-in']

export function useSignInMutation(): UseMutationResult<
  SignInResponse,
  ApiErrorPayload,
  SignInRequestDto
> {
  return useMutation({
    mutationKey: signInMutationKey,
    mutationFn: signIn,
  })
}
