export interface UploadFileResultDTO {
  batchId: string
  fileId: string
  fileName: string
  status: string
}

export interface UploadFilesResponseDTO {
  batchId: string
  files: UploadFileResultDTO[]
}

export interface StageDTO {
  id: string
  name?: string
  fileName: string
}

export interface WellDTO {
  name: string
  stages: StageDTO[]
}

export interface WellsStagesResponseDTO {
  wells: WellDTO[]
}
