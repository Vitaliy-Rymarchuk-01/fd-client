import { useMutation, useQuery } from '@tanstack/react-query'

import { getWellsStages, uploadFiles } from '../api/uploads'

export function useUploadFiles() {
  return useMutation({
    mutationFn: uploadFiles,
  })
}

export function useWellsStages(batchId: string | null) {
  return useQuery({
    queryKey: ['imports', 'wells-stages', batchId],
    queryFn: () => getWellsStages({ batchId: batchId as string }),
    enabled: Boolean(batchId),
  })
}
