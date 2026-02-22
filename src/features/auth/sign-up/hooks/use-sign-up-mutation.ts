import { useMutation, type UseMutationResult } from '@tanstack/react-query'

import type { ApiErrorPayload } from '@/shared/api/types'

import { signUp } from '../api/sign-up'
import type { SignUpRequestDto, SignUpResponse } from '../types/types'

const signUpMutationKey = ['auth', 'sign-up']

export function useSignUpMutation(): UseMutationResult<
  SignUpResponse,
  ApiErrorPayload,
  SignUpRequestDto
> {
  return useMutation({
    mutationKey: signUpMutationKey,
    mutationFn: signUp,
  })
}
