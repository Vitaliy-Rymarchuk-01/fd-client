import { useMutation } from '@tanstack/react-query'

import { detectBreakdowns } from '../api/detect'
import type {
  DetectBreakdownsRequestDTO,
  DetectBreakdownsResponseDTO,
} from '../types/detect'

export function useDetectBreakdowns() {
  return useMutation<
    DetectBreakdownsResponseDTO,
    unknown,
    { stageId: string; body: DetectBreakdownsRequestDTO }
  >({
    mutationFn: detectBreakdowns,
  })
}
