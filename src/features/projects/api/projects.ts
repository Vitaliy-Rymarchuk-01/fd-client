import { api } from '@/shared/api/base'

import type {
  CreateProjectRequestDTO,
  ProjectDTO,
  ProjectsResponseDTO,
  UpdateProjectRequestDTO,
} from '../types/project'

export async function listProjects(): Promise<ProjectDTO[]> {
  const { data } = await api.get<ProjectsResponseDTO>('/projects')
  return data.projects
}

export async function createProject(
  payload: CreateProjectRequestDTO,
): Promise<ProjectDTO> {
  const { data } = await api.post<ProjectDTO>('/projects', payload)
  return data
}

export async function updateProject(
  projectId: string,
  payload: UpdateProjectRequestDTO,
): Promise<ProjectDTO> {
  const { data } = await api.patch<ProjectDTO>(
    `/projects/${projectId}`,
    payload,
  )
  return data
}

export async function deleteProject(projectId: string): Promise<void> {
  await api.delete(`/projects/${projectId}`)
}
