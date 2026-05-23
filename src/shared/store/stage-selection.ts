import { create } from 'zustand'

interface StageSelectionState {
  selectedStageId: string | null
  setSelectedStageId: (id: string | null) => void
}

export const useStageSelectionStore = create<StageSelectionState>((set) => ({
  selectedStageId: null,
  setSelectedStageId: (id) => set({ selectedStageId: id }),
}))
