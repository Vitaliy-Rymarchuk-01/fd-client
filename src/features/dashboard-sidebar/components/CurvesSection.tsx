import { Checkbox } from '@/shared/components/ui/checkbox'
import { useCurveVisibilityStore } from '@/shared/store/curve-visibility'

const CURVE_ITEMS = [
  {
    color: '#ef4444',
    label: 'Treating pressure',
  },
  {
    color: '#22c55e',
    label: 'BH pressure',
  },
  {
    color: '#2563eb',
    label: 'Slurry rate',
  },
  {
    color: '#94a3b8',
    label: 'Prop. conc.',
  },
  {
    color: '#a16207',
    label: 'Wellbore prop. mass',
  },
] as const

export function CurvesSection() {
  const showTreatingPressure = useCurveVisibilityStore(
    (state) => state.showTreatingPressure,
  )
  const showBottomHolePressure = useCurveVisibilityStore(
    (state) => state.showBottomHolePressure,
  )
  const showSlurryRate = useCurveVisibilityStore(
    (state) => state.showSlurryRate,
  )
  const showPropCon = useCurveVisibilityStore((state) => state.showPropCon)
  const showWellBorePropMass = useCurveVisibilityStore(
    (state) => state.showWellBorePropMass,
  )
  const breakdownMode = useCurveVisibilityStore((state) => state.breakdownMode)

  const setShowTreatingPressure = useCurveVisibilityStore(
    (state) => state.setShowTreatingPressure,
  )
  const setShowBottomHolePressure = useCurveVisibilityStore(
    (state) => state.setShowBottomHolePressure,
  )
  const setShowSlurryRate = useCurveVisibilityStore(
    (state) => state.setShowSlurryRate,
  )
  const setShowPropCon = useCurveVisibilityStore(
    (state) => state.setShowPropCon,
  )
  const setShowWellBorePropMass = useCurveVisibilityStore(
    (state) => state.setShowWellBorePropMass,
  )
  const setBreakdownMode = useCurveVisibilityStore(
    (state) => state.setBreakdownMode,
  )

  return (
    <section>
      <div className="space-y-2">
        {CURVE_ITEMS.map((item) => {
          const checked =
            item.label === 'Treating pressure'
              ? showTreatingPressure
              : item.label === 'BH pressure'
                ? showBottomHolePressure
                : item.label === 'Slurry rate'
                  ? showSlurryRate
                  : item.label === 'Prop. conc.'
                    ? showPropCon
                    : item.label === 'Wellbore prop. mass'
                      ? showWellBorePropMass
                      : false

          const setChecked =
            item.label === 'Treating pressure'
              ? setShowTreatingPressure
              : item.label === 'BH pressure'
                ? setShowBottomHolePressure
                : item.label === 'Slurry rate'
                  ? setShowSlurryRate
                  : item.label === 'Prop. conc.'
                    ? setShowPropCon
                    : item.label === 'Wellbore prop. mass'
                      ? setShowWellBorePropMass
                      : () => {}

          return (
            <label key={item.label} className="flex items-center gap-2 text-xs">
              <Checkbox
                checked={checked}
                onCheckedChange={(value) => setChecked(Boolean(value))}
              />
              <span className="flex items-center gap-2">
                <span
                  className="inline-block size-2 rounded-full"
                  style={{ background: item.color }}
                />
                {item.label}
              </span>
            </label>
          )
        })}

        <div className="bg-border my-2 h-px" />

        <label className="flex items-center gap-2 text-xs">
          <Checkbox
            checked={breakdownMode === 'permeability'}
            onCheckedChange={(value) =>
              setBreakdownMode(value === true ? 'permeability' : null)
            }
          />
          <span className="flex items-center gap-2">
            <span
              className="inline-block size-2 rounded-full"
              style={{ background: '#f97316' }}
            />
            Breakdown zones (permeability)
          </span>
        </label>

        <label className="flex items-center gap-2 text-xs">
          <Checkbox
            checked={breakdownMode === 'deltaV'}
            onCheckedChange={(value) =>
              setBreakdownMode(value === true ? 'deltaV' : null)
            }
          />
          <span className="flex items-center gap-2">
            <span
              className="inline-block size-2 rounded-full"
              style={{ background: '#a855f7' }}
            />
            Breakdown zones (deltaV)
          </span>
        </label>
      </div>
    </section>
  )
}
