import axios, { AxiosError } from 'axios'

import type { ApiErrorPayload } from './types'

const baseURL = import.meta.env.VITE_API_BASE_URL

export const api = axios.create({
  baseURL,
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorPayload>) => {
    const payload: ApiErrorPayload =
      error.response?.data ?? {
        message: error.message || 'Unexpected error',
        statusCode: error.response?.status,
      }

    return Promise.reject(payload)
  },
)
