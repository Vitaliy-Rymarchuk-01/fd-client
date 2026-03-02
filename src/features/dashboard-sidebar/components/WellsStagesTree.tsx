import { FolderTree } from 'lucide-react'

import { Checkbox } from '@/shared/components/ui/checkbox'

import type { StageNode } from '../types/stage'
import { compareStages, groupStages } from '../utils/stage-tree'

interface WellsStagesTreeProps {
  stageNodes: StageNode[]
  selectedStageIds: Record<string, boolean>
  onToggleStage: (stageId: string, checked: boolean) => void
  onClear: () => void
}

export function WellsStagesTree({
  stageNodes,
  selectedStageIds,
  onToggleStage,
  onClear,
}: WellsStagesTreeProps) {
  const groupedStages = groupStages(stageNodes)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wide uppercase">
          <FolderTree className="size-3.5" /> wells
        </div>
        <button
          type="button"
          className="text-muted-foreground hover:text-sidebar-foreground text-xs font-semibold tracking-wide uppercase"
          onClick={onClear}
        >
          Clear
        </button>
      </div>

      <div className="space-y-3">
        {Object.entries(groupedStages)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([wellName, nodes]) => {
            const sorted = [...nodes].sort(compareStages)
            return (
              <div key={wellName} className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span className="truncate">{wellName}</span>
                </div>
                <div className="pl-4">
                  {sorted.map((node) => (
                    <label
                      key={node.id}
                      className="hover:bg-sidebar-accent/40 flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors"
                    >
                      <Checkbox
                        checked={Boolean(selectedStageIds[node.id])}
                        onCheckedChange={(value) =>
                          onToggleStage(node.id, value === true)
                        }
                      />
                      <span className="min-w-0 flex-1 truncate">
                        {node.stageName ? node.stageName : node.fileName}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
