import type { SignInFormValues } from './schema'

export type SignInRequestDto = SignInFormValues

export interface SignInResponse {
  accessToken: string
  refreshToken?: string
}

export type { SignInFormValues }
