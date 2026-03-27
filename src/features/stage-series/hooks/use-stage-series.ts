import { useQuery } from '@tanstack/react-query'

import { getStageSeries } from '../api/get-series'
import type { StageSeriesResponseDTO } from '../types/series'

const STORAGE_PREFIX = 'fd.stage-series:'

function getStorageKey(stageId: string): string {
  return `${STORAGE_PREFIX}${stageId}`
}

function normalizeSeries(data: StageSeriesResponseDTO): StageSeriesResponseDTO {
  const n = Array.isArray(data.seconds) ? data.seconds.length : 0

  const fill = (): number[] => Array.from({ length: n }, () => Number.NaN)

  const normalizeArr = (arr: unknown): number[] => {
    if (!Array.isArray(arr)) return fill()
    if (arr.length === n) return arr
    if (arr.length > n) return arr.slice(0, n)
    return arr.concat(Array.from({ length: n - arr.length }, () => Number.NaN))
  }

  return {
    startTime: typeof data.startTime === 'string' ? data.startTime : '',
    seconds: Array.isArray(data.seconds) ? data.seconds : [],
    treatingPressure: normalizeArr(data.treatingPressure),
    slurryRate: normalizeArr(data.slurryRate),
    bottomHolePressure: normalizeArr(data.bottomHolePressure),
    propCon: normalizeArr(data.propCon),
    bottomHolePropCon: normalizeArr(data.bottomHolePropCon),
    wellBorePropMass: normalizeArr(data.wellBorePropMass),
  }
}

function loadStageSeriesFromStorage(
  stageId: string,
): StageSeriesResponseDTO | undefined {
  if (typeof window === 'undefined') return undefined

  try {
    const raw = window.localStorage.getItem(getStorageKey(stageId))
    if (!raw) return undefined

    const parsed = JSON.parse(raw) as StageSeriesResponseDTO
    if (!parsed || !Array.isArray(parsed.seconds)) return undefined
    if (typeof parsed.startTime !== 'string' || !parsed.startTime)
      return undefined
    if (!Array.isArray(parsed.propCon)) return undefined
    if (!Array.isArray(parsed.bottomHolePropCon)) return undefined
    if (!Array.isArray(parsed.wellBorePropMass)) return undefined

    return normalizeSeries(parsed)
  } catch {
    return undefined
  }
}

function saveStageSeriesToStorage(
  stageId: string,
  data: StageSeriesResponseDTO,
): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(getStorageKey(stageId), JSON.stringify(data))
  } catch {
    return
  }
}

export function useStageSeries(stageId: string | null) {
  return useQuery<StageSeriesResponseDTO>({
    queryKey: ['stage-series', stageId],
    enabled: Boolean(stageId),
    initialData: stageId ? loadStageSeriesFromStorage(stageId) : undefined,
    queryFn: async () => {
      const sId = stageId as string
      const data = normalizeSeries(await getStageSeries({ stageId: sId }))
      saveStageSeriesToStorage(sId, data)
      return data
    },
  })
}
