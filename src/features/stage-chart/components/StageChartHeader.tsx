import { Checkbox } from '@/shared/components/ui/checkbox'

type Props = {
  showTreatingPressure: boolean
  setShowTreatingPressure: (next: boolean) => void
  showBottomHolePressure: boolean
  setShowBottomHolePressure: (next: boolean) => void
  showSlurryRate: boolean
  setShowSlurryRate: (next: boolean) => void

  showPropCon: boolean
  setShowPropCon: (next: boolean) => void
  showWellBorePropMass: boolean
  setShowWellBorePropMass: (next: boolean) => void
  showBreakdownZones: boolean
  setShowBreakdownZones: (next: boolean) => void
}

export function StageChartHeader(props: Props) {
  return (
    <div className="border-border bg-card i flex flex-col border-b">
      <div className="border-border h-12.5 min-w-0 border-b px-4 py-2">
        <div className="truncate text-sm font-semibold">Stage chart</div>
        <div className="text-muted-foreground truncate text-xs">
          multi-series vs seconds
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 px-4 py-2">
        <div className="flex flex-wrap items-center justify-end gap-3">
          <label className="flex items-center gap-2 text-xs">
            <Checkbox
              checked={props.showTreatingPressure}
              onCheckedChange={(v) => props.setShowTreatingPressure(Boolean(v))}
            />
            <span className="flex items-center gap-2">
              <span
                className="inline-block size-2 rounded-full"
                style={{ background: '#ef4444' }}
              />
              Treating pressure
            </span>
          </label>

          <label className="flex items-center gap-2 text-xs">
            <Checkbox
              checked={props.showBottomHolePressure}
              onCheckedChange={(v) =>
                props.setShowBottomHolePressure(Boolean(v))
              }
            />
            <span className="flex items-center gap-2">
              <span
                className="inline-block size-2 rounded-full"
                style={{ background: '#22c55e' }}
              />
              BH pressure
            </span>
          </label>

          <label className="flex items-center gap-2 text-xs">
            <Checkbox
              checked={props.showSlurryRate}
              onCheckedChange={(v) => props.setShowSlurryRate(Boolean(v))}
            />
            <span className="flex items-center gap-2">
              <span
                className="inline-block size-2 rounded-full"
                style={{ background: '#2563eb' }}
              />
              Slurry rate
            </span>
          </label>

          <label className="flex items-center gap-2 text-xs">
            <Checkbox
              checked={props.showPropCon}
              onCheckedChange={(v) => props.setShowPropCon(Boolean(v))}
            />
            <span className="flex items-center gap-2">
              <span
                className="inline-block size-2 rounded-full"
                style={{ background: '#94a3b8' }}
              />
              Prop. conc.
            </span>
          </label>

          <label className="flex items-center gap-2 text-xs">
            <Checkbox
              checked={props.showWellBorePropMass}
              onCheckedChange={(v) => props.setShowWellBorePropMass(Boolean(v))}
            />
            <span className="flex items-center gap-2">
              <span
                className="inline-block size-2 rounded-full"
                style={{ background: '#a16207' }}
              />
              Wellbore prop. mass
            </span>
          </label>

          <label className="flex items-center gap-2 text-xs">
            <Checkbox
              checked={props.showBreakdownZones}
              onCheckedChange={(v) => props.setShowBreakdownZones(Boolean(v))}
            />
            <span className="flex items-center gap-2">
              <span
                className="inline-block size-2 rounded-full"
                style={{ background: '#f97316' }}
              />
              Breakdown zones
            </span>
          </label>
        </div>

        <div className="flex items-center gap-2" />
      </div>
    </div>
  )
}
