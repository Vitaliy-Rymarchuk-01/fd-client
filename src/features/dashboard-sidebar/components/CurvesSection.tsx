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
  {
    color: '#f97316',
    label: 'Breakdown zones',
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
  const showBreakdownZones = useCurveVisibilityStore(
    (state) => state.showBreakdownZones,
  )

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
  const setShowBreakdownZones = useCurveVisibilityStore(
    (state) => state.setShowBreakdownZones,
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
                      : showBreakdownZones

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
                      : setShowBreakdownZones

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
      </div>
    </section>
  )
}
