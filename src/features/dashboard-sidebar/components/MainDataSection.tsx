import { DataImportPanel } from '@/features/data-import'
import type { ImportFileItem } from '@/features/data-import/types/file-import'

import type { StageNode } from '../types/stage'
import { WellsStagesTree } from './WellsStagesTree'

interface MainDataSectionProps {
  importItems: ImportFileItem[]
  stageNodes: StageNode[]
  selectedStageIds: Record<string, boolean>
  onFilesAdded: (files: File[]) => void
  onRemoveImportItem: (fileId: string) => void
  onClearAll: () => void
  onToggleStage: (stageId: string, checked: boolean) => void
}

export function MainDataSection({
  importItems,
  stageNodes,
  selectedStageIds,
  onFilesAdded,
  onRemoveImportItem,
  onClearAll,
  onToggleStage,
}: MainDataSectionProps) {
  const hasLoadedData = stageNodes.length > 0

  return (
    <section className="flex h-full min-h-0 flex-col">
      {hasLoadedData ? (
        <WellsStagesTree
          stageNodes={stageNodes}
          selectedStageIds={selectedStageIds}
          onToggleStage={onToggleStage}
          onClear={onClearAll}
        />
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <DataImportPanel
            items={importItems}
            onFilesAdded={onFilesAdded}
            onRemoveItem={onRemoveImportItem}
            onClear={onClearAll}
            variant="full"
          />
        </div>
      )}
    </section>
  )
}
