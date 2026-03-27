import { useQuery } from '@tanstack/react-query'

import type { StageSeriesResponseDTO } from '@/features/stage-series'

import { detectBreakdowns } from '../api/detect-breakdowns'
import type { DetectBreakdownsResponseDTO } from '../types/detect'

export function useBreakdowns(
  stageId: string | null,
  series: StageSeriesResponseDTO | undefined,
) {
  return useQuery<DetectBreakdownsResponseDTO>({
    queryKey: ['breakdowns', stageId],
    enabled: Boolean(stageId && series && series.seconds.length >= 2),
    queryFn: async () => {
      if (!series) throw new Error('no series')

      return detectBreakdowns({
        seconds: series.seconds,
        treatingPressure: series.treatingPressure,
        slurryRate: series.slurryRate,
        bottomHolePressure: series.bottomHolePressure,
        propCon: series.propCon,
        bottomHolePropCon: series.bottomHolePropCon,
      })
    },
  })
}
