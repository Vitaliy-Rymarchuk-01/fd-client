import { api } from '@/shared/api/base'

import type {
  UploadFilesResponseDTO,
  WellsStagesResponseDTO,
} from '../types/imports-api'

export async function uploadFiles(params: {
  files: File[]
  batchId?: string
}): Promise<UploadFilesResponseDTO> {
  const form = new FormData()

  params.files.forEach((file) => {
    form.append('files', file)
  })

  if (params.batchId) {
    form.append('batchId', params.batchId)
  }

  const { data } = await api.post<UploadFilesResponseDTO>('/upload/files', form)
  return data
}

export async function getWellsStages(params: {
  batchId: string
}): Promise<WellsStagesResponseDTO> {
  const { data } = await api.get<WellsStagesResponseDTO>(
    `/wells/${encodeURIComponent(params.batchId)}/stages`,
  )
  return data
}
