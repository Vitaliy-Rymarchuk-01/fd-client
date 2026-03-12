import { useEffect, useMemo } from 'react'

import { Button } from '@/shared/components/ui/button'
import { useBreakdownsStore } from '@/shared/store/breakdowns'

import { useDetectBreakdowns } from '../hooks/use-detect-breakdowns'
import type {
  BreakdownDTO,
  DetectBreakdownsMode,
  DetectBreakdownsRequestDTO,
} from '../types/detect'

interface BreakdownsPanelProps {
  stageId: string
}

function getDefaultRequest(
  mode: DetectBreakdownsMode,
): DetectBreakdownsRequestDTO {
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

function formatNum(v: number) {
  return Number.isFinite(v) ? v.toFixed(3) : '—'
}

function toPoints(values: number[], width: number, height: number) {
  const finite = values.filter((v) => Number.isFinite(v))
  const min = finite.length > 0 ? Math.min(...finite) : 0
  const max = finite.length > 0 ? Math.max(...finite) : 1
  const range = max - min || 1

  return values
    .map((v, i) => {
      const x = (i / Math.max(1, values.length - 1)) * width
      const y =
        height - ((Number.isFinite(v) ? v : min) - min) * (height / range)
      return `${x},${y}`
    })
    .join(' ')
}

function BreakdownOverlay({
  breakdowns,
  length,
  width,
  height,
}: {
  breakdowns: BreakdownDTO[]
  length: number
  width: number
  height: number
}) {
  return (
    <g>
      {breakdowns.map((br) => {
        const x1 = (br.startIndex / Math.max(1, length - 1)) * width
        const x2 = (br.endIndex / Math.max(1, length - 1)) * width
        const fill = br.isTooSmall
          ? 'rgba(34,197,94,0.14)'
          : br.isLarge
            ? 'rgba(239,68,68,0.18)'
            : 'rgba(59,130,246,0.14)'
        return (
          <rect
            key={`${br.startIndex}-${br.endIndex}`}
            x={Math.min(x1, x2)}
            y={0}
            width={Math.max(1, Math.abs(x2 - x1))}
            height={height}
            fill={fill}
          />
        )
      })}
    </g>
  )
}

export function BreakdownsPanel({ stageId }: BreakdownsPanelProps) {
  const mutation = useDetectBreakdowns()

  const setForStage = useBreakdownsStore((s) => s.setForStage)

  const data = mutation.data

  useEffect(() => {
    if (!data) return
    setForStage({ stageId, mode: data.mode, response: data })
  }, [data, setForStage, stageId])

  const series = data?.debug
  const pressure = series?.treatingPressure

  const chart = useMemo(() => {
    if (!pressure || pressure.length < 2) return null

    const width = 640
    const height = 220
    const points = toPoints(pressure, width, height)

    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full rounded-md border"
        aria-label="Treating pressure chart"
      >
        <BreakdownOverlay
          breakdowns={data?.breakdowns ?? []}
          length={pressure.length}
          width={width}
          height={height}
        />
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.8}
          strokeWidth={1}
        />
      </svg>
    )
  }, [data?.breakdowns, pressure])

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          type="button"
          disabled={mutation.isPending}
          onClick={() =>
            mutation.mutate({
              stageId,
              body: getDefaultRequest('permeability_increasing'),
            })
          }
        >
          Detect (Permeability)
        </Button>
        <Button
          size="sm"
          type="button"
          variant="secondary"
          disabled={mutation.isPending}
          onClick={() =>
            mutation.mutate({
              stageId,
              body: getDefaultRequest('delta_v_output'),
            })
          }
        >
          Detect (DeltaV)
        </Button>
      </div>

      {mutation.isError ? (
        <div className="text-destructive text-sm">Detection failed</div>
      ) : null}

      {data ? (
        <div className="space-y-2">
          <div className="text-sm">
            <div>
              <span className="font-semibold">Mode:</span> {data.mode}
            </div>
            <div>
              <span className="font-semibold">Total:</span>{' '}
              {data.amountTotal.total}
            </div>
            <div>
              <span className="font-semibold">Major:</span>{' '}
              {data.amountTotal.major}
            </div>
            <div>
              <span className="font-semibold">Minor:</span>{' '}
              {data.amountTotal.minor}
            </div>
            <div>
              <span className="font-semibold">Total capacity:</span>{' '}
              {formatNum(data.totalCapacity)}
            </div>
          </div>

          {chart}

          <div className="space-y-1">
            <div className="text-sm font-semibold">Breakdowns</div>
            <div className="divide-y rounded-md border">
              {data.breakdowns.map((br) => (
                <div
                  key={`${br.startIndex}-${br.endIndex}`}
                  className="flex items-center justify-between gap-3 px-3 py-2 text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-medium">
                      #{br.startIndex} → {br.endIndex}
                    </div>
                    <div className="text-muted-foreground">
                      t={formatNum(br.startTimeSeconds)}s →{' '}
                      {formatNum(br.endTimeSeconds)}s
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      cap {formatNum(br.capacity)}
                    </div>
                    <div className="text-muted-foreground">
                      {br.isLarge ? 'major' : br.isTooSmall ? 'small' : 'minor'}
                    </div>
                  </div>
                </div>
              ))}
              {data.breakdowns.length === 0 ? (
                <div className="text-muted-foreground px-3 py-2 text-xs">
                  No breakdowns detected.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-muted-foreground text-xs">
          Run detection to see breakdowns and a pressure chart.
        </div>
      )}
    </section>
  )
}
