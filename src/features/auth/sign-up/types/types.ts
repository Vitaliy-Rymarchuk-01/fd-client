import type { SignUpFormValues } from './schema'

export interface SignUpRequestDto {
  name: string
  email: string
  password: string
}

export interface SignUpResponse {
  accessToken: string
  refreshToken?: string
}

export type { SignUpFormValues }
