import { create } from 'zustand'

export type BreakdownMode = 'permeability' | 'deltaV'

type CurveVisibilityState = {
  showTreatingPressure: boolean
  showBottomHolePressure: boolean
  showSlurryRate: boolean
  showCleanRate: boolean
  showPropCon: boolean
  showWellBorePropMass: boolean
  breakdownMode: BreakdownMode | null
  setShowTreatingPressure: (next: boolean) => void
  setShowBottomHolePressure: (next: boolean) => void
  setShowSlurryRate: (next: boolean) => void
  setShowCleanRate: (next: boolean) => void
  setShowPropCon: (next: boolean) => void
  setShowWellBorePropMass: (next: boolean) => void
  setBreakdownMode: (next: BreakdownMode | null) => void
}

export const useCurveVisibilityStore = create<CurveVisibilityState>((set) => ({
  showTreatingPressure: true,
  showBottomHolePressure: true,
  showSlurryRate: true,
  showCleanRate: false,
  showPropCon: true,
  showWellBorePropMass: false,
  breakdownMode: 'permeability',
  setShowTreatingPressure: (next) => set({ showTreatingPressure: next }),
  setShowBottomHolePressure: (next) => set({ showBottomHolePressure: next }),
  setShowSlurryRate: (next) => set({ showSlurryRate: next }),
  setShowCleanRate: (next) => set({ showCleanRate: next }),
  setShowPropCon: (next) => set({ showPropCon: next }),
  setShowWellBorePropMass: (next) => set({ showWellBorePropMass: next }),
  setBreakdownMode: (next) => set({ breakdownMode: next }),
}))
