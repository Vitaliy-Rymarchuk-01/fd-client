import { create } from 'zustand'

const ACCESS_TOKEN_STORAGE_KEY = 'fd.auth:access-token'

interface AuthSessionState {
  accessToken: string | null
  isAuthenticated: boolean
  isBootstrapping: boolean
  setAccessToken: (token: string | null) => void
  setBootstrapping: (value: boolean) => void
  clearSession: () => void
}

function readStoredAccessToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
  } catch {
    return null
  }
}

function persistAccessToken(token: string | null): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    if (token) {
      window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token)
      return
    }

    window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
  } catch {
    return
  }
}

const initialAccessToken = readStoredAccessToken()

export const useAuthSessionStore = create<AuthSessionState>((set) => ({
  accessToken: initialAccessToken,
  isAuthenticated: Boolean(initialAccessToken),
  isBootstrapping: true,
  setAccessToken: (token) => {
    persistAccessToken(token)
    set({ accessToken: token, isAuthenticated: Boolean(token) })
  },
  setBootstrapping: (value) => set({ isBootstrapping: value }),
  clearSession: () => {
    persistAccessToken(null)
    set({ accessToken: null, isAuthenticated: false })
  },
}))

export function getAccessToken(): string | null {
  return useAuthSessionStore.getState().accessToken
}

export function setAccessToken(token: string | null): void {
  useAuthSessionStore.getState().setAccessToken(token)
}

export function setAuthBootstrapping(value: boolean): void {
  useAuthSessionStore.getState().setBootstrapping(value)
}

export function clearAuthSession(): void {
  useAuthSessionStore.getState().clearSession()
}
