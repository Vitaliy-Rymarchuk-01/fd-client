import { api } from '@/shared/api/base'

import type {
  DetectBreakdownsRequestDTO,
  DetectBreakdownsResponseDTO,
} from '../types/detect'

export async function detectBreakdowns(params: {
  stageId: string
  body: DetectBreakdownsRequestDTO
}): Promise<DetectBreakdownsResponseDTO> {
  const { data } = await api.post<DetectBreakdownsResponseDTO>(
    `/stages/${encodeURIComponent(params.stageId)}/breakdowns/detect`,
    params.body,
  )

  return data
}
