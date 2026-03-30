export interface ProjectDTO {
  id: string
  name: string
  userId: number
}

export interface ProjectsResponseDTO {
  projects: ProjectDTO[]
}

export interface CreateProjectRequestDTO {
  name: string
}

export interface UpdateProjectRequestDTO {
  name: string
}
