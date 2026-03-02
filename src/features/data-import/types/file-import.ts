export type ImportFileStatus = 'queued' | 'uploading' | 'uploaded' | 'error'

export interface ImportFileItem {
  id: string
  file: File
  status: ImportFileStatus
  errorMessage?: string
}
