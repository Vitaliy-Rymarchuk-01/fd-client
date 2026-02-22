export interface ApiErrorPayload {
  message: string
  statusCode?: number
  errors?: Record<string, string[]>
}
