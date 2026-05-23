export interface BreakdownZoneDTO {
  startIndex: number
  endIndex: number
  startTime: number
  endTime: number
  duration: number
  capacity: number
  kind: 'large' | 'medium' | 'small'

  startPressure: number
  endPressure: number
  maxPressure: number
  minPressure: number

  startRate: number
  endRate: number
  maxRate: number
  minRate: number
}

export interface DetectBreakdownsResponseDTO {
  zones: BreakdownZoneDTO[]
}
