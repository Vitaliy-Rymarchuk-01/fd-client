import { api } from '@/shared/api/base'

import type { DetectBreakdownsResponseDTO } from '../types/detect'

export interface DetectBreakdownsParams {
  seconds: number[]
  treatingPressure: number[]
  slurryRate: number[]
  bottomHolePressure: number[]
  propCon: number[]
  bottomHolePropCon: number[]
}

export async function detectBreakdowns(
  params: DetectBreakdownsParams,
): Promise<DetectBreakdownsResponseDTO> {
  const { data } = await api.post<DetectBreakdownsResponseDTO>(
    '/breakdowns/detect',
    params,
  )

  return data
}
