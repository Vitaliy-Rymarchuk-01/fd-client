import { api } from '@/shared/api/base'

export async function logout(): Promise<void> {
  await api.post('/auth/logout')
}
