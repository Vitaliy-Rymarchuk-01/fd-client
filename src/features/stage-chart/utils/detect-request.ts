import type { DetectBreakdownsMode } from '@/features/breakdowns/types/detect'

export function getDefaultDetectRequest(mode: DetectBreakdownsMode) {
  return {
    mode,
    applyFilters: true,
    maxTimeoutBetweenBreakdownsToJoinThem: 1,
    breakdownCapacityThreshold: 0.02,
    rateAndPressureDerAverageInterval: 5,
    slurryRateDerThreshold: 0.05,
    treatingPressureDerThreshold: 1,
    rateAndPressureAverageInterval: 5,
    averageRateBreakdownFilterThreshold: 0.05,
    averagePressureBreakdownFilterThreshold: 0.05,
    reservoirPressurePsi: 1000,
    filtrationArea: 1,
    fluidViscosityCPLike: 1,
    permeabilitySmoothingWindow: 11,
    permeabilitySmoothingPolyOrder: 3,
    permeabilityDerivativeAveragingInterval: 10,
    permeabilityDerivativeThreshold: 0.02,
    volumeLeapsScanInterval: 30,
    outputVolumeBreakdownThreshold: 0.0001,
    wellBoreVolumeBbl: 500,
    wellBoreVolumeCoefficient: 1,
  }
}
