import { useQuery } from '@tanstack/react-query'

import type { StageSeriesResponseDTO } from '@/features/stage-series'

import { detectBreakdowns } from '../api/detect-breakdowns'
import type { DetectBreakdownsResponseDTO } from '../types/detect'

export function useBreakdowns(
  stageId: string | null,
  series: StageSeriesResponseDTO | undefined,
  breakdownMode: 'permeability' | 'deltaV' | null,
) {
  return useQuery<DetectBreakdownsResponseDTO>({
    queryKey: ['breakdowns', stageId, breakdownMode],
    enabled: Boolean(
      stageId && series && series.seconds.length >= 2 && breakdownMode,
    ),
    queryFn: async () => {
      if (!series) throw new Error('no series')
      if (!breakdownMode) throw new Error('no breakdown mode')

      return detectBreakdowns({
        mode: breakdownMode,
        seconds: series.seconds,
        treatingPressure: series.treatingPressure,
        slurryRate: series.slurryRate,
        cleanRate: series.cleanRate,
        bottomHolePressure: series.bottomHolePressure,
        propCon: series.propCon,
        bottomHolePropCon: series.bottomHolePropCon,
      })
    },
  })
}
