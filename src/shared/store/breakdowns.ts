import { create } from 'zustand'

import type {
  DetectBreakdownsMode,
  DetectBreakdownsResponseDTO,
} from '@/features/breakdowns/types/detect'

interface BreakdownsState {
  byStageId: Record<
    string,
    {
      mode: DetectBreakdownsMode
      response: DetectBreakdownsResponseDTO
    }
  >
  setForStage: (params: {
    stageId: string
    mode: DetectBreakdownsMode
    response: DetectBreakdownsResponseDTO
  }) => void
  clearForStage: (stageId: string) => void
}

export const useBreakdownsStore = create<BreakdownsState>((set) => ({
  byStageId: {},
  setForStage: ({ stageId, mode, response }) =>
    set((s) => ({
      byStageId: {
        ...s.byStageId,
        [stageId]: { mode, response },
      },
    })),
  clearForStage: (stageId) =>
    set((s) => {
      const next = { ...s.byStageId }
      delete next[stageId]
      return { byStageId: next }
    }),
}))
