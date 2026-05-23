export interface StageNode {
  id: string
  fileId: string
  wellName: string
  stageName?: string
  fileName: string
  status: 'pending' | 'ready'
}
