import { create } from 'zustand'

const ACTIVE_PROJECT_STORAGE_KEY = 'fd.projects:active-project'

interface ActiveProjectState {
  activeProjectId: string | null
  setActiveProjectId: (projectId: string | null) => void
}

function readStoredActiveProjectId(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.localStorage.getItem(ACTIVE_PROJECT_STORAGE_KEY)
  } catch {
    return null
  }
}

function persistActiveProjectId(projectId: string | null): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    if (projectId) {
      window.localStorage.setItem(ACTIVE_PROJECT_STORAGE_KEY, projectId)
      return
    }

    window.localStorage.removeItem(ACTIVE_PROJECT_STORAGE_KEY)
  } catch {
    return
  }
}

const initialActiveProjectId = readStoredActiveProjectId()

export const useActiveProjectStore = create<ActiveProjectState>((set) => ({
  activeProjectId: initialActiveProjectId,
  setActiveProjectId: (projectId) => {
    persistActiveProjectId(projectId)
    set({ activeProjectId: projectId })
  },
}))

export function getActiveProjectId(): string | null {
  return useActiveProjectStore.getState().activeProjectId
}

export function setActiveProjectId(projectId: string | null): void {
  useActiveProjectStore.getState().setActiveProjectId(projectId)
}
