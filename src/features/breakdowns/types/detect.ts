export type DetectBreakdownsMode =
  | 'permeability_increasing'
  | 'delta_v_output'

export interface DetectBreakdownsRequestDTO {
  mode: DetectBreakdownsMode

  startIndex?: number
  endIndex?: number

  applyFilters: boolean

  maxTimeoutBetweenBreakdownsToJoinThem: number
  breakdownCapacityThreshold: number

  rateAndPressureDerAverageInterval: number
  slurryRateDerThreshold: number
  treatingPressureDerThreshold: number
  rateAndPressureAverageInterval: number
  averageRateBreakdownFilterThreshold: number
  averagePressureBreakdownFilterThreshold: number

  reservoirPressurePsi?: number
  filtrationArea?: number
  fluidViscosityCPLike?: number

  permeabilitySmoothingWindow: number
  permeabilitySmoothingPolyOrder: number
  permeabilityDerivativeAveragingInterval: number
  permeabilityDerivativeThreshold: number

  volumeLeapsScanInterval: number
  outputVolumeBreakdownThreshold: number
  wellBoreVolumeBbl?: number
  wellBoreVolumeCoefficient: number
}

export interface BreakdownDTO {
  startIndex: number
  endIndex: number
  startTimeSeconds: number
  endTimeSeconds: number
  capacity: number
  isLarge: boolean
  isTooSmall: boolean
}

export interface BreakdownsAmountDTO {
  total: number
  major: number
  minor: number
  majorPercent: number
  minorPercent: number
  ratio: number
}

export interface DetectBreakdownsDebugSeriesDTO {
  seconds?: number[]
  treatingPressure?: number[]
  slurryRate?: number[]
  calculatedBottomPressure?: number[]
  permeability?: number[]
  permeabilitySmoothed?: number[]
  deltaVSeconds?: number[]
  deltaVOutput?: number[]
}

export interface DetectBreakdownsResponseDTO {
  mode: DetectBreakdownsMode
  breakdowns: BreakdownDTO[]
  amountTotal: BreakdownsAmountDTO
  totalCapacity: number
  firstMajorBreakdownIndex: number
  debug?: DetectBreakdownsDebugSeriesDTO
}
