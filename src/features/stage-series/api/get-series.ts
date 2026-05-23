import { api } from '@/shared/api/base'

import type { StageSeriesResponseDTO } from '../types/series'

export async function getStageSeries(params: {
  stageId: string
}): Promise<StageSeriesResponseDTO> {
  const { data } = await api.get<StageSeriesResponseDTO>(
    `/stages/${encodeURIComponent(params.stageId)}/series`,
  )

  return data
}
