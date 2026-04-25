import { api } from '@/shared/api/base'

import type { DetectBreakdownsResponseDTO } from '../types/detect'

export type BreakdownMode = 'permeability' | 'deltaV'

export interface DetectBreakdownsParams {
  mode: BreakdownMode
  seconds: number[]
  treatingPressure: number[]
  slurryRate: number[]
  cleanRate: number[]
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
