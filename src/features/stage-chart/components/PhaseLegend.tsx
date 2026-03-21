import { Card } from '@/shared/components/ui/card'

interface PhaseLegendProps {
  phases?: {
    startFluidPumping?: number
    firstMajorBrInitiations?: number
    startPropPumping?: number
    finishPropPumping?: number
    isip?: number
    end?: number
    startRealData?: number
  }
  seriesLength: number
}

const phaseConfig = [
  {
    key: 'startFluidPumping' as const,
    label: 'Start Fluid Pumping',
    color: '#22c55e',
    description: 'FPP',
  },
  {
    key: 'firstMajorBrInitiations' as const,
    label: '1st Major BR',
    color: '#a855f7',
    description: 'First major breakdown',
  },
  {
    key: 'startPropPumping' as const,
    label: 'Start Proppant',
    color: '#f97316',
    description: 'Proppant pumping begins',
  },
  {
    key: 'finishPropPumping' as const,
    label: 'Finish Proppant',
    color: '#92400e',
    description: 'Proppant pumping ends',
  },
  {
    key: 'isip' as const,
    label: 'ISIP',
    color: '#ec4899',
    description: 'Instantaneous shut-in pressure',
  },
  {
    key: 'startRealData' as const,
    label: 'Start Real Data',
    color: '#06b6d4',
    description: 'Real data begins',
  },
]

export function PhaseLegend({ phases, seriesLength }: PhaseLegendProps) {
  if (!phases) {
    return null
  }

  const activePhases = phaseConfig.filter((config) => {
    const value = phases[config.key]
    return value != null && value >= 0 && value < seriesLength
  })

  if (activePhases.length === 0) {
    return null
  }

  return (
    <Card className="p-3">
      <div className="mb-2 text-xs font-semibold">Phase Markers</div>
      <div className="grid grid-cols-1 gap-2">
        {activePhases.map((config) => (
          <div key={config.key} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-sm border border-gray-300"
              style={{
                background: `repeating-linear-gradient(
                  45deg,
                  ${config.color},
                  ${config.color} 2px,
                  transparent 2px,
                  transparent 4px
                )`,
              }}
            />
            <div className="flex-1">
              <div className="text-xs font-medium">{config.label}</div>
              <div className="text-muted-foreground text-[10px]">
                {config.description} • Index: {phases[config.key]}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
