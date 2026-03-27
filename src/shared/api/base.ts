import axios, {
  AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from 'axios'

import {
  clearAuthSession,
  getAccessToken,
  setAccessToken,
} from '@/features/auth/store/session'
import type { RefreshSessionResponse } from '@/features/auth/types/session'

import type { ApiErrorPayload } from './types'

const baseURL = import.meta.env.VITE_API_BASE_URL

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

function normalizeApiError(
  error: AxiosError<ApiErrorPayload>,
): ApiErrorPayload {
  return (
    error.response?.data ?? {
      message: error.message || 'Unexpected error',
      statusCode: error.response?.status,
    }
  )
}

export const api = axios.create({
  baseURL,
  withCredentials: true,
})

let refreshAccessTokenPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshAccessTokenPromise) {
    refreshAccessTokenPromise = axios
      .post<RefreshSessionResponse>(`${baseURL}/auth/refresh`, undefined, {
        withCredentials: true,
      })
      .then(({ data }) => {
        setAccessToken(data.accessToken)
        return data.accessToken
      })
      .catch(() => {
        clearAuthSession()
        return null
      })
      .finally(() => {
        refreshAccessTokenPromise = null
      })
  }

  return refreshAccessTokenPromise
}

api.interceptors.request.use((config) => {
  const accessToken = getAccessToken()

  if (!accessToken) {
    return config
  }

  const headers = AxiosHeaders.from(config.headers)
  if (!headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  config.headers = headers

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorPayload>) => {
    const config = error.config as RetryableRequestConfig | undefined
    const isUnauthorized = error.response?.status === 401
    const isRefreshRequest = config?.url?.includes('/auth/refresh') ?? false
    const isLogoutRequest = config?.url?.includes('/auth/logout') ?? false

    if (
      isUnauthorized &&
      config &&
      !config._retry &&
      !isRefreshRequest &&
      !isLogoutRequest
    ) {
      config._retry = true

      const nextAccessToken = await refreshAccessToken()
      if (nextAccessToken) {
        const headers = AxiosHeaders.from(config.headers)
        headers.set('Authorization', `Bearer ${nextAccessToken}`)
        config.headers = headers

        return api.request(config)
      }
    }

    return Promise.reject(normalizeApiError(error))
  },
)
