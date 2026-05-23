export interface ApiErrorPayload {
  message: string
  statusCode?: number
  code?: string
  error?: string
  errors?: Record<string, string[]>
}
