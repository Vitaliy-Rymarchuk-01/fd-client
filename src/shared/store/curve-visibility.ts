import { create } from 'zustand'

type CurveVisibilityState = {
  showTreatingPressure: boolean
  showBottomHolePressure: boolean
  showSlurryRate: boolean
  showPropCon: boolean
  showWellBorePropMass: boolean
  showBreakdownZones: boolean
  setShowTreatingPressure: (next: boolean) => void
  setShowBottomHolePressure: (next: boolean) => void
  setShowSlurryRate: (next: boolean) => void
  setShowPropCon: (next: boolean) => void
  setShowWellBorePropMass: (next: boolean) => void
  setShowBreakdownZones: (next: boolean) => void
}

export const useCurveVisibilityStore = create<CurveVisibilityState>((set) => ({
  showTreatingPressure: true,
  showBottomHolePressure: true,
  showSlurryRate: true,
  showPropCon: true,
  showWellBorePropMass: false,
  showBreakdownZones: true,
  setShowTreatingPressure: (next) => set({ showTreatingPressure: next }),
  setShowBottomHolePressure: (next) => set({ showBottomHolePressure: next }),
  setShowSlurryRate: (next) => set({ showSlurryRate: next }),
  setShowPropCon: (next) => set({ showPropCon: next }),
  setShowWellBorePropMass: (next) => set({ showWellBorePropMass: next }),
  setShowBreakdownZones: (next) => set({ showBreakdownZones: next }),
}))
